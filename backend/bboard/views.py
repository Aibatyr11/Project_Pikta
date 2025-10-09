from .models import User, Post, Comment, Like, Follow, SavedPost
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status, permissions, generics, viewsets
from .serializers import UserSerializer, PostSerializer, UserDetailSerializer, CommentSerializer
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import logout
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.exceptions import NotFound
from rest_framework.decorators import action
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.conf import settings
from notify.utils import create_notification
from rest_framework.permissions import AllowAny
from django.db.models import Q
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode


class UserList(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class RegisterView(APIView):
    def post(self, request):
        data = request.data
        try:
            user = User.objects.create(
                username=data['username'],
                email=data['email'],
                password=make_password(data['password']),
            )
            return Response({'message': 'Пользователь создан'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['POST'])
def login_view(request):
    try:
        data = request.data
        serializer = TokenObtainPairSerializer(data=data)

        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["get", "post"], url_path="comments")
    def comments(self, request, pk=None):
        post = self.get_object()

        if request.method == "GET":
            comments = post.comments.all().order_by("created_at")
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data)

        elif request.method == "POST":
            serializer = CommentSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=request.user, post=post)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class UserProfileView(APIView):
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            posts = Post.objects.filter(user=user).order_by('-created_at')
            user_data = UserDetailSerializer(user, context={"request": request}).data
            post_data = PostSerializer(posts, many=True, context={"request": request}).data
            return Response({"user": user_data, "posts": post_data})
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=404)



class FollowView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        followed_id = request.data.get("followed_id")
        try:
            followed_user = User.objects.get(id=followed_id)
            if Follow.objects.filter(follower=request.user, followed=followed_user).exists():
                return Response({"detail": "Already following"}, status=400)

            Follow.objects.create(follower=request.user, followed=followed_user)

            from notify.utils import create_notification
            create_notification(
                target=followed_user.username,
                actor=request.user.username,
                verb="follow",
                description=f"{request.user.username} подписался на вас",
                payload={"follower_id": request.user.id}
            )

            return Response({"detail": "Followed!"}, status=201)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=404)

    def delete(self, request):
        followed_id = request.data.get("followed_id")
        try:
            followed_user = User.objects.get(id=followed_id)
            follow = Follow.objects.filter(
                follower=request.user,
                followed=followed_user
            ).first()
            if follow:
                follow.delete()
                return Response({"detail": "Unfollowed"}, status=204)
            return Response({"detail": "Not following"}, status=400)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=404)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def is_following(request, user_id):
    try:
        target = User.objects.get(id=user_id)
        is_following = Follow.objects.filter(follower=request.user, followed=target).exists()
        return Response({"is_following": is_following})
    except User.DoesNotExist:
        return Response({"detail": "User not found"}, status=404)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def privacy_policy_view(request):
    if request.method == 'GET':
        return Response({'accepted': request.user.has_accepted_policy})
    elif request.method == 'POST':
        request.user.has_accepted_policy = True
        request.user.save()
        return Response({'status': 'accepted'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    user = request.user
    return Response({
        "username": user.username,
        "has_accepted_policy": user.has_accepted_policy
    })




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_post(request, post_id):
    post = Post.objects.get(id=post_id)
    like, created = Like.objects.get_or_create(post=post, user=request.user)
    print("⚡ СОЗДАЁМ УВЕДОМЛЕНИЕ для", post.user.username)
    if created:
        create_notification(
            target=post.user.username,
            actor=request.user.username,
            verb="like",
            description=f"{request.user.username} лайкнул ваш пост",
            payload={"post_id": post.id}
        )

    return Response({'detail': 'Post liked.'}, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def unlike_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)

    deleted, _ = Like.objects.filter(post=post, user=request.user).delete()
    if deleted:
        return Response(
            {'detail': 'Post unliked.', 'likes_count': post.likes.count()},
            status=status.HTTP_200_OK
        )
    else:
        return Response({'detail': 'You have not liked this post.'}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def liked_posts(request, username):
    likes = Like.objects.filter(user__username=username)
    posts = Post.objects.filter(id__in=likes.values_list('post_id', flat=True)).order_by('-created_at')
    serializer = PostSerializer(posts, many=True, context={'request': request})
    return Response(serializer.data)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    user.username = request.POST.get('username', user.username)
    user.email = request.POST.get('email', user.email)
    user.bio = request.POST.get('bio', user.bio)

    if request.FILES.get('avatar'):
        user.avatar = request.FILES['avatar']

    user.save()
    return Response(UserSerializer(user).data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_profile(request):
    user = request.user
    logout(request)
    user.delete()
    return Response({"detail": "Профиль удалён"})



class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer


class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        post_id = self.kwargs.get("post_id")
        try:
            post = Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            raise NotFound("Post not found")
        return Comment.objects.filter(post=post).order_by("created_at")

    def perform_create(self, serializer):
        post_id = self.kwargs.get("post_id")
        try:
            post = Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            raise NotFound("Post not found")
        serializer.save(post=post, user=self.request.user if self.request.user.is_authenticated else None)


class CommentDetailView(generics.RetrieveDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.AllowAny]




@api_view(['GET'])
@permission_classes([AllowAny])
def search_users(request):
    query = request.GET.get("q", "").strip()
    if not query:
        return Response([], status=200)

    users = User.objects.filter(
        Q(username__icontains=query) | Q(email__icontains=query)
    )[:20]

    serializer = UserSerializer(users, many=True, context={"request": request})
    return Response(serializer.data)


@api_view(['GET'])
def followers_list(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"detail": "User not found"}, status=404)

    followers = user.followers.all().select_related("follower")
    data = [{"id": f.follower.id, "username": f.follower.username, "avatar": f.follower.avatar.url if f.follower.avatar else None} for f in followers]
    return Response(data)


@api_view(['GET'])
def following_list(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"detail": "User not found"}, status=404)

    following = user.following.all().select_related("followed")
    data = [{"id": f.followed.id, "username": f.followed.username, "avatar": f.followed.avatar.url if f.followed.avatar else None} for f in following]
    return Response(data)



class PasswordResetRequestView(APIView):
    def post(self, request):
        email = request.data.get("email")
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Пользователь с такой почтой не найден"}, status=status.HTTP_404_NOT_FOUND)

        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_link = f"http://localhost:5173/reset-password/{uid}/{token}"  # адрес фронта

        send_mail(
            "Сброс пароля",
            f"Привет! Перейди по ссылке для сброса пароля: {reset_link}",
            settings.DEFAULT_FROM_EMAIL,
            [email],
        )

        return Response({"message": "Письмо отправлено на почту"}, status=status.HTTP_200_OK)



User = get_user_model()

class PasswordResetConfirmApiView(APIView):

    def post(self, request, uidb64, token, *args, **kwargs):
        from django.utils.http import urlsafe_base64_decode
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            return Response({"error": "Неверная ссылка"}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Ссылка недействительна или устарела"}, status=status.HTTP_400_BAD_REQUEST)

        new_password = request.data.get("password")
        if not new_password:
            return Response({"error": "Введите новый пароль"}, status=status.HTTP_400_BAD_REQUEST)

        user.password = make_password(new_password)
        user.save()

        return Response({"message": "Пароль успешно изменён"}, status=status.HTTP_200_OK)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def share_post(request):
    from chat.mongo import messages_collection
    from datetime import datetime

    post_id = request.data.get("post_id")
    target_username = request.data.get("target_username")

    if not post_id or not target_username:
        return Response({"detail": "Нужно указать post_id и target_username"}, status=400)

    try:
        post = Post.objects.get(id=post_id)
        target_user = User.objects.get(username=target_username)
    except (Post.DoesNotExist, User.DoesNotExist):
        return Response({"detail": "Пост или пользователь не найден"}, status=404)

    sender = request.user.username
    receiver = target_user.username

    image_url = request.build_absolute_uri(post.image.url) if post.image else None
    message = {
        "type": "post",
        "post_id": post.id,
        "caption": post.caption,
        "image": image_url,
        "author": post.user.username,
        "timestamp": datetime.utcnow().isoformat()
    }

    messages_collection.insert_one({
        "sender": sender,
        "receiver": receiver,
        "content": message,
        "timestamp": datetime.utcnow()
    })

    from notify.utils import create_notification
    create_notification(
        target=receiver,
        actor=sender,
        verb="share_post",
        description=f"{sender} отправил(а) вам пост",
        payload={"post_id": post.id, "image": image_url}
    )

    return Response({"detail": "Пост отправлен", "message": message}, status=201)


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_post(request):
    recipient_id = request.data.get('recipient_id')
    post_id = request.data.get('post_id')

    try:
        recipient = User.objects.get(id=recipient_id)
        post = Post.objects.get(id=post_id)
    except User.DoesNotExist:
        return Response({'error': 'Пользователь не найден'}, status=404)
    except Post.DoesNotExist:
        return Response({'error': 'Пост не найден'}, status=404)

    chat, _ = Chat.objects.get_or_create_between(request.user, recipient)
    message = Message.objects.create(
        chat=chat,
        sender=request.user,
        post=post,  # 👈 поле post в модели Message
    )

    return Response({'success': True, 'message_id': message.id})

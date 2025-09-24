from .models import User, Post, Comment, Like, Follow, SavedPost
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status, permissions
from .serializers import UserSerializer, PostSerializer, UserDetailSerializer
from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import logout
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, permissions
from .models import Comment
from .serializers import CommentSerializer
from rest_framework import generics, permissions
from rest_framework.exceptions import NotFound
from .models import Post, Comment
from .serializers import PostSerializer, CommentSerializer
from rest_framework.decorators import action
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
                password=make_password(data['password']),  # Шифруем пароль
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

#
# class PostViewSet(viewsets.ModelViewSet):
#     queryset = Post.objects.all().order_by('-created_at')
#     serializer_class = PostSerializer
#
#
# class PostCreateView(APIView):
#     parser_classes = (MultiPartParser, FormParser)
#     permission_classes = [permissions.IsAuthenticated]
#
#     def post(self, request, format=None):
#         serializer = PostSerializer(data=request.data, context={'request': request})
#         if serializer.is_valid():
#             serializer.save(user=request.user)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["get", "post"], url_path="comments")
    def comments(self, request, pk=None):
        """Комментарии к конкретному посту"""
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



# class UserProfileView(APIView):
#     def get(self, request, username):
#         user = get_object_or_404(User, username=username)
#         posts = Post.objects.filter(user=user).order_by('-created_at')
#         user_data = UserSerializer(user).data
#         post_data = PostSerializer(posts, many=True).data
#         return Response({
#             "user": user_data,
#             "posts": post_data
#         })

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
            return Response({"detail": "Followed!"}, status=201)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=404)

    def delete(self, request):
        followed_id = request.data.get("followed_id")
        try:
            followed_user = User.objects.get(id=followed_id)
            follow = Follow.objects.filter(follower=request.user, followed=followed_user).first()
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
    Like.objects.get_or_create(post=post, user=request.user)
    return Response({'detail': 'Post liked.'}, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def unlike_post(request, post_id):
    post = Post.objects.get(id=post_id)
    Like.objects.filter(post=post, user=request.user).delete()
    return Response({'detail': 'Post unliked.'}, status=status.HTTP_204_NO_CONTENT)





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




#Search
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.db.models import Q
from .serializers import UserSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def search_users(request):
    query = request.GET.get("q", "").strip()
    if not query:
        return Response([], status=200)

    users = User.objects.filter(
        Q(username__icontains=query) | Q(email__icontains=query)
    )[:20]  # ограничим до 20 результатов

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




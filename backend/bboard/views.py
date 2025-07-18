from .models import User, Post, Comment, Like, Follow, SavedPost
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer, PostSerializer
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import UserDetailSerializer  # обязательно

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
def login_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")

            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({"message": "Login successful"})
            else:
                return JsonResponse({"error": "Invalid credentials"}, status=401)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Only POST method allowed"}, status=405)

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



# views.py (Django)
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


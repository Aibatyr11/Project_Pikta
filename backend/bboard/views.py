from .models import User, Post, Comment, Like, Follow, SavedPost
from .serializers import UserSerializer
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
from .models import Post
from .serializers import PostSerializer
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


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
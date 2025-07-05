from rest_framework import serializers
from .models import User, Post, Comment, Like, Follow, SavedPost


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'avatar', 'bio']


class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'user', 'image', 'caption', 'location', 'created_at']
from rest_framework import serializers
from .models import User, Post, Comment, Like, Follow, SavedPost

class UserDetailSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    avatar = serializers.ImageField(use_url=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'avatar', 'bio', 'followers_count', 'following_count']

    def get_followers_count(self, obj):
        return Follow.objects.filter(followed=obj).count()

    def get_following_count(self, obj):
        return Follow.objects.filter(follower=obj).count()



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'avatar', 'bio']



class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'user', 'image', 'caption', 'location', 'created_at', 'likes_count', 'is_liked']

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False


class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = ['id', 'follower', 'followed', 'created_at']
        read_only_fields = ['follower', 'created_at']



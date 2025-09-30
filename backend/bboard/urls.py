from django.urls import path, include
from .views import (
    UserList, RegisterView, login_view, UserProfileView, FollowView,
    PostViewSet, current_user, is_following, privacy_policy_view, current_user_view,
    like_post, unlike_post, liked_posts, update_profile, delete_profile, CustomTokenObtainPairView,
    CommentListCreateView, CommentDetailView, search_users, followers_list, following_list,
    PasswordResetRequestView, PasswordResetConfirmApiView
)
from django.contrib.auth.views import PasswordResetConfirmView
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')

urlpatterns = [
    path('api/users/', UserList.as_view()),
    path('api/register/', RegisterView.as_view()),
    path('api/', include(router.urls)),
    path('api/profile/<str:username>/', UserProfileView.as_view()),
    path('api/follow/', FollowView.as_view()),
    path('api/unfollow/', FollowView.as_view()),
    path('api/current_user/', current_user),
    path('api/is_following/<int:user_id>/', is_following),
    path('api/privacy-policy/', privacy_policy_view),
    path('api/current-user/', current_user_view),
    path('api/posts/<int:post_id>/like/', like_post),
    path('api/posts/<int:post_id>/unlike/', unlike_post),
    path('api/liked_posts/<str:username>/', liked_posts, name='liked-posts'),
    path('api/update_profile/', update_profile),
    path('api/delete_profile/', delete_profile, name='delete_profile'),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("posts/<int:post_id>/comments/", CommentListCreateView.as_view(), name="comment-list-create"),
    path("comments/<int:pk>/", CommentDetailView.as_view(), name="comment-detail"),
    path("api/search_users/", search_users, name="search-users"),
    path("api/followers/<str:username>/", followers_list, name="followers-list"),
    path("api/following/<str:username>/", following_list, name="following-list"),
    path("api/password-reset/", PasswordResetRequestView.as_view(), name="password-reset"),
    path("api/password-reset-confirm/<uidb64>/<token>/", PasswordResetConfirmApiView.as_view(), name="password-reset-confirm-api"),
]

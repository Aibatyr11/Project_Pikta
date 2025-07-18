from django.urls import path, include
from .views import (UserList, RegisterView, login_view, UserProfileView, FollowView,
                    PostViewSet, current_user, is_following, privacy_policy_view,current_user_view)
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')

urlpatterns = [
    path('api/users/', UserList.as_view()),
    path('api/register/', RegisterView.as_view()),
    path('api/login/', login_view),
    path('api/', include(router.urls)),
    path('api/profile/<str:username>/', UserProfileView.as_view()),
    path('api/follow/', FollowView.as_view()),
    path('api/unfollow/', FollowView.as_view()),
    path('api/current_user/', current_user),
    path('api/is_following/<int:user_id>/', is_following),
    path('api/privacy-policy/', privacy_policy_view),
    path('api/current-user/', current_user_view),

]

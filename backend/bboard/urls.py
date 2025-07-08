from django.urls import path, include
from .views import UserList, RegisterView, login_view, UserProfileView
from rest_framework.routers import DefaultRouter
from .views import PostViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')

urlpatterns = [
    path('api/users/', UserList.as_view()),
    path('api/register/', RegisterView.as_view()),
    path('api/login/', login_view),
    path('api/', include(router.urls)),
    path('api/profile/<str:username>/', UserProfileView.as_view()),
]

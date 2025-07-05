from django.urls import path
from .views import UserList, RegisterView, login_view
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet  # Импортируешь свой ViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')

urlpatterns = [
    path('api/users/', UserList.as_view()),
    path('api/register/', RegisterView.as_view()),
    path("api/login/", login_view),
    path('api/', include(router.urls)),

]

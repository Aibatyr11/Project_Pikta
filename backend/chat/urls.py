from django.urls import path
from . import views

urlpatterns = [
    path("history/<str:user1>/<str:user2>/", views.get_history),
path("chats/<str:username>/", views.user_chats, name="user_chats"),
path("history/<str:user1>/<str:user2>/", views.chat_history),
]
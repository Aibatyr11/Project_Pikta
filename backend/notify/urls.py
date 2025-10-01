from django.urls import path
from .views import my_notifications, read_notification, mark_all_read

urlpatterns = [
    path("notifications/", my_notifications, name="my-notifications"),
    path("notifications/<str:notif_id>/read/", read_notification, name="read-notification"),
    path("notifications/mark_all_read/", mark_all_read, name="mark_all_read"),
]

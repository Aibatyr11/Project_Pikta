from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .utils import get_user_notifications, mark_as_read, mark_all_as_read
from rest_framework import status

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_notifications(request):
    notifications = get_user_notifications(request.user.username)
    return Response(notifications)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def read_notification(request, notif_id):
    mark_as_read(notif_id)
    return Response({"status": "ok"})




@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mark_all_read(request):
    """
    Отметить все уведомления пользователя как прочитанные (MongoDB через utils)
    """
    mark_all_as_read(request.user.username)
    return Response({"detail": "Все уведомления отмечены как прочитанные"}, status=status.HTTP_200_OK)

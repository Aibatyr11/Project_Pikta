import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from urllib.parse import parse_qs
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model
from django.conf import settings
import jwt

User = get_user_model()

class NotifyConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        query_params = parse_qs(self.scope["query_string"].decode())
        token = query_params.get("token", [None])[0]

        self.user = None
        if token:
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                self.user = await database_sync_to_async(User.objects.get)(id=payload["user_id"])
            except Exception as e:
                print("❌ Ошибка токена:", e)
                self.user = AnonymousUser()

        if not self.user or self.user.is_anonymous:
            print("❌ WS connect отказано: аноним")
            await self.close()
            return

        self.username = self.user.username
        self.group_name = f"notify_{self.username}"

        print(f"✅ WS connect: user={self.username}, group={self.group_name}")

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            print(f"⚠️ WS disconnect: {self.group_name}")
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def notify(self, event):
        """Обработка входящих group_send"""
        print("📢 NotifyConsumer.notify получил событие:", event)

        await self.send(text_data=json.dumps({
            "notification": event["notification"]
        }))

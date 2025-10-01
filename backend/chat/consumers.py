import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .mongo import messages_collection
from datetime import datetime

# ⚡ импортируем уведомления
from notify.utils import create_notification


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        users = self.room_name.split("_")
        history = await sync_to_async(
            lambda: list(messages_collection.find({
                "$or": [
                    {"sender": {"$in": users}, "receiver": {"$in": users}}
                ]
            }).sort("timestamp", -1).limit(20))
        )()

        for msg in reversed(history):
            await self.send(text_data=json.dumps({
                "message": msg["content"],
                "sender": msg["sender"],
                "timestamp": msg["timestamp"].isoformat()
            }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data["message"]
        sender = data["sender"]
        receiver = data["receiver"]

        # сохраняем сообщение в Mongo
        await sync_to_async(messages_collection.insert_one)({
            "sender": sender,
            "receiver": receiver,
            "content": message,
            "timestamp": datetime.utcnow()
        })

        # ⚡ создаём уведомление получателю
        await sync_to_async(create_notification)(
            target=receiver,
            actor=sender,
            verb="message",
            description=f"{sender} отправил(а) вам сообщение",
            payload={"content": message}
        )

        # рассылаем сообщение в комнату
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "sender": sender,
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender": event["sender"],
        }))

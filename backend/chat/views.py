from django.http import JsonResponse
from django.contrib.auth import get_user_model
from .mongo import messages_collection

User = get_user_model()

def get_history(request, user1, user2):
    room_users = sorted([user1, user2])
    messages = list(messages_collection.find({
        "$or": [
            {"sender": room_users[0], "receiver": room_users[1]},
            {"sender": room_users[1], "receiver": room_users[0]},
        ]
    }).sort("timestamp", 1))

    for msg in messages:
        msg["_id"] = str(msg["_id"])
        msg["timestamp"] = msg["timestamp"].isoformat()
        msg["message"] = msg.pop("content", "")  # ✅ меняем content → message

    return JsonResponse(messages, safe=False)


def user_chats(request, username):
    pipeline = [
        {"$match": {"$or": [{"sender": username}, {"receiver": username}]}},
        {"$project": {
            "contact": {
                "$cond": [{"$eq": ["$sender", username]}, "$receiver", "$sender"]
            },
            "content": 1,
            "timestamp": 1
        }},
        {"$sort": {"timestamp": -1}},
        {"$group": {
            "_id": "$contact",
            "last_message": {"$first": "$content"},
            "last_message_time": {"$first": "$timestamp"}
        }},
        {"$sort": {"last_message_time": -1}}
    ]

    chats = list(messages_collection.aggregate(pipeline))

    data = []
    for c in chats:
        try:
            u = User.objects.get(username=c["_id"])
            avatar = u.profile.avatar.url if hasattr(u, "profile") and u.profile.avatar else None
        except User.DoesNotExist:
            avatar = None

        data.append({
            "username": c["_id"],
            "avatar": avatar,
            "last_message": c["last_message"],
            "last_message_time": c["last_message_time"].isoformat() if c["last_message_time"] else None
        })

    return JsonResponse(data, safe=False)


from django.http import JsonResponse
from .mongo import messages_collection

def chat_history(request, user1, user2):
    users = sorted([user1, user2])
    history = list(messages_collection.find({
        "$or": [
            {"sender": {"$in": users}, "receiver": {"$in": users}}
        ]
    }).sort("timestamp", -1).limit(20))
    for msg in history:
        msg["_id"] = str(msg["_id"])
        msg["timestamp"] = msg["timestamp"].isoformat()
    return JsonResponse(history[::-1], safe=False)

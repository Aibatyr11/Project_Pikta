from .mongo import notifications_collection
from datetime import datetime
from bson import ObjectId

def create_notification(target, actor, verb, description="", payload=None):
    notif = {
        "target": target,   # username получателя
        "actor": actor,     # username отправителя
        "verb": verb,
        "description": description,
        "payload": payload or {},
        "is_read": False,
        "created_at": datetime.utcnow()
    }
    result = notifications_collection.insert_one(notif)
    notif["_id"] = str(result.inserted_id)
    print("✅ Уведомление сохранено в MongoDB:", notif)
    return notif

def get_user_notifications(username):
    """Все уведомления для пользователя"""
    docs = list(notifications_collection.find({"target": username}).sort("created_at", -1))
    # приводим _id к строке
    for d in docs:
        d["_id"] = str(d["_id"])
    return docs

def mark_as_read(notification_id):
    notifications_collection.update_one(
        {"_id": ObjectId(notification_id)},
        {"$set": {"is_read": True}}
    )


def mark_all_as_read(username):
    notifications_collection.update_many(
        {"target": username, "is_read": False},
        {"$set": {"is_read": True}}
    )
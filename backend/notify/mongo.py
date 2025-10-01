from pymongo import MongoClient

# ⚡ тот же клиент, что и для чатов
client = MongoClient("mongodb://localhost:27017/")
db = client["chatdb"]   # замени на свою базу

notifications_collection = db["notifications"]

# chat/mongo.py
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["chatdb"]         # база будет создана автоматически
messages_collection = db["messages"]
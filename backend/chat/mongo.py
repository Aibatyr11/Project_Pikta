# chat/mongo.py
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["chatdb"]
messages_collection = db["messages"]
from django.db import models

from django.contrib.auth.models import User

class Message(models.Model):
    sender = models.CharField(max_length=150)
    receiver = models.CharField(max_length=150)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "messages"

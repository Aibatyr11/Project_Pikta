# notify/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver

# пример — чтобы не было пустым
@receiver(post_save)
def debug_signal(sender, **kwargs):
    pass

from django.apps import AppConfig

class NotifyConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "notify"   # имя должно совпадать с названием папки!

    def ready(self):
        import notify.signals

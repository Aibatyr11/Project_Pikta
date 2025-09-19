# chat/middleware.py
import logging
from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model

logger = logging.getLogger(__name__)
User = get_user_model()


@database_sync_to_async
def get_user_from_token(token):
    try:
        access = AccessToken(token)
        user_id = access.get("user_id")
        if not user_id:
            return AnonymousUser()
        return User.objects.filter(id=user_id).first() or AnonymousUser()
    except Exception as e:
        logger.warning("WS token invalid: %s", e)
        return AnonymousUser()


class JWTAuthMiddleware:
    """Channels 3 совместимый JWT middleware."""

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        try:
            qs = scope.get("query_string", b"").decode()
            params = parse_qs(qs)
            token = params.get("token", [None])[0]
            scope["user"] = await get_user_from_token(token) if token else AnonymousUser()
            logger.debug("WS connect scope user: %s", getattr(scope["user"], "username", "Anonymous"))
        except Exception as exc:
            logger.exception("JWTAuthMiddleware error: %s", exc)
            scope["user"] = AnonymousUser()

        return await self.inner(scope, receive, send)

# from channels.routing import ProtocolTypeRouter, URLRouter
# from django.core.asgi import get_asgi_application
# from chat.middleware import JWTAuthMiddleware
#
# import chat.routing
# import notify.routing
#
# application = ProtocolTypeRouter({
#     "http": get_asgi_application(),
#     "websocket": JWTAuthMiddleware(
#         URLRouter(
#             chat.routing.websocket_urlpatterns +
#             notify.routing.websocket_urlpatterns
#         )
#     ),
# })

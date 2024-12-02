from django.urls import re_path
from .consumers import GameServerConsumer


wbwebsocket_urlpatterns = [
    re_path(r'ws/game/server/$', GameServerConsumer.as_asgi()),
]
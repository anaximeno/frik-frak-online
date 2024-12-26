from django.urls import re_path
from .consumers import GameServerConsumer, GamePlayConsumer


websocket_urlpatterns = [
    re_path(r"ws/game/server/$", GameServerConsumer.as_asgi()),
    re_path(r"ws/game/play/$", GamePlayConsumer.as_asgi()),
]

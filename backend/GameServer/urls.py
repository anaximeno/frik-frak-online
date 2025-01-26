from django.urls import path

from .views import create_player, get_player_by_id


urlpatterns = [
    path("", create_player, name="player-create"),
    path("<str:pk>", get_player_by_id, name="player-get-by-id"),
]

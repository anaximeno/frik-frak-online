from django.urls import path

from .views import create_player, get_player_by_id, GameView

game_list = GameView.as_view({"get": "list"})
game_retrieve = GameView.as_view({"get": "retrieve"})

urlpatterns = [
    path("players", create_player, name="player-create"),
    path("players/<str:pk>", get_player_by_id, name="player-get-by-id"),
    path("", game_list, name="game-list"),
    path("<str:pk>", game_retrieve, name="game-retrieve"),
]

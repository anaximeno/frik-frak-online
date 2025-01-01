import datetime

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Board


class GamingService:
    __instance = None

    def __init__(self):
        self.channel_layer = get_channel_layer()

    @classmethod
    def get_instance(cls):  # Guarantee Singleton
        if cls.__instance:
            return cls.__instance
        cls.__instance = GamingService()
        return cls.__instance

    # XXX
    def create_game(self, player1_id: str, player2_id: str) -> str:
        game_id = f"{player1_id}-vs-{player2_id}"

        board = Board.objects.get(id=1)  # XXX

        async_to_sync(self.channel_layer.group_send)(
            "game-play-group",
            {
                "type": "game.start",
                "game_id": game_id,
                "content": {
                    "board": board.entries,
                    "adversary_id": 1,
                    "turn_player_id": 1,
                },
            },
        )

        return game_id

    def make_move(self, game_id: str, data: dict) -> None:
        pid = data["player_id"]

        board = Board.objects.get(id=1)

        if "from" in data and (pos_from := data["from"]):
            line, col = pos_from["line"], pos_from["col"]
            board.entries[line][col] = None

        if "to" in data and (pos_to := data["to"]):
            line, col = pos_to["line"], pos_to["col"]
            board.entries[line][col] = pid

        # board.save(update_fields=["entries"])

        async_to_sync(self.channel_layer.group_send)(
            "game-play-group",
            {
                "type": "game.update",
                "game_id": game_id,
                "content": {
                    "board": board.entries,
                    "next_turn_player": "002",
                },
            },
        )

import random

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import Game, Player


class GamingService:
    __instance = None

    def __init__(self):
        self.channel_layer = get_channel_layer()
        self.player_wait_list = []

    @classmethod
    def get_instance(cls):  # Guarantee Singleton
        if cls.__instance:
            return cls.__instance
        cls.__instance = GamingService()
        return cls.__instance

    def create_game(self, player1_id: str, player2_id: str) -> None:
        p1 = Player.objects.get(id=player1_id)
        p2 = Player.objects.get(id=player2_id)
        game = Game.objects.create()
        game.players.add(p1, p2)
        players_ids = [str(p1.id), str(p2.id)]
        turn_player = players_ids[random.randint(0, 1)]
        async_to_sync(self.channel_layer.group_send)(
            "game-play-group",
            {
                "type": "game.start",
                "game_id": str(game.id),
                "content": {
                    "board": game.board,
                    "turn_player_id": turn_player,
                    "players_ids": players_ids,
                },
            },
        )

    def add_player_to_wait_list(self, player_id: str) -> None:
        if not player_id in self.player_wait_list:
            self.player_wait_list.append(player_id)
        self.process_waiting_list()

    def process_waiting_list(self) -> None:
        while len(self.player_wait_list) >= 2:
            player1 = self.player_wait_list.pop(0)
            player2 = self.player_wait_list.pop(0)
            self.create_game(player1, player2)

    def make_move(self, game_id: str, player_id: str, move: dict) -> None:
        game = Game.objects.get(id=game_id)

        if game.state != "ongoing" or not self.player_in_game(player_id, game_id):
            return

        board = [*game.board]

        if "from" in move and (pos_from := move["from"]):
            line, col = pos_from["line"], pos_from["col"]
            board[line][col] = None

        if "to" in move and (pos_to := move["to"]):
            line, col = pos_to["line"], pos_to["col"]
            board[line][col] = player_id

        game.board = board
        game.save(update_fields=["board"])

        [p1, p2] = [str(p.id) for p in game.players.get_queryset()]
        turn_player = p2 if player_id == p1 else p1

        # TODO
        # winner = self.check_game_winner(game.board)
        # if winner:
        #     game.winner = winner
        #     game.save(update_fields=["winner"])

        async_to_sync(self.channel_layer.group_send)(
            "game-play-group",
            {
                "type": "game.update",
                "game_id": str(game.id),
                "content": {
                    "board": game.board,
                    "turn_player_id": turn_player,
                    "players_ids": [p1, p2],
                },
            },
        )

    def check_game_winner(self, board: list[list[str]]) -> str | None:
        return None  # XXX: properly implement this

    def player_in_game(self, player_id: str, game_id: str) -> bool:
        player = Player.objects.get(id=player_id)
        return Game.objects.get(id=game_id).players.contains(player)

    def handle_player_disconnected(self, player_id: str) -> None:
        if player_id in self.player_wait_list:
            self.player_wait_list.remove(player_id)

        for game in Game.objects.filter(players__id=player_id, state="ongoing"):
            [p1, p2] = game.players.get_queryset()
            player = Player.objects.get(id=player_id)
            game.winner = p2 if player.id == p1.id else p1
            game.state = "ended"
            game.save(update_fields=["winner", "state"])
            async_to_sync(self.channel_layer.group_send)(
                "game-play-group",
                {
                    "type": "game.finish",
                    "game_id": str(game.id),
                    "content": {
                        "board": game.board,
                        "turn_player_id": None,
                        "players_ids": [str(p1.id), str(p2.id)],
                        "winner_player_id": str(game.winner.id),
                        "won_for": "withdrawal",
                    },
                },
            )

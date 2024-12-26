import datetime

from .models import Board


class GamingService:
    __instance = None

    def __init__(self):
        self.gid_board_mapper = {}  # XXX: use db

    @classmethod
    def get_instance(cls):  # Guarantee Singleton
        if cls.__instance:
            return cls.__instance
        cls.__instance = GamingService()
        return cls.__instance

    def create_game(self, player1_id: str, player2_id: str) -> str:
        board = [
            [None, None, None],
            [None, None, None],
            [None, None, None],
        ]
        gid = f"{player1_id}-vs-{player2_id} {datetime.datetime.now()}"
        self.gid_board_mapper[gid] = board

        board = Board.objects.get(id=2)  # XXX

        return {"gid": gid, "board": board.entries}

    def make_move(self, data: dict) -> None:
        gid = data["gid"]
        pid = data["player_id"]

        # XXX: temporary, only for testing purposes
        # (board, _) = Board.objects.get_or_create(
        #     entries=[
        #         [None, None, None],
        #         [None, None, None],
        #         [None, None, None],
        #     ]
        # )

        board = Board.objects.get(id=2)

        if "from" in data and (pos_from := data["from"]):
            line, col = pos_from["line"], pos_from["col"]
            board.entries[line][col] = None

        if "to" in data and (pos_to := data["to"]):
            line, col = pos_to["line"], pos_to["col"]
            board.entries[line][col] = pid

        board.save(update_fields=["entries"])

        return {
            "next_turn_player": "002",
            "board": board.entries,
        }

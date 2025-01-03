import json

from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from urllib.parse import parse_qs

from .services import GamingService

gaming_service = GamingService.get_instance()


class GameServerConsumer(WebsocketConsumer):
    """Serves game info."""

    def connect(self):
        self.game_id = self.scope["url_route"]["kwargs"]["game_id"]
        # TODO: send current state for intialization
        async_to_sync(self.channel_layer.group_add)(
            "game-play-group", self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            "game-play-group", self.channel_name
        )

    def game_update(self, event):
        if (game_id := event["game_id"]) is None or self.game_id != game_id:
            return

        self.send(
            text_data=json.dumps(
                {
                    "msg_type": "update",
                    "game_id": self.game_id,
                    "body": event["content"],
                },
            )
        )


class GamePlayConsumer(WebsocketConsumer):
    """Sends and receive playing time data."""

    def connect(self):
        query_string = self.scope['query_string'].decode()
        query_params = parse_qs(query_string)
        # In case of disconnection and reconnection
        self.game_id = query_params.get('game_id', [None])[0]
        self.player_id = query_params.get('player_id', [None])[0]
        self.against_player_id = query_params.get('adversary_id', [None])[0]
        self.against_player_kind = query_params.get('vs', [None])[0]
        async_to_sync(self.channel_layer.group_add)(
            "game-play-group", self.channel_name
        )
        self.accept()

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            "game-play-group", self.channel_name
        )
        gaming_service.handle_player_disconnected(self.player_id)
        return super().disconnect(code)

    def receive(self, text_data=None, bytes_data=None):
        if text_data:
            data = json.loads(text_data)
            if "msg_type" in data:
                self.handle_messsage(data)

    def handle_messsage(self, data: dict) -> None:
        match data["msg_type"]:
            case "play":
                self.player_id = data["player_id"]
                self.against_player_kind = data["body"]["vs"]  # bot | user
                gaming_service.add_player_to_wait_list(
                    player_id=self.player_id,
                )
            case "move":
                try:
                    gaming_service.make_move(
                        game_id=data["game_id"],
                        player_id=data["player_id"],
                        move=data["body"],
                    )
                except Exception as e:
                    async_to_sync(self.channel_layer.group_send)(
                        "game-play-group",
                        {
                            "type": "game.error",
                            "error": json.dumps(str(e)),
                            "game_id": self.game_id,
                        },
                    )
            case _:
                pass

    def game_start(self, event):
        if self.game_id != None or not gaming_service.player_in_game(
            self.player_id, event["game_id"]
        ):
            return

        self.game_id = event["game_id"]
        [p1, p2] = event["content"]["players_ids"]
        self.against_player_id = p1 if self.player_id == p2 else p2

        self.send(
            text_data=json.dumps(
                {
                    "msg_type": "start",
                    "game_id": event["game_id"],
                    "body": event["content"],
                },
            )
        )

    def game_update(self, event):
        if gaming_service.player_in_game(self.player_id, event["game_id"]):
            self.send(
                text_data=json.dumps(
                    {
                        "msg_type": "update",
                        "game_id": event["game_id"],
                        "body": event["content"],
                    },
                )
            )

    def game_error(self, event):
        if gaming_service.player_in_game(self.player_id, event["game_id"]):
            self.send(
                text_data=json.dumps(
                    {
                        "msg_type": "error",
                        "game_id": event["game_id"],
                        "body": {"error": event["error"]},
                    },
                )
            )

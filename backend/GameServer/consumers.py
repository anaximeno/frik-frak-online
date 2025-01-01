import json

from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

from .services import GamingService

gaming_service = GamingService.get_instance()


class GameServerConsumer(WebsocketConsumer):
    """Serves game info."""

    # TODO: implement this for real
    def connect(self):
        async_to_sync(self.channel_layer.group_add)(
            "game-server-group", self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            "game-server-group", self.channel_name
        )

    def receive(self, text_data):
        async_to_sync(self.channel_layer.group_send)(
            "game-server-group",
            {
                "type": "chat.message",
                "text": text_data,
            },
        )

    def chat_message(self, event):
        self.send(text_data=event["text"])


class GamePlayConsumer(WebsocketConsumer):
    """Sends and receive playing time data."""

    def connect(self):
        self.game_id = None
        self.player_id = None
        self.player_vs = None
        async_to_sync(self.channel_layer.group_add)(
            "game-play-group", self.channel_name
        )
        self.accept()
        gaming_service.create_game("001", "002")  # XXX: for testing

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            "game-play-group", self.channel_name
        )
        return super().disconnect(code)

    def receive(self, text_data=None, bytes_data=None):
        if text_data:
            data = json.loads(text_data)
            if "msg_type" in data:
                self.handle_messsage(data)

    def handle_messsage(self, data: dict) -> None:
        match data["msg_type"]:
            case "play":
                self.player_id = data["body"]["player_id"]
                self.player_vs = data["body"]["vs"]  # bot | user
                gaming_service.add_player_to_game_queue(
                    player=self.player_id,
                    against=self.player_vs,
                )
                pass
            case "move":
                try:
                    gaming_service.make_move(data["game_id"], data["body"])
                except Exception as e:
                    async_to_sync(self.channel_layer.group_send)(
                        "game-play-group",
                        {
                            "type": "game.error",
                            "error": json.dumps(e),
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
        game_id = event["game_id"] if "game_id" in event else None
        if game_id is not None and self.game_id != game_id:
            return

        self.send(
            text_data=json.dumps(
                {
                    "msg_type": "update",
                    "game_id": game_id,
                    "body": event["content"],
                },
            )
        )

    def game_error(self, event):
        game_id = event["game_id"] if "game_id" in event else None
        if game_id is not None and self.game_id != game_id:
            return

        self.send(
            text_data=json.dumps(
                {
                    "msg_type": "error",
                    "game_id": game_id,
                    "body": event["content"],
                },
            )
        )

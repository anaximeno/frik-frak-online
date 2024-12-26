import json

from channels.generic.websocket import WebsocketConsumer

from .services import GamingService

gaming_service = GamingService.get_instance()


class GameServerConsumer(WebsocketConsumer):
    """Serves game info."""

    def connect(self):
        self.accept()

    def disconnect(self, code):
        return super().disconnect(code)

    def receive(self, text_data=None, bytes_data=None):
        self.send(text_data=json.dumps({"message": "Received!"}))
        return super().receive(text_data, bytes_data)


class GamePlayConsumer(WebsocketConsumer):
    """Sends and receive playing time data."""

    def connect(self):
        self.accept()
        self.gid = None
        game = gaming_service.create_game("001", "002")
        self.gid = game["gid"]
        self.send(
            text_data=json.dumps(
                {
                    "message_type": "start",
                    "body": {
                        "gid": self.gid,
                        "adversary_id": 1,
                        "turn_player_id": 1,
                        "board": game["board"],
                    },
                }
            )
        )

    def disconnect(self, code):
        return super().disconnect(code)

    def receive(self, text_data=None, bytes_data=None):
        if text_data:
            data = json.loads(text_data)
            if "message_type" in data:
                self.handle_msg_type_from_data(data)

    def handle_msg_type_from_data(self, data: dict) -> None:
        match data["message_type"]:
            case "play":
                # TODO: handle multiplayer
                pass
            case "move":
                try:
                    if not self.gid:
                        game = gaming_service.create_game("001", "002")  # XXX
                        self.gid = game["gid"]  # XXX
                    # -----------------------------------------------------------
                    data["body"]["gid"] = self.gid
                    result = gaming_service.make_move(data["body"])
                    response = json.dumps({"message_type": "update", "body": result})
                    self.send(text_data=response)
                except Exception as e:
                    response = json.dumps(
                        {
                            "message_type": "error",
                            "body": {
                                "gid": self.gid,
                                "error": str(e),
                            },
                        }
                    )
                    self.send(text_data=response)
            case _:
                print("UNKNOWN")

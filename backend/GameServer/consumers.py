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

    def disconnect(self, code):
        return super().disconnect(code)

    def receive(self, text_data=None, bytes_data=None):
        self.send(
            text_data=json.dumps(
                {
                    "message": {
                        "gaming_service_instance": gaming_service.__hash__(),
                        "play_consumer_instance": self.__hash__(),
                    }
                }
            )
        )
        return super().receive(text_data, bytes_data)

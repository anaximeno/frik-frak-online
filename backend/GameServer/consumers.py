import json

from channels.generic.websocket import WebsocketConsumer


class GameServerConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, code):
        return super().disconnect(code)

    def receive(self, text_data=None, bytes_data=None):
        self.send(text_data=json.dumps({"message": "Received!"}))
        return super().receive(text_data, bytes_data)


import enum


class GamePlayMessageTypes(enum.Enum):
    PLAY = "play"
    START = "start"
    MOVE = "move"
    UPDATE = "update"

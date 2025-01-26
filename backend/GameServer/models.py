import uuid
import os

from django.db import models
from django.contrib.auth.models import User
from django.core.files.storage import FileSystemStorage
from BackendServer.settings import BASE_DIR

imgfs = FileSystemStorage(location=os.path.join(BASE_DIR, '/images'), base_url="/images")


class Player(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        primary_key=True,
        null=False,
        blank=False,
        editable=False,
    )
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="player",
        unique=True,
    )
    profile_picture = models.ImageField(
        help_text="The player's profile picture",
        null=True,
        blank=True,
        storage=imgfs,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username


class Game(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        primary_key=True,
        null=False,
        blank=False,
        editable=False,
    )
    players = models.ManyToManyField(
        Player,
        related_name="game_players",
        blank=False,
        max_length=2,
    )
    winner = models.ForeignKey(
        Player,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="games_won",
    )
    GAME_STATES = [
        ("ongoing", "Ongoing"),
        ("ended", "Ended"),
    ]
    state = models.CharField(
        max_length=20,
        choices=GAME_STATES,
        default="ongoing",
    )

    def default_board():
        return [
            [None, None, None],
            [None, None, None],
            [None, None, None],
        ]

    board = models.JSONField(
        help_text="The game board",
        blank=False,
        null=False,
        default=default_board,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return " vs ".join(str(p) for p in self.players.get_queryset())

    def vs(self):
        return " vs ".join(str(p) for p in self.players.get_queryset())
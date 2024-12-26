from django.db import models


# Create your models here.
class Board(models.Model):
    entries = models.JSONField(
        help_text="The game board",
        blank=False,
        null=False,
        default=dict,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Game(models.Model):
    # TODO: add: board, game_id, last_player_id, player1_id, player2_id, winner_player_id
    pass

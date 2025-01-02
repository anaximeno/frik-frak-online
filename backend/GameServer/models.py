import uuid
from django.db import models

class Board(models.Model):
    entries = models.JSONField(
        help_text="The game board",
        blank=False,
        null=False,
        default=dict,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Player(models.Model):
    # Campos básicos para um jogador
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Game(models.Model):
    board = models.ForeignKey(Board, on_delete=models.CASCADE)
    game_id = models.UUIDField(default=uuid.uuid4, unique=True)
    
    last_player_id = models.ForeignKey(
        Player,  # Agora referencia o modelo Player diretamente
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='last_moves'
    )
    
    player1_id = models.ForeignKey(
        Player,
        on_delete=models.CASCADE,
        related_name='games_as_player1'
    )
    
    player2_id = models.ForeignKey(
        Player,
        on_delete=models.CASCADE,
        related_name='games_as_player2'
    )
    
    winner_player_id = models.ForeignKey(
        Player,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='games_won'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
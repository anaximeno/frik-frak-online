from rest_framework import serializers
from djoser.serializers import UserSerializer as DjoserUserSerializer
from .models import Player, Game


class UserSerializer(DjoserUserSerializer):
    player_id = serializers.SerializerMethodField()

    class Meta(DjoserUserSerializer.Meta):
        fields = DjoserUserSerializer.Meta.fields + ("player_id",)

    def get_player_id(self, obj):
        try:
            player = Player.objects.get(user=obj)
            return player.id
        except Player.DoesNotExist:
            return None


class GetPlayerSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    user_id = serializers.SerializerMethodField()

    class Meta:
        model = Player
        fields = ("id", "user_id", "username", "profile_picture")
        depth = 1

    def get_user_id(self, obj):
        try:
            player = Player.objects.get(id=obj.id)
            return player.user.pk
        except Player.DoesNotExist:
            return None

    def get_username(self, obj):
        try:
            player = Player.objects.get(id=obj.id)
            return player.user.username
        except Player.DoesNotExist:
            return None


class CreatePlayerSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField()
    # profile_picture = serializers.ImageField()

    class Meta:
        model = Player
        fields = ("username", "email", "password")


class GetPlayerStatsSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    games_played = serializers.SerializerMethodField()
    games_won = serializers.SerializerMethodField()
    games_lost = serializers.SerializerMethodField()

    class Meta:
        model = Player
        fields = ("id", "username", "games_played", "games_won", "games_lost")
        depth = 1

    def get_games_played(self, obj):
        try:
            games = Game.objects.filter(players__id=obj.id)
            return games.count()
        except Game.DoesNotExist:
            return None

    def get_games_won(self, obj):
        try:
            games = Game.objects.filter(winner__id=obj.id)
            return games.count()
        except Game.DoesNotExist:
            return None

    def get_games_lost(self, obj):
        try:
            games = Game.objects.exclude(winner__id=obj.id)
            return games.count()
        except Game.DoesNotExist:
            return None

    def get_username(self, obj):
        try:
            player = Player.objects.get(id=obj.id)
            return player.user.username
        except Player.DoesNotExist:
            return None


class GameSerializer(serializers.ModelSerializer):
    winner = GetPlayerSerializer()
    players = serializers.ListSerializer(child=GetPlayerSerializer())

    class Meta:
        model = Game
        fields = "__all__"
        depth = 1

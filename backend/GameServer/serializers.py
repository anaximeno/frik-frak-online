from rest_framework import serializers
from djoser.serializers import UserSerializer as DjoserUserSerializer
from .models import Player, Game


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


class GameSerializer(serializers.ModelSerializer):
    winner = GetPlayerSerializer()
    players = serializers.ListSerializer(child=GetPlayerSerializer())

    class Meta:
        model = Game
        fields = "__all__"
        depth = 1

from rest_framework import serializers
from djoser.serializers import UserSerializer as DjoserUserSerializer
from .models import Player, User


class GetPlayerSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    user_id = serializers.SerializerMethodField()

    class Meta:
        model = Player
        fields = ("id", "user_id", "username", "profile_picture")
        depth = 1

    def get_user_id(self, obj):
        return obj.user.id

    def get_username(self, obj):
        return obj.user.username


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

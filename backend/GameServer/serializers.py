from rest_framework import serializers
from djoser.serializers import UserSerializer as DjoserUserSerializer
from .models import Player


class UserSerializer(DjoserUserSerializer):
    player_id = serializers.SerializerMethodField()
    # profile_picture = serializers.SerializerMethodField() # TODO

    class Meta(DjoserUserSerializer.Meta):
        fields = DjoserUserSerializer.Meta.fields + (
            "player_id",
            # "profile_picture", # TODO
        )

    def get_player_id(self, obj):
        try:
            player = Player.objects.get(user=obj)
            return player.id
        except Player.DoesNotExist:
            return None

    # TODO
    # def get_profile_picture(self, obj):
    #     pass

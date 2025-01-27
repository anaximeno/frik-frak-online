from rest_framework.generics import get_object_or_404, GenericAPIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.settings import api_settings
from rest_framework import status, viewsets
from .models import Player, User, Game
from .serializers import (
    CreatePlayerSerializer,
    GetPlayerSerializer,
    GameSerializer,
    GetPlayerStatsSerializer,
)


class GameView(viewsets.ViewSet):
    pagination_class = api_settings.DEFAULT_PAGINATION_CLASS

    def list(self, request):
        queryset = Game.objects.all().order_by("-created_at")
        serializer = GameSerializer(queryset, many=True)
        paginator = self.pagination_class()
        data = paginator.paginate_queryset(serializer.data, request)
        return paginator.get_paginated_response(data)

    def retrieve(self, request, pk=None):
        queryset = Game.objects.all()
        game = get_object_or_404(queryset, pk=pk)
        serializer = GameSerializer(game)
        return Response(serializer.data)


@api_view(("POST",))
def create_player(request):
    serialized = CreatePlayerSerializer(data=request.data)
    serialized.is_valid(raise_exception=True)
    user = User.objects.create_user(
        email=serialized.validated_data.get("email"),
        username=serialized.validated_data.get("username"),
        password=serialized.validated_data.get("password"),
    )
    player = Player.objects.create(user=user)
    player_serialized = GetPlayerSerializer(player)
    return Response(player_serialized.data, status=status.HTTP_201_CREATED)


@api_view(("GET",))
def get_player_by_id(request, pk: str):
    player = get_object_or_404(Player, id=pk)
    player_serialized = GetPlayerSerializer(player)
    return Response(player_serialized.data, status=status.HTTP_200_OK)


@api_view(("GET",))
def get_player_stats(request, pk: str):
    player = get_object_or_404(Player, id=pk)
    player_stats_serialized = GetPlayerStatsSerializer(player)
    return Response(player_stats_serialized.data)

from rest_framework.generics import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Player, User
from .serializers import CreatePlayerSerializer, GetPlayerSerializer


# Create your views here.
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
def get_player_by_id(request, pk):
    player = get_object_or_404(Player, id=pk)
    player_serialized = GetPlayerSerializer(player)
    return Response(player_serialized.data, status=status.HTTP_200_OK)

from django.contrib import admin

from .models import *


# Register your models here.
@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "user",
        "created_at"
    ]


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = [
        "vs",
        "state",
        "winner",
        "created_at",
        "updated_at",
    ]

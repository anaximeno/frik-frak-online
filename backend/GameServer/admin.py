from django.contrib import admin

from .models import *


# Register your models here.
@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    pass


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = [
        "vs",
        "winner",
        "created_at",
    ]

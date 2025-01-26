# Generated by Django 5.1.5 on 2025-01-26 18:04

import django.core.files.storage
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('GameServer', '0002_alter_game_board'),
    ]

    operations = [
        migrations.AddField(
            model_name='player',
            name='profile_picture',
            field=models.ImageField(blank=True, help_text="The player's profile picture", null=True, storage=django.core.files.storage.FileSystemStorage(base_url='/images', location='/images'), upload_to=''),
        ),
    ]

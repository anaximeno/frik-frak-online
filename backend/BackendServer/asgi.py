"""
ASGI config for BackendServer project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os
import django

from django.core.asgi import get_asgi_application


# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.
django_asgi_app = get_asgi_application()


from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator

import GameServer.routing

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "BackendServer.settings")
django.setup()

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        # TODO: use AllowedHostsOriginValidator, ref bellow:
        # https://channels.readthedocs.io/en/latest/topics/authentication.html
        "websocket": AuthMiddlewareStack(
            URLRouter(GameServer.routing.websocket_urlpatterns),
        ),
    },
)

"""
WSGI config for The Beauty Bar backend.
"""
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'beautybar.settings')
application = get_wsgi_application()

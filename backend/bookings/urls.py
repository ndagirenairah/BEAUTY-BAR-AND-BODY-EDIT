"""
URL routes for The Beauty Bar API.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.ServiceCategoryViewSet, basename='category')
router.register(r'services', views.ServiceViewSet, basename='service')
router.register(r'bookings', views.BookingViewSet, basename='booking')
router.register(r'gallery', views.GalleryViewSet, basename='gallery')

urlpatterns = [
    path('', views.api_root, name='api-root'),
    path('health/', views.health_check, name='health-check'),
    path('availability/', views.AvailabilityView.as_view(), name='availability'),
    path('settings/', views.BusinessSettingsView.as_view(), name='settings'),
    path('', include(router.urls)),
]

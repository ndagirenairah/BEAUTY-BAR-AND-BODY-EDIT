"""
API Views for The Beauty Bar booking system.
"""
from datetime import datetime, timedelta
from django.utils import timezone
from django.db.models import Q
from rest_framework import viewsets, status, generics
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    ServiceCategory, ServiceSubcategory, Service,
    Customer, Booking, GalleryImage, BusinessSettings
)
from .serializers import (
    ServiceCategorySerializer, ServiceSubcategorySerializer, ServiceSerializer,
    CustomerSerializer, BookingSerializer, BookingCreateSerializer,
    GalleryImageSerializer, BusinessSettingsSerializer
)


class ServiceCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for service categories.
    """
    queryset = ServiceCategory.objects.filter(is_active=True)
    serializer_class = ServiceCategorySerializer
    lookup_field = 'slug'


class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for services.
    """
    queryset = Service.objects.filter(is_active=True).select_related('subcategory__category')
    serializer_class = ServiceSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(subcategory__category__slug=category)
        
        # Filter by subcategory
        subcategory = self.request.query_params.get('subcategory')
        if subcategory:
            queryset = queryset.filter(subcategory__slug=subcategory)
        
        # Filter popular
        popular = self.request.query_params.get('popular')
        if popular and popular.lower() == 'true':
            queryset = queryset.filter(is_popular=True)
        
        return queryset


class BookingViewSet(viewsets.ModelViewSet):
    """
    API endpoint for bookings.
    """
    queryset = Booking.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return BookingCreateSerializer
        return BookingSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by date
        date = self.request.query_params.get('date')
        if date:
            queryset = queryset.filter(date=date)
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by phone (for customer lookup)
        phone = self.request.query_params.get('phone')
        if phone:
            queryset = queryset.filter(customer_phone=phone)
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()
        
        # Return full booking details
        output_serializer = BookingSerializer(booking)
        return Response({
            'success': True,
            'message': 'Booking created successfully',
            'bookingRef': booking.reference,
            'booking': output_serializer.data
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm a booking"""
        booking = self.get_object()
        if booking.status != 'pending':
            return Response(
                {'error': 'Only pending bookings can be confirmed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        booking.confirm()
        return Response({
            'success': True,
            'message': 'Booking confirmed',
            'booking': BookingSerializer(booking).data
        })
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark booking as completed"""
        booking = self.get_object()
        if booking.status not in ['confirmed', 'in_progress']:
            return Response(
                {'error': 'Only confirmed or in-progress bookings can be completed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        booking.complete()
        return Response({
            'success': True,
            'message': 'Booking completed',
            'booking': BookingSerializer(booking).data
        })
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a booking"""
        booking = self.get_object()
        if booking.status in ['completed', 'cancelled']:
            return Response(
                {'error': 'Cannot cancel completed or already cancelled bookings'},
                status=status.HTTP_400_BAD_REQUEST
            )
        booking.status = 'cancelled'
        booking.save()
        return Response({
            'success': True,
            'message': 'Booking cancelled',
            'booking': BookingSerializer(booking).data
        })


class AvailabilityView(APIView):
    """
    Check available time slots for a given date.
    """
    def get(self, request):
        date_str = request.query_params.get('date')
        duration = int(request.query_params.get('duration', 60))
        
        if not date_str:
            return Response(
                {'error': 'Date parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {'error': 'Invalid date format. Use YYYY-MM-DD'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get business settings
        settings = BusinessSettings.get_settings()
        
        # Check if date is a closed day
        closed_days = [d.strip().lower() for d in settings.closed_days.split(',')]
        day_name = date.strftime('%A').lower()
        if day_name in closed_days:
            return Response({
                'date': date_str,
                'available': False,
                'message': f'Closed on {day_name.capitalize()}',
                'slots': []
            })
        
        # Generate all possible slots
        opening = datetime.combine(date, settings.opening_time)
        closing = datetime.combine(date, settings.closing_time)
        slot_duration = timedelta(minutes=settings.booking_slot_duration)
        
        all_slots = []
        current = opening
        while current + timedelta(minutes=duration) <= closing:
            all_slots.append(current.time())
            current += slot_duration
        
        # Get existing bookings for the date
        existing_bookings = Booking.objects.filter(
            date=date,
            status__in=['pending', 'confirmed', 'in_progress']
        ).values_list('time', 'service_duration')
        
        # Find unavailable slots
        unavailable_slots = set()
        for booking_time, booking_duration in existing_bookings:
            booking_start = datetime.combine(date, booking_time)
            booking_end = booking_start + timedelta(minutes=booking_duration)
            
            for slot in all_slots:
                slot_start = datetime.combine(date, slot)
                slot_end = slot_start + timedelta(minutes=duration)
                
                # Check if slot overlaps with booking
                if not (slot_end <= booking_start or slot_start >= booking_end):
                    unavailable_slots.add(slot)
        
        # Build available slots
        available_slots = [
            {
                'time': slot.strftime('%H:%M'),
                'label': slot.strftime('%I:%M %p').lstrip('0'),
                'available': slot not in unavailable_slots
            }
            for slot in all_slots
        ]
        
        return Response({
            'date': date_str,
            'available': True,
            'slots': available_slots
        })


class GalleryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for gallery images.
    """
    queryset = GalleryImage.objects.filter(is_active=True)
    serializer_class = GalleryImageSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by gallery type
        gallery = self.request.query_params.get('gallery')
        if gallery:
            queryset = queryset.filter(gallery=gallery)
        
        return queryset


class BusinessSettingsView(generics.RetrieveAPIView):
    """
    API endpoint for business settings (public info).
    """
    serializer_class = BusinessSettingsSerializer
    
    def get_object(self):
        return BusinessSettings.get_settings()


@api_view(['GET'])
def api_root(request):
    """
    API root with available endpoints.
    """
    return Response({
        'name': 'The Beauty Bar & Body Edit API',
        'version': '1.0.0',
        'endpoints': {
            'categories': '/api/categories/',
            'services': '/api/services/',
            'bookings': '/api/bookings/',
            'availability': '/api/availability/',
            'gallery': '/api/gallery/',
            'settings': '/api/settings/',
        },
        'social': {
            'tiktok': 'https://www.tiktok.com/@thebeautybarug0',
            'whatsapp': 'https://wa.me/256700000000',
        }
    })


@api_view(['GET'])
def health_check(request):
    """Health check endpoint"""
    return Response({
        'status': 'healthy',
        'timestamp': timezone.now().isoformat()
    })

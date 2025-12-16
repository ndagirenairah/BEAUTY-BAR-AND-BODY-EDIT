"""
Serializers for The Beauty Bar API.
"""
from rest_framework import serializers
from .models import (
    ServiceCategory, ServiceSubcategory, Service,
    Customer, Booking, GalleryImage, BusinessSettings
)


class ServiceSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='subcategory.category.name', read_only=True)
    subcategory_name = serializers.CharField(source='subcategory.name', read_only=True)
    
    class Meta:
        model = Service
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'duration',
            'image', 'is_popular', 'category_name', 'subcategory_name'
        ]


class ServiceSubcategorySerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)
    
    class Meta:
        model = ServiceSubcategory
        fields = ['id', 'name', 'slug', 'description', 'services']


class ServiceCategorySerializer(serializers.ModelSerializer):
    subcategories = ServiceSubcategorySerializer(many=True, read_only=True)
    service_count = serializers.SerializerMethodField()
    min_price = serializers.SerializerMethodField()
    
    class Meta:
        model = ServiceCategory
        fields = ['id', 'name', 'slug', 'description', 'icon', 'subcategories', 'service_count', 'min_price']
    
    def get_service_count(self, obj):
        return Service.objects.filter(subcategory__category=obj, is_active=True).count()
    
    def get_min_price(self, obj):
        services = Service.objects.filter(subcategory__category=obj, is_active=True)
        if services.exists():
            return services.order_by('price').first().price
        return None


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'name', 'phone', 'email', 'total_bookings', 'total_spent']
        read_only_fields = ['id', 'total_bookings', 'total_spent']


class BookingCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new bookings"""
    service_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Booking
        fields = [
            'customer_name', 'customer_phone', 'customer_email',
            'service_id', 'service_name', 'service_category', 'service_price', 'service_duration',
            'date', 'time', 'notes', 'source'
        ]
    
    def create(self, validated_data):
        service_id = validated_data.pop('service_id', None)
        
        # Get or create customer
        customer, _ = Customer.objects.get_or_create(
            phone=validated_data['customer_phone'],
            defaults={
                'name': validated_data['customer_name'],
                'email': validated_data.get('customer_email', '')
            }
        )
        validated_data['customer'] = customer
        
        # Link to service if ID provided
        if service_id:
            try:
                service = Service.objects.get(id=service_id, is_active=True)
                validated_data['service'] = service
            except Service.DoesNotExist:
                pass
        
        return super().create(validated_data)


class BookingSerializer(serializers.ModelSerializer):
    """Full booking serializer"""
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'id', 'reference', 'customer_name', 'customer_phone', 'customer_email',
            'service_name', 'service_category', 'service_price', 'service_duration',
            'date', 'time', 'status', 'status_display', 'payment_status', 'payment_status_display',
            'notes', 'source', 'created_at', 'confirmed_at', 'completed_at'
        ]
        read_only_fields = ['id', 'reference', 'created_at', 'confirmed_at', 'completed_at']


class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = ['id', 'title', 'image', 'gallery', 'caption', 'alt_text']


class BusinessSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessSettings
        fields = [
            'business_name', 'phone', 'whatsapp', 'email',
            'tiktok_handle', 'instagram_handle', 'facebook_url',
            'address', 'google_maps_url',
            'opening_time', 'closing_time', 'closed_days',
            'min_advance_booking_hours', 'max_advance_booking_days', 'booking_slot_duration'
        ]


class AvailabilitySerializer(serializers.Serializer):
    """Serializer for checking availability"""
    date = serializers.DateField()
    service_duration = serializers.IntegerField(default=60)

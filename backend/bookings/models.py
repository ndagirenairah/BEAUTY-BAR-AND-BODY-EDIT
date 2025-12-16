"""
Models for The Beauty Bar & Body Edit booking system.
"""
from django.db import models
from django.utils import timezone
import uuid


class ServiceCategory(models.Model):
    """Category for services (e.g., Infusion Bar, Edit Studio, Lash Lounge)"""
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Icon name or emoji")
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Service Categories"
        ordering = ['display_order', 'name']

    def __str__(self):
        return self.name


class ServiceSubcategory(models.Model):
    """Subcategory for services (e.g., Signature Favorites, Balance & Metabolism)"""
    category = models.ForeignKey(ServiceCategory, on_delete=models.CASCADE, related_name='subcategories')
    name = models.CharField(max_length=100)
    slug = models.SlugField()
    description = models.TextField(blank=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "Service Subcategories"
        ordering = ['display_order', 'name']
        unique_together = ['category', 'slug']

    def __str__(self):
        return f"{self.category.name} - {self.name}"


class Service(models.Model):
    """Individual services offered by The Beauty Bar"""
    subcategory = models.ForeignKey(ServiceSubcategory, on_delete=models.CASCADE, related_name='services')
    name = models.CharField(max_length=200)
    slug = models.SlugField()
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=0, help_text="Price in UGX")
    duration = models.PositiveIntegerField(help_text="Duration in minutes")
    image = models.ImageField(upload_to='services/', blank=True, null=True)
    is_popular = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', 'name']
        unique_together = ['subcategory', 'slug']

    def __str__(self):
        return self.name

    @property
    def category(self):
        return self.subcategory.category


class Customer(models.Model):
    """Customer information"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    notes = models.TextField(blank=True, help_text="Internal notes about this customer")
    total_bookings = models.PositiveIntegerField(default=0)
    total_spent = models.DecimalField(max_digits=12, decimal_places=0, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.phone})"


class Booking(models.Model):
    """Booking/appointment records"""
    
    STATUS_CHOICES = [
        ('pending', 'Pending Confirmation'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('unpaid', 'Unpaid'),
        ('partial', 'Partially Paid'),
        ('paid', 'Paid'),
        ('refunded', 'Refunded'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reference = models.CharField(max_length=20, unique=True, editable=False)
    
    # Customer info
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')
    customer_name = models.CharField(max_length=200)
    customer_phone = models.CharField(max_length=20)
    customer_email = models.EmailField(blank=True)
    
    # Service info
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')
    service_name = models.CharField(max_length=200)
    service_category = models.CharField(max_length=100)
    service_price = models.DecimalField(max_digits=10, decimal_places=0)
    service_duration = models.PositiveIntegerField(help_text="Duration in minutes")
    
    # Scheduling
    date = models.DateField()
    time = models.TimeField()
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='unpaid')
    
    # Additional info
    notes = models.TextField(blank=True, help_text="Customer notes or special requests")
    internal_notes = models.TextField(blank=True, help_text="Internal staff notes")
    
    # Tracking
    source = models.CharField(max_length=50, default='website', help_text="Booking source (website, phone, walk-in)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-date', '-time']
        indexes = [
            models.Index(fields=['date', 'time']),
            models.Index(fields=['status']),
            models.Index(fields=['customer_phone']),
            models.Index(fields=['reference']),
        ]

    def __str__(self):
        return f"{self.reference} - {self.customer_name} ({self.date})"

    def save(self, *args, **kwargs):
        if not self.reference:
            # Generate reference like TBE-ABC123
            self.reference = f"TBE-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)

    def confirm(self):
        """Confirm the booking"""
        self.status = 'confirmed'
        self.confirmed_at = timezone.now()
        self.save()

    def complete(self):
        """Mark booking as completed"""
        self.status = 'completed'
        self.completed_at = timezone.now()
        self.save()
        
        # Update customer stats
        if self.customer:
            self.customer.total_bookings += 1
            self.customer.total_spent += self.service_price
            self.customer.save()


class GalleryImage(models.Model):
    """Gallery images for the website"""
    
    GALLERY_CHOICES = [
        ('body', 'Body Edit / Infusion Bar'),
        ('lashes', 'Lash Lounge'),
        ('studio', 'Edit Studio'),
        ('results', 'Results / Before & After'),
    ]
    
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='gallery/')
    gallery = models.CharField(max_length=20, choices=GALLERY_CHOICES)
    caption = models.CharField(max_length=300, blank=True)
    alt_text = models.CharField(max_length=200, blank=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['gallery', 'display_order']
        verbose_name_plural = "Gallery Images"

    def __str__(self):
        return f"{self.gallery} - {self.title}"


class BusinessSettings(models.Model):
    """Business configuration settings"""
    
    # Contact Info
    business_name = models.CharField(max_length=200, default="The Beauty Bar & Body Edit")
    phone = models.CharField(max_length=20, default="256700000000")
    whatsapp = models.CharField(max_length=20, default="256700000000")
    email = models.EmailField(blank=True)
    
    # Social Media
    tiktok_handle = models.CharField(max_length=100, default="@thebeautybarug0")
    instagram_handle = models.CharField(max_length=100, blank=True)
    facebook_url = models.URLField(blank=True)
    
    # Location
    address = models.TextField(blank=True)
    google_maps_url = models.URLField(blank=True)
    google_maps_embed = models.TextField(blank=True, help_text="Google Maps embed code")
    
    # Business Hours
    opening_time = models.TimeField(default="09:00")
    closing_time = models.TimeField(default="19:00")
    closed_days = models.CharField(max_length=50, default="Sunday", help_text="Comma-separated days")
    
    # Booking Settings
    min_advance_booking_hours = models.PositiveIntegerField(default=24)
    max_advance_booking_days = models.PositiveIntegerField(default=30)
    booking_slot_duration = models.PositiveIntegerField(default=60, help_text="Slot duration in minutes")
    
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Business Settings"
        verbose_name_plural = "Business Settings"

    def __str__(self):
        return self.business_name

    def save(self, *args, **kwargs):
        # Ensure only one instance exists
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_settings(cls):
        """Get or create business settings"""
        settings, _ = cls.objects.get_or_create(pk=1)
        return settings

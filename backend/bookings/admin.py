"""
Admin configuration for The Beauty Bar booking system.
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import (
    ServiceCategory, ServiceSubcategory, Service,
    Customer, Booking, GalleryImage, BusinessSettings
)


@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'display_order', 'is_active']
    list_editable = ['display_order', 'is_active']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']


@admin.register(ServiceSubcategory)
class ServiceSubcategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'display_order', 'is_active']
    list_editable = ['display_order', 'is_active']
    list_filter = ['category', 'is_active']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name', 'category__name']


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'subcategory', 'price_display', 'duration', 'is_popular', 'is_active']
    list_editable = ['is_popular', 'is_active']
    list_filter = ['subcategory__category', 'subcategory', 'is_popular', 'is_active']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name', 'description']
    
    def price_display(self, obj):
        return f"UGX {obj.price:,.0f}"
    price_display.short_description = "Price"


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'email', 'total_bookings', 'total_spent_display', 'created_at']
    search_fields = ['name', 'phone', 'email']
    readonly_fields = ['id', 'total_bookings', 'total_spent', 'created_at', 'updated_at']
    
    def total_spent_display(self, obj):
        return f"UGX {obj.total_spent:,.0f}"
    total_spent_display.short_description = "Total Spent"


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = [
        'reference', 'customer_name', 'customer_phone', 'service_name',
        'date', 'time', 'status_badge', 'payment_status_badge', 'created_at'
    ]
    list_filter = ['status', 'payment_status', 'date', 'service_category', 'source']
    search_fields = ['reference', 'customer_name', 'customer_phone', 'customer_email', 'service_name']
    readonly_fields = ['id', 'reference', 'created_at', 'updated_at', 'confirmed_at', 'completed_at']
    date_hierarchy = 'date'
    
    fieldsets = (
        ('Booking Info', {
            'fields': ('reference', 'status', 'payment_status')
        }),
        ('Customer', {
            'fields': ('customer', 'customer_name', 'customer_phone', 'customer_email')
        }),
        ('Service', {
            'fields': ('service', 'service_name', 'service_category', 'service_price', 'service_duration')
        }),
        ('Schedule', {
            'fields': ('date', 'time')
        }),
        ('Notes', {
            'fields': ('notes', 'internal_notes')
        }),
        ('Tracking', {
            'fields': ('source', 'created_at', 'updated_at', 'confirmed_at', 'completed_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['confirm_bookings', 'complete_bookings', 'cancel_bookings']
    
    def status_badge(self, obj):
        colors = {
            'pending': '#f59e0b',
            'confirmed': '#10b981',
            'in_progress': '#3b82f6',
            'completed': '#22c55e',
            'cancelled': '#ef4444',
            'no_show': '#6b7280',
        }
        color = colors.get(obj.status, '#6b7280')
        return format_html(
            '<span style="background:{}; color:white; padding:3px 8px; border-radius:12px; font-size:11px;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = "Status"
    
    def payment_status_badge(self, obj):
        colors = {
            'unpaid': '#ef4444',
            'partial': '#f59e0b',
            'paid': '#22c55e',
            'refunded': '#6b7280',
        }
        color = colors.get(obj.payment_status, '#6b7280')
        return format_html(
            '<span style="background:{}; color:white; padding:3px 8px; border-radius:12px; font-size:11px;">{}</span>',
            color, obj.get_payment_status_display()
        )
    payment_status_badge.short_description = "Payment"
    
    @admin.action(description="Confirm selected bookings")
    def confirm_bookings(self, request, queryset):
        count = 0
        for booking in queryset.filter(status='pending'):
            booking.confirm()
            count += 1
        self.message_user(request, f"{count} booking(s) confirmed.")
    
    @admin.action(description="Mark as completed")
    def complete_bookings(self, request, queryset):
        count = 0
        for booking in queryset.filter(status__in=['confirmed', 'in_progress']):
            booking.complete()
            count += 1
        self.message_user(request, f"{count} booking(s) marked as completed.")
    
    @admin.action(description="Cancel selected bookings")
    def cancel_bookings(self, request, queryset):
        count = queryset.exclude(status__in=['completed', 'cancelled']).update(status='cancelled')
        self.message_user(request, f"{count} booking(s) cancelled.")


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ['title', 'gallery', 'display_order', 'is_active', 'image_preview']
    list_editable = ['display_order', 'is_active']
    list_filter = ['gallery', 'is_active']
    search_fields = ['title', 'caption']
    
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height:50px; border-radius:4px;" />',
                obj.image.url
            )
        return "-"
    image_preview.short_description = "Preview"


@admin.register(BusinessSettings)
class BusinessSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Business Info', {
            'fields': ('business_name', 'phone', 'whatsapp', 'email')
        }),
        ('Social Media', {
            'fields': ('tiktok_handle', 'instagram_handle', 'facebook_url')
        }),
        ('Location', {
            'fields': ('address', 'google_maps_url', 'google_maps_embed')
        }),
        ('Business Hours', {
            'fields': ('opening_time', 'closing_time', 'closed_days')
        }),
        ('Booking Settings', {
            'fields': ('min_advance_booking_hours', 'max_advance_booking_days', 'booking_slot_duration')
        }),
    )
    
    def has_add_permission(self, request):
        # Only allow one instance
        return not BusinessSettings.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        return False


# Customize admin site
admin.site.site_header = "The Beauty Bar & Body Edit"
admin.site.site_title = "Beauty Bar Admin"
admin.site.index_title = "Dashboard"

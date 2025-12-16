"""
Management command to seed initial services data.
"""
from django.core.management.base import BaseCommand
from bookings.models import ServiceCategory, ServiceSubcategory, Service, BusinessSettings


class Command(BaseCommand):
    help = 'Seeds the database with initial services data for The Beauty Bar'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database...')
        
        # Create Business Settings
        settings, created = BusinessSettings.objects.get_or_create(pk=1)
        if created:
            settings.business_name = "The Beauty Bar & Body Edit"
            settings.phone = "256700000000"
            settings.whatsapp = "256700000000"
            settings.tiktok_handle = "@thebeautybarug0"
            settings.save()
            self.stdout.write(self.style.SUCCESS('✓ Business settings created'))
        
        # Define services data
        services_data = {
            'Infusion Bar': {
                'icon': '💉',
                'description': 'Premium IV vitamin infusions for wellness, beauty, and recovery.',
                'subcategories': {
                    'Signature Favorites': [
                        ('Total Body Edit', 450000, 60, 'Complete wellness reset with hydration, vitamins, and minerals.'),
                        ('NAD+ Cellular Regeneration', 680000, 90, 'Energy, longevity, and mental clarity through cellular repair.'),
                        ('Glow & Radiance Infusion', 370000, 45, 'Brightening, even tone, and luminous skin from within.'),
                    ],
                    'Balance & Metabolism': [
                        ('Weight Management Mix', 320000, 45, 'Support fat burn and metabolism optimization.'),
                        ('Detoxification Infusion', 280000, 40, 'Cleanse and reset your system with targeted nutrients.'),
                        ('Hangover & Recovery', 250000, 30, 'Fast relief from dehydration and fatigue.'),
                    ],
                    'Skin & Beauty': [
                        ('Skin Whitening Mix', 400000, 50, 'Glutathione and vitamin C for brighter, even skin tone.'),
                        ('Skin Anti-Aging Infusion', 450000, 55, 'Combat fine lines with collagen-boosting nutrients.'),
                        ('Glow Boost Shot', 150000, 15, 'Quick vitamin boost for instant radiance.'),
                    ],
                    'Wellness & Mood': [
                        ('Stress Relief & Calm', 300000, 45, 'Magnesium and B-vitamins for relaxation and mental clarity.'),
                        ('Immune Boost Infusion', 280000, 40, 'High-dose vitamin C and zinc for immune support.'),
                        ('Energy & Vitality', 320000, 45, 'B12 and amino acids for sustained energy.'),
                    ],
                }
            },
            'Edit Studio': {
                'icon': '✨',
                'description': 'Advanced body sculpting, skin treatments, and intimate wellness.',
                'subcategories': {
                    'Body Sculpting': [
                        ('Cryolipolysis Fat Freezing', 800000, 60, 'Non-invasive fat reduction through controlled cooling.'),
                        ('Body Contouring & Tightening', 600000, 45, 'RF technology for skin tightening and cellulite reduction.'),
                        ('Sculpt & Tone Session', 500000, 40, 'Muscle stimulation for definition and tone.'),
                    ],
                    'Female Intimate Wellness': [
                        ('Intimate Rejuvenation', 700000, 45, 'Non-surgical intimate wellness treatment.'),
                        ('Intimate Tightening', 650000, 40, 'RF-based intimate tightening and comfort enhancement.'),
                    ],
                    'Skin Rejuvenation': [
                        ('Facial Rejuvenation', 400000, 50, 'Advanced facial treatment for youthful, glowing skin.'),
                        ('Micro-Needling Therapy', 350000, 45, 'Collagen induction for smoother, firmer skin.'),
                    ],
                }
            },
            'Lash Lounge': {
                'icon': '👁️',
                'description': 'Professional lash extensions and maintenance services.',
                'subcategories': {
                    'Lash Extensions': [
                        ('Classic Full Set', 180000, 120, 'Natural-looking classic lash extensions.'),
                        ('Hybrid Full Set', 220000, 150, 'Mix of classic and volume for textured fullness.'),
                        ('Volume Full Set', 280000, 180, 'Dramatic, fluffy volume lash set.'),
                        ('Mega Volume Full Set', 350000, 210, 'Ultra-dramatic mega volume for maximum impact.'),
                    ],
                    'Maintenance': [
                        ('Lash Infill (2-3 weeks)', 100000, 60, 'Maintenance infill for existing lash sets.'),
                        ('Lash Removal', 50000, 30, 'Safe, gentle removal of existing extensions.'),
                    ],
                }
            },
        }
        
        # Create categories, subcategories, and services
        for cat_name, cat_data in services_data.items():
            category, created = ServiceCategory.objects.get_or_create(
                slug=cat_name.lower().replace(' ', '-').replace('&', 'and'),
                defaults={
                    'name': cat_name,
                    'description': cat_data['description'],
                    'icon': cat_data['icon'],
                }
            )
            if created:
                self.stdout.write(f'  ✓ Category: {cat_name}')
            
            for subcat_name, services in cat_data['subcategories'].items():
                subcategory, created = ServiceSubcategory.objects.get_or_create(
                    category=category,
                    slug=subcat_name.lower().replace(' ', '-').replace('&', 'and'),
                    defaults={
                        'name': subcat_name,
                    }
                )
                if created:
                    self.stdout.write(f'    ✓ Subcategory: {subcat_name}')
                
                for service_name, price, duration, description in services:
                    service, created = Service.objects.get_or_create(
                        subcategory=subcategory,
                        slug=service_name.lower().replace(' ', '-').replace('&', 'and'),
                        defaults={
                            'name': service_name,
                            'price': price,
                            'duration': duration,
                            'description': description,
                        }
                    )
                    if created:
                        self.stdout.write(f'      ✓ Service: {service_name}')
        
        self.stdout.write(self.style.SUCCESS('\n✅ Database seeded successfully!'))
        
        # Summary
        self.stdout.write(f'\nSummary:')
        self.stdout.write(f'  Categories: {ServiceCategory.objects.count()}')
        self.stdout.write(f'  Subcategories: {ServiceSubcategory.objects.count()}')
        self.stdout.write(f'  Services: {Service.objects.count()}')

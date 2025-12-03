from django.core.management.base import BaseCommand
from apps.listings.models import Property
from apps.services.models import Service
from apps.blog.models import Article
from apps.content.models import WhoWeAreItem, WhyChooseReason
from apps.core.models import SiteHero


class Command(BaseCommand):
    help = 'Seed initial data extracted from the React frontend static arrays'

    def handle(self, *args, **options):
        # Hero
        SiteHero.objects.update_or_create(
            title='Real Estate Intelligence for Modern Africa',
            defaults={
                'subtitle': 'Trusted guidance for property financing, land documentation, and investment strategy—built on integrity, competence, and data-driven insight.',
                'cta_text': 'Book a Free Consultation',
                'image_url': 'https://images.unsplash.com/photo-1588334488081-06fca9a234f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080'
            }
        )

        # Properties
        properties = [
            {
                'image_url': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
                'location': 'Bastos, Yaoundé',
                'price': '85,000,000 FCFA',
                'features': '4 bed · 3 bath · 250m²',
                'verified': True,
            },
            {
                'image_url': 'https://images.unsplash.com/photo-1701589212546-2a1bcd94c5af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
                'location': 'Odza, Yaoundé',
                'price': '35,000,000 FCFA',
                'features': '3 bed · 2 bath · 180m²',
                'verified': True,
            },
            {
                'image_url': 'https://images.unsplash.com/photo-1764222233275-87dc016c11dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
                'location': 'Ebolowa Road',
                'price': '15,000,000 FCFA',
                'features': 'Land · 500m² · Titled',
                'verified': True,
            },
        ]
        for p in properties:
            Property.objects.update_or_create(location=p['location'], defaults=p)

        # Services
        services = [
            {
                'title': 'Real Estate Loan Support',
                'subtitle': 'Simplifying the process from application to approval.',
                'slug': 'loan-assistance',
                'image_url': 'https://images.unsplash.com/photo-1739430630591-9380bdf1c798?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
                'height': 'tall',
            },
            {
                'title': 'Land & Property Documentation',
                'subtitle': 'Accurate, transparent, legally compliant documentation.',
                'slug': 'documentation',
                'image_url': 'https://images.unsplash.com/photo-1609424612637-20f39c4187ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
                'height': 'medium',
            },
            {
                'title': 'Rental Management',
                'subtitle': 'Hands-free tenant management and property oversight.',
                'slug': 'rental-management',
                'image_url': 'https://images.unsplash.com/photo-1603736043044-65d44d3c6230?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
                'height': 'medium',
            },
            {
                'title': 'Portfolio Strategy for Investors',
                'subtitle': "Smart, data-driven investment plans for locals & diaspora.",
                'slug': 'diaspora-strategy',
                'image_url': 'https://images.unsplash.com/photo-1761587941453-bd1790225d52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
                'height': 'tall',
            },
            {
                'title': 'Property Verification',
                'subtitle': 'Verify land ownership, boundaries, and legitimacy before payment.',
                'slug': 'verification',
                'image_url': 'https://images.unsplash.com/photo-1716037991590-c975184b37df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
                'height': 'short',
            },
            {
                'title': 'Verified Property Listings',
                'subtitle': 'Curated, verified properties you can trust.',
                'slug': 'listings',
                'image_url': 'https://images.unsplash.com/photo-1610401511615-a36fb6e94657?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
                'height': 'short',
            },
        ]
        for s in services:
            Service.objects.update_or_create(slug=s['slug'], defaults=s)

        # Articles
        articles = [
            {
                'title': 'How Real Estate Loans Work in Cameroon',
                'excerpt': 'A comprehensive breakdown of the loan process, requirements, and what you need to know before applying.',
                'category': 'Loan Education',
            },
            {
                'title': '7 Red Flags When Buying Land in Yaoundé',
                'excerpt': "Learn to identify warning signs that could save you from fraud and costly mistakes.",
                'category': 'Market Intelligence',
            },
            {
                'title': "The Diaspora Investor's Roadmap",
                'excerpt': "Essential strategies for Cameroonians abroad looking to invest safely in real estate back home.",
                'category': 'Diaspora Investment Tips',
            },
            {
                'title': 'How to Verify Property Before Paying',
                'excerpt': 'Step-by-step verification process to protect yourself from scams and ensure legitimate deals.',
                'category': 'Property Verification',
            },
        ]
        for a in articles:
            Article.objects.update_or_create(title=a['title'], defaults=a)

        # Who we are items
        who_items = [
            "Deep understanding of Cameroon's real estate loan processes",
            "Strong network with trusted developers and institutions",
            "Tech-driven approach with data-backed insights",
            "Integrity as our foundation",
        ]
        for idx, text in enumerate(who_items):
            WhoWeAreItem.objects.update_or_create(text=text, defaults={'order': idx})

        # Why choose reasons
        reasons = [
            {'title': 'Integrity Above Everything', 'description': 'Every process is transparent and trustworthy.'},
            {'title': 'Competence & Professional Expertise', 'description': 'We apply modern systems, data, and strategy to deliver results.'},
            {'title': 'Tech-Driven Consulting', 'description': 'Digital tools, market intelligence, and data-backed insights.'},
            {'title': 'Personalized Guidance', 'description': 'Every client gets founder-level attention with clear communication.'},
            {'title': 'Bilingual Service (EN/FR)', 'description': 'Seamless communication in English and French.'},
            {'title': 'Safety & Fraud Prevention', 'description': 'We help you avoid common real estate risks and scams.'},
        ]
        for idx, r in enumerate(reasons):
            WhyChooseReason.objects.update_or_create(title=r['title'], defaults={'description': r['description'], 'order': idx})

        self.stdout.write(self.style.SUCCESS('Seeded initial data successfully'))

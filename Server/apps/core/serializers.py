from rest_framework import serializers
from .models import SiteHero


class SiteHeroSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteHero
        fields = ['id', 'title', 'subtitle', 'cta_text', 'image_url']

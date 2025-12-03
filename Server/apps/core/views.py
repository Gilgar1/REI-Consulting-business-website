from rest_framework import viewsets, permissions
from .models import SiteHero
from .serializers import SiteHeroSerializer


class SiteHeroViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SiteHero.objects.all()
    serializer_class = SiteHeroSerializer
    permission_classes = [permissions.AllowAny]

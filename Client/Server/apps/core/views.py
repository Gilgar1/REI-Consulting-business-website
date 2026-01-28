from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from .models import SiteHero
from .serializers import SiteHeroSerializer, UserRegistrationSerializer
from django.contrib.auth.models import User


class SiteHeroViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SiteHero.objects.all()
    serializer_class = SiteHeroSerializer
    permission_classes = [permissions.AllowAny]


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer

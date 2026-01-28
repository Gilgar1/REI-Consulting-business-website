from rest_framework import viewsets, permissions
from .models import WhoWeAreItem, WhyChooseReason
from .serializers import WhoWeAreItemSerializer, WhyChooseReasonSerializer


class WhoWeAreViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = WhoWeAreItem.objects.all()
    serializer_class = WhoWeAreItemSerializer
    permission_classes = [permissions.AllowAny]


class WhyChooseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = WhyChooseReason.objects.all()
    serializer_class = WhyChooseReasonSerializer
    permission_classes = [permissions.AllowAny]

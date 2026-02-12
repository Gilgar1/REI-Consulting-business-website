from rest_framework import serializers
from .models import WhoWeAreItem, WhyChooseReason


class WhoWeAreItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhoWeAreItem
        fields = ['id', 'text', 'order']


class WhyChooseReasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhyChooseReason
        fields = ['id', 'title', 'description', 'order']

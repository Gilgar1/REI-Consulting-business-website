from django.contrib import admin
from .models import Property


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('location', 'price', 'verified', 'created_at')
    list_filter = ('verified',)
    search_fields = ('location', 'price', 'features')

from django.contrib import admin
from .models import WhoWeAreItem, WhyChooseReason


@admin.register(WhoWeAreItem)
class WhoWeAreItemAdmin(admin.ModelAdmin):
    list_display = ('text', 'order')
    ordering = ('order',)


@admin.register(WhyChooseReason)
class WhyChooseReasonAdmin(admin.ModelAdmin):
    list_display = ('title', 'order')
    ordering = ('order',)

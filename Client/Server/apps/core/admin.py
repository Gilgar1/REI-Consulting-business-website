from django.contrib import admin
from .models import SiteHero

@admin.register(SiteHero)
class SiteHeroAdmin(admin.ModelAdmin):
    list_display = ('title',)

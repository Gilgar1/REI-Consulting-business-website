from django.db import models


class SiteHero(models.Model):
    title = models.CharField(max_length=255)
    subtitle = models.TextField(blank=True)
    cta_text = models.CharField(max_length=100, blank=True)
    image_url = models.URLField(blank=True)

    def __str__(self):
        return self.title

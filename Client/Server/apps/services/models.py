from django.db import models


class Service(models.Model):
    title = models.CharField(max_length=255)
    subtitle = models.TextField(blank=True)
    slug = models.SlugField(max_length=100, unique=True)
    image_url = models.URLField(blank=True)
    height = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['title']

    def __str__(self):
        return self.title

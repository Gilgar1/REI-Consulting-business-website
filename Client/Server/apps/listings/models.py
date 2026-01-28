from django.db import models


class Property(models.Model):
    title = models.CharField(max_length=255, blank=True)
    image_url = models.URLField(blank=True)
    location = models.CharField(max_length=255)
    price = models.CharField(max_length=100)
    features = models.CharField(max_length=255, blank=True)
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.location} — {self.price}"

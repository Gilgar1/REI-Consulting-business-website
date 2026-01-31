from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SiteHeroViewSet, RegisterView

router = DefaultRouter()
router.register(r'hero', SiteHeroViewSet, basename='hero')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='auth_register'),
]

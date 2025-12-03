from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WhoWeAreViewSet, WhyChooseViewSet

router = DefaultRouter()
router.register(r'who-we-are', WhoWeAreViewSet, basename='who-we-are')
router.register(r'why-choose', WhyChooseViewSet, basename='why-choose')

urlpatterns = [
    path('', include(router.urls)),
]

from django.urls import path
from posts.views import receive_data
from rest_framework.routers import DefaultRouter
from .views import PostViewSet

post_router = DefaultRouter()
post_router.register(r'posts', PostViewSet)

urlpatterns = [
    path("receive-data/", receive_data, name="receive_data"),
]
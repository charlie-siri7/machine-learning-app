from django.urls import path
from posts.views import receive_data
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, sort_csv, select_csv

post_router = DefaultRouter()
post_router.register(r'posts', PostViewSet)

urlpatterns = [
    path("receive-data/", receive_data, name="receive_data"),
    path('sort-csv/', sort_csv, name='sort_csv'),
    path('select-csv/', select_csv, name='select_csv'),
]
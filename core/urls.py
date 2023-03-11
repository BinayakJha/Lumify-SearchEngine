from .views import *
from rest_framework import routers
from django.urls import path, include
# import settings.py


router = routers.DefaultRouter()
router.register('search_query', SearchAPI)

urlpatterns = [
    path('', index, name='index'),
    path('search', search, name='search'),
    path('searchjs/<str:query>', searchjs, name='search'),
    path('sidesearch/<str:query>', main_side_search, name='sidesearch'),
    path('suggestions/<str:query>', suggestions, name='suggestions'),
    path('imagesearch/<str:query>', image_search, name='imagesearch'),
]



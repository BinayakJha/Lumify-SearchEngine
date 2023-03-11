from rest_framework import serializers
from .models import Search_Query

class SearchQuerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Search_Query
        fields = '__all__'
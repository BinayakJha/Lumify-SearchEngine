from django.db import models

# Create your models here.

class Search_Query(models.Model):
    query = models.CharField(max_length=300)
    icon_image = models.CharField(max_length=300)
    title = models.CharField(max_length=200)
    description = models.TextField()
    link = models.CharField(max_length=200)
    
    def __str__(self):
        return self.title
    


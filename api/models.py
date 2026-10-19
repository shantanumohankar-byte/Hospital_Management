from django.db import models

# Create your models here.
class Doctor(models.Model):
    Name = models.CharField(max_length=100)
    contact = models.IntegerField()
    email = models.EmailField()



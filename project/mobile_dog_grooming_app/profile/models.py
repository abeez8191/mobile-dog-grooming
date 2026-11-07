from django.db import models
from django.core.validators import RegexValidator

# Create your models here.
class Groomer(models.Model):
    firstName = models.CharField()
    lastName = models.CharField()
    email = models.EmailField()
    phoneNumber = models.CharField(max_length=10, validators=[RegexValidator("[0-9]{10}")])
    availability = models.JSONField()
    biography = models.CharField(max_length=1_000)
    photo = models.BinaryField()

class Customer(models.Model):
    firstName = models.CharField()
    lastName = models.CharField()
    street = models.CharField()
    street2 = models.CharField()
    city = models.CharField()
    state = models.CharField(max_length=2)
    zipCode = models.CharField(max_length=5)
    email = models.EmailField()
    phoneNumber = models.CharField(max_length=10, validators=[RegexValidator("[0-9]{10}")])
    
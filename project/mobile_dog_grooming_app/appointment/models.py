from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

from profile.models import Customer, Groomer

# Create your models here.
class Service(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField(validators=[MinValueValidator(0)])
    duration = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(240)])

class Appointment(models.Model):
    customer_id = models.ForeignKey(Customer, on_delete=models.RESTRICT)
    groomer_id = models.ForeignKey(Groomer, on_delete=models.RESTRICT)
    datetime = models.DateTimeField(validators=[MinValueValidator(timezone.now)])
    services = models.ManyToManyField(Service, related_name="appointments")

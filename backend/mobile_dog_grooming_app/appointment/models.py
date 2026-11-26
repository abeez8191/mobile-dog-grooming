from profile.models import Customer, Dog, Groomer

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone


# Create your models here.
class Service(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField(validators=[MinValueValidator(0)])
    duration = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(240)])

    def __str__(self):
        return self.name

class Appointment(models.Model):
    dog = models.ForeignKey(Dog, on_delete=models.RESTRICT)
    customer = models.ForeignKey(Customer, on_delete=models.RESTRICT)
    groomer = models.ForeignKey(Groomer, on_delete=models.RESTRICT)
    datetime = models.DateTimeField(validators=[MinValueValidator(timezone.now)])
    services = models.ManyToManyField(Service, related_name="appointment")
    completed_on = models.DateTimeField(null=True)
    deleted_on = models.DateTimeField(null=True)
    deleted_by = models.CharField(max_length=8, null=True)
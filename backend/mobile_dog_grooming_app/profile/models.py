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
    photoData = models.CharField(max_length=30)

    def __str__(self):
        return f"{self.firstName} {self.lastName}"

class Customer(models.Model):
    firstName = models.CharField()
    lastName = models.CharField()
    street = models.CharField()
    street2 = models.CharField(null=True, blank=True)
    city = models.CharField()
    state = models.CharField(max_length=2, validators=[RegexValidator("[a-zA-Z]{2}")])
    zipCode = models.CharField(max_length=5, validators=[RegexValidator("[0-9]{5}")])
    email = models.EmailField()
    phoneNumber = models.CharField(max_length=10, validators=[RegexValidator("[0-9]{10}")])

    def __str__(self):
        return f"{self.firstName} {self.lastName}"

class Dog(models.Model):
    name = models.CharField(max_length=50)
    owner = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="dogs")
    breed = models.CharField(max_length=50)

class Note(models.Model):
    dog = models.ForeignKey(Dog, on_delete=models.CASCADE, related_name="notes")
    message = models.CharField()
    groomer = models.ForeignKey(Groomer, on_delete=models.CASCADE)
    created_on = models.DateTimeField()
    updated_on = models.DateTimeField()
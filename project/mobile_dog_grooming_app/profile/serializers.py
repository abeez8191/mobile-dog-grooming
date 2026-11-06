from rest_framework import serializers
from .models import Customer, Groomer

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['firstName', 'lastName', 'street', 'street2', 'city', 'state', 'zipCode', 'email', 'phoneNumber']

class GroomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Groomer
        fields = ['firstName', 'lastName', 'email', 'phoneNumber', 'availability', 'biography', 'photo']

class PublicGroomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Groomer
        fields = ['firstName', 'lastName', 'photo', 'biography']
from rest_framework import serializers
from .models import Service, Appointment
from profile.serializers import CustomerSerializer, GroomerSerializer
from profile.models import Customer, Groomer

import logging

logger = logging.getLogger(__name__)

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['name', 'price', 'duration']

class AppointmentSerializer(serializers.ModelSerializer):
    customer = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all())
    groomer = serializers.PrimaryKeyRelatedField(queryset=Groomer.objects.all())
    services = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Service.objects.all()
    )

    class Meta:
        model = Appointment
        fields = ['customer', 'groomer', 'datetime', 'services']

    def create(self, validated_data):
        logger.info(f"Inside create(): {validated_data}")
        service_data = validated_data.pop('services', [])

        appointment = Appointment.objects.create(**validated_data)

        appointment.services.set(service_data)

        return appointment

    def update(self, instance, validated_data):
        service_data = validated_data.pop('services', None)

        logger.info(f"Validated Data: {validated_data}")
        instance.customer = validated_data.get('customer', instance.customer)
        instance.groomer = validated_data.get('groomer', instance.groomer)
        instance.datetime = validated_data.get('datetime', instance.datetime)

        if service_data is not None:
            instance.services.set(service_data)

        return instance
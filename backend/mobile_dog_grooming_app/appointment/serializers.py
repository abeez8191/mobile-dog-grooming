from rest_framework import serializers
from .models import Service, Appointment
from profile.models import Customer, Groomer
from profile.serializers import CustomerSerializer, PublicViewGroomerSerializer

import logging

logger = logging.getLogger(__name__)

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'price', 'duration']

class AppointmentSerializer(serializers.ModelSerializer):
    customer_id = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all(), write_only=True, source='customer')
    customer = CustomerSerializer(read_only=True)
    groomer_id = serializers.PrimaryKeyRelatedField(queryset=Groomer.objects.all(), write_only=True, source='groomer')
    groomer = PublicViewGroomerSerializer(read_only=True)
    service_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Service.objects.all(),
        write_only=True,
        source='services'
    )
    services = ServiceSerializer(many=True, read_only=True)

    class Meta:
        model = Appointment
        fields = ['id', 'customer', 'customer_id', 'groomer', 'groomer_id', 'datetime', 'services', 'service_ids']

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

        instance.save()
        return instance
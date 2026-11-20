import logging

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

from profile.models import Customer, Groomer

logger = logging.getLogger(__name__)

User = get_user_model()

class ApplicationUserSerializer(serializers.ModelSerializer):
    customer = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all(), required=False, allow_null=True)
    groomer = serializers.PrimaryKeyRelatedField(queryset=Groomer.objects.all(), required=False, allow_null=True)
    
    class Meta:
        model = User
        fields = ('pk', 'email', 'groomer','customer', 'password', 'groups', 'is_superuser', 'last_login', 'date_joined')
        read_only_fields = ('groups', 'is_superuser', 'last_login', 'date_joined')

    def validate_password(self, value):
        # Runs all validators configured in settings.AUTH_PASSWORD_VALIDATORS
        print(f"Validating password: {value}")
        validate_password(value)
        return value

    def validate_customer(self, value):
       return None if value == "" else value

    def validate_groomer(self, value):
        return None if value == "" else value
    
    def create(self, validated_data):
        email=validated_data.pop('email', None)
        password = validated_data.pop('password', None)
        return User.objects.create_user(email, password, **validated_data)
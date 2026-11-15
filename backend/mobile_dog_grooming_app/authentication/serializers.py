from dj_rest_auth.serializers import UserDetailsSerializer
from rest_framework import serializers

from authentication.models import ApplicationUser
from profile.models import Customer, Groomer

class ApplicationUserSerializer(UserDetailsSerializer):
    customer = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all())
    groomer = serializers.PrimaryKeyRelatedField(queryset=Groomer.objects.all())
    
    class Meta(UserDetailsSerializer.Meta):
        model = ApplicationUser
        fields = ('pk', 'email', 'first_name', 'last_name', 'groomer','customer')
        read_only_fields = ("email", )
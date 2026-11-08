import base64
from rest_framework import serializers
from .models import Customer, Groomer

class Base64BinaryField(serializers.Field):

  def to_internal_value(self, data):
    if isinstance(data, str):
      try:
        # Decode base64 string to raw bytes
        return base64.b64decode(data)
      except Exception as e:
        raise serializers.ValidationError("Invalid base64 string.")
    return data

  def to_representation(self, value):
    if value is None:
      return None
    # Encode bytes back to ascii/utf-8 base64 string for JSON output
    if isinstance(value, memoryview):
      value = bytes(value)
    return base64.b64encode(value).decode("ascii")
  
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'firstName', 'lastName', 'street', 'street2', 'city', 'state', 'zipCode', 'email', 'phoneNumber']

class GroomerSerializer(serializers.ModelSerializer):
    photo = Base64BinaryField()

    class Meta:
        model = Groomer
        fields = ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'availability', 'biography', 'photo']
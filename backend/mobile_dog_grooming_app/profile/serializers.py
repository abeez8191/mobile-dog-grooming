import base64

from django.db import transaction
from rest_framework import serializers

from .models import Customer, Dog, Groomer, Note


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


class PublicViewGroomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Groomer
        fields = ["id", "firstName", "lastName", "biography", "photo", "photoData"]


class GroomerSerializer(serializers.ModelSerializer):
    photo = Base64BinaryField()

    class Meta:
        model = Groomer
        fields = [
            "id",
            "firstName",
            "lastName",
            "email",
            "phoneNumber",
            "availability",
            "biography",
            "photo",
            "photoData",
        ]


class GroomerNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Groomer
        fields = ["firstName", "lastName"]


class NoteSerializer(serializers.ModelSerializer):
    groomer = GroomerNameSerializer(read_only=True)
    groomer_id = serializers.PrimaryKeyRelatedField(
        queryset=Groomer.objects.all(), write_only=True, source="groomer"
    )

    class Meta:
        model = Note
        fields = ["id", "message", "groomer", "groomer_id", "created_on", "updated_on"]


class DogSerializer(serializers.ModelSerializer):
    notes = NoteSerializer(many=True, read_only=True)
    note_ids = serializers.PrimaryKeyRelatedField(
        many=True, 
        queryset=Note.objects.all(), 
        write_only=True, 
        source="notes",
        required=False
    )

    class Meta:
        model = Dog
        fields = ["id", "name", "breed", "notes", "note_ids"]


class CustomerSerializer(serializers.ModelSerializer):
    dogs = DogSerializer(many=True)

    # dog_ids = serializers.PrimaryKeyRelatedField(queryset=Dog.objects.all(), write_only=True, source='dogs', many=True)
    class Meta:
        model = Customer
        fields = [
            "id",
            "firstName",
            "lastName",
            "street",
            "street2",
            "city",
            "state",
            "zipCode",
            "email",
            "phoneNumber",
            "dogs",
        ]

    def validate_street2(self, value):
        return None if value == "" else value

    @transaction.atomic
    def create(self, validated_data):
        dogs_data = validated_data.pop("dogs", [])
        customer = Customer.objects.create(**validated_data)

        for dog_data in dogs_data:
            Dog.objects.create(owner=customer, **dog_data)

        return customer

    @transaction.atomic
    def update(self, instance, validated_data):
        dogs_data = validated_data.pop("dogs", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if dogs_data is not None:
            existing_ids = [dog["id"] for dog in dogs_data if "id" in dog]
            instance.dogs.exclude(id__in=existing_ids).delete()

            for dog_data in dogs_data:
                dog_id = dog_data.get("id")
                if dog_id:
                    Dog.objects.filter(id=dog_id, owner=instance).update(**dog_data)
                else:
                    Dog.objects.create(owner=instance, **dog_data)

        return instance

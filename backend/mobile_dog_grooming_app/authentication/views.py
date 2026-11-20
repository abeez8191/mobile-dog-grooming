from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import ApplicationUserSerializer

# Create your views here.

class CustomerCreateAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ApplicationUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class GroomerCreateAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ApplicationUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
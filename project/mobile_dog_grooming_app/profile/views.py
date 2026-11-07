from rest_framework import viewsets

from .models import Customer, Groomer
from .serializers import CustomerSerializer, GroomerSerializer

# Create your views here.

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

class GroomerViewSet(viewsets.ModelViewSet):
    queryset = Groomer.objects.all()
    serializer_class = GroomerSerializer
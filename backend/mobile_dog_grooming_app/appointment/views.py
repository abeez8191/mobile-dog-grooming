from authentication.models import ApplicationUser
from django.utils import timezone
from rest_framework import viewsets

from .models import Appointment, Service
from .serializers import AppointmentSerializer, ServiceSerializer


# Create your views here.
class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer

    def get_queryset(self): # type: ignore[override]
        if self.request.user.is_authenticated:

            requested_date = self.request.GET.get("date", f"{timezone.localdate()}")
            if isinstance(self.request.user, ApplicationUser):
                if self.request.user.customer is not None:
                    return Appointment.objects.select_related("groomer", "customer", "dog")\
                        .prefetch_related("services")\
                        .filter(customer=self.request.user.customer)
                elif self.request.user.groomer is not None:
                    return Appointment.objects.select_related("groomer", "customer", "dog")\
                        .prefetch_related("services")\
                        .filter(groomer=self.request.user.groomer, datetime__date=requested_date)
                elif self.request.user.is_superuser:
                    return Appointment.objects.select_related('groomer', 'customer', 'dog')\
                        .prefetch_related('services')\
                        .filter(datetime__date=requested_date)

        return []

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            if isinstance(self.request.user, ApplicationUser):
                if self.request.user.customer is not None:
                    serializer.save(customer=self.request.user.customer)
                elif self.request.user.groomer is not None:
                    serializer.save(groomer = self.request.user.groomer)

        else:
            serializer.save()
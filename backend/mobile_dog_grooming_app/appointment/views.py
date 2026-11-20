from django.db.models import QuerySet
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Service, Appointment
from .serializers import ServiceSerializer, AppointmentSerializer
from authentication.models import ApplicationUser

# Create your views here.
class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AppointmentSerializer

    def get_queryset(self): # type: ignore[override]
        if self.request.user.is_authenticated:

            today = self.request.GET.get("date", f"{timezone.localdate()}")
            if isinstance(self.request.user, ApplicationUser):
                if self.request.user.customer is not None:
                    return Appointment.objects.select_related("groomer", "customer")\
                        .prefetch_related("services")\
                        .filter(customer=self.request.user.customer)
                elif self.request.user.groomer is not None:
                    return Appointment.objects.select_related("groomer", "customer")\
                        .prefetch_related("services")\
                        .filter(groomer=self.request.user.groomer, datetime__date=today)

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
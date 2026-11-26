from authentication.models import ApplicationUser
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied

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
                        .filter(customer=self.request.user.customer, completed_on=None, deleted_on=None)
                elif self.request.user.groomer is not None:
                    query = Appointment.objects.select_related("groomer", "customer", "dog")\
                        .prefetch_related("services")
                    if self.kwargs.get('pk') is None:
                        return query.filter(groomer=self.request.user.groomer, datetime__date=requested_date)
                    else:
                        return query.filter(groomer=self.request.user.groomer, id=self.kwargs.get('pk'))
                elif self.request.user.is_superuser:
                    query = Appointment.objects.select_related('groomer', 'customer', 'dog')\
                        .prefetch_related('services')
                    
                    if self.kwargs.get('pk') is None:
                        return query.filter(datetime__date=requested_date)
                    else:
                        return query.filter(id=self.kwargs.get('pk'))
        else:
            raise PermissionDenied("Not Authorized")

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            if isinstance(self.request.user, ApplicationUser):
                if self.request.user.customer is not None:
                    serializer.save(customer=self.request.user.customer)
                elif self.request.user.groomer is not None:
                    serializer.save(groomer = self.request.user.groomer)

        else:
            raise PermissionDenied("Not Authorized")
        
    def perform_destroy(self, instance):
        if self.request.user.is_authenticated:
            instance.deleted_on = timezone.now()
            
            if isinstance(self.request.user, ApplicationUser):
                if self.request.user.customer is not None:
                    instance.deleted_by = "customer"
                elif self.request.user.groomer is not None:
                    instance.deleted_by = "groomer"
                elif self.request.user.is_superuser is True:
                    instance.deleted_by = "admin"
                    
            instance.save(update_fields=["deleted_on", "deleted_by"])
        else:
            raise PermissionDenied("Not Authorized")

import logging
import math
from datetime import date, datetime, time, timedelta
from functools import reduce
from zoneinfo import ZoneInfo

from appointment.models import Appointment
from authentication.models import ApplicationUser
from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ReadOnlyModelViewSet

from .models import Customer, Groomer, Note
from .serializers import (
    CustomerSerializer,
    GroomerSerializer,
    NoteSerializer,
    PublicViewGroomerSerializer,
)

logger = logging.getLogger(__name__)

# Create your views here.

class CustomerViewSet(viewsets.ModelViewSet):
    serializer_class = CustomerSerializer
    
    def get_queryset(self): # type: ignore[override]
        if self.request.user.is_superuser:
            return Customer.objects.all()
        elif isinstance(self.request.user, ApplicationUser) and self.request.user.customer:
            return Customer.objects.filter(id=self.request.user.customer.id) #type: ignore
        
        raise PermissionDenied("Not Authorized")

class GroomerViewSet(viewsets.ModelViewSet):
    serializer_class = GroomerSerializer
    
    def get_queryset(self): # type: ignore[override]
        if self.request.user.is_superuser:
            return Groomer.objects.all()
        elif isinstance(self.request.user, ApplicationUser) and self.request.user.groomer:
            return Groomer.objects.filter(id=self.request.user.groomer.id) #type: ignore
        
        raise PermissionDenied("Not Authorized")

""" Gets all or one groomer's *public* information """
class PublicGroomerViewSet(ReadOnlyModelViewSet):
    queryset = Groomer.objects.all()
    serializer_class = PublicViewGroomerSerializer

""" Gets a given groomer's availability slots that are still open """
class PublicGroomerAvailabilityView(APIView):
    def get(self, request, pk, format='None'):
        start_date_query = request.query_params.get('start_date', datetime.now().strftime("%m/%d/%Y"))
        start_date = self.normalizeStartDate(start_date_query)
        
        groomer = Groomer.objects.only('availability').get(pk=pk)
        groomer_schedule = self.getSchedule(groomer.availability)
        self.enrichGroomerSchedule(groomer_schedule, start_date)

        queryset = self.getAppointmentQuerySet(pk, start_date, groomer_schedule['timezone'])
        for appointment in queryset:
            duration = reduce(lambda total, service: total + service.duration, appointment.services.all(), 30)
            appointment_day = appointment.datetime.strftime("%a").lower()
            
            appointment_localized = timezone.localtime(appointment.datetime, timezone=ZoneInfo(groomer_schedule['timezone']))
            
            index = next((i for i, row in enumerate(groomer_schedule[appointment_day]['times']) if row[0] == appointment_localized.time()), None)
            number_of_chunks_to_remove = math.ceil(duration / 30 )

            if index is not None:
                for time_index in range(index, index + number_of_chunks_to_remove):
                    groomer_schedule[appointment_day]['times'][time_index][1] = 'X'

        return Response({"available_slots": groomer_schedule}, status=status.HTTP_200_OK)

    def enrichGroomerSchedule(self, groomer_schedule, start_date):
        weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
        for index in range(len(weekDays)):
            if weekDays[index] in groomer_schedule:
                time = groomer_schedule[weekDays[index]]
                groomer_schedule[weekDays[index]] = {
                    'date': start_date + timedelta(days=index),
                    'times': time
                }

    """ Gets the requested date's start of week date """
    def normalizeStartDate(self, start_date_string):
        [month, day, year] = start_date_string.split("/")
        start_date = date(int(year), int(month), int(day))
        today = date.today()
        if start_date <= today:
            days_since_sunday = (today.weekday() + 1) % 7
            sow = today - timedelta(days=days_since_sunday)
            if start_date < sow:
                return None

            return sow
        
        return start_date
    
    """ Takes the groomer's specified availability and returns a daily, 30-minute breakout for the current week """
    def getSchedule(self, groomer_availability):
        retVal = {}
        for day in ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']:
            if day in groomer_availability:
                retVal[day] = self.getTimeSlots(groomer_availability[day]);
            else:
                retVal[day] = [];
        retVal['timezone'] = groomer_availability['timezone']
        return retVal

    def getTimeSlots(self, availability):
        retVal = []
        start_parts = availability['start'].split(":")
        end_parts = availability['end'].split(":")

        start_time = time(int(start_parts[0]), int(start_parts[1]))
        end_time = time(int(end_parts[0]), int(end_parts[1]))

        date_time = datetime.combine(date.today(), start_time)
        end_date_time = datetime.combine(date.today(), end_time)

        while date_time < end_date_time:
            retVal.append([date_time.time(),''])
            date_time += timedelta(minutes=30)

        retVal.append([date_time.time(), ''])
        return retVal

    """ Gets all the appointments for the current week for the groomer specified"""
    def getAppointmentQuerySet(self, pk, start_date, time_zone_string):
        end_of_week = start_date + timedelta(days=6)
        time_zone = ZoneInfo(time_zone_string)
        
        sow_midnight = datetime.combine(
            start_date,
            time.min
        )
        
        sow_tzaware = timezone.make_aware(sow_midnight, timezone=time_zone)

        eow_midnight = datetime.combine(
            end_of_week,
            time.max
        )
        eow_tzaware = timezone.make_aware(eow_midnight, timezone=time_zone)

        return Appointment.objects.filter(datetime__range=(sow_tzaware, eow_tzaware), groomer=pk).prefetch_related('services')
    
class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    
    def get_queryset(self): # type: ignore[override]
        if self.request.user.is_authenticated:
            dog_id = self.kwargs['dog']
            if isinstance(self.request.user, ApplicationUser):
                return Note.objects.filter(groomer=self.request.user.groomer, dog_id=dog_id)

        raise PermissionDenied("Not Authorized")
        
    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            dog_id = self.kwargs['dog']
            if isinstance(self.request.user, ApplicationUser):
                serializer.save(groomer=self.request.user.groomer, dog_id=dog_id)
                return
            
        raise PermissionDenied("Not Authorized")
            
    def perform_update(self, serializer):
        if self.request.user.is_authenticated:
            if isinstance(self.request.user, ApplicationUser):
                if serializer.instance.groomer != self.request.user.groomer:
                    raise PermissionDenied("You can't update a note you didn't write.")
                else:
                    serializer.save()
                return
        raise PermissionDenied("Not Authorized")
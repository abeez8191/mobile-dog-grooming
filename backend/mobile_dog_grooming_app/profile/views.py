import copy

from datetime import datetime, timedelta, time

from django.utils import timezone

from functools import reduce

import math

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ReadOnlyModelViewSet

from .models import Customer, Groomer
from .serializers import CustomerSerializer, GroomerSerializer, PublicViewGroomerSerializer

from appointment.models import Appointment
import logging

logger = logging.getLogger(__name__)

# Create your views here.

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

class GroomerViewSet(viewsets.ModelViewSet):
    queryset = Groomer.objects.all()
    serializer_class = GroomerSerializer

""" Gets all or one groomer's *public* information """
class PublicGroomerViewSet(ReadOnlyModelViewSet):
    queryset = Groomer.objects.all()
    serializer_class = PublicViewGroomerSerializer

""" Gets a given groomer's availability slots that are still open """
class PublicGroomerAvailabilityView(APIView):
    def get(self, request, pk, format='None'):
        groomer = Groomer.objects.only('availability').get(pk=pk)
        groomer_availability = groomer.availability
        groomer_schedule = self.getSchedule(groomer_availability)

        queryset = self.getAppointmentQuerySet(pk)
        for appointment in queryset:
            appointmentTime = f"{int(appointment.datetime.strftime("%I"))}:{appointment.datetime.strftime("%M %p")}"
            duration = reduce(lambda total, service: total + service.duration, appointment.services.all(), 30)

            appointment_day = appointment.datetime.strftime("%a").lower()
            index = groomer_schedule[appointment_day].index(appointmentTime)
            number_of_chunks_to_remove = math.ceil(duration / 30 )
            del groomer_schedule[appointment_day][index:index + number_of_chunks_to_remove]

        return Response({"available_slots": groomer_schedule}, status=status.HTTP_200_OK)

    """ Takes the groomer's specified availability and returns a daily, 30-minute breakout for the current week """
    def getSchedule(self, groomer_availability):
        template = [
            "6:00 AM", "6:30 AM",
            "7:00 AM", "7:30 AM",
            "8:00 AM", "8:30 AM",
            "9:00 AM", "9:30 AM",
            "10:00 AM", "10:30 AM",
            "11:00 AM", "11:30 AM",
            "12:00 PM", "12:30 PM",
            "1:00 PM", "1:30 PM",
            "2:00 PM", "2:30 PM",
            "3:00 PM", "3:30 PM",
            "4:00 PM", "4:30 PM",
            "5:00 PM", "5:30 PM",
            "6:00 PM", "6:30 PM",
            "7:00 PM", "7:30 PM",
            "8:00 PM", "8:30 PM"
        ]

        retVal = {}
        for day in ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']:
            if day in groomer_availability:
                day_copy = copy.deepcopy(template)
                start_idx = template.index(groomer_availability[day]['start'])
                end_idx = template.index(groomer_availability[day]['end'], start_idx)

                retVal[day] = day_copy[start_idx:end_idx]
        return retVal

    """ Gets all the appointments for the current week for the groomer specified"""
    def getAppointmentQuerySet(self, pk):
        today = timezone.now()
        start_of_week = today - timedelta(days=(today.weekday() + 1) % 7)
        end_of_week = start_of_week + timedelta(days=6)

        sow_midnight = datetime.combine(
            start_of_week.date(),
            time.min,
            tzinfo = start_of_week.tzinfo
        )

        eow_midnight = datetime.combine(
            end_of_week.date(),
            time.max,
            tzinfo = end_of_week.tzinfo
        )

        return Appointment.objects.filter(datetime__range=(sow_midnight, eow_midnight), groomer=pk).prefetch_related('services')
import { DatePipe, JsonPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  CalendarEvent,
  CalendarModule,
} from 'angular-calendar';
import { Appointment } from 'src/app/appointment/model/appointment.model';
import { AppointmentService } from 'src/app/appointment/service/appointment-service';
import { Service } from 'src/app/grooming-service/model/services.model';
import { BannerService } from 'src/app/shared/components/banner/banner.service';

@Component({
  selector: 'app-groomer-schedule',
  imports: [CalendarModule, DatePipe, JsonPipe, MatButtonModule, MatIconModule],
  templateUrl: './groomer-schedule.html',
  styleUrl: './groomer-schedule.scss',
})
export class GroomerSchedule implements OnInit{
  appointmenService = inject(AppointmentService);
  bannerService = inject(BannerService);

  appointments = signal<Appointment[]>([])
  date = signal<Date>(new Date());

  events = computed(() => {
    return this.appointments().map((appointment) => this.convertAppointmentToCalendarEvent(appointment))
  });

  onEventClick(event: CalendarEvent): void {
    console.log('Selected event:', event);
  }

  ngOnInit(): void {
    this.appointmenService.getAppointments('2026-11-24').subscribe({
      next: (appointments) => this.appointments.set(appointments),
      error: (error) => {
        this.bannerService.open(
          'Unable to get your apppointments at this time. Try again later.',
          {
            icon: 'warning_outline',
            warning: true,
            timeout: 10000
          }
        )
      }
    })
  }

  getServiceDuration(services: Service[]): number {
    return services.reduce((prev, next) => prev + next.duration, 0);
  }

  convertAppointmentToCalendarEvent(appointment: Appointment): CalendarEvent {
    let startDate = new Date(appointment.datetime);
    
    const minutes = this.getServiceDuration(appointment.services!);

    const retVal = {
      start: startDate,
      end: new Date(startDate.getTime() + ((30 + minutes) * 60000)),
      title: `${appointment.customer!.firstName} ${appointment.customer!.lastName}`,
      color: { primary: '#006a6a', secondary: '#cce8e7'}
    }

    console.log("Returning: ", retVal);
    return retVal;
  }

  nextDay(): void {
    this.addDayToDate(1);
  }

  previousDay(): void {
    this.addDayToDate(-1);
  }

  addDayToDate(daysToAdd: number): void {
    this.date.update(d => {
      let nextDay = new Date(d);
      nextDay.setDate(d.getDate() + daysToAdd);
      return nextDay;
    });
  }
}

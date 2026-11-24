import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  CalendarEvent,
  CalendarModule,
} from 'angular-calendar';
import { Appointment } from 'src/app/appointment/model/appointment.model';
import { AppointmentService } from 'src/app/appointment/service/appointment-service';
import { DataStore } from 'src/app/data-store/data-store';
import { Service } from 'src/app/grooming-service/model/services.model';
import { BannerService } from 'src/app/shared/components/banner/banner.service';
import { NoteView } from '../../components/note-view/note-view';

@Component({
  selector: 'app-groomer-schedule',
  imports: [CalendarModule, DatePipe, MatButtonModule, MatIconModule, NoteView],
  templateUrl: './groomer-schedule.html',
  styleUrl: './groomer-schedule.scss',
})
export class GroomerSchedule implements OnInit{
  appointmenService = inject(AppointmentService);
  bannerService = inject(BannerService);
  dataStore = inject(DataStore);

  appointments = signal<Appointment[]>([])
  date = signal<Date>(new Date());

  detailView = signal<Appointment|undefined>(undefined);

  updateAppointments = effect(() => {
    this.getAppointments(this.date());
  });
  events = computed(() => {
    return this.appointments().map((appointment) => this.convertAppointmentToCalendarEvent(appointment))
  });

  onEventClick(event: CalendarEvent): void {
    this.detailView.set(this.appointments().find(a => a.id === event.id));
  }

  ngOnInit(): void {
    this.getAppointments(this.date());
  }

  getAppointments(date: Date): void {
    this.appointmenService.getAppointments(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`).subscribe({
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
    });
  }

  getServiceDuration(services: Service[]): number {
    return services.reduce((prev, next) => prev + next.duration, 0);
  }

  convertAppointmentToCalendarEvent(appointment: Appointment): CalendarEvent {
    let startDate = new Date(appointment.datetime);
    
    const minutes = this.getServiceDuration(appointment.services!);

    let prefix = "";
    if( this.dataStore.isAdmin() ) {
      prefix = `[${appointment.groomer!.firstName} ${appointment.groomer!.lastName}]`
    }

    let suffix = "";
    if( appointment.completed_on ) {
      suffix = '(COMPLETED)';
    }

    const retVal = {
      id: appointment.id!,
      start: startDate,
      end: new Date(startDate.getTime() + ((30 + minutes) * 60000)),
      title: `${prefix} ${appointment.customer!.firstName} ${appointment.customer!.lastName} ${suffix}`,
      color: { primary: 'var(--mat-sys-primary)', secondary: 'var(--mat-sys-secondary-container)', secondaryText: 'var(--mat-sys-on-secondary-container)' }
    }

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

  getEstimatedCost(services?: Service[]): number {
    if( services === undefined ) {
      return 0;
    }

    return services.reduce((prev, next) => prev + next.price, 0);
  }

  getEstimatedDuration(services?: Service[]): string {
    if( services === undefined ) {
      return "";
    }

    let totalMinutes = services.reduce((prev, next) => prev + next.duration, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes - (hours * 60);

    let retVal = "";
    if( hours > 0 ) {
      if( hours > 1 ) {
        retVal += `${hours} hrs `;
      }
      else {
        retVal += `${hours} hr `;
      }
    }
    if( minutes > 0 ) {
      retVal += `${String(minutes).padStart(2, "0")} mins`;
    }

    return retVal;
  }

  completeAppointment(appointment: Appointment): void {
    this.appointmenService.completeAppointment(appointment).subscribe({
      next: (completed_appointment) => {
        let appointments = this.appointments();
        const updateIndex = appointments.findIndex(elem => elem.id === completed_appointment.id!);
        appointments[updateIndex] = completed_appointment;
        this.appointments.update(snapshot => snapshot.filter(appt => appt.id! !== completed_appointment.id))
        this.appointments.set(appointments);
        this.detailView.set(undefined);
      }
    })
  }
}

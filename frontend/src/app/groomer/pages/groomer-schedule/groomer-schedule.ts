import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  CalendarEvent,
  CalendarModule,
} from 'angular-calendar';
import {EventColor} from 'calendar-utils';
import { AppointmentResponse, convertAppointmentResponseToUpdateAppointmentRequest } from 'src/app/appointment/model/appointment.model';
import { AppointmentService } from 'src/app/appointment/service/appointment-service';
import { DataStore } from 'src/app/data-store/data-store';
import { Service } from 'src/app/grooming-service/model/services.model';
import { BannerService } from 'src/app/shared/components/banner/banner.service';
import { NoteView } from '../../components/note-view/note-view';
import { Note } from 'src/app/customer/model/customer.model';

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

  appointments = signal<AppointmentResponse[]>([])
  date = signal<Date>(new Date());

  detailView = signal<AppointmentResponse|undefined>(undefined);

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

  convertAppointmentToCalendarEvent(appointment: AppointmentResponse): CalendarEvent {
    let startDate = new Date(appointment.datetime);
    
    const minutes = this.getServiceDuration(appointment.services!);

    let prefix = "";
    if( this.dataStore.isAdmin() ) {
      prefix = `[${appointment.groomer!.firstName} ${appointment.groomer!.lastName}]`
    }

    let color: EventColor = { primary: 'var(--mat-sys-primary)', secondary: 'var(--mat-sys-secondary-container)', secondaryText: 'var(--mat-sys-on-secondary-container)' };
    
    let suffix = "";
    if( appointment.completed_on ) {
      suffix = '(COMPLETED)';
    }
    else if( appointment.deleted_on ) {
      suffix = '(CANCELED)';
    }

    const retVal = {
      id: appointment.id!,
      start: startDate,
      end: new Date(startDate.getTime() + ((30 + minutes) * 60000)),
      title: `${prefix} ${appointment.customer!.firstName} ${appointment.customer!.lastName} ${suffix}`,
      color,
      cssClass: (appointment.deleted_on) ? 'canceled' : ''
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

  completeAppointment(appointment: AppointmentResponse): void {
    const updateAppointmentRequest = convertAppointmentResponseToUpdateAppointmentRequest(appointment);

    this.appointmenService.completeAppointment(updateAppointmentRequest).subscribe({
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

  // We want to keep the notes "in sync" without having to do another fetch
  // So either append the new note or replace the old note with the edited note
  appendNewNote(note: Note): void {
    if( this.detailView() ) {
      const appointmentIndex = this.appointments().findIndex(item => item.id === this.detailView()?.id );
      console.log(`Found appointment index: ${appointmentIndex}`);
      if( appointmentIndex >= 0 ) {
        let snapshot = this.appointments();
        let notes = snapshot[appointmentIndex].dog.notes;

        const noteIndex = notes.findIndex(item => note.id === item.id);
        console.log(`Found note index: ${noteIndex}`)
        if( noteIndex >= 0 ) {
          notes[noteIndex] = note;
        }
        else {
          notes.push(note);
        }
        
        console.log("Updating snapshot");
        snapshot[appointmentIndex].dog.notes = notes;
        this.appointments.set(snapshot);
      }
    }
  }
}

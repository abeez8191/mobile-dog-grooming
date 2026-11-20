import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  CalendarDayViewComponent,
  CalendarEvent,
  CalendarModule,
  DateAdapter,
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

@Component({
  selector: 'app-groomer-schedule',
  imports: [CalendarModule, DatePipe],
  templateUrl: './groomer-schedule.html',
  styleUrl: './groomer-schedule.scss',
})
export class GroomerSchedule {
  viewDate = signal<Date>(new Date());

  events = signal<CalendarEvent[]>([
    {
      start: new Date(new Date().setHours(9, 0, 0)),
      end: new Date(new Date().setHours(10, 30, 0)),
      title: 'Morning Session',
      color: { primary: '#1e90ff', secondary: '#D1E8FF' },
    },
    {
      start: new Date(new Date().setHours(10, 0, 0)),
      end: new Date(new Date().setHours(11, 15, 0)),
      title: 'Overlapping Appointment',
      color: { primary: '#e3bc08', secondary: '#FDF1BA' },
    },
    {
      start: new Date(new Date().setHours(13, 30, 0)),
      end: new Date(new Date().setHours(15, 0, 0)),
      title: 'Afternoon Block',
      color: { primary: '#ad2121', secondary: '#FAE3E3' },
    }
  ]);

  onEventClick(event: CalendarEvent): void {
    console.log('Selected event:', event);
  }
}

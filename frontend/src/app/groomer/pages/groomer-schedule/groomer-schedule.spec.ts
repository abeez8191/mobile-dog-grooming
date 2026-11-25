import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroomerSchedule } from './groomer-schedule';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CalendarModule, DateAdapter, provideCalendar } from 'angular-calendar';
import { NoteView } from '../../components/note-view/note-view';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

describe('GroomerSchedule', () => {
  let component: GroomerSchedule;
  let fixture: ComponentFixture<GroomerSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroomerSchedule, CalendarModule, DatePipe, MatButtonModule, MatIconModule, NoteView],
      providers:[
        provideCalendar({
          provide: DateAdapter,
          useFactory: adapterFactory,
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GroomerSchedule);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

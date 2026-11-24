import { Component, inject, input, OnInit, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { GroomerService } from 'src/app/groomer/service/groomer-service';
import { PublicGroomerAvailability, PublicGroomerAvailabilityKey } from 'src/app/groomer/model/groomer.model';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AvailabilityDay } from '../availability-day/availability-day';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-select-time',
  imports: [
    AvailabilityDay,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinner
  ],
  templateUrl: './select-time.html',
  styleUrl: './select-time.scss',
})
export class SelectTime implements OnInit {
  groomerId = input.required<number>();
  duration = input.required<number>();

  select: OutputEmitterRef<Date> = output();
  back: OutputEmitterRef<void> = output();

  groomerService = inject(GroomerService);
  
  isLoading = signal(true);
  availability: WritableSignal<PublicGroomerAvailability> = signal({});
  date = signal(new Date());

  ngOnInit(): void {
    this.groomerService.getPublicGroomerAvailability(this.groomerId()).subscribe({
      next: (availability) => {
        this.isLoading.set(false);
        this.availability.set(availability);
      }
    });
  }

  selectDate(date: Date): void {
    this.select.emit(date);
  }

  getAvailableDays(): {date: string, key: PublicGroomerAvailabilityKey}[] {
    let retVal = [];
    for(let key of ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as PublicGroomerAvailabilityKey[]) {
      if( this.availability()[key] ) {
        retVal.push({date: this.availability()[key]!.date, key});
      }
    }

    return retVal;
  }

  getAvailabilityForDay(day: PublicGroomerAvailabilityKey): {date: string, times: string[][]} {
    return this.availability()[day] || {date: '', times: [[]]};
  }

  getNextWeek() {
    this.updateDate(7);
  }

  getLastWeek() {
    this.updateDate(-7);
  }

  updateDate(byDays: number): void {
    this.date.update(d => {
      const result = new Date(d);
      result.setDate(result.getDate() + byDays);
      console.log(`New Date: ${result}`);
      return result;
    });

    this.groomerService.getPublicGroomerAvailability(this.groomerId(), this.date()).subscribe({
      next: (availability) => {
        this.availability.set(availability);
      }
    });
  }
}
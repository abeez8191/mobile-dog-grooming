import { Component, input, OnDestroy, OnInit, output, OutputEmitterRef, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-availability-day',
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './availability-day.html',
  styleUrl: './availability-day.scss',
})
export class AvailabilityDay implements OnInit, OnDestroy{
  readonly day = input('day');
  protected choice: OutputEmitterRef<string[]> = output();

  readonly times: string[] = [
    "N/A",
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
  ];

  startTime: FormControl = new FormControl('N/A');
  endTime: FormControl = new FormControl('N/A');

  startTimeIndex = signal(0);
  endTimeIndex = signal(0);

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.startTime.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.startTimeIndex.set(this.times.indexOf(value));

        // If the end time is before the start time, reset the end time
        if( this.endTimeIndex() <= this.startTimeIndex() ) {
          this.endTimeIndex.set(0);
          this.endTime.setValue('N/A');
          this.choice.emit([]);
        }
        
        if( this.endTimeIndex() > 0 && this.startTimeIndex() > 0 ) {
          this.choice.emit([this.times[this.startTimeIndex()], this.times[this.endTimeIndex()]]);
        }
      });

    this.endTime.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.endTimeIndex.set(this.times.indexOf(value));

        if( this.endTimeIndex() > 0 && this.startTimeIndex() > 0 ) {
          this.choice.emit([this.times[this.startTimeIndex()], this.times[this.endTimeIndex()]]);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

import { Component, input, OnInit, output, OutputEmitterRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-availability-day',
  imports: [
    MatButtonModule
  ],
  templateUrl: './availability-day.html',
  styleUrl: './availability-day.scss',
})
export class AvailabilityDay implements OnInit {
  day = input.required<string>();
  availability = input.required<{date: string, times: string[]}>();
  duration = input.required<number>();

  select: OutputEmitterRef<Date> = output();
  monthsShortName = ['empty', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  ngOnInit(): void {
    const timeSlotsRequired = Math.ceil(this.duration() / 30) + 1;
  }

  formatTime(time: string) {
    let [hour, min] = time.split(":");
    let isAm = true;
    if( +hour === 12 ) {
      isAm = false;
    }

    if( +hour > 12 ) {
      hour = (+hour % 12).toString();
      isAm = false;
    }

    return `${hour}:${min.padStart(2, "0")} ${isAm ? 'AM' : 'PM'}`;
  }

  chooseTime(date: string, time: string): void {
    var dateParts = date.split("-").map(i => +i);
    var timeParts = time.split(":").map(i => +i);

    this.select.emit(new Date(dateParts[0], dateParts[1], dateParts[2], timeParts[0], timeParts[1], timeParts[2]));
  }

  getCalendarDay(): string {
    const [year, month, day] = this.availability().date.split("-");
    const formattedDay = String(day).padStart(2, '0');
    return `${this.monthsShortName[+month]} ${formattedDay}`;
  }
}

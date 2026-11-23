import { Component, input, OnInit, output, OutputEmitterRef, signal } from '@angular/core';
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
  availability = input.required<{date: string, times: string[][]}>();
  duration = input.required<number>();

  select: OutputEmitterRef<Date> = output();
  monthsShortName = ['empty', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  filteredAvailability = signal<{date: string, times: string[]} | undefined>(undefined);

  ngOnInit(): void {
    const timeSlotsRequired = Math.ceil(this.duration() / 30) + 1;
    this.filteredAvailability.set(this.filterAvailability(timeSlotsRequired));
  }

  filterAvailability(numberOfSlotsRequired: number): {date: string, times: string[]} {
    let retVal: {date: string, times: string[]} = {
      date: this.availability().date,
      times: []
    };

    let index = 0;
    const times = this.availability().times;

    while( index < times.length ) {
      // get first window (either because this is index == 0 or we ran into a non-available timeslot)
      let windowIndex = 0;
      while( windowIndex < numberOfSlotsRequired ) {
        windowIndex++;
        if( times[index++][1] === 'X' ) {
          // If we find an unavailable time, reset our window
          console.log(`[window] ${times[index][0]} is not available`);
          windowIndex = 0;
        }
      }
      // We found our first timeslot, add it to retVal
      retVal.times.push(times[index - numberOfSlotsRequired][0]);

      // Keep adding timeslots from index - numberOfSlotsRequired as long as slots at index are free
      while(index < times.length && times[index++][1] !== 'X') {
        retVal.times.push(times[index - numberOfSlotsRequired][0]);
      }
      
      if( index < times.length ) {
        console.log(`[non-window] ${times[index][0]} is not available`);
      }
      // Found a not-available slot, throw away all the intermediate slots and start again
    }

    console.log(retVal);
    return retVal;
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

    this.select.emit(new Date(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1], timeParts[2]));
  }

  getCalendarDay(): string {
    const [year, month, day] = this.availability().date.split("-");
    const formattedDay = String(day).padStart(2, '0');
    return `${this.monthsShortName[+month]} ${formattedDay}`;
  }
}

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

    if( this.isPastDate() ) {
      this.filteredAvailability.set({date: this.availability().date, times: []});
    }
    else {
      this.filteredAvailability.set(this.filterAvailability(timeSlotsRequired));
    }
  }

  isPastDate(): boolean {
    const [year, month, day] = this.availability().date.split("-").map(val => +val);
    const date = new Date(year, month - 1, day, 0, 0, 0);

    const now = new Date();
    now.setHours( 23, 59, 59);

    if( date < now ) {
      return true;
    }
    
    return false;
  }

  filterAvailability(numberOfSlotsRequired: number): {date: string, times: string[]} {
    let retVal: {date: string, times: string[]} = {
      date: this.availability().date,
      times: []
    };

    let index = 0;
    const times = this.availability().times;

    while( index < times.length ) {
      let lastIndexInFreeWindow = this.getNextAvailableWindow(times, index, numberOfSlotsRequired);
      if( ! lastIndexInFreeWindow ) {
        // We didn't find a free window. Return
        break;
      }

      index = lastIndexInFreeWindow;

      // We found our first timeslot, add it to retVal
      retVal.times.push(times[index - (numberOfSlotsRequired - 1)][0]);
      index ++; // We have already verified that this one is free in the getNextAvailableWindow method...

      // Keep adding timeslots from index - (numberOfSlotsRequired - 1 [remember the fence post problem]) as long as slots at index are free
      while(index < times.length && times[index][1] !== 'X') {
        retVal.times.push(times[index - (numberOfSlotsRequired - 1)][0]);
        index++;
      }

      // Found a not-available slot, throw away all the intermediate slots and start again
    }

    return retVal;
  }

  // Returns the index of the last timeslot in an open window:
  // so if we return a 3 with numberOfSlots == 2, then indexes
  // 2 and 3 (two slots) are open and we should continue searching
  // from 3, ie 4, 5, etc.
  getNextAvailableWindow(times: string[][], startingIndex: number, numberOfSlotsRequired: number): number|undefined {
    let windowIndex = 0;
    while( (startingIndex + windowIndex) < times.length ) {
      if( times[startingIndex + windowIndex][1] === 'X' ) {
        // Start the search all over
        startingIndex += windowIndex + 1;
        windowIndex = 0;
      }
      else if( windowIndex + 1 === numberOfSlotsRequired ) {
        break;
      }
      else {
        windowIndex++;
      }
    }

    if( (startingIndex + windowIndex) >= times.length ) {
      return undefined;
    }
    else {
      return startingIndex + windowIndex;
    }
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
    const [_, month, day] = this.availability().date.split("-");
    const formattedDay = String(day).padStart(2, '0');
    return `${this.monthsShortName[+month]} ${formattedDay}`;
  }
}

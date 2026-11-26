import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { GroomerService } from '../../service/groomer-service';
import { Groomer, AvailabilitySlotsKey } from '../../model/groomer.model';
import { AuthenticationService } from 'src/app/authentication/service/authentication-service';
import { DataStore } from 'src/app/data-store/data-store';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-groomer-profile',
  imports: [
    MatButtonModule
  ],
  templateUrl: './groomer-profile.html',
  styleUrl: './groomer-profile.scss',
})
export class GroomerProfile implements OnInit{
  dataStore = inject(DataStore);
  authService = inject(AuthenticationService);
  groomerService = inject(GroomerService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  groomer: WritableSignal<Groomer|undefined> = signal(undefined);

  ngOnInit(): void {
    if( !this.dataStore.groomerId() ) {
      return;
    }

    this.groomerService.getGroomer(this.dataStore.groomerId()!).subscribe({
      next: (groomer) => this.groomer.set(groomer),
      error: (error) => console.log(error)
    });
  }

  getAvailableDays(): AvailabilitySlotsKey[] {
    return ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as AvailabilitySlotsKey[];
  }

  editGroomer(): void {
    this.router.navigate(['./edit'], {state: {id: this.dataStore.groomerId()}, relativeTo: this.activatedRoute});
  }

  convert24HourTo12Hour(time: string): string {
    let[ hourString, min ] = time.split(new RegExp(":"));
    let isPM = false;

    let hour = +hourString;
    if( hour === 0 ) {
      hour = 12;
    }
    else if( hour >= 12 ) {
      isPM = true;
      if( hour > 12 ) {
        hour -= 12; 
      }
    }

    const retVal = `${hour}:${min} ${isPM ? 'PM' : 'AM'}`;
    console.log(`Converting ${time} to ${retVal}`);
    return retVal;
  }
}

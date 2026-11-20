import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { GroomerService } from '../../service/groomer-service';
import { Groomer, PublicGroomerAvailabilityKey } from '../../model/groomer.model';
import { AuthenticationService } from 'src/app/authentication/service/authentication-service';
import { DataStore } from 'src/app/data-store/data-store';
import { MatButtonModule } from '@angular/material/button';

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

  getAvailableDays(): PublicGroomerAvailabilityKey[] {
    return ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as PublicGroomerAvailabilityKey[];
  }
}

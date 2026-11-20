import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Appointment } from 'src/app/appointment/model/appointment.model';
import { AppointmentService } from 'src/app/appointment/service/appointment-service';
import { Service } from 'src/app/grooming-service/model/services.model';
import { BannerService } from 'src/app/shared/components/banner/banner.service';

@Component({
  selector: 'app-customer-appointments',
  imports: [
    MatButtonModule
  ],
  templateUrl: './customer-appointments.html',
  styleUrl: './customer-appointments.scss',
})
export class CustomerAppointments implements OnInit{
  appointmentService = inject(AppointmentService);
  bannerService = inject(BannerService);

  appointments: WritableSignal<Appointment[]> = signal([]);
  
  ngOnInit(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (appointments) => this.appointments.set(appointments),
      error: (error) => {
        this.bannerService.open(
          'Unable to retrieve your appointments at this time.',
          {
            icon: 'warning_outline',
            warning: true,
            timeout: 10000
          }
        )
      }
    })
  }

  getDuration(services?: Service[]): string {
    if( services === undefined ) {
      return "No services requested";
    }

    let mins = services.reduce((prev, curr) => prev + curr.duration, 0);
    const hours = Math.floor(mins / 60);
    mins = mins - (hours * 60);

    let retVal = "";
    if( hours > 0 ) {
      retVal = `${hours}${hours > 1 ? 'hrs' : 'hr'}`;
    }

    if( mins > 0 ) {
      retVal += ` ${mins}mins`;
    }

    return retVal;
  }

  getPrice(services?: Service[]): number {
    if( !!!services ) {
      return 0;
    }
    return services.reduce((prev, curr) => prev + curr.price, 0);
  }

  parseDateTime(iso8601DateTime: string): string {
    const date = new Date(iso8601DateTime);
    console.log(`Type of ${date}: ${typeof date}`)
    return `${this.months[date.getMonth()]} ${date.getDate()}`;
  }

  parseTime(iso8601DateTime: string): string {
    const date = new Date(iso8601DateTime);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  }

  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
}

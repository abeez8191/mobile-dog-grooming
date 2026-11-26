import { Component, inject, signal, WritableSignal } from '@angular/core';
import { SelectGroomer } from 'src/app/booking/components/select-groomer/select-groomer';
import { SelectServices } from 'src/app/booking/components/select-services/select-services';
import { Service } from 'src/app/grooming-service/model/services.model';
import { SelectTime } from 'src/app/booking/components/select-time/select-time';
import { AppointmentService } from 'src/app/appointment/service/appointment-service';
import { AuthenticationService } from 'src/app/authentication/service/authentication-service';
import { Customer, Dog, NewCustomer } from 'src/app/customer/model/customer.model';
import { DataStore } from 'src/app/data-store/data-store';
import { CustomerService } from 'src/app/customer/service/customer-service';
import { BannerService } from 'src/app/shared/components/banner/banner.service';
import { CustomerDetails } from 'src/app/customer/components/customer-details/customer-details';
import { SelectDog } from '../../components/select-dog/select-dog';
import { NewAppointmentRequest } from 'src/app/appointment/model/appointment.model';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-booking',
  imports: [
    CustomerDetails,
    MatButtonModule,
    SelectDog,
    SelectGroomer,
    SelectServices,
    SelectTime
  ],
  templateUrl: './booking.html',
  styleUrl: './booking.scss',
})
export class Booking {
  appointmentService = inject(AppointmentService);
  authenticationService = inject(AuthenticationService);
  bannerService = inject(BannerService);
  customerService = inject(CustomerService);
  dataStore = inject(DataStore);
  router = inject(Router);
  
  step = signal(1);
  groomerId = signal(-1);
  selectedServices: WritableSignal<Service[]> = signal([]);
  selectedTime: WritableSignal<Date|undefined> = signal(undefined);
  customer: WritableSignal<Customer | undefined> = signal(undefined);

  monthsShortName = ['empty', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  previous(): void {
    this.step.update(val => val - 1);
  }
  
  next(): void {
    console.log(`Customer ID: ${this.dataStore.customerId()}`);
    this.step.update(val => val + 1);
  }

  getServicesDuration(): number {
    return this.selectedServices().reduce((total, service) => total + service.duration, 0);
  }

  chooseGroomer(id: number): void {
    this.groomerId.set(id);
    this.next();
  }

  saveCustomer(customer: Customer): void {
    this.customer.set(customer);
    console.log("Saving customer", this.customer());
    this.next();
  }

  selectServices(services: Service[]): void {
    this.selectedServices.set(services);
    console.log(services);
    this.next();
  }

  selectTime(dateTime: Date): void {
    this.selectedTime.set(dateTime);
    console.log(dateTime);
    this.next();
  }

  selectDog(dog: Dog): void {
    this.createAppointment({
      dog_id: dog.id,
      groomer_id: this.groomerId(),
      customer_id: this.customer()!.id,
      datetime: this.selectedTime()!,
      service_ids: this.selectedServices().map(s => s.id!)
    });
  }

  createAppointment(appointment: NewAppointmentRequest): void {
    this.appointmentService.createAppointment(appointment).subscribe({
      next: (appointment) => {this.next()},
      error: (error) => {
        console.error(error);
        this.bannerService.open(
          'Unable to book appointment at this time. Try again later.',
          {
            icon: 'warning_outline', 
            warning: true,
            timeout: 10000
          }
        )
      }
    });
  }

  getAppointmentDateTime(): string {
    const d = this.selectedTime()!;
    const month = d.getMonth();
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${this.monthsShortName[month]} ${day} at ${hours}:${minutes}`;
  }

  goHome(): void {
    this.router.navigate(['/'])
  }
}

import { Component, inject, signal, WritableSignal } from '@angular/core';
import { SelectGroomer } from 'src/app/booking/components/select-groomer/select-groomer';
import { SelectServices } from 'src/app/booking/components/select-services/select-services';
import { Service } from 'src/app/grooming-service/model/services.model';
import { SelectTime } from 'src/app/booking/components/select-time/select-time';
import { CreateCustomer } from 'src/app/booking/components/create-customer/create-customer';
import { AppointmentService } from 'src/app/appointment/service/appointment-service';

@Component({
  selector: 'app-booking',
  imports: [
    CreateCustomer,
    SelectGroomer,
    SelectServices,
    SelectTime
  ],
  templateUrl: './booking.html',
  styleUrl: './booking.scss',
})
export class Booking {
  appointmentService = inject(AppointmentService);
  
  step = signal(1);
  groomerId = signal(-1);
  selectedServices: WritableSignal<Service[]> = signal([]);
  selectedTime: WritableSignal<Date|undefined> = signal(undefined);
  customerId: WritableSignal<number> = signal(-1);

  monthsShortName = ['empty', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  next(): void {
    this.step.update(val => val + 1);
  }

  getServicesDuration(): number {
    return this.selectedServices().reduce((total, service) => total + service.duration, 0);
  }

  chooseGroomer(id: number): void {
    this.groomerId.set(id);
    this.next();
  }

  getCustomerId(id: number): void {
    this.customerId.set(id);
    this.createAppointment();
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

  createAppointment(): void {
    this.appointmentService.createAppointment({
      customer: this.customerId(),
      groomer: this.groomerId(),
      datetime: this.selectedTime()!,
      services: this.selectedServices().map(s => s.id!)
    }).subscribe({
      next: (appointment) => {console.log(appointment);}
    });
  }

  getAppointmentDateTime(): string {
    const d = this.selectedTime()!;
    const month = d.getMonth();
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${this.monthsShortName[month]}/${day} at ${hours}:${minutes}`;
  }
}

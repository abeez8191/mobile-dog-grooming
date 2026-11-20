import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication/service/authentication-service';
import { DataStore } from 'src/app/data-store/data-store';
import { CustomerService } from '../../service/customer-service';
import { Customer } from '../../model/customer.model';

@Component({
  selector: 'app-customer-profile',
  imports: [],
  templateUrl: './customer-profile.html',
  styleUrl: './customer-profile.scss',
})
export class CustomerProfile implements OnInit {
  dataStore = inject(DataStore);
  authService = inject(AuthenticationService);
  customerService = inject(CustomerService);

  customer: WritableSignal<Customer|undefined> = signal(undefined);

  ngOnInit(): void {
    if( !this.dataStore.customerId() ) {
      return;
    }

    this.customerService.getCustomer(this.dataStore.customerId()!).subscribe({
      next: (customer) => this.customer.set(customer),
      error: (error) => console.log(error)
    });
  }
}

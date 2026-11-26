import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CustomerService } from '../../service/customer-service';
import { Customer } from 'src/app/customer/model/customer.model'

@Component({
  selector: 'app-list-customers',
  imports: [],
  templateUrl: './list-customers.html',
  styleUrl: './list-customers.scss',
})
export class ListCustomers implements OnInit{
  customerService = inject(CustomerService);
  customerList: WritableSignal<Customer[]> = signal([]);

  ngOnInit(): void {
    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        this.customerList.set(customers);
      }
    });
  }
}

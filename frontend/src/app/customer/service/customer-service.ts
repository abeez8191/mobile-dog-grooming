import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer, NewCustomer } from '../model/customer.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  url = `/customer/`;

  constructor(private httpClient: HttpClient) {}

  createCustomer(customer: NewCustomer): Observable<Customer> {
    return this.httpClient.post<Customer>(this.url, customer);
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    return this.httpClient.put<Customer>(`${this.url}${customer.id}/`, customer);
  }

  getCustomers(): Observable<Customer[]> {
    return this.httpClient.get<Customer[]>(this.url);
  }

  getCustomer(id: number): Observable<Customer> {
    return this.httpClient.get<Customer>(`${this.url}${id}/`);
  }
}

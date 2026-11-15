import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../model/customer.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  baseUrl = 'http://localhost:8000/api';
  url = `${this.baseUrl}/customer/`;

  constructor(private httpClient: HttpClient) {}

  createCustomer(customer: Customer): Observable<Customer> {
    return this.httpClient.post<Customer>(this.url, customer);
  }
}

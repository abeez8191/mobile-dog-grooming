import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerAccountRequest, CustomerAccountResponse, GroomerAccountRequest, GroomerAccountResponse, LoginRequest, LoginResponse, LogoutRequest, LogoutResponse, UserInformation } from '../model/authentication.model';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  url = 'auth';
  constructor(private httpClient: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.url}/login`, request);
  }

  logout(request: LogoutRequest): Observable<LogoutResponse> {
    return this.httpClient.post<LogoutResponse>(`${this.url}/logout`, request);
  }

  getUserInformation(): Observable<UserInformation> {
    return this.httpClient.get<UserInformation>(`${this.url}/user/`, {withCredentials: true});
  }

  createCustomer(request: CustomerAccountRequest): Observable<CustomerAccountResponse> {
    return this.httpClient.post<CustomerAccountResponse>(`${this.url}/register`, request);
  }

  createGroomer(request: GroomerAccountRequest): Observable<GroomerAccountResponse> {
    return this.httpClient.post<GroomerAccountResponse>(`${this.url}/create/customer`, request);
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    return this.httpClient.post<LoginResponse>(`${this.url}/login`, request, {withCredentials: true});
  }

  logout(request: LogoutRequest): Observable<LogoutResponse> {
    return this.httpClient.post<LogoutResponse>(`${this.url}/logout`, request, {withCredentials: true, headers: this.getCsrfHeader()});
  }

  getUserInformation(): Observable<UserInformation> {
    return this.httpClient.get<UserInformation>(`${this.url}/user/`, {withCredentials: true});
  }

  createCustomer(request: CustomerAccountRequest): Observable<CustomerAccountResponse> {
    return this.httpClient.post<CustomerAccountResponse>(`${this.url}/create/customer/`, request);
  }

  createGroomer(request: GroomerAccountRequest): Observable<GroomerAccountResponse> {
    return this.httpClient.post<GroomerAccountResponse>(`${this.url}/create/groomer/`, request);
  }
  
  getCsrfHeader(): HttpHeaders {
    let headers = new HttpHeaders();
    return headers.set('X-CSRFToken', this.getCookie('csrftoken'));
  }

  getCookie(headerName: string): string {
    let options = document.cookie.split('; ').map(c => c.split('=')).find(arr => arr[0] === 'csrftoken');
    if( options ) {
      return options[1];
    }

    return '';
  }
}

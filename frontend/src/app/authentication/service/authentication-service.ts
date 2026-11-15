import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse, LogoutRequest, LogoutResponse } from '../model/authentication.model';

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
}

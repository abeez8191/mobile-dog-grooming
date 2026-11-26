import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  AppointmentResponse, NewAppointmentRequest, UpdateAppointmentRequest } from '../model/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  url = `/appointment/`;

  constructor(private httpClient: HttpClient) {}

  createAppointment(appointment: NewAppointmentRequest): Observable<AppointmentResponse> {
    return this.httpClient.post<AppointmentResponse>(this.url, appointment);
  }

  getAppointments(date?: string): Observable<AppointmentResponse[]> {
    let params = new HttpParams();

    if( date ) {
      params = params.set('date', date);
    }

    return this.httpClient.get<AppointmentResponse[]>(this.url, {withCredentials: true, params});
  }

  deleteAppointment(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}${id}/`, {withCredentials: true})
  }

  completeAppointment(appointment: UpdateAppointmentRequest): Observable<AppointmentResponse> {
    const appointmentRequest = {
      ...appointment,
      completed_on: new Date()
    };

    return this.httpClient.put<AppointmentResponse>(`${this.url}${appointment.id}/`, appointmentRequest, {withCredentials: true});
  }
}

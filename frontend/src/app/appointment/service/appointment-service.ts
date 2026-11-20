import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../model/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  url = `/appointment/`;

  constructor(private httpClient: HttpClient) {}

  createAppointment(appointment: Appointment): Observable<Appointment> {
    return this.httpClient.post<Appointment>(this.url, appointment);
  }

  getAppointments(date?: string): Observable<Appointment[]> {
    let params = new HttpParams();

    if( date ) {
      params = params.set('date', date);
    }

    return this.httpClient.get<Appointment[]>(this.url, {withCredentials: true, params});
  }
}

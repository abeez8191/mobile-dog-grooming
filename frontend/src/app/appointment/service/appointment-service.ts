import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  deleteAppointment(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}${id}/`, {withCredentials: true})
  }

  completeAppointment(appointment: Appointment): Observable<Appointment> {
    const appointmentRequest = {
      id: appointment.id,
      dog_id: appointment.dog?.id ?? appointment.dog_id,
      customer_id: appointment.customer?.id ?? appointment.customer_id,
      groomer_id: appointment.groomer?.id ?? appointment.groomer_id,
      service_ids: appointment.services?.map(service => service.id) ?? appointment.service_ids,
      datetime: appointment.datetime,
      completed_on: new Date()
    };

    return this.httpClient.put<Appointment>(`${this.url}${appointment.id}/`, appointmentRequest, {withCredentials: true});
  }
}

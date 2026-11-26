import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Groomer, PublicGroomer, AvailabilitySlots, PublicGroomerAvailabilityResponse } from '../model/groomer.model';

@Injectable({
  providedIn: 'root',
})
export class GroomerService {
  url = `/groomer/`;
  
  constructor(private httpClient: HttpClient) {}

  addGroomer(data: Groomer): Observable<Groomer> {
    return this.httpClient.post<Groomer>(this.url, data);
  }

  getGroomers(): Observable<Groomer[]> {
    return this.httpClient.get<Groomer[]>(this.url);
  }

  deleteGroomer(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}${id}/`);
  }

  getGroomer(id: number): Observable<Groomer> {
    return this.httpClient.get<Groomer>(`${this.url}${id}/`);
  }

  updateGroomer(data: Groomer): Observable<Groomer> {
    return this.httpClient.put<Groomer>(`${this.url}${data.id}/`, data);
  }

  getPublicGroomers(): Observable<PublicGroomer[]> {
    return this.httpClient.get<PublicGroomer[]>(`/public/groomer/`);
  }

  getPublicGroomerAvailability(id: number, date?: Date): Observable<AvailabilitySlots> {
    let params = new HttpParams();
    console.log(date);
    if( date ) {
      params = params.set('start_date', this.formatDate(date));
    }

    return this.httpClient.get<PublicGroomerAvailabilityResponse>(`/public/groomer/${id}/availability`, {params})
      .pipe(
        map(response => response.available_slots)
      );
  }

  formatDate(date: Date): string {
    const month = String(date.getMonth() + 1); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }
}
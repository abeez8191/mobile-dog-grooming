import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Groomer } from '../model/groomer.model';

@Injectable({
  providedIn: 'root',
})
export class GroomerService {
  url = "http://localhost:8000/api/groomer/";
  
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
}
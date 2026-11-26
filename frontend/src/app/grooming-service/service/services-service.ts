import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Service } from '../model/services.model';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  url = "/service/";

  constructor(private httpClient: HttpClient){}

  getServices(): Observable<Service[]> {
    return this.httpClient.get<Service[]>(this.url);
  }

  addService(data: Service): Observable<Service>{
    return this.httpClient.post<Service>(this.url, data);
  }

  updateService(data: Service): Observable<Service>{
    return this.httpClient.put<Service>(`${this.url}${data.id}/`, data);
  }

  deleteService(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}${id}/`);
  }
}

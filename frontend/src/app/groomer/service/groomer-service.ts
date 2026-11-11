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
}
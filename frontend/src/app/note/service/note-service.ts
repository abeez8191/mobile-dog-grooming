import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Note, NoteRequest } from 'src/app/customer/model/customer.model';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  constructor(private httpClient: HttpClient) {}

  deleteService(dogId: number, noteId: number): Observable<void> {
    return this.httpClient.delete<void>(`dog/${dogId}/note/${noteId}/`, {withCredentials: true, headers: this.getCsrfHeader()} );
  }

  addNote(dogId: number, note: NoteRequest): Observable<Note> {
    return this.httpClient.post<Note>(`dog/${dogId}/note/`, note, {withCredentials: true, headers: this.getCsrfHeader()} );
  }

  updateNote(dogId: number, note: NoteRequest): Observable<Note> {
    return this.httpClient.put<Note>(`dog/${dogId}/note/${note.id!}/`, note, {withCredentials: true, headers: this.getCsrfHeader()} );
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

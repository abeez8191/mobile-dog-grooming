import { Component, inject, input, InputSignal, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { Note, NoteRequest } from 'src/app/customer/model/customer.model';
import { DataStore } from 'src/app/data-store/data-store';
import { NoteService } from 'src/app/note/service/note-service';

@Component({
  selector: 'app-note-view',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './note-view.html',
  styleUrl: './note-view.scss',
})
export class NoteView implements OnInit {
  notesInput: InputSignal<Note[]> = input.required({alias: 'notes'});
  dogId: InputSignal<number|undefined> = input();

  dataStore = inject(DataStore);
  noteService = inject(NoteService);
  
  editingIndex = signal(-1);
  notes: WritableSignal<Note[]> = signal([]);

  noteForm!: FormGroup;
  constructor(private fb: FormBuilder) {
    this.noteForm = this.resetForm();
  }

  ngOnInit(): void {
    this.notes.set(this.notesInput());
  }

  resetForm(note?: Note): FormGroup {
    return this.fb.group({
      message: [note ? note.message : '', [Validators.required]]
    });
  }
  
  addNote(): void {
    this.noteForm = this.resetForm();
    this.notes.update(snapshot => (snapshot ?? []).concat({message: '', groomer: {id: -1, firstName: 'none', lastName: 'other'}, updated_on: new Date()}));
    this.editingIndex.set(this.notes().length - 1);
  }

  editNote(index: number): void {
    this.editingIndex.set(index);
    this.noteForm = this.resetForm(this.notes()[index]);
  }

  deleteNote(note_id: number): void {
    this.noteService.deleteService(this.dogId()!, note_id).subscribe({
      next: () => {
        const index = this.notes().findIndex((notes) => notes.id === note_id);
        this.removeNoteAtIndex(index);
      }
    });
  }

  saveNote(note_id?: number): void {
    if( !this.noteForm?.valid ) {
      console.log("Service form is not valid");
      return;
    }

    let observable: Observable<Note>;
    if( note_id ) {
      observable = this.noteService.updateNote(this.dogId()!, {id: note_id, message: this.noteForm.get('message')!.value, groomer_id: this.dataStore.groomerId()!});
    }
    else {
      observable = this.noteService.addNote(this.dogId()!, {message: this.noteForm.get('message')!.value, groomer_id: this.dataStore.groomerId()!});
    }

    observable.subscribe({
        next: (note: Note) => {
          this.notes.update(snapshot => snapshot.with(this.editingIndex(), note));
          this.editingIndex.set(-1);
        },
        error: () => {
          console.log("Error while adding/updating")
        }
      });
  }

  cancelEdit(id?: number): void {
    if( !id ) {
      // Cancel an add
      this.removeNoteAtIndex(this.editingIndex());
    }
    this.editingIndex.set(-1);
  }

  removeNoteAtIndex(index: number): void {
    if( index >= 0 ) {
      let snapshot = this.notes();
      snapshot = snapshot.toSpliced(index, 1);
      this.notes.set(snapshot);
    }
  }

  getShortDate(dateString?: string) : string {
    const date = dateString ? new Date(dateString!) : new Date();
    return date.toLocaleString().split(",")[0];
  }

  getShortTime(dateString?: string): string {
    const date = dateString ? new Date(dateString!) : new Date();
    return date.toLocaleString().split(",")[1];
  }
}

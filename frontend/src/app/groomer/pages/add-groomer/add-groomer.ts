import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AvailabilityDay } from '../../components/availability-day/availability-day';
import { JsonPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { PhotoSelector } from '../../components/photo-selector/photo-selector';
import { Groomer } from '../../model/groomer.model';
import { GroomerService } from '../../service/groomer-service';

@Component({
  selector: 'app-add-groomer',
  imports: [AvailabilityDay, PhotoSelector, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, JsonPipe],
  templateUrl: './add-groomer.html',
  styleUrl: './add-groomer.scss',
})
export class AddGroomer implements OnInit{
  groomerService = inject(GroomerService);

  groomerForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.groomerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: [''],
      email: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      availability: this.fb.group({
        sun: [''],
        mon: [''],
        tue: [''],
        wed: [''],
        thu: [''],
        fri: [''],
        sat: [''],
      }),
      bio: ['', Validators.required],
      photo: ['', Validators.required]
    });
  }

  submitForm() {
    if( ! this.groomerForm.valid ) {
      return;
    }

    let availability: Record<string, {start: string, end: string}> = {};
    for( let key of ['sun', 'mon', 'tue', 'wed', 'thu', 'fri','sat']) {
      console.log("Checking " + key)
      const formEntry = this.groomerForm.get(`availability.${key}`);
      if( formEntry && formEntry.value !== '' && formEntry.value.length > 0 ) {
        availability[key] = {start: formEntry.value[0], end: formEntry.value[1]}
        console.log(`availability[${key}] = ${availability[key]}`)
      }
    }

    const [photoData, photo] = this.groomerForm.get('photo')!.value.split(",");

    const formData: Groomer = {
      firstName: this.groomerForm.get('firstName')!.value,
      lastName: this.groomerForm.get('lastName')!.value,
      email: this.groomerForm.get('email')!.value,
      phoneNumber: this.groomerForm.get('phoneNumber')!.value,
      biography: this.groomerForm.get('bio')!.value,
      photo,
      photoData,
      availability
    };

    console.log(JSON.stringify(formData));

    this.groomerService.addGroomer(formData).subscribe({
      next: (groomer: Groomer) => {
        console.log("Done!");
      },
      error: (error) => {
        console.error("Error");
      }
    })
  }

  updatePhoto($event: string|ArrayBuffer) {
    this.groomerForm.get('photo')?.setValue($event);
  }
}

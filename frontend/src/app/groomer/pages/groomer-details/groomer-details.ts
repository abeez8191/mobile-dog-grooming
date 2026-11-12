import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AvailabilityDay } from '../../components/availability-day/availability-day';
import { MatButtonModule } from '@angular/material/button';
import { PhotoSelector } from '../../components/photo-selector/photo-selector';
import { Groomer } from '../../model/groomer.model';
import { GroomerService } from '../../service/groomer-service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-groomer-details',
  imports: [AvailabilityDay, PhotoSelector, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './groomer-details.html',
  styleUrl: './groomer-details.scss',
})
export class GroomerDetails implements OnInit{
  private location = inject(Location);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private groomerService = inject(GroomerService);

  groomerForm!: FormGroup;
  groomerId!: number;
  formReady: WritableSignal<boolean> = signal(false);
  isEdit = signal(false);

  constructor(private fb: FormBuilder) {
    if( this.router.currentNavigation()?.extras.state ) {
      this.groomerId = this.router.currentNavigation()?.extras.state?.['id'];
      this.isEdit.set(true);
    }
  }

  ngOnInit(): void {
    if( this.groomerId ) {
      this.groomerService.getGroomer(this.groomerId).subscribe({
        next: (groomer: Groomer) => {
          this.createForm(groomer);
          this.formReady.set(true);
        }
      })
    }
    else {
      console.log("Calling create form with no groomer")
      this.createForm();
      this.formReady.set(true);
    }
  }

  createForm(groomer?: Groomer): void {
    this.groomerForm = this.fb.group({
      firstName: [groomer?.firstName || '', [Validators.required]],
      lastName: [groomer?.lastName || ''],
      email: [groomer?.email || '', [Validators.required]],
      phoneNumber: [groomer?.phoneNumber || '', [Validators.required]],
      availability: this.fb.group({
        sun: [(groomer?.availability.sun) ? [groomer.availability.sun.start, groomer.availability.sun.end] : []],
        mon: [(groomer?.availability.mon) ? [groomer.availability.mon.start, groomer.availability.mon.end] : []],
        tue: [(groomer?.availability.tue) ? [groomer.availability.tue.start, groomer.availability.tue.end] : []],
        wed: [(groomer?.availability.wed) ? [groomer.availability.wed.start, groomer.availability.wed.end] : []],
        thu: [(groomer?.availability.thu) ? [groomer.availability.thu.start, groomer.availability.thu.end] : []],
        fri: [(groomer?.availability.fri) ? [groomer.availability.fri.start, groomer.availability.fri.end] : []],
        sat: [(groomer?.availability.sat) ? [groomer.availability.sat.start, groomer.availability.sat.end] : []],
      }),
      bio: [groomer?.biography || '', Validators.required],
      photo: [(groomer) ? `${groomer.photoData},${groomer.photo}` : '', Validators.required]
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

    const observable = this.isEdit() ? 
        this.groomerService.updateGroomer({id: this.groomerId, ...formData}) : 
        this.groomerService.addGroomer(formData);
        
    observable.subscribe({
      next: (groomer: Groomer) => {
        console.log("Done!");
        this.router.navigate(['../list'], {relativeTo: this.activatedRoute});
      },
      error: (error) => {
        console.error("Error");
      }
    })
  }

  updatePhoto($event: string|ArrayBuffer) {
    this.groomerForm.get('photo')?.setValue($event);
  }

  cancelAdd(): void {
    this.location.back();
  }

  getFormControl(name: string): FormControl {
    return this.groomerForm.get(name) as FormControl;
  }
}

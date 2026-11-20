import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AvailabilityDay } from '../../components/availability-day/availability-day';
import { MatButtonModule } from '@angular/material/button';
import { PhotoSelector } from '../../components/photo-selector/photo-selector';
import { Availability, AvailabilityKey, Groomer, PublicGroomerAvailabilityKey } from '../../model/groomer.model';
import { GroomerService } from '../../service/groomer-service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication/service/authentication-service';
import { BannerService } from 'src/app/shared/components/banner/banner.service';

@Component({
  selector: 'app-groomer-details',
  imports: [
    AvailabilityDay, 
    PhotoSelector, 
    ReactiveFormsModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule
  ],
  templateUrl: './groomer-details.html',
  styleUrl: './groomer-details.scss',
})
export class GroomerDetails implements OnInit{
  private location = inject(Location);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private groomerService = inject(GroomerService);
  private authenticationService = inject(AuthenticationService);
  private bannerService = inject(BannerService);

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
        sun: [(groomer?.availability.sun) ? [this.convert24HourTo12Hour(groomer.availability.sun.start), this.convert24HourTo12Hour(groomer.availability.sun.end)] : []],
        mon: [(groomer?.availability.mon) ? [this.convert24HourTo12Hour(groomer.availability.mon.start), this.convert24HourTo12Hour(groomer.availability.mon.end)] : []],
        tue: [(groomer?.availability.tue) ? [this.convert24HourTo12Hour(groomer.availability.tue.start), this.convert24HourTo12Hour(groomer.availability.tue.end)] : []],
        wed: [(groomer?.availability.wed) ? [this.convert24HourTo12Hour(groomer.availability.wed.start), this.convert24HourTo12Hour(groomer.availability.wed.end)] : []],
        thu: [(groomer?.availability.thu) ? [this.convert24HourTo12Hour(groomer.availability.thu.start), this.convert24HourTo12Hour(groomer.availability.thu.end)] : []],
        fri: [(groomer?.availability.fri) ? [this.convert24HourTo12Hour(groomer.availability.fri.start), this.convert24HourTo12Hour(groomer.availability.fri.end)] : []],
        sat: [(groomer?.availability.sat) ? [this.convert24HourTo12Hour(groomer.availability.sat.start), this.convert24HourTo12Hour(groomer.availability.sat.end)] : []],
      }),
      bio: [groomer?.biography || '', Validators.required],
      photo: [(groomer) ? `${groomer.photoData},${groomer.photo}` : '', Validators.required],
      password: ['']
    });
  }

  submitForm() {
    if( ! this.groomerForm.valid ) {
      return;
    }

    let availability: Record<string, {start: string, end: string}> = {};
    for( let key of ['sun', 'mon', 'tue', 'wed', 'thu', 'fri','sat']) {
      const formEntry = this.groomerForm.get(`availability.${key}`);
      if( formEntry && formEntry.value !== '' && formEntry.value.length > 0 ) {
        availability[key] = {start: formEntry.value[0], end: formEntry.value[1]}
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
      availability: this.updateAvailabilityTimesTo24Hr(availability)
    };

    if( this.isEdit() ) {
      this.groomerService.updateGroomer({id: this.groomerId, ...formData}).subscribe({
        next: () => {
          console.log("Done!");
          this.router.navigate(['..'], {relativeTo: this.activatedRoute});
        },
        error: (error) => {
          this.bannerService.open(
            'Unable to update groomer',
            {
              icon: 'error_outline',
              error: true,
              timeout: 10000
            }
          );
        }
      });
    }
    else {
      this.groomerService.addGroomer(formData).pipe(
        concatMap((groomer) => {
          return this.authenticationService.createGroomer({
            email: groomer.email, 
            groomer: groomer.id!, 
            password: this.groomerForm.value.password
          });
        })
      ).subscribe({
        next: () => {
          console.log("Done!");
          this.router.navigate(['..'], {relativeTo: this.activatedRoute});
        },
        error: (error) => {
          this.bannerService.open(
            'Unable to create groomer account',
            {
              icon: 'error_outline',
              error: true,
              timeout: 10000
            }
          );
        }
      });
    }
  }

  updateAvailabilityTimesTo24Hr(availability: Availability): Availability {
    let newAvailability: Availability = {};
    for( let day of ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as AvailabilityKey[] ) {
      if( availability[day]) {
        newAvailability[day] = {
          start: this.convert12HourTo24Hour(availability[day]['start']), 
          end: this.convert12HourTo24Hour(availability[day]['end'])
        };
      }
    }

    return newAvailability;
  }

  convert12HourTo24Hour(time: string): string {
    let [hour, min, amPm] = time.split(new RegExp("[: ]"));

    if( amPm === "PM" ) {
      hour = String(12 + +hour);
    }

    return `${hour}:${min}`;
  }

  convert24HourTo12Hour(time: string): string {
    let[ hourString, min ] = time.split(new RegExp(":"));
    let isPM = false;

    let hour = +hourString;
    if( hour === 0 ) {
      hour = 12;
    }
    else if( hour >= 12 ) {
      isPM = true;
      if( hour > 12 ) {
        hour -= 12; 
      }
    }

    const retVal = `${hour}:${min} ${isPM ? 'PM' : 'AM'}`;
    console.log(`Converting ${time} to ${retVal}`);
    return retVal;
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

import { Component, inject, input, OnInit, output, OutputEmitterRef, signal } from '@angular/core';
import { Dog } from '../../model/customer.model';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BannerService } from 'src/app/shared/components/banner/banner.service';

@Component({
  selector: 'app-dog-information',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './dog-information.html',
  styleUrl: './dog-information.scss',
})
export class DogInformation implements OnInit{
  createDogs: OutputEmitterRef<Dog[]> = output();
  back: OutputEmitterRef<void> = output();

  bannerService = inject(BannerService);

  dogs = input.required<Dog[]>()

  dogForm!: FormGroup;
  formIsReady = signal(false);
  
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.dogForm = this.fb.group({
      dogList: this.fb.array([])
    });

    for( let dog of this.dogs() ) {
      console.log("Adding a dog");
      this.dogList.push(this.fb.group({
        id: [dog.id],
        name: [dog.name, [Validators.required]],
        breed: [dog.breed, [Validators.required]]
      }));
    }

    this.formIsReady.set(true);
    console.log(this.dogList.controls);
  }

  goBack() {
    this.back.emit();
  }

  save() {
    console.log("Saving...");
    if( this.dogList.valid) {
      this.createDogs.emit(this.dogList.value);
    }
    else {
      this.bannerService.open(
        'Information missing. Please make sure you filled out all the form',
        {
          icon: 'warning_outline',
          warning: true,
          timeout: 10000
        }
      )
    }
  }

  addDog() {
    this.dogList.push(this.fb.group({
      name: ['', [Validators.required]],
      breed: ['', [Validators.required]]
    }));
  }

  deleteDog(index: number): void {
    console.log(this.dogList);
    this.dogList.removeAt(index);
  }

  get dogList() {
    return this.dogForm.controls['dogList'] as FormArray;
  }

  get dogListControls() {
    return (this.dogList.controls as unknown[]) as FormGroup[]
  }
}

import { Component, input, InputSignal, OnInit, output, OutputEmitterRef } from '@angular/core';
import { Dog } from 'src/app/customer/model/customer.model';

@Component({
  selector: 'app-select-dog',
  imports: [],
  templateUrl: './select-dog.html',
  styleUrl: './select-dog.scss',
})
export class SelectDog implements OnInit{
  dogs: InputSignal<Dog[]> = input.required();
  dog: OutputEmitterRef<Dog> = output();
  back: OutputEmitterRef<void> = output();

  ngOnInit(): void {
    console.log("Passed in dogs: ", this.dogs())
  }
  
  selectDog(dog: Dog) {
    this.dog.emit(dog);
  }

  goBack(): void {
    this.back.emit();
  }
}

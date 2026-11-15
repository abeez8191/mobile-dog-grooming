import { Component, inject, output, OutputEmitterRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CustomerService } from 'src/app/customer/service/customer-service';
import { Customer } from 'src/app/customer/model/customer.model';

@Component({
  selector: 'app-create-customer',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-customer.html',
  styleUrl: './create-customer.scss',
})
export class CreateCustomer {
  customerCreated: OutputEmitterRef<number> = output();
  customerService = inject(CustomerService);
  
  constructor(private fb: FormBuilder) {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      street: ['', [Validators.required]],
      street2: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]]
    });
  }

  customerForm!: FormGroup;

  createCustomer(): void {
    if(! this.customerForm.valid ){ 
      return;
    }

    this.customerService.createCustomer(this.customerForm.value).subscribe({
      next: (customer: Customer) => {
        this.customerCreated.emit(customer.id!);
      }
    });
  }
}

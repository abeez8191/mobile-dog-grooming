import { Component, inject, output, OutputEmitterRef, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CustomerService } from 'src/app/customer/service/customer-service';
import { Customer } from 'src/app/customer/model/customer.model';
import { LoadingButton } from 'src/app/shared/components/loading-button/loading-button';

@Component({
  selector: 'app-customer-information',
  imports: [
    LoadingButton,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './customer-information.html',
  styleUrl: './customer-information.scss',
})
export class CustomerInformation {
  customerCreated: OutputEmitterRef<number> = output();
  customerService = inject(CustomerService);

  isSubmitting = signal(false);
  
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

    this.isSubmitting.set(true);

    this.customerService.createCustomer(this.customerForm.value).subscribe({
      next: (customer: Customer) => {
        this.customerCreated.emit(customer.id!);
      },
      error: (error) => {
        this.isSubmitting.set(false);
      }
    });
  }
}

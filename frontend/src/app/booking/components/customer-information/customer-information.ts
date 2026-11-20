import { Component, inject, output, OutputEmitterRef, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CustomerService } from 'src/app/customer/service/customer-service';
import { Customer } from 'src/app/customer/model/customer.model';
import { LoadingButton } from 'src/app/shared/components/loading-button/loading-button';
import { BannerService } from 'src/app/shared/components/banner/banner.service';

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
  customerCreated: OutputEmitterRef<Customer> = output();
  customerService = inject(CustomerService);
  bannerService = inject(BannerService);

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
        this.customerCreated.emit(customer);
      },
      error: (error) => {
        if( error.status === 400 ) {
          this.bannerService.open(
            'Missing information. Please enter all required fields and submit again.',
            {
              icon: 'warning_outline',
              warning: true,
              timeout: 10000
            }
          )
        }
        else if( error.status === 403 ) {
          this.bannerService.open(
            'Not authorized to create a customer',
            {
              icon: 'warning_outline',
              warning: true,
              timeout: 10000
            }
          )
        }
        else if( error.status > 500 ) {
          this.bannerService.open(
            'Unable to create new customers at this time. Please try again later.',
            {
              icon: 'error_outline',
              error: true,
              timeout: 10000
            }
          )
        }
        else {
          this.bannerService.open(
            'Unknown error occured',
            {
              icon: 'warning_outline',
              warning: true,
              timeout: 10000
            }
          );
        }
        
        this.isSubmitting.set(false);
      }
    });
  }
}

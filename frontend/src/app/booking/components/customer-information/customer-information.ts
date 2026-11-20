import { Component, inject, OnInit, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CustomerService } from 'src/app/customer/service/customer-service';
import { Customer } from 'src/app/customer/model/customer.model';
import { LoadingButton } from 'src/app/shared/components/loading-button/loading-button';
import { BannerService } from 'src/app/shared/components/banner/banner.service';
import { DataStore } from 'src/app/data-store/data-store';

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
export class CustomerInformation implements OnInit {
  customerCreated: OutputEmitterRef<Customer> = output();
  customerService = inject(CustomerService);
  bannerService = inject(BannerService);
  dataStore = inject(DataStore);
  
  isSubmitting = signal(false);
  formLoaded = signal(false);
  customer: WritableSignal<Customer | null> = signal(null);
  
  constructor(private fb: FormBuilder) {}

  customerForm!: FormGroup;

  ngOnInit(): void {
    if( this.dataStore.isCustomer() ) {
      this.customerService.getCustomer(this.dataStore.customerId()!).subscribe({
        next: (customer) => {
          this.customer.set(customer);
          this.customerForm = this.createCustomerForm(customer);
          this.formLoaded.set(true);
        },
        error: (error) => {
          this.bannerService.open(
            'Unable to fetch your information. Please enter it below.',
            {
              icon: 'error_outline',
              error: true,
              timeout: 10000
            }
          );

          this.customerForm = this.createCustomerForm();
          this.formLoaded.set(true);
        }
      })
    }
  }

  createCustomerForm(customer?: Customer): FormGroup {
    return this.fb.group({
      firstName: [customer?.firstName || '', [Validators.required]],
      lastName: [customer?.lastName || '', [Validators.required]],
      street: [customer?.street || '', [Validators.required]],
      street2: [customer?.street2 ?? ''],
      city: [customer?.city || '', [Validators.required]],
      state: [customer?.state || '', [Validators.required]],
      zipCode: [customer?.zipCode || '', [Validators.required]],
      email: [customer?.email || '', [Validators.required]],
      phoneNumber: [customer?.phoneNumber || '', [Validators.required]]
    });
  }

  createCustomer(): void {
    if(! this.customerForm.valid ){ 
      return;
    }

    this.isSubmitting.set(true);

    let observable;
    if( this.customer() !== null ) {
      observable = this.customerService.updateCustomer({...this.customerForm.value, id: this.customer()!.id });
    }
    else {
      observable = this.customerService.createCustomer(this.customerForm.value);
    }

    observable.subscribe({
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

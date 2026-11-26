import { Component, computed, inject, input, InputSignal, OnInit, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CustomerService } from 'src/app/customer/service/customer-service';
import { Customer } from 'src/app/customer/model/customer.model';
import { LoadingButton } from 'src/app/shared/components/loading-button/loading-button';
import { BannerService } from 'src/app/shared/components/banner/banner.service';
import { DataStore } from 'src/app/data-store/data-store';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-customer-information',
  imports: [
    LoadingButton,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './customer-information.html',
  styleUrl: './customer-information.scss',
})
export class CustomerInformation implements OnInit {
  customer: InputSignal<Customer|undefined> = input();
  customerUpdated: OutputEmitterRef<Customer> = output();
  back: OutputEmitterRef<void> = output();

  bannerService = inject(BannerService);
  dataStore = inject(DataStore);
  
  isSubmitting = signal(false);
  isNewCustomer = computed(() => this.customer() === undefined || this.customer()!.id === undefined);
  
  constructor(private fb: FormBuilder) {}

  customerForm!: FormGroup;

  ngOnInit(): void {
    this.customerForm = this.createCustomerForm(this.customer());
    console.log(`this.customer():`, this.customer());
  }

  createCustomerForm(customer?: Customer): FormGroup {
    console.log("Got customer", customer);
    let retVal = this.fb.group({
      firstName: [customer?.firstName || '', [Validators.required]],
      lastName: [customer?.lastName || '', [Validators.required]],
      street: [customer?.street || '', [Validators.required]],
      street2: [customer?.street2 ?? ''],
      city: [customer?.city || '', [Validators.required]],
      state: [customer?.state || '', [Validators.required]],
      zipCode: [customer?.zipCode || '', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      email: [customer?.email || '', [Validators.required]],
      phoneNumber: [customer?.phoneNumber || '', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: ['']
    });

    if( this.isNewCustomer() ) {
      retVal.get('password')?.setValidators(Validators.required);
    }

    return retVal;
  }

  createCustomer(): void {
    if(! this.customerForm.valid ){ 
      return;
    }

    let customerData: Customer = { ...this.customerForm.value, dogs: this.customer()?.dogs ?? [] }
    if( this.customer()?.id ) {
      customerData.id = this.customer()!.id;
    }

    this.customerUpdated.emit(customerData);
  }

  goBack(): void {
    console.log("Emitting back from customer-information");
    this.back.emit();
  }
}
import { Component, computed, inject, input, InputSignal, OnInit, output, OutputEmitterRef, signal } from '@angular/core';
import { Customer, Dog, NewCustomer } from '../../model/customer.model';
import { CustomerService } from '../../service/customer-service';
import { BannerService } from 'src/app/shared/components/banner/banner.service';
import { CustomerInformation } from '../customer-information/customer-information';
import { DogInformation } from '../dog-information/dog-information';
import { AuthenticationService } from 'src/app/authentication/service/authentication-service';

@Component({
  selector: 'app-customer-details',
  imports: [CustomerInformation, DogInformation],
  templateUrl: './customer-details.html',
  styleUrl: './customer-details.scss',
})
export class CustomerDetails implements OnInit {
  updateCustomer: InputSignal<number|undefined> = input();
  customer: OutputEmitterRef<Customer> = output();
  back: OutputEmitterRef<void> = output();

  authenticationService = inject(AuthenticationService);
  customerService = inject(CustomerService);
  bannerService = inject(BannerService);
  
  isNewCustomer = computed(() => this.updateCustomer() === undefined);

  customerLoaded = signal(false);
  customerSignal = signal<Customer | NewCustomer | undefined>(undefined);
  dogsSignal = signal<Dog[]>([]);

  customerOrUndefined = computed(() => this.customerSignal() === undefined ? undefined : this.customerSignal() as Customer );
  step = signal(1);

  ngOnInit(): void {
    console.log(`Passed in ${this.updateCustomer()} as the id to update`)
    if( this.updateCustomer() !== undefined ) {
      // get customer
      this.customerService.getCustomer(this.updateCustomer()!).subscribe({
        next: (customer) => {
          this.customerSignal.set(customer);
          console.log("Got customer", customer);
          this.customerLoaded.set(true);
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
        }
      });
    }
    else {
      console.log("No customer asked for...");
      this.customerLoaded.set(true);
    }
  }

  submit(): void {
    let customerValue = this.customerSignal();
    if( customerValue !== undefined ) {
      customerValue.dogs = this.dogsSignal();

      let observable;
      if( this.updateCustomer() === undefined ) {
        observable = this.customerService.createCustomer(customerValue as NewCustomer).subscribe({
          next: (customer) => {
            this.authenticationService.createCustomer({
              email: customer.email,
              password: (customerValue as NewCustomer).password!,
              customer: customer.id!
            }).subscribe({
              next: (response) => {
                this.authenticationService.login({email: customer.email, password: (customerValue as NewCustomer).password}).subscribe({
                  next: (response) => this.customer.emit(customer),
                  error: () => { 
                    this.bannerService.open(
                      'Customer account created, but unable to login',
                      {
                        icon: 'error_icon',
                        error: true,
                        timeout: 10000
                      }
                    );
                  }
                })
              },
              error: (error) => {
                this.bannerService.open(
                  'Unable to create customer at this time.',
                  {
                    icon: 'error_icon',
                    error: true,
                    timeout: 10000
                  }
                )
              }
            })
          },
          error: (error) => {
            this.bannerService.open(
              'Unable to create customer at this time.',
              {
                icon: 'error_icon',
                error: true,
                timeout: 10000
              }
            )
          }
        })
      }
      else {
        observable = this.customerService.updateCustomer(customerValue as Customer).subscribe({
          next: (customer) => {
            this.customer.emit(customer);
          },
          error: (error) => {
            this.bannerService.open(
              'Unable to update customer at this time.',
              {
                icon: 'error_icon',
                error: true,
                timeout: 10000
              }
            )
          }
        });
      }
    }
  }

  modifyCustomer(customer: Customer): void {
    this.customerSignal.set(customer);
    this.step.update(val => val + 1);
  }

  goBack(): void {
    console.log(`Emitting back on step ${this.step()}`);
    if( this.step() === 1 ) {
      this.back.emit();
    }
    else {
      this.step.update(val => val - 1);
    }
  }
}
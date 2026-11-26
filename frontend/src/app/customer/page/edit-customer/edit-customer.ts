import { Component, inject } from '@angular/core';
import { Customer, NewCustomer } from '../../model/customer.model';
import { CustomerService } from '../../service/customer-service';
import { BannerService } from 'src/app/shared/components/banner/banner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerDetails } from '../../components/customer-details/customer-details';
import { DataStore } from 'src/app/data-store/data-store';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-customer',
  imports: [
    CustomerDetails
  ],
  templateUrl: './edit-customer.html',
  styleUrl: './edit-customer.scss',
})
export class EditCustomer {
  customerService = inject(CustomerService);
  dataStore = inject(DataStore);
  bannerService = inject(BannerService);
  router = inject(Router);
  activeRoute = inject(ActivatedRoute);
  location = inject(Location);
  
  saveCustomer(customer: Customer | NewCustomer): void {
    let observable;
    if( customer.hasOwnProperty('id') ) {
      observable = this.customerService.updateCustomer(customer as Customer);
    }
    else {
      observable = this.customerService.createCustomer(customer as NewCustomer);
    }

    observable.subscribe({
      next: (customer: Customer) => {
        this.router.navigate(['..'], {relativeTo: this.activeRoute})
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
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}

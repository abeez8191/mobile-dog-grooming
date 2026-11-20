import { CanActivateFn, Router, Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { ListGroomers } from './groomer/pages/list-groomers/list-groomers';
import { GroomerDetails } from './groomer/pages/groomer-details/groomer-details';
import { ListService } from './grooming-service/page/list-service/list-service';
import { SelectGroomer } from './booking/components/select-groomer/select-groomer';
import { Booking } from './booking/pages/booking/booking';
import { Login } from './authentication/page/login/login';
import { ListCustomers } from './customer/page/list-customers/list-customers';
import { AdminConsole } from './console/admin/admin-console';
import { CustomerConsole } from './console/customer-console/customer-console';
import { GroomerConsole } from './console/groomer-console/groomer-console';
import { CustomerProfile } from './customer/page/customer-profile/customer-profile';
import { GroomerProfile } from './groomer/pages/groomer-profile/groomer-profile';
import { GroomerSchedule } from './groomer/pages/groomer-schedule/groomer-schedule';
import { inject } from '@angular/core';
import { DataStore } from './data-store/data-store';

export const isGroomerAuthGuard: CanActivateFn = (route, state) => {
  const dataStore = inject(DataStore);
  const router = inject(Router);
  
  if( !dataStore.isLoggedIn() ) {
    return router.createUrlTree(['/']);
  }

  if( dataStore.isGroomer() ) {
    console.log("User is Groomer!");
    return true;
  }

  if( dataStore.isCustomer() ) {
    return router.createUrlTree(['/console/customer']);
  }

  return router.createUrlTree(['/']);
}

export const isCustomerAuthGuard: CanActivateFn = (route, state) => {
  const dataStore = inject(DataStore);
  const router = inject(Router);
  
  if( !dataStore.isLoggedIn() ) {
    return router.createUrlTree(['/']);
  }

  if( dataStore.isGroomer() ) {
    return router.createUrlTree(['/console/groomer']);
  }

  if( dataStore.isCustomer() ) {
    return true;
  }

  return router.createUrlTree(['/']);
}

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'groomer/add', component: GroomerDetails},
    { path: 'groomer/edit', component: GroomerDetails},
    { path: 'groomer/', component: ListGroomers},
    { path: 'service/', component: ListService},
    { path: 'booking', component: Booking},
    { path: 'booking/select-groomer', component: SelectGroomer },
    { path: 'auth', component: Login },
    { path: 'console/admin',
      component: AdminConsole,
      children: [
        { path: 'services', component: ListService },
        { path: 'groomers', component: ListGroomers },
        { path: 'groomers/add', component: GroomerDetails },
        { path: 'groomers/edit', component: GroomerDetails },
        { path: 'clients', component: ListCustomers },
        // { path: 'schedule', component: ListSchedule }
      ]
    },
    { path: 'console/groomer',
      component: GroomerConsole,
      children: [
        { path: 'profile', component: GroomerProfile },
        { path: 'schedule', component: GroomerSchedule },
      ],
      canActivate: [isGroomerAuthGuard]
    },
    { path: 'console/customer',
      component: CustomerConsole,
      children: [
        { path: 'profile', component: CustomerProfile },
        // { path: 'appointments', component: CustomerAppointments },
      ]
    }
];
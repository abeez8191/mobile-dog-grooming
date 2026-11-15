import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { ListGroomers } from './groomer/pages/list-groomers/list-groomers';
import { GroomerDetails } from './groomer/pages/groomer-details/groomer-details';
import { ListService } from './grooming-service/page/list-service/list-service';
import { SelectGroomer } from './booking/components/select-groomer/select-groomer';
import { Booking } from './booking/pages/booking/booking';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'groomer/add', component: GroomerDetails},
    { path: 'groomer/edit', component: GroomerDetails},
    { path: 'groomer/list', component: ListGroomers},
    { path: 'service/list', component: ListService},
    { path: 'booking', component: Booking},
    { path: 'booking/select-groomer', component: SelectGroomer }
];

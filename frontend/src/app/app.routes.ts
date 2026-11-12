import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { ListGroomers } from './groomer/pages/list-groomers/list-groomers';
import { GroomerDetails } from './groomer/pages/groomer-details/groomer-details';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'groomer/add', component: GroomerDetails},
    { path: 'groomer/edit', component: GroomerDetails},
    { path: 'groomer/list', component: ListGroomers},
];

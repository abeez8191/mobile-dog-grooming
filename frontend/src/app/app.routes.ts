import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { AddGroomer } from './groomer/pages/add-groomer/add-groomer';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'groomer/add', component: AddGroomer},
];

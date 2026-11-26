import { Component } from '@angular/core';
import { Console } from 'src/app/shared/components/console/console';

@Component({
  selector: 'app-customer-console',
  imports: [
    Console
  ],
  templateUrl: './customer-console.html',
  styleUrl: '../../shared/components/console/console.scss',
})
export class CustomerConsole {
  title = 'Customer Console';
  navItems = [
    {label: 'My Profile', path: 'profile'},
    {label: 'Appointments', path: 'appointments'},
  ];
}

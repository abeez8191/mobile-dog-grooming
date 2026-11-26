import { Component } from '@angular/core';
import { Console } from 'src/app/shared/components/console/console';

@Component({
  selector: 'app-admin-console',
  imports: [
    Console
  ],
  templateUrl: './admin-console.html',
  styleUrl: '../../shared/components/console/console.scss',
})
export class AdminConsole {
  title = 'Admin Console';
  navItems = [
    {label: 'Groomer List', path: 'groomers'},
    {label: 'Daily Schedule', path: 'schedule'},
    {label: 'Services', path: 'services'},
    {label: 'Clients', path: 'clients' }
  ];
}

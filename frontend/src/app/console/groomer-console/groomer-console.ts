import { Component } from '@angular/core';
import { Console } from 'src/app/shared/components/console/console';

@Component({
  selector: 'app-groomer-console',
  imports: [Console],
  templateUrl: './groomer-console.html',
  styleUrl: '../../shared/components/console/console.scss',
})
export class GroomerConsole {
  title = 'Groomer Console';
  navItems = [
    {label: 'My Profile', path: 'profile'},
    {label: 'Daily Schedule', path: 'schedule'},
  ];
}

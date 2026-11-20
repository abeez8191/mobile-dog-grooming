import { Component, inject, input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-console',
  imports: [
    MatListModule,
    RouterLinkActive,
    RouterModule,
    RouterOutlet,
  ],
  templateUrl: './console.html',
  styleUrl: './console.scss',
})
export class Console {
  activatedRoute = inject(ActivatedRoute);
  title = input.required<string>();
  navItems = input.required<{label: string, path: string}[]>();
}

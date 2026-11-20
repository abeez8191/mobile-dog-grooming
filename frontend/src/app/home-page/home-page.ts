import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [
    MatButtonModule
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  router = inject(Router);

  goToBooking(): void {
    this.router.navigate(['/booking']);
  }
}

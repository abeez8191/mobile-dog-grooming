import { MediaMatcher } from '@angular/cdk/layout';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';
import { LoginDialog } from './login-dialog/login-dialog';
import { DataStore } from './data-store/data-store';
import { AuthenticationService } from './authentication/service/authentication-service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    MatIconModule, 
    MatListModule,
    MatSidenavModule, 
    MatToolbarModule, 
    MatButtonModule,
    MatSidenavModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnDestroy {
  protected readonly title = signal('mobile_dog_grooming_frontend');
  protected readonly isMobile = signal(false);
  protected readonly isOpen = signal(false);

  readonly router = inject(Router);
  readonly dialog = inject(MatDialog);
  readonly dataStore = inject(DataStore);
  readonly authenticationService = inject(AuthenticationService);

  private readonly _mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;

  constructor() {
    const media = inject(MediaMatcher);

    this._mobileQuery = media.matchMedia('(max-width: 750px)');
    this.isMobile.set(this._mobileQuery.matches);
    this._mobileQueryListener = () =>
      this.isMobile.set(this._mobileQuery.matches);
    this._mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this._mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  toggleNavBar(): void {
    console.log(`Setting isOpen to ${!this.isOpen()}`)
    this.isOpen.set(!!!this.isOpen());
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LoginDialog);
    dialogRef.afterClosed().subscribe();
  }

  logout(): void {
    this.authenticationService.logout({key: this.dataStore.loginKey()}).subscribe({
      next: () => {
        this.dataStore.resetStore();
        this.router.navigate(['/']);
      },
      error: () => {

      }
    })
  }

  goToConsole(): void {
    if( ! this.dataStore.isLoggedIn() ) {
      return;
    }

    if( this.dataStore.isCustomer() ) {
      this.router.navigate(['/console/customer']);
    }
    else if( this.dataStore.isGroomer() ) {
      this.router.navigate(['/console/groomer']);
    }
  }
}

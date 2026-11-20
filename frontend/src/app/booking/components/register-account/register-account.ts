import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthenticationService } from 'src/app/authentication/service/authentication-service';
import { DataStore } from 'src/app/data-store/data-store';
import { BannerService } from 'src/app/shared/components/banner/banner.service';
import { LoadingButton } from 'src/app/shared/components/loading-button/loading-button';

@Component({
  selector: 'app-register-account',
  imports: [
    LoadingButton,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './register-account.html',
  styleUrl: './register-account.scss',
})
export class RegisterAccount implements OnInit {
  customerId = input.required<number>();

  readonly dataStore = inject(DataStore);
  readonly authenticationService = inject(AuthenticationService);
  readonly bannerService = inject(BannerService);

  showAccountCreation = signal(false);
  isSubmitting = signal(false);

  constructor(private fb: FormBuilder) {}

  accountCreationForm!: FormGroup;

  ngOnInit(): void {
    this.accountCreationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  createAuthentication(): void {
    if( ! this.accountCreationForm.valid ) {
      return;
    }

    this.isSubmitting.set(true);
    this.authenticationService.createCustomer({customer: 1, ...this.accountCreationForm.value}).subscribe({
      next: (response) => {
        console.log(response);
        this.isSubmitting.set(false);
      },
      error: (error) => {
        if( error.status === 400 ) {
          this.bannerService.open(
            'Email address already exists. Please log in instead.',
            {
              icon: 'warning_outline',
              warning: true,
              timeout: 10000
            }
          )
        }
        this.isSubmitting.set(false);
      }
    })
  }
}

import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthenticationService } from 'src/app/authentication/service/authentication-service';
import { DataStore } from 'src/app/data-store/data-store';
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
  authenticationService = inject(AuthenticationService);

  showAccountCreation = signal(false);
  isSubmitting = signal(false);

  constructor(private fb: FormBuilder) {}

  accountCreationForm!: FormGroup;

  ngOnInit(): void {
    this.accountCreationForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  createAuthentication(): void {
    if( ! this.accountCreationForm.valid ) {
      return;
    }

    this.isSubmitting.set(true);
    this.authenticationService.createCustomer({customer: this.customerId(), ...this.accountCreationForm.value}).subscribe({
      next: (response) => {
        console.log(response);
        this.isSubmitting.set(false);
      },
      error: (error) => {
        console.log(error);
        this.isSubmitting.set(false);
      }
    })
  }
}

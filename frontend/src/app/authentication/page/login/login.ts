import { Component, inject, OnInit, output, OutputEmitterRef, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthenticationService } from '../../service/authentication-service';
import { LoginRequest, UserInformation } from '../../model/authentication.model';
import { concatMap } from 'rxjs';
import { DataStore } from 'src/app/data-store/data-store';
import { LoadingButton } from 'src/app/shared/components/loading-button/loading-button';

@Component({
  selector: 'app-login',
  imports: [
    LoadingButton,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  login: OutputEmitterRef<void> = output();

  authenticationService = inject(AuthenticationService);
  dataStore = inject(DataStore);

  isLoading = signal(false);

  constructor(private fb: FormBuilder) {}

  loginForm!: FormGroup;
  
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  submit(): void {
    if( !this.loginForm.valid ) {
      return;
    }

    this.isLoading.set(true);

    let data: any = {};
    data.password = this.loginForm.value.password;
    
    if( this.loginForm.value.username.indexOf('@') > -1 ) {
      data.email = this.loginForm.value.username;
    }
    else {
      data.username = this.loginForm.value.username;
    }

    this.authenticationService.login(data as LoginRequest).pipe(
      concatMap((response) => {
        this.dataStore.setLoginKey(response.key);
        return this.authenticationService.getUserInformation()
      })
    ).subscribe({
      next: (userInformation: UserInformation) => {
        userInformation.customer && this.dataStore.setCustomerId(userInformation.customer);
        userInformation.groomer && this.dataStore.setGroomerId(userInformation.groomer);
        this.dataStore.setEmail(userInformation.email);
        this.login.emit();
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}

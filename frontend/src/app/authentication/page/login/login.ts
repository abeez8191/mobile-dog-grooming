import { Component, inject, OnInit, output, OutputEmitterRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthenticationService } from '../../service/authentication-service';
import { LoginRequest } from '../../model/authentication.model';

@Component({
  selector: 'app-login',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  login: OutputEmitterRef<string> = output();

  authenticationService = inject(AuthenticationService);

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

    let data: any = {};
    data.password = this.loginForm.value.password;
    
    if( this.loginForm.value.username.indexOf('@') > -1 ) {
      data.email = this.loginForm.value.username;
    }
    else {
      data.username = this.loginForm.value.username;
    }

    this.authenticationService.login(data as LoginRequest).subscribe({
      next: (response) => {
        this.login.emit(response.key);
      },
      error: (error) => {
        if( error.status === 400 ) {
          console.log("Invalid username/password combination");
        }
      }
    })
  }
}

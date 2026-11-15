import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Login } from "../authentication/page/login/login";

@Component({
  selector: 'app-login-dialog',
  templateUrl: 'login-dialog.html',
  styleUrl: 'login-dialog.scss',
  imports: [
    Login,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
  ],
})
export class LoginDialog {
  readonly dialogRef = inject(MatDialogRef<LoginDialog>);

  loginSuccess(loginKey: string): void {
    this.dialogRef.close({loginKey});
  }
}
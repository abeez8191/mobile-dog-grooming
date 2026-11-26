import { Component, input, InputSignal, OnInit } from '@angular/core';
import { MatButtonAppearance, MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-button',
  imports: [
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './loading-button.html',
  styleUrl: './loading-button.scss',
})
export class LoadingButton {
  isLoading = input(false);
  type: InputSignal<MatButtonAppearance> = input('filled' as MatButtonAppearance);
}

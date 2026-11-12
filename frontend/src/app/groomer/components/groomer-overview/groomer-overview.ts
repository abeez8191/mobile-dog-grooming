import { Component, inject, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { Groomer } from '../../model/groomer.model';
import { MatButtonModule } from '@angular/material/button';
import { GroomerService } from '../../service/groomer-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-groomer-overview',
  imports: [MatButtonModule],
  templateUrl: './groomer-overview.html',
  styleUrl: './groomer-overview.scss',
})
export class GroomerOverview {
  readonly g: InputSignal<Groomer|undefined> = input<Groomer>(undefined, {alias: 'groomer'});
  readonly delete: OutputEmitterRef<void> = output<void>();

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  private groomerService = inject(GroomerService);

  deleteGroomer(): void {
    this.groomerService.deleteGroomer(this.g()!.id!).subscribe({
      next: () => {
        this.delete.emit();
      },
      error: () => {}
    });
  }

  editGroomer(): void {
    this.router.navigate(['../edit'], {state: {id: this.g()!.id!}, relativeTo: this.activatedRoute});
  }
}

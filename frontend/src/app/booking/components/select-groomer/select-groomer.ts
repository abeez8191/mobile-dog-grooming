import { Component, inject, OnInit, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { GroomerService } from 'src/app/groomer/service/groomer-service';
import { PublicGroomer } from 'src/app/groomer/model/groomer.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-select-groomer',
  imports: [
    MatButtonModule
  ],
  templateUrl: './select-groomer.html',
  styleUrl: './select-groomer.scss',
})
export class SelectGroomer implements OnInit {
  private readonly groomerService = inject(GroomerService);
  select: OutputEmitterRef<number> = output();

  groomers: WritableSignal<PublicGroomer[]> = signal([]);

  ngOnInit(): void {
    this.groomerService.getPublicGroomers().subscribe({
      next: (groomers) => {
        this.groomers.set(groomers);
      }
    });
  }

  selectGroomer(id: number): void {
    this.select.emit(id);
  }
}

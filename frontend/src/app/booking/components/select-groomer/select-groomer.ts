import { Component, inject, OnInit, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { GroomerService } from 'src/app/groomer/service/groomer-service';
import { PublicGroomer } from 'src/app/groomer/model/groomer.model';
import { MatButtonModule } from '@angular/material/button';
import { BannerService } from 'src/app/shared/components/banner/banner.service';

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
  private readonly bannerService = inject(BannerService);
  
  select: OutputEmitterRef<number> = output();

  groomers: WritableSignal<PublicGroomer[]> = signal([]);

  ngOnInit(): void {
    this.groomerService.getPublicGroomers().subscribe({
      next: (groomers) => {
        this.groomers.set(groomers);
      },
      error: (error) => {
        this.bannerService.open(
          'Unable to retrieve available groomers. Please try again later.',
          {
            icon: 'warning_outline',
            warning: true,
            timeout: 10000
          }
        )
      }
    });
  }

  selectGroomer(id: number): void {
    this.select.emit(id);
  }
}

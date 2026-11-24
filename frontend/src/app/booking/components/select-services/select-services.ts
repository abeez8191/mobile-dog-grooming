import { Component, inject, OnInit, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { ServicesService } from 'src/app/grooming-service/service/services-service';
import { Service } from 'src/app/grooming-service/model/services.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BannerService } from 'src/app/shared/components/banner/banner.service';

@Component({
  selector: 'app-select-services',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './select-services.html',
  styleUrl: './select-services.scss',
})
export class SelectServices implements OnInit{
  servicesService = inject(ServicesService);
  select: OutputEmitterRef<Service[]> = output();
  back: OutputEmitterRef<void> = output();
  
  bannerService = inject(BannerService);

  isLoading = signal(true);
  services: WritableSignal<Service[]> = signal([]);
  selectedServices: WritableSignal<Service[]> = signal([]);

  ngOnInit(): void {
    this.servicesService.getServices().subscribe({
      next: (services: Service[]) => {
        this.isLoading.set(false);
        this.services.set(services);
      }
    });
  }

  addService(service: Service): void {
    this.selectedServices.update(snapshot => snapshot.concat(service))
  }

  removeService(service: Service): void {
    var snapshot = this.selectedServices();
    const index = snapshot.findIndex(s => s.id === service.id);
    if( index > -1 ) {
      this.selectedServices.set(snapshot.toSpliced(index, 1));
    }
  }

  next(): void {
    if( this.selectedServices().length > 0 ) {
      this.select.emit(this.selectedServices());
    }
    else {
      this.bannerService.open("Please select a service before continuing.", {
        icon: 'warning_outlined',
        warning: true,
        timeout: 10000
      });
    }
  }

  previous(): void {
    this.back.emit();
  }
}

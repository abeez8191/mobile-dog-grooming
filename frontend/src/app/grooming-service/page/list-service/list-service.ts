import { Component, inject, OnInit, signal } from '@angular/core';
import { ServicesService } from '../../service/services-service';
import { Service } from '../../model/services.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list-service',
  imports: [
    MatButtonModule, 
    MatFormFieldModule, 
    MatIconModule, 
    MatInputModule, 
    MatTableModule,
    ReactiveFormsModule
  ],
  templateUrl: './list-service.html',
  styleUrl: './list-service.scss',
})
export class ListService implements OnInit{
  servicesService = inject(ServicesService);

  services = signal<Service[]>([]);
  editingIndex = signal(-1);

  serviceForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.serviceForm = this.resetForm();
  }

  displayedColumns: string[] = ['name', 'price', 'duration', 'actions'];

  ngOnInit(): void {
    this.servicesService.getServices().subscribe({
      next: (services: Service[]) => {
        this.services.set(services);
      }
    });
  }

  addService(): void {
    this.serviceForm = this.resetForm();
    this.services.update(snapshot => snapshot.concat({duration: 0, name: "", price: 0}));
    this.editingIndex.set(this.services().length - 1)

    console.log(`Editing index: ${this.editingIndex()}`)
  }

  resetForm(service?: Service): FormGroup {
    return this.fb.group({
      name:     [service ? service.name : '', [Validators.required]],
      price:    [service ? service.price : 0,  [Validators.min(0), Validators.required]],
      duration: [service ? service.duration : 0,  [Validators.min(0), Validators.max(240), Validators.required]]
    });
  }

  deleteService(id: number): void {
    this.servicesService.deleteService(id).subscribe({
      next: () => {
        const index = this.services().findIndex((service) => service.id === id);
        this.removeServiceAtIndex(index);
      }
    });
  }

  cancelEdit(id?: number): void {
    if( !id ) {
      // Cancel an add
      this.removeServiceAtIndex(this.editingIndex());
    }
    this.editingIndex.set(-1);
    console.log("Done cancelling edit");
  }

  editService(index: number): void {
    this.editingIndex.set(index);
    this.serviceForm = this.resetForm(this.services()[index]);
  }

  saveService(id?: number): void {
    if( !this.serviceForm?.valid ) {
      console.log("Service form is not valid");
      return;
    }

    let observable: Observable<Service>;
    if( id ) {
      observable = this.servicesService.updateService({id, ...this.serviceForm?.value});
    }
    else {
      observable = this.servicesService.addService(this.serviceForm!.value);
    }

    observable.subscribe({
        next: (service: Service) => {
          this.services.update(snapshot => snapshot.with(this.editingIndex(), service));
          this.editingIndex.set(-1);
        },
        error: () => {
          console.log("Error while adding/updating")
        }
      });
  }

  removeServiceAtIndex(index: number): void {
    if( index >= 0 ) {
      let snapshot = this.services();
      snapshot = snapshot.toSpliced(index, 1);
      this.services.set(snapshot);
    }
  }
}

import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { GroomerService } from '../../service/groomer-service';
import { Groomer } from '../../model/groomer.model';
import { GroomerOverview } from '../../components/groomer-overview/groomer-overview';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-list-groomers',
  imports: [GroomerOverview, MatButtonModule, MatIconModule],
  templateUrl: './list-groomers.html',
  styleUrl: './list-groomers.scss',
})
export class ListGroomers implements OnInit{
  private groomerService = inject(GroomerService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  groomers: WritableSignal<Groomer[]> = signal([]);

  ngOnInit(): void {
    this.groomerService.getGroomers().subscribe({
      next: (groomerList: Groomer[]) => {
        this.groomers.set(groomerList);
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  addGroomer(): void {
    this.router.navigate(['../add'], {relativeTo: this.activatedRoute})
  }

  removeGroomer(id: number): void {
    const index = this.groomers().findIndex((groomer: Groomer) => groomer.id === id );
    const snapshot = this.groomers();
    snapshot.splice(index, 1);
    this.groomers.set(snapshot);
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListService } from './list-service';

describe('ListService', () => {
  let component: ListService;
  let fixture: ComponentFixture<ListService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListService],
    }).compileComponents();

    fixture = TestBed.createComponent(ListService);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

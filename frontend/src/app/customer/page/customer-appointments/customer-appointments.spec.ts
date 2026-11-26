import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAppointments } from './customer-appointments';

describe('CustomerAppointments', () => {
  let component: CustomerAppointments;
  let fixture: ComponentFixture<CustomerAppointments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerAppointments],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerAppointments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

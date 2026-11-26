import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerInformation } from './customer-information';

describe('CreateCustomer', () => {
  let component: CustomerInformation;
  let fixture: ComponentFixture<CustomerInformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerInformation],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerInformation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

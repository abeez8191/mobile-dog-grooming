import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerConsole } from './customer-console';

describe('CustomerConsole', () => {
  let component: CustomerConsole;
  let fixture: ComponentFixture<CustomerConsole>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerConsole],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerConsole);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

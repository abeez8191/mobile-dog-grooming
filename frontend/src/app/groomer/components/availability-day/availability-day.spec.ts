import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityDay } from './availability-day';

describe('AvailabilityDay', () => {
  let component: AvailabilityDay;
  let fixture: ComponentFixture<AvailabilityDay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailabilityDay],
    }).compileComponents();

    fixture = TestBed.createComponent(AvailabilityDay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroomerSchedule } from './groomer-schedule';

describe('GroomerSchedule', () => {
  let component: GroomerSchedule;
  let fixture: ComponentFixture<GroomerSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroomerSchedule],
    }).compileComponents();

    fixture = TestBed.createComponent(GroomerSchedule);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

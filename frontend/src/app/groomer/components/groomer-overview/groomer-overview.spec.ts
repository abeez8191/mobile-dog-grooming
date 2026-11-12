import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroomerOverview } from './groomer-overview';

describe('GroomerOverview', () => {
  let component: GroomerOverview;
  let fixture: ComponentFixture<GroomerOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroomerOverview],
    }).compileComponents();

    fixture = TestBed.createComponent(GroomerOverview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroomerDetails } from './groomer-details';

describe('AddGroomer', () => {
  let component: GroomerDetails;
  let fixture: ComponentFixture<GroomerDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroomerDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(GroomerDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

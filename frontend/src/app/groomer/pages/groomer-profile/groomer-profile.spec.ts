import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroomerProfile } from './groomer-profile';

describe('GroomerProfile', () => {
  let component: GroomerProfile;
  let fixture: ComponentFixture<GroomerProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroomerProfile],
    }).compileComponents();

    fixture = TestBed.createComponent(GroomerProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

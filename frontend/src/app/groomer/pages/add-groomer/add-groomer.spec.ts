import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroomer } from './add-groomer';

describe('AddGroomer', () => {
  let component: AddGroomer;
  let fixture: ComponentFixture<AddGroomer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddGroomer],
    }).compileComponents();

    fixture = TestBed.createComponent(AddGroomer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

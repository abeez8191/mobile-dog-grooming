import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectGroomer } from './select-groomer';

describe('SelectGroomer', () => {
  let component: SelectGroomer;
  let fixture: ComponentFixture<SelectGroomer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectGroomer],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectGroomer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

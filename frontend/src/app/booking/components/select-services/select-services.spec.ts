import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectServices } from './select-services';

describe('SelectServices', () => {
  let component: SelectServices;
  let fixture: ComponentFixture<SelectServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectServices],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectServices);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

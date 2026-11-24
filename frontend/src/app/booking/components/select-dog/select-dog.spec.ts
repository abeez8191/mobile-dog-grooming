import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDog } from './select-dog';

describe('SelectDog', () => {
  let component: SelectDog;
  let fixture: ComponentFixture<SelectDog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectDog],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectDog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

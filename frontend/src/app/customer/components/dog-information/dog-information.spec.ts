import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DogInformation } from './dog-information';

describe('DogInformation', () => {
  let component: DogInformation;
  let fixture: ComponentFixture<DogInformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DogInformation],
    }).compileComponents();

    fixture = TestBed.createComponent(DogInformation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

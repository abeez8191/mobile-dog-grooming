import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoSelector } from './photo-selector';

describe('PhotoSelector', () => {
  let component: PhotoSelector;
  let fixture: ComponentFixture<PhotoSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoSelector],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoSelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

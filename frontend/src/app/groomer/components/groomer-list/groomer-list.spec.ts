import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroomerList } from './groomer-list';

describe('GroomerList', () => {
  let component: GroomerList;
  let fixture: ComponentFixture<GroomerList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroomerList],
    }).compileComponents();

    fixture = TestBed.createComponent(GroomerList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

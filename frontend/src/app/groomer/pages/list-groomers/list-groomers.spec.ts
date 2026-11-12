import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGroomers } from './list-groomers';

describe('ListGroomers', () => {
  let component: ListGroomers;
  let fixture: ComponentFixture<ListGroomers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListGroomers],
    }).compileComponents();

    fixture = TestBed.createComponent(ListGroomers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

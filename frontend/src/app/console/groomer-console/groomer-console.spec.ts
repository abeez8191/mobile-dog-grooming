import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroomerConsole } from './groomer-console';

describe('GroomerConsole', () => {
  let component: GroomerConsole;
  let fixture: ComponentFixture<GroomerConsole>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroomerConsole],
    }).compileComponents();

    fixture = TestBed.createComponent(GroomerConsole);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

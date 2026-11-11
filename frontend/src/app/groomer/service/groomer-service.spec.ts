import { TestBed } from '@angular/core/testing';

import { GroomerService } from './groomer-service';

describe('GroomerService', () => {
  let service: GroomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

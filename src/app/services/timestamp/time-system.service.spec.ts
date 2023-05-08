import { TestBed } from '@angular/core/testing';

import { TimeSystemService } from './time-system.service';

describe('TimeSystemService', () => {
  let service: TimeSystemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeSystemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

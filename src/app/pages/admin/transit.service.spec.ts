import { TestBed } from '@angular/core/testing';

import { TransitService } from './transit.service';

describe('TransitService', () => {
  let service: TransitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

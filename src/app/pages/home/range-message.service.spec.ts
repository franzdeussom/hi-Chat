import { TestBed } from '@angular/core/testing';

import { RangeMessageService } from './range-message.service';

describe('RangeMessageService', () => {
  let service: RangeMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RangeMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

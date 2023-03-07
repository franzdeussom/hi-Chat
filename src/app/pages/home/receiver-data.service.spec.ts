import { TestBed } from '@angular/core/testing';

import { ReceiverDataService } from './receiver-data.service';

describe('ReceiverDataService', () => {
  let service: ReceiverDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceiverDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

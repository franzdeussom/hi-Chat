import { TestBed } from '@angular/core/testing';

import { GetAllMessageService } from './get-all-message.service';

describe('GetAllMessageService', () => {
  let service: GetAllMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetAllMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

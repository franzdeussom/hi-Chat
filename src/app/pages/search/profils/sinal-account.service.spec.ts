import { TestBed } from '@angular/core/testing';

import { SinalAccountService } from './sinal-account.service';

describe('SinalAccountService', () => {
  let service: SinalAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SinalAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

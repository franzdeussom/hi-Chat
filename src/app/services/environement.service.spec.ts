import { TestBed } from '@angular/core/testing';

import { EnvironementService } from './environement.service';

describe('EnvironementService', () => {
  let service: EnvironementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnvironementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { PathPpService } from './path-pp.service';

describe('PathPpService', () => {
  let service: PathPpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PathPpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

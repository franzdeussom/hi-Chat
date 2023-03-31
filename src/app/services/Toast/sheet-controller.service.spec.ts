import { TestBed } from '@angular/core/testing';

import { SheetControllerService } from './sheet-controller.service';

describe('SheetControllerService', () => {
  let service: SheetControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SheetControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

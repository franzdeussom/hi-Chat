import { TestBed } from '@angular/core/testing';

import { ToastAppService } from './toast-app.service';

describe('ToastAppService', () => {
  let service: ToastAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

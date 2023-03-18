import { TestBed } from '@angular/core/testing';

import { GetNotificationService } from './get-notification.service';

describe('GetNotificationService', () => {
  let service: GetNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

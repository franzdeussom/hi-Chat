import { TestBed } from '@angular/core/testing';

import { CryptAndDecryptMessage } from './encrytDecrypt.service';

describe('SendMessageService', () => {
  let service: CryptAndDecryptMessage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptAndDecryptMessage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

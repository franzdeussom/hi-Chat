import { TestBed } from '@angular/core/testing';

import { TmpCommentService } from './tmp-comment.service';

describe('TmpCommentService', () => {
  let service: TmpCommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TmpCommentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

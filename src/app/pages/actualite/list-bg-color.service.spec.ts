import { TestBed } from '@angular/core/testing';

import { ListBgColorService } from './list-bg-color.service';

describe('ListBgColorService', () => {
  let service: ListBgColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListBgColorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

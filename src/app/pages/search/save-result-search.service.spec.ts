import { TestBed } from '@angular/core/testing';

import { SaveResultSearchService } from './save-result-search.service';

describe('SaveResultSearchService', () => {
  let service: SaveResultSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveResultSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

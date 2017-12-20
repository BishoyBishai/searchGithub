import { TestBed, inject } from '@angular/core/testing';

import { CacheSearchService } from './cache-search.service';

describe('CacheSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CacheSearchService]
    });
  });

  it('should be created', inject([CacheSearchService], (service: CacheSearchService) => {
    expect(service).toBeTruthy();
  }));
});

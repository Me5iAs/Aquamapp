import { TestBed } from '@angular/core/testing';

import { GQueryService } from './g-query.service';

describe('GQueryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GQueryService = TestBed.get(GQueryService);
    expect(service).toBeTruthy();
  });
});

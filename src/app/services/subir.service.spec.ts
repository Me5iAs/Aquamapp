import { TestBed } from '@angular/core/testing';

import { SubirService } from './subir.service';

describe('SubirService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubirService = TestBed.get(SubirService);
    expect(service).toBeTruthy();
  });
});

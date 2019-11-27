import { TestBed } from '@angular/core/testing';

import { SchemalistService } from './schemalist.service';

describe('SchemalistService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SchemalistService = TestBed.get(SchemalistService);
    expect(service).toBeTruthy();
  });
});

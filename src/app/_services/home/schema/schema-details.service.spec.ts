import { TestBed } from '@angular/core/testing';

import { SchemaDetailsService } from './schema-details.service';

describe('SchemaDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SchemaDetailsService = TestBed.get(SchemaDetailsService);
    expect(service).toBeTruthy();
  });
});

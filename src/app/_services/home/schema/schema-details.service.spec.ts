import { TestBed } from '@angular/core/testing';

import { SchemaDetailsService } from './schema-details.service';
import { HttpClientModule } from '@angular/common/http';

describe('SchemaDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule]
  }));

  it('should be created', () => {
    const service: SchemaDetailsService = TestBed.inject(SchemaDetailsService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { SchemaService } from './schema.service';
import { HttpClientModule } from '@angular/common/http';

describe('SchemaService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule]
  }));

  it('should be created', () => {
    const service: SchemaService = TestBed.get(SchemaService);
    expect(service).toBeTruthy();
  });
});

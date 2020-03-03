import { TestBed } from '@angular/core/testing';

import { SchemaExecutionService } from './schema-execution.service';
import { HttpClientModule } from '@angular/common/http';

describe('SchemaExecutionService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule]
  }));

  it('should be created', () => {
    const service: SchemaExecutionService = TestBed.inject(SchemaExecutionService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { Any2tsService } from './any2ts.service';

describe('Any2tsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Any2tsService = TestBed.inject(Any2tsService);
    expect(service).toBeTruthy();
  });
});

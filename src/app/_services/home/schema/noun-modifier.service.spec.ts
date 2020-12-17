import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { NounModifierService } from './noun-modifier.service';

describe('NounModifierService', () => {
  let service: NounModifierService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(NounModifierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

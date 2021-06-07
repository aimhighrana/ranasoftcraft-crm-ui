import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { TestBed } from '@angular/core/testing';

import { UdrCdktreeService } from './udr-cdktree.service';

describe('UdrCdktreeService', () => {
  let service: UdrCdktreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UdrCdktreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

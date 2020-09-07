import { TestBed } from '@angular/core/testing';

import { GlobaldialogService } from './globaldialog.service';

describe('GlobaldialogService', () => {
  let service: GlobaldialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobaldialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

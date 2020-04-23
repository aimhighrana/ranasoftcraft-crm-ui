import { TestBed } from '@angular/core/testing';

import { WidgetService } from './widget.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('WidgetService', () => {
  let service: WidgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]});
    service = TestBed.inject(WidgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

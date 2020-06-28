import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { WorkflowBuilderService } from './workflow-builder.service';


describe('WorkflowBuilderService', () => {
  let service: WorkflowBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports : [HttpClientTestingModule]
    });
    service = TestBed.inject(WorkflowBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

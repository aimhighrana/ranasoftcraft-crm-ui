import { TestBed } from '@angular/core/testing';

import { EndpointsProcessService } from './endpoints-process.service';

describe('EndpointsProcessService', () => {
  let service: EndpointsProcessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EndpointsProcessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getInboxNodesCountUrl', () => {
    expect(service.getInboxNodesCountUrl()).toContain('process/feed/count');
  });

  it('saveTasklistVisitByUserUrl', () => {
    expect(service.saveTasklistVisitByUserUrl('inbox')).toContain('process/feed/visit/inbox');
  });
});

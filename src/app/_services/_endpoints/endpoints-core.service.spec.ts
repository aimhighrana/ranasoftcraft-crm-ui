import { TestBed } from '@angular/core/testing';

import { EndpointsCoreService } from './endpoints-core.service';

describe('EndpointsCoreService', () => {
  let service: EndpointsCoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EndpointsCoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getAllObjectTypeUrl', () => {
    expect(service.getAllObjectTypeUrl()).toContain('/metadata/get-all-objecttype');
  });

  it('should getAllFieldsForViewUrl', () => {
    expect(service.getAllFieldsForViewUrl()).toContain('/metadata/list-view-fields');
  });

});

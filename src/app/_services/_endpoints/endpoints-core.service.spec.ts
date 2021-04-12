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
    expect(service.getAllFieldsForViewUrl('1005')).toContain('/metadata/list-view-all-fields/1005');
  });

  it('should getObjectTypeDetailsUrl', () => {
    expect(service.getObjectTypeDetailsUrl('1005')).toContain('/metadata/get-module-desc/1005');
  });

});

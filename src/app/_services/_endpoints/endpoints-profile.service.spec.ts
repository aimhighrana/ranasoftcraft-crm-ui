import { TestBed } from '@angular/core/testing';

import { EndpointsProfileService } from './endpoints-profile.service';

describe('EndpointsProfileService', () => {
  let service: EndpointsProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EndpointsProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getPersonalDetails', () => {
    expect(service.getPersonalDetails()).toContain('/get-personal-details');
  });

  it('should updatePersonalDetails', () => {
    expect(service.updatePersonalDetails()).toContain('/save-personal-details');
  });
});

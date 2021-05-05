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

  it('should getUserPreferenceDetails', () => {
    expect(service.getUserPreferenceDetails()).toContain('/get-user-pref');
  });

  it('should updateUserPreferenceDetails', () => {
    expect(service.updateUserPreferenceDetails()).toContain('/save-user-pref');
  });

  it('should getAllLanguagesList', () => {
    expect(service.getAllLanguagesList()).toContain('/get-all-languages');
  });

  it('should getDateFormatList', () => {
    expect(service.getDateFormatList()).toContain('/get-date-format');
  });

  it('should getNumberFormatList', () => {
    expect(service.getNumberFormatList()).toContain('/get-number-format');
  });
});
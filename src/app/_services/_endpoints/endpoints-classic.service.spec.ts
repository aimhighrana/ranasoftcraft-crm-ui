import { async, inject, TestBed } from '@angular/core/testing';

import { EndpointsClassicService } from './endpoints-classic.service';

describe('EndpointsClassicService', () => {

  beforeEach(() => {
    const endPointProvider = jasmine.createSpyObj('EndpointsClassicService', ['onLoadSchema']);
    TestBed.configureTestingModule({
      providers: [
        { provide: EndpointsClassicService, useValue: endPointProvider }
      ]
    });
  });

  it('should be created', inject([EndpointsClassicService], (service: EndpointsClassicService) => {
    expect(service).toBeTruthy();
  }));

  it('onLoadSchema(),should load schema', async(() => {
    const serObj = new EndpointsClassicService();
    expect(serObj.onLoadSchema()).toContain('restSchemaLogs');
  }));

  it('getCreateNounModUrl(),should return create noun url', async(() => {
    const serObj =new EndpointsClassicService();
    expect(serObj.getCreateNounModUrl()).toContain('create-noun');
  }));

  it('getCreateAttributeUrl(), should return create-attribute url', async(() => {
    const serObj =new EndpointsClassicService();
    expect(serObj.getCreateAttributeUrl('17021')).toContain('add-attributes/17021');
  }));

  it('getSaveAttributesMappingUrl(),should return save-mappings url', async(() => {
    const serObj =new EndpointsClassicService();
    expect(serObj.getSaveAttributesMappingUrl()).toContain('save-mappings');
  }));

  it('getFetchAttributesMappingUrl(),should return getFetchAttributesMapping url', async(() => {
    const serObj =new EndpointsClassicService();
    expect(serObj.getFetchAttributesMappingUrl()).toContain('get-mappings');
  }));

  it('getAvailableNounsUri(),should return getAvailableNounsUri url', async(() => {
    const serObj =new EndpointsClassicService();
    expect(serObj.getAvailableNounsUri()).toContain('mro/noun');
  }));

  it('getAvailableModifierUri(),should return getAvailableModifierUri url', async(() => {
    const serObj =new EndpointsClassicService();
    expect(serObj.getAvailableModifierUri()).toContain('mro/modifier');
  }));

  it('getAvailableAttributeUri(),should return getAvailableAttributeUri url', async(() => {
    const serObj =new EndpointsClassicService();
    expect(serObj.getAvailableAttributeUri()).toContain('mro/attribute');
  }));

  it('approveClassificationUri(),should return approveClassification url', async(() => {
    const serObj =new EndpointsClassicService();
    expect(serObj.approveClassificationUri()).toContain('mro/approve');
  }));

  it('rejectClassificationUri(),should return rejectClassification url', async(() => {
    const serObj =new EndpointsClassicService();
    expect(serObj.rejectClassificationUri()).toContain('mro/reset');
  }));

  it('doClassificationCorrectionUri(),should return doClassificationCorrectionUri url', async(() => {
    const serObj =new EndpointsClassicService();
    expect(serObj.doClassificationCorrectionUri()).toContain('schema/do-mro-correction');
  }));

  it('masterRecordChangeUrl(),should return masterRecordChangeUrl url', async(() => {
    const serObj =new EndpointsClassicService();
    expect(serObj.masterRecordChangeUrl()).toContain('duplicate/updatemasterRecord');
  }));

});

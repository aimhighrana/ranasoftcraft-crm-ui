import { TestBed, inject, async } from '@angular/core/testing';

import { EndpointService } from './endpoint.service';

describe('EndpointService', () => {
  beforeEach(() => {
    const endPointProvider = jasmine.createSpyObj('EndpointService',['getAllUnselectedFields']);
    TestBed.configureTestingModule({
      providers: [
        {provide:EndpointService, useValue:endPointProvider}
      ]
    });
  });

  it('should be created', inject([EndpointService], (service: EndpointService) => {
    expect(service).toBeTruthy();
  }));

  it('getAllUnselectedFields(), should return the unselected url', async(() =>{
      const serObj = new EndpointService();
      expect(serObj.getAllSelectedFields()).toContain('/schema/get-unselected-fields');
  }));

  it('getSchemaBrInfoList(), should return the schema br information list url', async(() =>{
    const serObj = new EndpointService();
    expect(serObj.getSchemaBrInfoList('28364872686186')).toContain('schema/schema-br-infolist/28364872686186');
  }));

  it('doCorrectionUrl(), should return the schema do correction url', async(() =>{
    const serObj = new EndpointService();
    expect(serObj.doCorrectionUrl('28364872686186')).toContain('schema/do-correction/28364872686186');
  }));

  it('getSchemaExecutionLogUrl(), should return the schema execution logs  url', async(() =>{
    const serObj = new EndpointService();
    expect(serObj.getSchemaExecutionLogUrl('28364872686186')).toContain('schema/get-execution-logs/28364872686186');
  }));

});
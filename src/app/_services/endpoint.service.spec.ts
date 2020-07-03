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

  it('uploadFileDataUrl(), should return the upload file data   url', async(() =>{
    const serObj = new EndpointService();
    expect(serObj.uploadFileDataUrl()).toContain('schema/upload-file');
  }));

  it('uploadDataUrl(), should return the upload  data   url', async(() =>{
    const serObj = new EndpointService();
    expect(serObj.uploadDataUrl('1005','1234')).toContain('schema/upload-data/1005/1234');
  }));

  it('getSchemaStatusUrl(), should return the schema status url', async(() =>{
    const serObj = new EndpointService();
    expect(serObj.getSchemaStatusUrl()).toContain('schema/schema-status');
  }));

  it('getDynamicColumnListsUrl(), should return the listmetadata url', async(() =>{
    const serObj = new EndpointService();
    expect(serObj.getDynamicColumnListsUrl()).toContain('/listPage/listmetadata');
  }));

  it('getDynamicFiltermetaListsUrl(), should return the FilterMeta field url', async(() =>{
    const serObj = new EndpointService();
    expect(serObj.getDynamicFiltermetaListsUrl()).toContain('/listPage/getFilterMetaField');
  }));

  it('docCountUrl(), should return the get doc count url', async(() =>{
    const serObj = new EndpointService();
    const objType = '1005';
    expect(serObj.docCountUrl(objType)).toContain(`report/record-count/${objType}`, `report/record-count/${objType}  sould be return!`);
  }));

  it('deleteCollaboratorUrl(), should return the delete url', async(() =>{
    const serObj = new EndpointService();
    const permisionId  = '243787235';
    expect(serObj.deleteCollaboratorUrl(permisionId)).toContain(`admin/permission/collaborator/delete/${permisionId}`, `admin/permission/collaborator/delete/${permisionId}  sould be return!`);
  }));

  it('deleteConditionBlock(), should return the delete condition  url', async(() =>{
    const serObj = new EndpointService();
    const blockId  = '243787235';
    expect(serObj.deleteConditionBlock(blockId)).toContain(`schema/br/udr/delete-conditionblock/${blockId}`);
  }));

});
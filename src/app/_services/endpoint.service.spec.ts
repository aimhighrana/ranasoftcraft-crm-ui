import { TestBed, inject, async } from '@angular/core/testing';

import { EndpointService } from './endpoint.service';
import { TaskListSummaryRequestParams, CommonGridRequestObject } from '@models/task-list/taskListDetails';

describe('EndpointService', () => {
  beforeEach(() => {
    const endPointProvider = jasmine.createSpyObj('EndpointService', ['getAllUnselectedFields']);
    TestBed.configureTestingModule({
      providers: [
        { provide: EndpointService, useValue: endPointProvider }
      ]
    });
  });

  it('should be created', inject([EndpointService], (service: EndpointService) => {
    expect(service).toBeTruthy();
  }));

  it('getAllUnselectedFields(), should return the unselected url', async(() => {
    const serObj = new EndpointService();
    expect(serObj.getAllSelectedFields()).toContain('/schema/get-unselected-fields');
  }));

  it('getSchemaBrInfoList(), should return the schema br information list url', async(() => {
    const serObj = new EndpointService();
    expect(serObj.getSchemaBrInfoList('28364872686186')).toContain('schema/schema-br-infolist/28364872686186');
  }));

  it('doCorrectionUrl(), should return the schema do correction url', async(() => {
    const serObj = new EndpointService();
    expect(serObj.doCorrectionUrl('28364872686186')).toContain('schema/do-correction/28364872686186');
  }));

  it('getSchemaExecutionLogUrl(), should return the schema execution logs  url', async(() => {
    const serObj = new EndpointService();
    expect(serObj.getSchemaExecutionLogUrl('28364872686186')).toContain('schema/get-execution-logs/28364872686186');
  }));

  it('uploadFileDataUrl(), should return the upload file data   url', async(() => {
    const serObj = new EndpointService();
    expect(serObj.uploadFileDataUrl()).toContain('schema/upload-file');
  }));

  it('uploadDataUrl(), should return the upload  data   url', async(() => {
    const serObj = new EndpointService();
    expect(serObj.uploadDataUrl('1005', '1234')).toContain('schema/upload-data/1005/1234');
  }));

  it('getSchemaStatusUrl(), should return the schema status url', async(() => {
    const serObj = new EndpointService();
    expect(serObj.getSchemaStatusUrl()).toContain('schema/schema-status');
  }));

  it('getDynamicColumnListsUrl(), should return the listmetadata url', async(() => {
    const serObj = new EndpointService();
    expect(serObj.getDynamicColumnListsUrl()).toContain('/listPage/listmetadata');
  }));

  it('getDynamicFiltermetaListsUrl(), should return the FilterMeta field url', async(() => {
    const serObj = new EndpointService();
    expect(serObj.getDynamicFiltermetaListsUrl()).toContain('/listPage/getFilterMetaField');
  }));

  it('docCountUrl(), should return the get doc count url', async(() => {
    const serObj = new EndpointService();
    const objType = '1005';
    expect(serObj.docCountUrl(objType)).toContain(`report/record-count/${objType}`, `report/record-count/${objType}  sould be return!`);
  }));

  it('deleteCollaboratorUrl(), should return the delete url', async(() => {
    const serObj = new EndpointService();
    const permisionId = '243787235';
    expect(serObj.deleteCollaboratorUrl(permisionId)).toContain(`admin/permission/collaborator/delete/${permisionId}`, `admin/permission/collaborator/delete/${permisionId}  sould be return!`);
  }));

  it('deleteConditionBlock(), should return the delete condition  url', async(() => {
    const serObj = new EndpointService();
    const blockId = '243787235';
    expect(serObj.deleteConditionBlock(blockId)).toContain(`schema/br/udr/delete-conditionblock/${blockId}`);
  }));

  it('should call getTaskListCountURL(), should return task list count URL', () => {
    const serObj = new EndpointService();
    expect(serObj.getTaskListCountURL()).toContain('tasklist/getTaskListCount');
  })

  it('it should call getTaskListViewsUrl() and return formatted URL', () => {
    const serviceobj = new EndpointService();
    const userName = 'DemoApp';
    expect(serviceobj.getTaskListViewsUrl(userName)).toContain(`tasklist/getTaskListViews?userCreated=${userName}`)
  });

  it('it should call getDeleteTaskListViewUrl() and return formatted URL', () => {
    const serviceobj = new EndpointService();
    const viewId = '1234';
    expect(serviceobj.getDeleteTaskListViewUrl(viewId)).toContain(`tasklist/deleteTaskListView?viewId=${viewId}`)
  });

  it('it should call getSaveTaskListViewUrl() and return formatted URL', () => {
    const serviceobj = new EndpointService();
    expect(serviceobj.getSaveTaskListViewUrl()).toContain(`tasklist/taskListUserView`);
  });

  it('it should call getSaveTaskListURL() and return formatted URL', () => {
    const serviceobj = new EndpointService();
    expect(serviceobj.getSaveTaskListURL()).toContain(`tasklist/taskListUserView`);
  });

  it('should call getTaskSummaryMetaDataURL()', () => {
    const serviceobj = new EndpointService();
    const requestObject: TaskListSummaryRequestParams = {
      plantCode: '123',
      userRole: '12456890',
      userId: 'DemoApp',
      lang: 'en',
      taskId: '1234567890',
      wfId: '0987654321',
      objectnumber: '0101010101',
      objecttype: '0101010101',
      eventCode: '0101010101',
    }
    expect(serviceobj.getTaskSummaryMetaDataURL(requestObject)).toContain(`/layout/getLayoutMetaData/${requestObject.objectnumber}/${requestObject.objecttype}/${5}?plantCode=${requestObject.plantCode}&userRole=${requestObject.userRole}&taskId=${requestObject.taskId}&userId=${requestObject.userId}&wfId=${requestObject.taskId}&lang=${requestObject.lang}`);
  })

  it('should call getTaskSummaryLayoutDataURL()', () => {
    const serviceobj = new EndpointService();
    const wfid = 'ERSA2528';
    const eventCode = '1005'
    const lang = 'en'

    expect(serviceobj.getTaskSummaryLayoutDataURL(wfid, eventCode, lang)).toContain(`layoutData/getLayoutData/${wfid}/${eventCode}?lang=${lang}`);
  });

  it('should call getAuditTrailLogsURL()', () => {
    const serviceobj = new EndpointService();
    expect(serviceobj.getAuditTrailLogsURL()).toContain(`changeAuditLog/getChangeAuditLog`)
  });

  it('should call getGridDataURL()', () => {
    const serviceobj = new EndpointService();
    const gridRequestParams: CommonGridRequestObject = {
      objecttype: '123abcd',
      tabCode: '123',
      eventCode: '123',
      plantCode: 'MDO1003',
      lang: 'en',
      taskId: '000101001010100101',
      wfId: '221322101146259092',
      userId: 'DemoApp',
      userRole: '663065348460318692',
      tabId: '840574035205469800',
      fetchSize: 10,
      fetchCount: 0,
      gridId: ''
    }
    const urlParams = `plantCode=${gridRequestParams.plantCode}&lang=${gridRequestParams.lang}&taskId=${gridRequestParams.taskId}&wfId=${gridRequestParams.wfId}&userId=${gridRequestParams.userId}&userRole=${gridRequestParams.userRole}&tabId=${gridRequestParams.tabId}`
    expect(serviceobj.getGridMetaDataURL(gridRequestParams)).toContain(`grid/getGridMetadata/${gridRequestParams.objecttype}/${gridRequestParams.tabCode}/${gridRequestParams.eventCode}?${urlParams}`)
  });

  it('should call getMetadataByWfid()', () => {
    const serviceobj = new EndpointService();
    const wfid = '221322101146259092'
    expect(serviceobj.getMetadataByWfid(wfid)).toContain(`layout/getMetadataByWfid/${wfid}`);
  })

  it('getCollaboratorDetailsUrl(), should return the person details  url', async(() => {
    const serObj = new EndpointService();
    expect(serObj.getCollaboratorDetailsUrl('28364872686186')).toContain('schema/get-all-schemacollaborator-details/28364872686186');
  }));

  it('createUpdatePersonDetailsUrl(), should  create and update person details url', async(() => {
    const serObj = new EndpointService();
    expect(serObj.createUpdateUserDetailsUrl()).toContain('schema/create-update-schemacollaborator');
  }));

  it('getAllUserDetailsUrl(), should return the all person details url', async(() => {
    const serObj = new EndpointService();
    expect(serObj.getAllUserDetailsUrl()).toContain('admin/permission/collaborators');
  }));

  it('deleteSchemaCollaboratorDetailsUrl(),should delte the exexting collaborator derail', async(() => {
    const serObj = new EndpointService();
    expect(serObj.deleteSchemaCollaboratorDetailsUrl('355535857155320681 ')).toContain('admin/users/collaborator-records/delete/355535857155320681');
  }));

  it('deleteSchema(),should delte the schema', async(() => {
    const serObj = new EndpointService();
    expect(serObj.deleteSchema('355535857155320681 ')).toContain('schema/delete/355535857155320681');
  }));

  it('it should call getLoadRecipientsListUrl() and return formatted URL', () => {
    const serviceobj = new EndpointService();
    expect(serviceobj.getLoadRecipientsListUrl()).toContain(`restWorkflow/loadRecipient`);
  });

  it('it should call getWfFieldsListUrl() and return formatted URL', () => {
    const serviceobj = new EndpointService();
    expect(serviceobj.getWfFieldsListUrl()).toContain(`restWorkflow/loadWorkfLowField`);
  });

  it('it should call getReportListUrl() and return formatted URL', () => {
    const serviceobj = new EndpointService();
    expect(serviceobj.getReportListUrl()).toContain(`report/list`);
  });

  it('it should call getFiltersUrl() and return formatted URL', () => {
    const serviceobj = new EndpointService();
    expect(serviceobj.getFiltersUrl()).toContain(`tasklist/filter`);
  });

  it('it should call getLoadApisUrl() and return formatted URL', () => {
    const serviceobj = new EndpointService();
    expect(serviceobj.getLoadApisUrl()).toContain(`restWorkflow/loadAPI`);
  });

  it('it should call getSaveWfDefinitionUrl() and return formatted URL', () => {
    const serviceobj = new EndpointService();
    expect(serviceobj.getSaveWfDefinitionUrl()).toContain(`restWorkflow/saveWorkFlowStepViaXml`);
  });

  it('saveUpdateVariantUrl(), hould  create and update Variant details url', () => {
    const serviceobj = new EndpointService();
    expect(serviceobj.saveUpdateVariantUrl()).toContain(`schema/variant/create-update-single`);
  });

  it('getVariantdetailsByvariantIdUrl(),should return all variant detials by variantId', async(() => {
    const serObj = new EndpointService();
    expect(serObj.getVariantdetailsByvariantIdUrl('355555320681 ')).toContain('schema/variant/355555320681');
  }));

  it('deleteVariantUrl(),should delete variant details', async(() => {
    const serObj = new EndpointService();
    expect(serObj.deleteVariantUrl('35555320681 ')).toContain('schema/variant/delete/35555320681');
  }));

  it('getSchemaDetailsBySchemaIdUrl(),should return all schema detials by schemaId', async(() => {
    const serObj = new EndpointService();
    expect(serObj.getSchemaDetailsBySchemaIdUrl('355555320681 ')).toContain('schema/schema-details/355555320681');
  }));

});
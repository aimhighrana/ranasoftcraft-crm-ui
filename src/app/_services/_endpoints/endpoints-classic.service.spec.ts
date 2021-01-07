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

  it('markForDeletionUrl(),should return markForDeletionUrl url', async(() => {
    const serObj =new EndpointsClassicService();
    expect(serObj.markForDeletionUrl('diw_15','mod1','schema','run')).toContain('/schema/update-delFlag/diw_15/mod1/schema/run');
  }));

  it('doDuplicacyCorrectionUrl(),should return doDuplicacyCorrectionUrl url', async(() => {
    const serObj =new EndpointsClassicService();
    expect(serObj.doDuplicacyCorrectionUrl('schema1','run1')).toContain('duplicate/do-correction/schema1/run1');
  }));

  it('saveUpdateDuplicateRule(),should return saveUpdateDuplicateRule url', async(() => {
    const serObj =new EndpointsClassicService();
    expect(serObj.saveUpdateDuplicateRule()).toContain('duplicate/saveDuppsett');
  }));

  it('saveUpdateDataScopeUrl(),should return saveUpdateDataScopeUrl url', async(() => {
    const serObj =new EndpointsClassicService();
    expect(serObj.saveUpdateDataScopeUrl()).toContain('schema/variant/create-update-single');
  }));

  it('getAllDataScopeUrl(),should return getAllDataScopeUrl url', async(() => {
    const serObj =new EndpointsClassicService();
    expect(serObj.getAllDataScopeUrl('schema1','type1')).toContain('schema/variants/schema1/type1');
  }));

  it('getWorkFlowFieldsUrl(),should return getWorkFlowFieldsUrl url', async(() => {
    const serObj =new EndpointsClassicService();
    expect(serObj.getWorkFlowFieldsUrl()).toContain('schema/get-wffields');
  }));

  it('getWorkFlowPathUrl(),should return getWorkFlowPathUrl url', async(() => {
    const serObj =new EndpointsClassicService();
    expect(serObj.getWorkFlowPathUrl()).toContain('schema/get-wfpath');
  }));

  it('getNotificationsUrl(),should return getNotificationsUrl url', async(() => {
    const serObj =new EndpointsClassicService();
    expect(serObj.getNotificationsUrl('uid','from','to')).toContain('/notification/getNotification/uid?from=from&to=to');
  }));

  it('getUpdateNotificationUrl(),should return getUpdateNotificationUrl url', async(() => {
    const serObj =new EndpointsClassicService();
    expect(serObj.getUpdateNotificationUrl()).toContain('notification/saveNotification');
  }));

  it('approveDuplicacyCorrectionUrl(),should return approveDuplicacyCorrectionUrl url', async(() => {
    const serObj =new EndpointsClassicService();
    expect(serObj.approveDuplicacyCorrectionUrl('schema','run','user')).toContain('approveDuplicateRecords/schema/run?userName=user');
  }));

  it('rejectDuplicacyCorrectionUrl(),should return rejectDuplicacyCorrectionUrl url', async(() => {
    const serObj =new EndpointsClassicService();
    expect(serObj.rejectDuplicacyCorrectionUrl('schema','run','user')).toContain('rejectDuplicateRecords/schema/run?userName=user');
  }));

  it('downloadMroExceutionUri(),should return downloadMroExceutionUri url', async(() => {
    const serObj =new EndpointsClassicService();
    expect(serObj.downloadMroExceutionUri('schema')).toContain('schema/download/mro');
  }));

  it('generateMroClassificationDescriptionUri(),should return generateMroClassificationDescriptionUri url', async(() => {
    const serObj = new EndpointsClassicService();
    expect(serObj.generateMroClassificationDescriptionUri()).toContain('schema/mro/generate-description');
  }));

  it('getExecutionOverviewChartDataUrl(),should return getExecutionOverviewChartDataUrl url', async(() => {​​​​​​​​​
    const serObj = new EndpointsClassicService();
    expect(serObj.getExecutionOverviewChartDataUrl('schema1', '0')).toContain('schema/overview-chart-data/schema1/0');
  }​​​​​​​​​​​​​​​​));

  it('getlayoutsUrl(),should return getlayoutsUrl url', async(() => {​​​​​​​​​​​​​​​​
    const serObj = new EndpointsClassicService();
    expect(serObj.getlayoutsUrl()).toContain('/report/layouts');
  }​​​​​​​​​​​​​​​​));

   it('generateCrossEntryUri(),should return generateCrossEntryUri url', async(() => {​​​​​​​​​​​​​​​​
    const serObj = new EndpointsClassicService();
    expect(serObj.generateCrossEntryUri('schemaId', 'objectType', 'objectNumber' )).toContain('schema/generateCrossmodule/schemaId/objectType/objectNumber');
  }​​​​​​​​​​​​​​​​));

  it('resetCorrectionRecords(), return Uri for reset schema execution correction data ',async(() => {
    const serObj =new EndpointsClassicService();
    expect(serObj.resetCorrectionRecords('654567879')).toContain('schema/reset-corrected-records/654567879');
  }));

  it('getNotificationsCount(), return count of notification',async(() => {
    const serObj =new EndpointsClassicService();
    const senderUid = '654567879';
    expect(serObj.getNotificationsCount(senderUid)).toContain(`notification/getNotificationCount/${senderUid}`);
  }));

  it('getSaveTaskListViewUrl(), should save task list view', async(() => {
    const serObj =new EndpointsClassicService();
    expect(serObj.getSaveTaskListViewUrl()).toContain('tasklist/taskListUserView');
  }));

  it('saveUpdateUDRUrl(), should saveudr rule', async(() => {
    const serObj =new EndpointsClassicService();
    expect(serObj.saveUpdateUDRUrl()).toContain('admin/schema/udr/save-update');
  }));

});

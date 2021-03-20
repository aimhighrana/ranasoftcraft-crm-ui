import { TestBed, async } from '@angular/core/testing';

import { SchemaDetailsService } from './schema-details.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EndpointsClassicService } from '@services/_endpoints/endpoints-classic.service';
import { CategoryChartDataSet, CategoryInfo, ClassificationNounMod, MetadataModeleResponse, Noun, OverViewChartDataSet, RequestForSchemaDetailsWithBr, SchemaBrInfo, SchemaCorrectionReq, SchemaDataTableColumnInfoResponse, SchemaExecutionLog, SchemaMROCorrectionReq, SchemaTableAction, SchemaTableViewFldMap, SchemaTableViewRequest, SendReqForSchemaDataTableColumnInfo } from '@models/schema/schemadetailstable';
import { PermissionOn, SchemaDashboardPermission } from '@models/collaborator';
import { HttpResponse } from '@angular/common/http';
import { Any2tsService } from '@services/any2ts.service';
import { SchemaListDetails } from '@models/schema/schemalist';
describe('SchemaDetailsService', () => {
  let endpointServiceSpy: jasmine.SpyObj<EndpointsClassicService>;
  let schemaDetaService: SchemaDetailsService;
  let httpTestingController: HttpTestingController;
  let any2tsSpy: jasmine.SpyObj<Any2tsService>;
  beforeEach(() => {
    const endpointSpy = jasmine.createSpyObj('EndpointsClassicService', ['getAllSelectedFields', 'getCreateUpdateSchemaActionUrl', 'getFindActionsBySchemaUrl',
    'getDeleteSchemaActionUrl', 'getCrossMappingUrl', 'getCreateUpdateSchemaActionsListUrl', 'getAllSelectedFields', 'getWorkFlowFieldsUrl', 'getUpdateSchemaTableViewUrl',
    'getSchemaTableDetailsUrl', 'getSchemaBrInfoList', 'getCorrectedRecords', 'getSchemaExecutionLogUrl', 'doCorrectionUrl', 'getLastBrErrorRecords',
    'approveCorrectedRecords', 'resetCorrectionRecords', 'getAllUserDetailsUrl', 'createUpdateUserDetailsUrl', 'deleteSchemaCollaboratorDetailsUrl',
    'saveNewSchemaUrl', 'getClassificationDataTableUrl', 'generateCrossEntryUri', 'doClassificationCorrectionUri', 'approveClassificationUri', 'rejectClassificationUri',
    'generateMroClassificationDescriptionUri', 'downloadMroExceutionUri', 'getSchemaDataTableColumnInfoUrl', 'getSchemaDetailsBySchemaId', 'getShowMoreSchemaTableDataUrl',
    'getOverviewChartDataUrl', 'getCategoryInfoUrl', 'getSchemaStatusUrl', 'categoryChartData', 'getMetadataFields', 'getClassificationNounMod',
    'getSchemaExecutedStatsTrendUri', 'getFindActionsBySchemaAndRoleUrl']);

    const mapperSpy = jasmine.createSpyObj('Any2tsService', ['any2SchemaDataTableResponse', 'any2OverviewChartData', 'any2CategoryInfo', 'any2SchemaStatus', 'any2CategoryChartData',
      'any2MetadataResponse']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SchemaDetailsService,
        { provide: EndpointsClassicService, useValue: endpointSpy },
        { provide: Any2tsService, useValue: mapperSpy}
      ]
    }).compileComponents();
    schemaDetaService = TestBed.inject(SchemaDetailsService);
    httpTestingController = TestBed.inject(HttpTestingController);
    endpointServiceSpy = TestBed.inject(EndpointsClassicService) as jasmine.SpyObj<EndpointsClassicService>;
    any2tsSpy = TestBed.inject(Any2tsService) as jasmine.SpyObj<Any2tsService>;
  });

  it('should be created', () => {
    const service: SchemaDetailsService = TestBed.inject(SchemaDetailsService);
    expect(service).toBeTruthy();
  });

  it('getAllSelectedFields(): get selected fields ', async(() => {
    const schemaId = '837645763957';
    const variantId = '0';
    const url = `get selected field url`;
    // mock url
    endpointServiceSpy.getAllSelectedFields.and.returnValue(url);
    // mock data
    const mockData = [
      {fieldId: 'FIELD1', order:0, editable: false},
      {fieldId: 'FIELD2', order:1, editable: false}
    ];
    // actual service call
    schemaDetaService.getAllSelectedFields(schemaId, variantId).subscribe(actualResponse => {
      expect(actualResponse).toEqual(mockData);
      expect(actualResponse.length).toEqual(mockData.length);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}?schemaId=${schemaId}&variantId=${variantId}`);
    expect(mockRequst.request.method).toEqual('GET');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(mockData);
    // verify http
    httpTestingController.verify();
  }));

  it('createUpdateSchemaAction(): createUpdateSchemaAction ', async(() => {

    const url = `createUpdateSchemaAction url`;
    // mock url
    endpointServiceSpy.getCreateUpdateSchemaActionUrl.and.returnValue(url);

    const action = new SchemaTableAction();

    // actual service call
    schemaDetaService.createUpdateSchemaAction(action).subscribe(actualResponse => {
      expect(actualResponse).toEqual(action);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(url);
    expect(mockRequst.request.method).toEqual('POST');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(action);
    // verify http
    httpTestingController.verify();
  }));

  it('getTableActionsBySchemaId(): getTableActionsBySchemaId ', async(() => {

    const url = `getTableActionsBySchemaId url`;
    // mock url
    endpointServiceSpy.getFindActionsBySchemaUrl.and.returnValue(url);


    // actual service call
    schemaDetaService.getTableActionsBySchemaId('schemaId').subscribe(actualResponse => {
      expect(actualResponse).toEqual([]);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(url);
    expect(mockRequst.request.method).toEqual('GET');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush([]);
    // verify http
    httpTestingController.verify();
  }));

  it('deleteSchemaTableAction(): deleteSchemaTableAction ', async(() => {

    const url = `getDeleteSchemaActionUrl url`;
    // mock url
    endpointServiceSpy.getDeleteSchemaActionUrl.and.returnValue(url);


    // actual service call
    schemaDetaService.deleteSchemaTableAction('schemaId', '1701').subscribe(actualResponse => {
      expect(actualResponse).toEqual([]);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(url);
    expect(mockRequst.request.method).toEqual('DELETE');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush([]);
    // verify http
    httpTestingController.verify();
  }));

  it('getCrossMappingRules(): getCrossMappingRules ', async(() => {

    const url = `getCrossMappingRules url`;
    // mock url
    endpointServiceSpy.getCrossMappingUrl.and.returnValue(url);


    // actual service call
    schemaDetaService.getCrossMappingRules('0').subscribe(actualResponse => {
      expect(actualResponse).toEqual([]);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(url);
    expect(mockRequst.request.method).toEqual('GET');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush([]);
    // verify http
    httpTestingController.verify();
  }));

  it('createUpdateSchemaActionsList(): createUpdateSchemaActionsList ', async(() => {

    const url = `createUpdateSchemaActionsList url`;
    // mock url
    endpointServiceSpy.getCreateUpdateSchemaActionsListUrl.and.returnValue(url);

    const actions = [new SchemaTableAction()];

    // actual service call
    schemaDetaService.createUpdateSchemaActionsList(actions).subscribe(actualResponse => {
      expect(actualResponse).toEqual(actions);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(url);
    expect(mockRequst.request.method).toEqual('POST');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(actions);
    // verify http
    httpTestingController.verify();
  }));

  it('should getSchemaTableData()', async(() => {

    const url = `getSchemaTableDetailsUrl`;
    // mock url
    endpointServiceSpy.getSchemaTableDetailsUrl.and.returnValue(url);

    const request = new RequestForSchemaDetailsWithBr();
    const response = {};

    // actual service call
    schemaDetaService.getSchemaTableData(request).subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(url);
    expect(mockRequst.request.method).toEqual('POST');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(response);
    // verify http
    httpTestingController.verify();
  }));

  it('should updateSchemaTableView()', async(() => {

    const url = `getUpdateSchemaTableViewUrl`;
    // mock url
    endpointServiceSpy.getUpdateSchemaTableViewUrl.and.returnValue(url);

    const request = new SchemaTableViewRequest();
    const response = {};

    // actual service call
    schemaDetaService.updateSchemaTableView(request).subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(url);
    expect(mockRequst.request.method).toEqual('POST');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(response);
    // verify http
    httpTestingController.verify();
  }));

  it('should getWorkflowFields()', async(() => {

    const url = `getWorkFlowFieldsUrl`;
    // mock url
    endpointServiceSpy.getWorkFlowFieldsUrl.and.returnValue(url);

    const request = ['1005'];
    const response = {};

    // actual service call
    schemaDetaService.getWorkflowFields(request).subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(url);
    expect(mockRequst.request.method).toEqual('POST');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(response);
    // verify http
    httpTestingController.verify();
  }));

  it('should getAllSelectedFields()', async(() => {

    const url = `getAllSelectedFields url`;
    // mock url
    endpointServiceSpy.getAllSelectedFields.and.returnValue(url);

    const response: SchemaTableViewFldMap[] = [];

    // actual service call
    schemaDetaService.getAllSelectedFields('schema1701', '0').subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}?schemaId=schema1701&variantId=0`);
    expect(mockRequst.request.method).toEqual('GET');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(response);
    // verify http
    httpTestingController.verify();
  }));

  it('should getSchemaBrInfoList()', async(() => {

    const url = `getSchemaBrInfoList url`;
    // mock url
    endpointServiceSpy.getSchemaBrInfoList.and.returnValue(url);

    const schemaId = '1701';
    const response: SchemaBrInfo[] = [];

    // actual service call
    schemaDetaService.getSchemaBrInfoList(schemaId).subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}`);
    expect(mockRequst.request.method).toEqual('GET');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(response);
    // verify http
    httpTestingController.verify();
  }));

  it('should getCorrectedRecords()', async(() => {

    const url = `getCorrectedRecords url`;
    // mock url
    endpointServiceSpy.getCorrectedRecords.and.returnValue(url);

    const schemaId = '1701';
    const response = {};

    // actual service call
    schemaDetaService.getCorrectedRecords(schemaId, 10, 0).subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}?fetchSize=10&fetchCount=0`);
    expect(mockRequst.request.method).toEqual('GET');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(response);
    // verify http
    httpTestingController.verify();
  }));

  it('should getSchemaExecutionLogs()', async(() => {

    const url = `getSchemaExecutionLogUrl`;
    // mock url
    endpointServiceSpy.getSchemaExecutionLogUrl.and.returnValue(url);

    const schemaId = '1701';
    const response: SchemaExecutionLog[] = [];

    // actual service call
    schemaDetaService.getSchemaExecutionLogs(schemaId).subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}`);
    expect(mockRequst.request.method).toEqual('GET');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(response);
    // verify http
    httpTestingController.verify();
  }));

  it('should doCorrection()', async(() => {

    const url = `doCorrectionUrl`;
    // mock url
    endpointServiceSpy.doCorrectionUrl.and.returnValue(url);

    const schemaId = '1701';
    const request = {} as  SchemaCorrectionReq;
    const response = 'success';

    // actual service call
    schemaDetaService.doCorrection(schemaId, request).subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}`);
    expect(mockRequst.request.method).toEqual('POST');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(response);
    // verify http
    httpTestingController.verify();
  }));

  it('should getLastBrErrorRecords()', async(() => {

    const url = `getLastBrErrorRecords url`;
    // mock url
    endpointServiceSpy.getLastBrErrorRecords.and.returnValue(url);

    const schemaId = '1701';
    const objNumns = ['TMP001'];
    const response = 'success';

    // actual service call
    schemaDetaService.getLastBrErrorRecords(schemaId, objNumns).subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}`);
    expect(mockRequst.request.method).toEqual('POST');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(response);
    // verify http
    httpTestingController.verify();
  }));

  it('should getLastBrErrorRecords()', async(() => {

    const url = `getLastBrErrorRecords url`;
    // mock url
    endpointServiceSpy.getLastBrErrorRecords.and.returnValue(url);

    const schemaId = '1701';
    const objNumns = ['TMP001'];
    const response = 'success';

    // actual service call
    schemaDetaService.getLastBrErrorRecords(schemaId, objNumns).subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}`);
    expect(mockRequst.request.method).toEqual('POST');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(response);
    // verify http
    httpTestingController.verify();
  }));

  it('should approveCorrectedRecords()', async(() => {

    const url = `approveCorrectedRecords url`;
    // mock url
    endpointServiceSpy.approveCorrectedRecords.and.returnValue(url);

    const schemaId = '1701';
    const objNumns = ['TMP001'];
    const response = 'success';

    // actual service call
    schemaDetaService.approveCorrectedRecords(schemaId, objNumns, '').subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}?roleId=`);
    expect(mockRequst.request.method).toEqual('POST');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(response);
    // verify http
    httpTestingController.verify();
  }));

  it('should resetCorrectionRecords()', async(() => {

    const url = `resetCorrectionRecords url`;
    // mock url
    endpointServiceSpy.resetCorrectionRecords.and.returnValue(url);

    const schemaId = '1701';
    const objNumns = ['TMP001'];
    const runId = 'run18';
    const response = 'success';

    // actual service call
    schemaDetaService.resetCorrectionRecords(schemaId, runId, objNumns).subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}?runId=${runId}`);
    expect(mockRequst.request.method).toEqual('PUT');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(response);
    // verify http
    httpTestingController.verify();
  }));

  it('should getAllUserDetails()', async(() => {

    const url = `getAllUserDetailsUrl url`;
    // mock url
    endpointServiceSpy.getAllUserDetailsUrl.and.returnValue(url);

    const response = {} as PermissionOn;

    // actual service call
    schemaDetaService.getAllUserDetails('search', 1).subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}?queryString=search&fetchCount=1`);
    expect(mockRequst.request.method).toEqual('GET');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(response);
    // verify http
    httpTestingController.verify();
  }));

  it('should createUpdateUserDetails()', async(() => {

    const url = `createUpdateUserDetailsUrl`;
    // mock url
    endpointServiceSpy.createUpdateUserDetailsUrl.and.returnValue(url);

    const request: SchemaDashboardPermission[] = [];
    const response = [];

    // actual service call
    schemaDetaService.createUpdateUserDetails(request).subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}`);
    expect(mockRequst.request.method).toEqual('POST');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(response);
    // verify http
    httpTestingController.verify();
  }));

  it('should deleteCollaborator()', async(() => {

    const url = `deleteSchemaCollaboratorDetailsUrl`;
    // mock url
    endpointServiceSpy.deleteSchemaCollaboratorDetailsUrl.and.returnValue(url);

    const sNoList = [1701];
    const response = true;

    // actual service call
    schemaDetaService.deleteCollaborator(sNoList).subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}`);
    expect(mockRequst.request.method).toEqual('DELETE');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.event(new HttpResponse<boolean>({body: response}));
    // verify http
    httpTestingController.verify();
  }));

  it('should deleteCollaborator()', async(() => {

    const url = `deleteSchemaCollaboratorDetailsUrl`;
    // mock url
    endpointServiceSpy.deleteSchemaCollaboratorDetailsUrl.and.returnValue(url);

    const sNoList = [1701];
    const response = true;

    // actual service call
    schemaDetaService.deleteCollaborator(sNoList).subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}`);
    expect(mockRequst.request.method).toEqual('DELETE');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.event(new HttpResponse<boolean>({body: response}));
    // verify http
    httpTestingController.verify();
  }));

  it('should saveNewSchemaDetails()', async(() => {

    const url = `saveNewSchemaUrl`;
    // mock url
    endpointServiceSpy.saveNewSchemaUrl.and.returnValue(url);
    const response = 'success';

    // actual service call
    schemaDetaService.saveNewSchemaDetails('1005', false, '0', '1701', {}).subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}`);
    expect(mockRequst.request.method).toEqual('POST');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(response);
    // verify http
    httpTestingController.verify();
  }));

  it('should getClassificationData()', async(() => {

    const url = `getClassificationDataTableUrl`;
    // mock url
    endpointServiceSpy.getClassificationDataTableUrl.and.returnValue(url);
    const response = {};

    // actual service call
    schemaDetaService.getClassificationData('schema1', 'run1', 'Bearing', 'Ball', '', 'error', '', '').subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}?nounCode=Bearing&modifierCode=Ball&ruleType=&requestStatus=error&searchString=&objectNumberAfter=`);
    expect(mockRequst.request.method).toEqual('GET');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(response);
    // verify http
    httpTestingController.verify();
  }));

  it('should generateCrossEntry()', async(() => {

    const url = `generateCrossEntryUri`;
    // mock url
    endpointServiceSpy.generateCrossEntryUri.and.returnValue(url);
    const response = 'success';

    // actual service call
    schemaDetaService.generateCrossEntry('schema1', '1005', 'TMP1701', '').subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}?crossbrId=`);
    expect(mockRequst.request.method).toEqual('GET');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(response);
    // verify http
    httpTestingController.verify();
  }));

  it('should generateCrossEntry()', async(() => {

    const url = `generateCrossEntryUri`;
    // mock url
    endpointServiceSpy.generateCrossEntryUri.and.returnValue(url);
    const response = 'success';

    // actual service call
    schemaDetaService.generateCrossEntry('schema1', '1005', 'TMP1701', '').subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}?crossbrId=`);
    expect(mockRequst.request.method).toEqual('GET');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(response);
    // verify http
    httpTestingController.verify();
  }));

  it('should doCorrectionForClassification()', async(() => {

    const url = `doClassificationCorrectionUri`;
    // mock url
    endpointServiceSpy.doClassificationCorrectionUri.and.returnValue(url);

    const schemaId = '1701';
    const fieldId = 'region';
    const request = new SchemaMROCorrectionReq();
    const response = 'success';

    // actual service call
    schemaDetaService.doCorrectionForClassification(schemaId, fieldId, request).subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    let mockRequst = httpTestingController.expectOne(`${url}?schemaId=${schemaId}&fieldId=${fieldId}`);
    expect(mockRequst.request.method).toEqual('POST');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(response);
    // verify http
    httpTestingController.verify();

    // actual service call
    schemaDetaService.doCorrectionForClassification(schemaId, '', request).subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    mockRequst = httpTestingController.expectOne(`${url}?schemaId=${schemaId}&fieldId=`);
    mockRequst.flush(response);
    // verify http
    httpTestingController.verify();
  }));

  it('should approveClassification()', async(() => {

    const url = `approveClassificationUri`;
    // mock url
    endpointServiceSpy.approveClassificationUri.and.returnValue(url);

    const schemaId = '1701';
    const runId = '158';
    const objNr = ['TMP01']
    const response = true;

    // actual service call
    schemaDetaService.approveClassification(schemaId, runId, objNr).subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}?schemaId=${schemaId}&runId=${runId}`);
    expect(mockRequst.request.method).toEqual('PUT');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.event(new HttpResponse<boolean>({body: response}));
    // verify http
    httpTestingController.verify();
  }));

  it('should rejectClassification()', async(() => {

    const url = `rejectClassificationUri`;
    // mock url
    endpointServiceSpy.rejectClassificationUri.and.returnValue(url);

    const schemaId = '1701';
    const runId = '158';
    const objNr = ['TMP01']
    const response = true;

    // actual service call
    schemaDetaService.rejectClassification(schemaId, runId, objNr).subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}?schemaId=${schemaId}&runId=${runId}`);
    expect(mockRequst.request.method).toEqual('PUT');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.event(new HttpResponse<boolean>({body: response}));
    // verify http
    httpTestingController.verify();
  }));

  it('should generateMroClassificationDescription()', async(() => {

    const url = `generateMroClassificationDescriptionUri`;
    // mock url
    endpointServiceSpy.generateMroClassificationDescriptionUri.and.returnValue(url);

    const schemaId = '1701';
    const runId = '158';
    const objNr = ['TMP01']
    const response = true;

    // actual service call
    schemaDetaService.generateMroClassificationDescription(schemaId, runId, objNr, true).subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}?schemaId=${schemaId}&runId=${runId}&isFromMasterLib=true`);
    expect(mockRequst.request.method).toEqual('PUT');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.event(new HttpResponse<boolean>({body: response}));
    // verify http
    httpTestingController.verify();
  }));

  it('should getDownloadAbledataforMroExecution()', async(() => {

    const url = `downloadMroExceutionUri`;
    // mock url
    endpointServiceSpy.downloadMroExceutionUri.and.returnValue(url);

    const schemaId = '1701';
    const response = {};

    expect(() => schemaDetaService.getDownloadAbledataforMroExecution(schemaId, '1548', undefined, undefined, '', 'error', ''))
      .toThrowError('Nouncode must be required !');

    expect(() => schemaDetaService.getDownloadAbledataforMroExecution(schemaId, '1548', 'Bearing', undefined, '', 'error', ''))
      .toThrowError('Modifiercode must be required !');

    // actual service call
    schemaDetaService.getDownloadAbledataforMroExecution(schemaId, '1548', 'Bearing', 'Ball', '', 'error', '').subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    let mockRequst = httpTestingController.expectOne(`${url}?runId=1548&dataFor=error&ruleType=&nounCode=Bearing&modifierCode=Ball&searchString=`);
    expect(mockRequst.request.method).toEqual('GET');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(response);
    // verify http
    httpTestingController.verify();

    // actual service call
    schemaDetaService.getDownloadAbledataforMroExecution(schemaId, '1548', 'Bearing', 'Ball', '', 'error', 'search').subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    mockRequst = httpTestingController.expectOne(`${url}?runId=1548&dataFor=error&ruleType=&nounCode=Bearing&modifierCode=Ball&searchString=search`);
    mockRequst.flush(response);
    // verify http
    httpTestingController.verify();
  }));

  it('should getSchemaDataTableColumnInfo()', async(() => {

    const url = `getSchemaDataTableColumnInfoUrl`;
    // mock url
    endpointServiceSpy.getSchemaDataTableColumnInfoUrl.and.returnValue(url);

    const request = new SendReqForSchemaDataTableColumnInfo();
    const mockHttpResp = {};
    const response = new SchemaDataTableColumnInfoResponse();

    any2tsSpy.any2SchemaDataTableResponse.withArgs(mockHttpResp).and.returnValue(response);

    // actual service call
    schemaDetaService.getSchemaDataTableColumnInfo(request).subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}`);
    expect(mockRequst.request.method).toEqual('POST');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(mockHttpResp);
    // verify http
    httpTestingController.verify();
  }));

  it('should getSchemaDetailsBySchemaId()', async(() => {

    const url = `getSchemaDetailsBySchemaId url`;
    // mock url
    endpointServiceSpy.getSchemaDetailsBySchemaId.and.returnValue(url);

    const schemaId = '15488788';
    const response = new SchemaListDetails();

    // actual service call
    schemaDetaService.getSchemaDetailsBySchemaId(schemaId).subscribe(actualResponse => {
      expect(actualResponse).toBeNull();
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}`);
    expect(mockRequst.request.method).toEqual('POST');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(response);
    // verify http
    httpTestingController.verify();
  }));

  it('should getSchemaDataTableShowMore()', async(() => {

    const url = `getShowMoreSchemaTableDataUrl`;
    // mock url
    endpointServiceSpy.getShowMoreSchemaTableDataUrl.and.returnValue(url);

    const scrollId = '15488788';
    const response = {};

    // actual service call
    schemaDetaService.getSchemaDataTableShowMore(scrollId).subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}`);
    expect(mockRequst.request.method).toEqual('POST');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(response);
    // verify http
    httpTestingController.verify();
  }));

  it('should getOverviewChartDetails()', async(() => {

    const url = `getOverviewChartDataUrl`;
    // mock url
    endpointServiceSpy.getOverviewChartDataUrl.and.returnValue(url);

    const mockHttpResp = {};
    const response = new OverViewChartDataSet();

    any2tsSpy.any2OverviewChartData.withArgs(mockHttpResp).and.returnValue(response);

    // actual service call
    schemaDetaService.getOverviewChartDetails('schema1', '0', 'run1').subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    let mockRequst = httpTestingController.expectOne(`${url}`);
    expect(mockRequst.request.method).toEqual('GET');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(mockHttpResp);
    // verify http
    httpTestingController.verify();

    // actual service call
    schemaDetaService.getOverviewChartDetails('', '0', '').subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });

    // mock http call
    mockRequst = httpTestingController.expectOne(`${url}`);
    mockRequst.flush(mockHttpResp);
    // verify http
    httpTestingController.verify();

  }));

  it('should getAllCategoryInfo()', async(() => {

    const url = `getCategoryInfoUrl`;
    // mock url
    endpointServiceSpy.getCategoryInfoUrl.and.returnValue(url);

    const mockHttpResp = {};
    const response: CategoryInfo[] = [];

    any2tsSpy.any2CategoryInfo.withArgs(mockHttpResp).and.returnValue(response);

    // actual service call
    schemaDetaService.getAllCategoryInfo().subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}`);
    expect(mockRequst.request.method).toEqual('GET');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(mockHttpResp);
    // verify http
    httpTestingController.verify();
  }));

  it('should getSchemaStatus()', async(() => {

    const url = `getSchemaStatusUrl`;
    // mock url
    endpointServiceSpy.getSchemaStatusUrl.and.returnValue(url);

    const mockHttpResp = {};
    const response: string[] = [];

    any2tsSpy.any2SchemaStatus.withArgs(mockHttpResp).and.returnValue(response);

    // actual service call
    schemaDetaService.getSchemaStatus().subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}`);
    expect(mockRequst.request.method).toEqual('GET');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(mockHttpResp);
    // verify http
    httpTestingController.verify();
  }));

  it('should getCategoryChartDetails()', async(() => {

    const url = `categoryChartData url`;
    // mock url
    endpointServiceSpy.categoryChartData.and.returnValue(url);

    const mockHttpResp = {};
    const response = new CategoryChartDataSet();

    any2tsSpy.any2CategoryChartData.withArgs(mockHttpResp).and.returnValue(response);

    // actual service call
    schemaDetaService.getCategoryChartDetails('schema1', '0', 'cat1', '').subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}`);
    expect(mockRequst.request.method).toEqual('GET');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(mockHttpResp);
    // verify http
    httpTestingController.verify();
  }));

  it('should getMetadataFields()', async(() => {

    const url = `getMetadataFields url`;
    // mock url
    endpointServiceSpy.getMetadataFields.and.returnValue(url);

    const mockHttpResp = {};
    const response = new MetadataModeleResponse();
    const objectId = '1005';

    any2tsSpy.any2MetadataResponse.withArgs(mockHttpResp).and.returnValue(response);

    // actual service call
    schemaDetaService.getMetadataFields(objectId).subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}`);
    expect(mockRequst.request.method).toEqual('GET');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(mockHttpResp);
    // verify http
    httpTestingController.verify();
  }));

  it('should getClassificationNounMod()', async(() => {

    const url = `getClassificationNounMod url`;
    // mock url
    endpointServiceSpy.getClassificationNounMod.and.returnValue(url);

    let mockHttpResponse = [
      {ruleType: 'mro_local_lib', doc_count: 1, info: [{nounCode: 'Bearing'}] as Noun[]},
      {ruleType: 'mro_gsn_lib', doc_count: 1, info: [{nounCode: 'Bearing'}] as Noun[]},
      {ruleType: 'unmatched', doc_count: 1}
    ]
    let response = {
      mro_local_lib: {doc_cnt: 1, info: [{nounCode: 'Bearing'}] as Noun[]},
      mro_gsn_lib: {doc_cnt: 1, info: [{nounCode: 'Bearing'}] as Noun[]},
      unmatched: {doc_count: 1}
    } as ClassificationNounMod;

    // actual service call
    schemaDetaService.getClassificationNounMod('schema1', 'run1', 'error', '0', 'search').subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    let mockRequst = httpTestingController.expectOne(`${url}?searchString=search&requestStatus=error`);
    expect(mockRequst.request.method).toEqual('GET');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(mockHttpResponse);
    // verify http
    httpTestingController.verify();

    mockHttpResponse = [
      {ruleType: 'unmatched', doc_count: null}
    ];

    response = {
      mro_local_lib: {doc_cnt: 0, info: []},
      mro_gsn_lib: {doc_cnt: 0, info: []},
      unmatched: {doc_count: 0}
    } as ClassificationNounMod;

    // actual service call
    schemaDetaService.getClassificationNounMod('schema1', 'run1', '', '0', '').subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    mockRequst = httpTestingController.expectOne(`${url}?searchString=&requestStatus=`);
    mockRequst.flush(mockHttpResponse);
    // verify http
    httpTestingController.verify();
  }));

  it('should getSchemaExecutedStatsTrend()', async(() => {

    const url = `getSchemaExecutedStatsTrendUri`;
    // mock url
    endpointServiceSpy.getSchemaExecutedStatsTrendUri.and.returnValue(url);
    const response: SchemaExecutionLog[] = [];

    // actual service call
    schemaDetaService.getSchemaExecutedStatsTrend('schema1', '0').subscribe(actualResponse => {
      expect(actualResponse).toEqual(response);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}?exeStart=null&exeEnd=null&plantCode=0`);
    expect(mockRequst.request.method).toEqual('GET');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(response);
    // verify http
    httpTestingController.verify();

  }));

  it('getTableActionsBySchemaAndRole() ', async(() => {

    const url = `getFindActionsBySchemaAndRoleUrl`;
    // mock url
    endpointServiceSpy.getFindActionsBySchemaAndRoleUrl.and.returnValue(url);
    const response: SchemaTableAction[] = [];

    // actual service call
    schemaDetaService.getTableActionsBySchemaAndRole('schemaId', 'approver').subscribe(actualResponse => {
      expect(actualResponse).toEqual([]);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(url);
    expect(mockRequst.request.method).toEqual('GET');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(response);
    // verify http
    httpTestingController.verify();
  }));

});

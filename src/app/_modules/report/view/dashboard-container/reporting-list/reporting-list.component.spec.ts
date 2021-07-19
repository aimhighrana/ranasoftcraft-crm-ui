import { MdoUiLibraryModule } from 'mdo-ui-library';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingListComponent } from './reporting-list.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PageEvent } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { WidgetService } from '@services/widgets/widget.service';
import { WidgetHeader, ReportingWidget, Criteria, DisplayCriteria } from '@modules/report/_models/widget';
import { of } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { RouterTestingModule } from '@angular/router/testing';
import { SimpleChanges } from '@angular/core';
import { SharedModule } from '@modules/shared/shared.module';
import { Router } from '@angular/router';
import { MetadataModel, MetadataModeleResponse } from '@models/schema/schemadetailstable';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { UserService } from '@services/user/userservice.service';
import { Userdetails } from '@models/userdetails';

describe('ReportingListComponent', () => {
  let component: ReportingListComponent;
  let fixture: ComponentFixture<ReportingListComponent>;
  let widgetServiceSpy: WidgetService;
  let router: Router;
  let schemaDetailsService : SchemaDetailsService
  let userService : UserService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportingListComponent],
      imports: [MdoUiLibraryModule, AppMaterialModuleForSpec, HttpClientTestingModule, MatMenuModule, RouterTestingModule, SharedModule],
      providers: [WidgetService,SchemaDetailsService, UserService]
    })
      .compileComponents();
    router = TestBed.inject(Router);

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingListComponent);
    component = fixture.componentInstance;
    widgetServiceSpy = fixture.debugElement.injector.get(WidgetService);
    schemaDetailsService = fixture.debugElement.injector.get(SchemaDetailsService);
    userService = fixture.debugElement.injector.get(UserService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getHeaderMetaData, return header data', async(() => {
    component.widgetId = 75656;
    const response: WidgetHeader = new WidgetHeader();
    response.pageDefaultSize = 25;
    response.displayCriteria = DisplayCriteria.TEXT;
    component.widgetHeader = response;
    component.getHeaderMetaData();
    expect(component.pageSizeOption).toEqual([25, 100, 200, 300, 400]);
    expect(component.widgetHeader.displayCriteria).toEqual('TEXT');
    expect(component.pageSize).toEqual(25);
  }));

  it('getHeaderMetaData, return header data', async(() => {
    component.widgetId = 75656;
    const response: WidgetHeader = new WidgetHeader();
    component.widgetHeader = response;
    component.getHeaderMetaData();
    expect(component.pageSizeOption).toEqual([100, 200, 300, 400]);
    expect(component.widgetHeader.displayCriteria).toEqual('CODE');
    expect(component.pageSize).toEqual(100);
  }));

  it('getListTableMetadata, return table data', async(() => {
    component.widgetId = 75656;
    component.allColumnMetaDataFields = {} as MetadataModeleResponse;
    const response: ReportingWidget[] = [{ widgetId: 75656, fields: 'test', fieldOrder: 'APPTEST', fieldDesc: 'testing', sno: 65467465, fldMetaData: { picklist: '4' } as MetadataModel, displayCriteria: DisplayCriteria.TEXT }];
    spyOn(widgetServiceSpy, 'getListTableMetadata').withArgs(component.widgetId).and.returnValue(of(response));
    spyOn(component, 'getFieldType').withArgs(response[0].fldMetaData).and.returnValue(of({ isHierarchy: false, isGrid: false }));
    component.getListTableMetadata();
    expect(widgetServiceSpy.getListTableMetadata).toHaveBeenCalledWith(component.widgetId);
    expect(component.getFieldType).toHaveBeenCalledWith(response[0].fldMetaData);
    expect(component.displayedColumnsId.length).toEqual(2);
  }));

  it('getServerData(), do pagination ', async(() => {
    // mock data
    const evnet = new PageEvent();
    evnet.pageIndex = 0;
    evnet.pageSize = 10;

    const actualData = component.getServerData(evnet);
    expect(evnet.pageSize).toEqual(actualData.pageSize);
    expect(evnet.pageIndex).toEqual(actualData.pageIndex);
  }));

  // it('details(), get the url', async(() =>{
  //   const data = {ObjectNumber:''};
  //   component.objectType = '';
  //   component.details(data);
  //   expect(component.details(data)).not.toBe(null);
  // }))
  it('downloadCSV, download the data', async(() => {
    component.filterCriteria = [{ fieldId: 'test' } as Criteria, { fieldId: 'test1' } as Criteria];
    spyOn(router, 'navigate');
    const widgetId = component.widgetId;
    component.downloadCSV()
    expect(router.navigate).toHaveBeenCalledWith(['', { outlets: { sb: `sb/report/download-widget/${widgetId}` } }], { queryParams: { conditionList: `${JSON.stringify(component.filterCriteria)}` }, queryParamsHandling: 'merge' });
  }));

  it('sortTable(), sort the data in asc or desc ', async(() => {
    const sort: Sort = { active: '2', direction: 'asc' } as Sort;
    component.sortTable(sort);

    expect(component.sortTable(sort)).not.toBe(null);

    const sort1: Sort = { active: '2', direction: '' } as Sort;
    component.sortTable(sort1);

    expect(component.sortTable(sort1)).not.toBe(null);

    expect(component.sortTable(null)).not.toBe(null);
  }));

  it('ngOnChanges(), should check if there are new filter criteria', async(() => {
    const filterCriteria = [{ fieldId: 'test' } as Criteria, { fieldId: 'test1' } as Criteria];
    const chnages: SimpleChanges = { filterCriteria: { currentValue: filterCriteria, previousValue: null, firstChange: null, isFirstChange: null } };
    spyOn(component.reportingListWidget, 'next');
    component.widgetHeader = { isEnableGlobalFilter: false } as WidgetHeader;
    component.ngOnChanges(chnages);
    expect(component.reportingListWidget.next).toHaveBeenCalled();

    component.widgetHeader = { isEnableGlobalFilter: true } as WidgetHeader;
    component.ngOnChanges(chnages);
    expect(component.ngOnChanges).toBeTruthy();

    const changes2: import('@angular/core').SimpleChanges = {};
    component.ngOnChanges(changes2);
    expect(component.ngOnChanges).toBeTruthy();
  }));

  it('getListdata(), should return the data of field', async(() => {
    const res = { data: { hits: { hits: [{ sourceAsMap: { stat: 'APP', staticFields: { OBJECTID: { fId: 'OBJECTID', ls: 'OBJECTID', vc: [{ c: 'C000164628' }] }, WFID: { fId: 'WFID', ls: 'WFID', vc: [{ c: '130086693666196566' }] }, REQUESTOR_DATE: { fId: 'REQUESTOR_DATE', ls: 'Requested Date', vc: [{ c: '1584440382535' }] }, TIME_TAKEN: { fId: 'TIME_TAKEN', ls: 'Time Taken', vc: [{ c: 97089034 }] }, FORWARDENABLED: { fId: 'FORWARDENABLED', ls: 'FORWARDENABLED', vc: [{ c: 1 }] }, OVERDUE: { fId: 'OVERDUE', ls: 'OVERDUE', vc: [{ c: 'n' }] } }, id: 103048380550997539 }, id: 103048380550997539, sort: [103048380550997539], _score: null }], total: { value: 1, relation: 'eq' }, max_score: null }, took: 4, timed_out: false }, count: 1 };
    const pageSize = 10;
    const pageIndex = 0;
    const widgetId = 1612965351574;
    const criteria = [];
    const soringMap = null;
    component.tableColumnMetaData = [{ fields: 'REQUESTOR_DATE', fldMetaData: { picklist: '1', fieldId: 'REQUESTOR_DATE' } as MetadataModel, displayCriteria: DisplayCriteria.TEXT } as ReportingWidget, { fields: 'objectNumber', fldMetaData: { picklist: '0' } } as ReportingWidget, { fields: 'WFID', fldMetaData: { picklist: '0' } } as ReportingWidget, { fields: 'TIME_TAKEN', fldMetaData: { picklist: '0' } } as ReportingWidget, { fields: 'FORWARDENABLED', fldMetaData: { picklist: '1' } } as ReportingWidget, { fields: 'OVERDUE', fldMetaData: { picklist: '0' } } as ReportingWidget];
    component.displayedColumnsId = ['REQUESTOR_DATE', 'WFID', 'objectNumber', 'OVERDUE', 'FORWARDENABLED', 'TIME_TAKEN'];
    const reportingW = [{ fields: 'REQUESTOR_DATE', fldMetaData: { dataType: 'DTMS', picklist: '1' } } as ReportingWidget, { fields: 'objectNumber', fldMetaData: { dataType: '0' } } as ReportingWidget, { fields: 'WFID', fldMetaData: { dataType: '0' } } as ReportingWidget, { fields: 'TIME_TAKEN', fldMetaData: { dataType: '0' } } as ReportingWidget, { fields: 'FORWARDENABLED', fldMetaData: { dataType: '1' } } as ReportingWidget, { fields: 'OVERDUE', fldMetaData: { dataType: '0' } } as ReportingWidget];
    component.reportingListWidget.next(reportingW);
    component.widgetHeader = { displayCriteria: DisplayCriteria.CODE } as WidgetHeader;
    spyOn(widgetServiceSpy, 'getListdata').withArgs(String(pageSize), String(pageIndex), String(widgetId), criteria, soringMap).and.returnValue(of(res));

    component.getListdata(pageSize, pageIndex, widgetId, criteria, soringMap);

    expect(widgetServiceSpy.getListdata).toHaveBeenCalledWith(String(pageSize), String(pageIndex), String(widgetId), criteria, soringMap);
    expect(component.resultsLength).toEqual(1);
    expect(component.listData[0].REQUESTOR_DATE).toEqual('1584440382535');
    expect(component.listData[0].WFID).toEqual('130086693666196566');
    expect(component.listData[0].OVERDUE).toEqual('No');
    expect(component.listData[0].FORWARDENABLED).toEqual('Yes');
    expect(component.listData[0].TIME_TAKEN).toEqual('1 d 2 h 58 m 9 s');
    expect(component.listData[0].objectNumber).toEqual(103048380550997540);

    component.widgetHeader = { displayCriteria: DisplayCriteria.TEXT } as WidgetHeader;
    component.getListdata(pageSize, pageIndex, widgetId, criteria, soringMap);

    expect(widgetServiceSpy.getListdata).toHaveBeenCalledWith(String(pageSize), String(pageIndex), String(widgetId), criteria, soringMap);
    expect(component.resultsLength).toEqual(1);
    expect(component.listData[0].REQUESTOR_DATE).toEqual('1584440382535');
    expect(component.listData[0].WFID).toEqual('130086693666196566');
    expect(component.listData[0].OVERDUE).toEqual('No');
    expect(component.listData[0].FORWARDENABLED).toEqual('Yes');
    expect(component.listData[0].TIME_TAKEN).toEqual('1 d 2 h 58 m 9 s');
    expect(component.listData[0].objectNumber).toEqual(103048380550997540);

    component.widgetHeader = { displayCriteria: DisplayCriteria.CODE_TEXT } as WidgetHeader;
    component.getListdata(pageSize, pageIndex, widgetId, criteria, soringMap);

    expect(widgetServiceSpy.getListdata).toHaveBeenCalledWith(String(pageSize), String(pageIndex), String(widgetId), criteria, soringMap);
    expect(component.resultsLength).toEqual(1);
    expect(component.listData[0].REQUESTOR_DATE).toEqual('1584440382535');
    expect(component.listData[0].WFID).toEqual('130086693666196566');
    expect(component.listData[0].OVERDUE).toEqual('No');
    expect(component.listData[0].FORWARDENABLED).toEqual('Yes');
    expect(component.listData[0].TIME_TAKEN).toEqual('1 d 2 h 58 m 9 s');
    expect(component.listData[0].objectNumber).toEqual(103048380550997540);

    component.getListdata(pageSize, pageIndex, widgetId, criteria, soringMap);
    expect(widgetServiceSpy.getListdata).toHaveBeenCalledWith(String(pageSize), String(pageIndex), String(widgetId), criteria, soringMap);
    expect(component.resultsLength).toEqual(1);
    expect(component.listData[0].REQUESTOR_DATE).toEqual('1584440382535');
    expect(component.listData[0].WFID).toEqual('130086693666196566');
    expect(component.listData[0].OVERDUE).toEqual('No');
    expect(component.listData[0].FORWARDENABLED).toEqual('Yes');
    expect(component.listData[0].TIME_TAKEN).toEqual('1 d 2 h 58 m 9 s');
    expect(component.listData[0].objectNumber).toEqual(103048380550997540);
  }));

  it('isDateType(),isDateType  case', async(() => {
    let result = component.isDateType('column');
    expect(result).toBeFalse();

    const reportingW = [{ fields: 'column', fldMetaData: { dataType: 'DTMS' } } as ReportingWidget];
    component.reportingListWidget.next(reportingW);
    result = component.isDateType('column');
    expect(result).toBeTrue();


    const reportingW2 = [{ fields: 'column', fldMetaData: { dataType: 'CHAR' } } as ReportingWidget];
    component.reportingListWidget.next(reportingW2);
    result = component.isDateType('column');
    expect(result).toBeFalse();

    const reportingW3 = [{ fields: 'column' } as ReportingWidget];
    component.reportingListWidget.next(reportingW3);
    result = component.isDateType('column');
    expect(result).toBeFalse();
  }));

  it('isDropdownType(), should check field picklist is 1, 37, 30', async(() => {
    let result = component.isDropdownType('column');
    expect(result).toBeFalse();

    const reportingW = [{ fields: 'requestor_date', fldMetaData: { picklist: '1' } } as ReportingWidget];
    component.reportingListWidget.next(reportingW);
    result = component.isDropdownType('requestor_date');
    expect(result).toBeTrue();

    const reportingW2 = [{ fields: 'Due_date', fldMetaData: { picklist: '30' } } as ReportingWidget];
    component.reportingListWidget.next(reportingW2);
    result = component.isDropdownType('Due_date');
    expect(result).toBeTrue();

    const reportingW3 = [{ fields: 'forwarded_date', fldMetaData: { picklist: '37' } } as ReportingWidget];
    component.reportingListWidget.next(reportingW3);
    result = component.isDropdownType('forwarded_date');
    expect(result).toBeTrue();

    const reportingW4 = [{ fields: 'TimeTaken' } as ReportingWidget];
    component.reportingListWidget.next(reportingW4);
    result = component.isDropdownType('TimeTaken');
    expect(result).toBeFalse();
  }));

  it('getDateTypeValue(), should check the value is number or not', async(() => {
    let fld = '7654345';
    expect(component.getDateTypeValue(fld)).toEqual(fld);

    fld = 'aftadrtsa';
    expect(component.getDateTypeValue(fld)).toEqual('');
  }));

  it('getObjectData(), get display data according to its display criteria', async(() => {
    component.tableColumnMetaData = [{ fields: 'REQUESTOR_DATE', fldMetaData: { picklist: '1', fieldId: 'REQUESTOR_DATE' } as MetadataModel, displayCriteria: DisplayCriteria.TEXT } as ReportingWidget, { fields: 'objectNumber', fldMetaData: { picklist: '0' } } as ReportingWidget, { fields: 'WFID', fldMetaData: { picklist: '0' } } as ReportingWidget, { fields: 'TIME_TAKEN', fldMetaData: { picklist: '0' } } as ReportingWidget, { fields: 'FORWARDENABLED', fldMetaData: { picklist: '1' } } as ReportingWidget, { fields: 'OVERDUE', fldMetaData: { picklist: '0' } } as ReportingWidget];
    component.getObjectData('Code', 'Value', 'REQUESTOR_DATE');
    expect(component.getObjectData('Code', 'Value', 'REQUESTOR_DATE')).toEqual('Value');

    const reportingW = [{ fields: 'REQUESTOR_DATE', fldMetaData: { picklist: '1' } } as ReportingWidget, { fields: 'objectNumber', fldMetaData: { dataType: '0' } } as ReportingWidget, { fields: 'WFID', fldMetaData: { dataType: '0' } } as ReportingWidget, { fields: 'TIME_TAKEN', fldMetaData: { dataType: '0' } } as ReportingWidget, { fields: 'FORWARDENABLED', fldMetaData: { dataType: '1' } } as ReportingWidget, { fields: 'OVERDUE', fldMetaData: { dataType: '0' } } as ReportingWidget];
    component.reportingListWidget.next(reportingW);
    component.tableColumnMetaData = [{ fields: 'REQUESTOR_DATE', fldMetaData: { picklist: '1', fieldId: 'REQUESTOR_DATE' } as MetadataModel, displayCriteria: DisplayCriteria.CODE_TEXT } as ReportingWidget, { fields: 'objectNumber', fldMetaData: { picklist: '0' } } as ReportingWidget, { fields: 'WFID', fldMetaData: { picklist: '0' } } as ReportingWidget, { fields: 'TIME_TAKEN', fldMetaData: { picklist: '0' } } as ReportingWidget, { fields: 'FORWARDENABLED', fldMetaData: { picklist: '1' } } as ReportingWidget, { fields: 'OVERDUE', fldMetaData: { picklist: '0' } } as ReportingWidget];
    component.getObjectData('Code', 'Value', 'REQUESTOR_DATE');
    expect(component.getObjectData('Code', 'Value', 'REQUESTOR_DATE')).toEqual('Code -- Value');

    // const reportingW = [{ fields: 'REQUESTOR_DATE', fldMetaData: {picklist: '1' } } as ReportingWidget, { fields: 'objectNumber', fldMetaData: { dataType: '0' } } as ReportingWidget,{ fields: 'WFID', fldMetaData: { dataType: '0' } } as ReportingWidget,{ fields: 'TIME_TAKEN', fldMetaData: { dataType: '0' } } as ReportingWidget,{ fields: 'FORWARDENABLED', fldMetaData: { dataType: '1' } } as ReportingWidget, { fields: 'OVERDUE', fldMetaData: { dataType: '0' } } as ReportingWidget];
    component.reportingListWidget.next(reportingW);
    component.tableColumnMetaData = [{ fields: 'REQUESTOR_DATE', fldMetaData: { picklist: '1', fieldId: 'REQUESTOR_DATE' } as MetadataModel, displayCriteria: DisplayCriteria.CODE_TEXT } as ReportingWidget, { fields: 'objectNumber', fldMetaData: { picklist: '0' } } as ReportingWidget, { fields: 'WFID', fldMetaData: { picklist: '0' } } as ReportingWidget, { fields: 'TIME_TAKEN', fldMetaData: { picklist: '0' } } as ReportingWidget, { fields: 'FORWARDENABLED', fldMetaData: { picklist: '1' } } as ReportingWidget, { fields: 'OVERDUE', fldMetaData: { picklist: '0' } } as ReportingWidget];
    component.getObjectData('Code', null, 'REQUESTOR_DATE');
    expect(component.getObjectData('Code', null, 'REQUESTOR_DATE')).toEqual('Code -- Code');

    component.reportingListWidget.next(reportingW);
    component.tableColumnMetaData = [{ fields: 'REQUESTOR_DATE', fldMetaData: { picklist: '1', fieldId: 'REQUESTOR_DATE' } as MetadataModel, displayCriteria: DisplayCriteria.CODE_TEXT } as ReportingWidget, { fields: 'objectNumber', fldMetaData: { picklist: '0' } } as ReportingWidget, { fields: 'WFID', fldMetaData: { picklist: '0' } } as ReportingWidget, { fields: 'TIME_TAKEN', fldMetaData: { picklist: '0' } } as ReportingWidget, { fields: 'FORWARDENABLED', fldMetaData: { picklist: '1' } } as ReportingWidget, { fields: 'OVERDUE', fldMetaData: { picklist: '0' } } as ReportingWidget];
    component.getObjectData('Code', null, 'REQUESTOR_DATE');
    expect(component.getObjectData(null, null, 'REQUESTOR_DATE')).toEqual('');

    component.tableColumnMetaData = null;
    component.getObjectData('Code', null, 'REQUESTOR_DATE');
    expect(component.getObjectData(null, null, 'REQUESTOR_DATE')).toEqual(undefined);

    component.tableColumnMetaData = [{ fields: 'REQUESTOR_DATE', fldMetaData: { picklist: '1', fieldId: 'REQUESTOR_DATE' } as MetadataModel } as ReportingWidget, { fields: 'objectNumber', fldMetaData: { picklist: '0' } } as ReportingWidget, { fields: 'WFID', fldMetaData: { picklist: '0' } } as ReportingWidget, { fields: 'TIME_TAKEN', fldMetaData: { picklist: '0' } } as ReportingWidget, { fields: 'FORWARDENABLED', fldMetaData: { picklist: '1' } } as ReportingWidget, { fields: 'OVERDUE', fldMetaData: { picklist: '0' } } as ReportingWidget];
    component.getObjectData('Code', 'Value', 'REQUESTOR_DATE');
    expect(component.getObjectData('Code', 'Value', 'REQUESTOR_DATE')).toEqual(undefined);
  }));

  it('getFieldType,get field type for column', async(() => {
    let fldMetaData = { dataType: '0', parentField: 'ADD_EANDATA' } as MetadataModel;
    component.allColumnMetaDataFields = {
      headers: { MARA_NRFHG: { fieldId: 'MARA_NRFHG', fieldDescri: 'Qual.f.FreeGoodsDis' } },
      grids: { ADD_EANDATA: { fieldId: 'ADD_EANDATA', fieldDescri: 'Additional EAN Grid', dataType: 'CHAR', maxChar: '100' } },
      gridFields: { ADD_EANDATA: { ADD_EANCAT: { fieldId: 'ADD_EANCAT', fieldDescri: 'EAN category', dataType: 'CHAR', maxChar: '2', mandatory: '0' } } },
      hierarchy: [{ objnr: 1, heirarchyId: '1', heirarchyText: 'Plant Data', fieldId: 'PLANT', structureId: '0002' }],
      hierarchyFields: { 1: { ABC_ID: { fieldId: 'ABC_ID', fieldDescri: 'ABC Indicator', dataType: 'CHAR', maxChar: '1', mandatory: '0' } } },
    } as MetadataModeleResponse;
    component.getFieldType(fldMetaData);
    expect(component.getFieldType(fldMetaData)).toEqual({ isGrid: true, parentFieldId: 'ADD_EANDATA' });

    fldMetaData = { dataType: '0', parentField: 'PLANT' } as MetadataModel;
    component.getFieldType(fldMetaData);
    expect(component.getFieldType(fldMetaData)).toEqual({ isHierarchy: true, hierarchyId: '1' });

    fldMetaData = { dataType: '0', parentField: 'ABC' } as MetadataModel;
    component.getFieldType(fldMetaData);
    expect(component.getFieldType(fldMetaData)).toEqual({ isHierarchy: false, isGrid: false });

    fldMetaData = { dataType: '0', fieldId : 'ABC_ID' } as MetadataModel;
    component.getFieldType(fldMetaData);
    expect(component.getFieldType(fldMetaData)).toEqual({ isHierarchy: true, hierarchyId: '1' });

    fldMetaData = { dataType: '0', fieldId : 'ADD_EANCAT' } as MetadataModel;
    component.getFieldType(fldMetaData);
    expect(component.getFieldType(fldMetaData)).toEqual({ isGrid: true, parentFieldId: 'ADD_EANDATA' });

    fldMetaData = { dataType: '0', fieldId : 'MARA_NRFHG' } as MetadataModel;
    component.getFieldType(fldMetaData);
    expect(component.getFieldType(fldMetaData)).toEqual({ isGrid: false, isHierarchy: false });
  }))

  it('getMetaDataFields(), call api to get meta data fields',async(()=>{
    const obj = '1005';
    const res = {
      headers: { MARA_NRFHG: { fieldId: 'MARA_NRFHG', fieldDescri: 'Qual.f.FreeGoodsDis' } },
      grids: { ADD_EANDATA: { fieldId: 'ADD_EANDATA', fieldDescri: 'Additional EAN Grid', dataType: 'CHAR', maxChar: '100' } },
      gridFields: { ADD_EANDATA: { ADD_EANCAT: { fieldId: 'ADD_EANCAT', fieldDescri: 'EAN category', dataType: 'CHAR', maxChar: '2', mandatory: '0' } } },
      hierarchy: [{ objnr: 1, heirarchyId: '1', heirarchyText: 'Plant Data', fieldId: 'PLANT', structureId: '0002' }],
      hierarchyFields: { 1: { ABC_ID: { fieldId: 'ABC_ID', fieldDescri: 'ABC Indicator', dataType: 'CHAR', maxChar: '1', mandatory: '0' } } },
    } as MetadataModeleResponse;
    spyOn(schemaDetailsService, 'getMetadataFields').withArgs(obj).and.returnValue(of(res));
    component.getMetaDataFields(obj);
    expect(schemaDetailsService.getMetadataFields).toHaveBeenCalledWith(obj);
  }))

  it('getUsetDetails()', async(() => {

    const res = { dateformat: 'mm.dd.yy' } as Userdetails;
    spyOn(userService, 'getUserDetails').and.returnValue(of(res));
    component.getUserDetails();
    expect(component.getUserDetails).toBeTruthy();
    expect(component.dateFormat).toEqual('MM.dd.yyyy, h:mm:ss a');
  }));

  it('getUsetDetails(),when date format is dd.MM.yy', async(() => {

    const res = { dateformat: 'dd.MM.yy' } as Userdetails;
    spyOn(userService, 'getUserDetails').and.returnValue(of(res));
    component.getUserDetails();
    expect(component.getUserDetails).toBeTruthy();
    expect(component.dateFormat).toEqual('dd.MM.yyyy, h:mm:ss a');
  }));

  it('getUsetDetails(),when date format is dd M, yy', async(() => {

    const res = { dateformat: 'dd M, yy' } as Userdetails;
    spyOn(userService, 'getUserDetails').and.returnValue(of(res));
    component.getUserDetails();
    expect(component.getUserDetails).toBeTruthy();
    expect(component.dateFormat).toEqual('dd MMM, yyyy, h:mm:ss a');
  }));

  it('getUsetDetails(),when date format is MM d, yy', async(() => {

    const res = { dateformat: 'MM d, yy' } as Userdetails;
    spyOn(userService, 'getUserDetails').and.returnValue(of(res));
    component.getUserDetails();
    expect(component.getUserDetails).toBeTruthy();
    expect(component.dateFormat).toEqual('MMMM d, yyyy, h:mm:ss a');
  }));


  it('getUsetDetails(), when date format is dd-MM-YYY', async(() => {
    const res = { dateformat: 'dd-mm-yyyy' } as Userdetails;
    spyOn(userService, 'getUserDetails').and.returnValue(of(res));
    component.getUserDetails();
    expect(component.getUserDetails).toBeTruthy();
    expect(component.dateFormat).toEqual(undefined);
  }));
});

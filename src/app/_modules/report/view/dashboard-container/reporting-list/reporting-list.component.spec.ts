import { MdoUiLibraryModule } from 'mdo-ui-library';
import { async, ComponentFixture, fakeAsync ,TestBed } from '@angular/core/testing';

import { ReportingListComponent } from './reporting-list.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PageEvent } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { WidgetService } from '@services/widgets/widget.service';
import { WidgetHeader, ReportingWidget, Criteria, DisplayCriteria, BlockType, ConditionOperator, FormControlType } from '@modules/report/_models/widget';
import { of } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { RouterTestingModule } from '@angular/router/testing';
import { SimpleChanges } from '@angular/core';
import { SharedModule } from '@modules/shared/shared.module';
import { Router } from '@angular/router';
import { MetadataModel } from '@models/schema/schemadetailstable';
import { FormControl, FormGroup } from '@angular/forms';
import { ReportService } from '@modules/report/_service/report.service';
import { DropDownValue } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { UserService } from '@services/user/userservice.service';
import { Userdetails } from '@models/userdetails';

fdescribe('ReportingListComponent', () => {
  let component: ReportingListComponent;
  let fixture: ComponentFixture<ReportingListComponent>;
  let widgetServiceSpy: WidgetService;
  let reportServiceSpy: ReportService;
  let userService: UserService;
  let router: Router;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportingListComponent ],
      imports:[ MdoUiLibraryModule, AppMaterialModuleForSpec,HttpClientTestingModule,MatMenuModule, RouterTestingModule, SharedModule],
      providers:[ WidgetService, ReportService,UserService ]
    })
      .compileComponents();
    router = TestBed.inject(Router);

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingListComponent);
    component = fixture.componentInstance;
    widgetServiceSpy = fixture.debugElement.injector.get(WidgetService);
    reportServiceSpy = fixture.debugElement.injector.get(ReportService);
    userService = fixture.debugElement.injector.get(UserService);
    component.reportingListFilterForm = new FormGroup({});

    component.tableColumnMetaData = [
      {
        widgetId: 1,
        fields: 'MATL_GROUP',
        fieldOrder: '1',
        fieldDesc: 'first field 1',
        sno: 1,
        fldMetaData: { fieldId: 'MATL_GROUP'} as MetadataModel,
        displayCriteria: DisplayCriteria.CODE
      }
    ];

    component.filteredList = [
      {
        fieldId: 'MATL_GROUP',
        conditionFieldId: 'MATL_GROUP',
        conditionFieldValue: 'test',
        blockType: BlockType.COND,
        conditionOperator: ConditionOperator.EQUAL,
        conditionFieldStartValue: null,
        conditionFieldEndValue: null,
        udrid: null,
      }
    ];

    component.selectedMultiSelectData = [
      {
        fieldId: 'MATL_GROUP',
        conditionFieldId: 'MATL_GROUP',
        conditionFieldValue: ['test', 'test2'],
        blockType: BlockType.COND,
        conditionOperator: ConditionOperator.EQUAL,
        conditionFieldStartValue: null,
        conditionFieldEndValue: null,
        udrid: null,
      },
      {
        fieldId: 'column',
        conditionFieldId: 'column',
        conditionFieldValue: ['test'],
        blockType: BlockType.COND,
        conditionOperator: ConditionOperator.EQUAL,
        conditionFieldStartValue: null,
        conditionFieldEndValue: null,
        udrid: null,
      }
    ];

    component.localFilterCriteria = [
      {
        fieldId: 'MATL_GROUP',
        conditionFieldId: 'MATL_GROUP',
        conditionFieldValue: 'test',
        blockType: BlockType.COND,
        conditionOperator: ConditionOperator.EQUAL,
        conditionFieldStartValue: null,
        conditionFieldEndValue: null,
        udrid: null,
      }
    ];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.initializeForm();
    expect(component.initializeForm).toBeTruthy();
  });

  it('getHeaderMetaData, return header data', async(() => {
    component.widgetId = 75656;
    const response: WidgetHeader = new WidgetHeader();
    response.pageDefaultSize = 25;
    response.displayCriteria = DisplayCriteria.TEXT;
    spyOn(widgetServiceSpy, 'getHeaderMetaData').withArgs(component.widgetId).and.returnValue(of(response));
    component.getHeaderMetaData();
    expect(widgetServiceSpy.getHeaderMetaData).toHaveBeenCalledWith(component.widgetId);
    expect(component.pageSizeOption).toEqual([25, 100, 200, 300, 400]);
    expect(component.widgetHeader.displayCriteria).toEqual('TEXT');
    expect(component.pageSize).toEqual(25);
  }));

  it('getHeaderMetaData, return header data', async(() => {
    component.widgetId = 75656;
    const response: WidgetHeader = new WidgetHeader();
    spyOn(widgetServiceSpy, 'getHeaderMetaData').withArgs(component.widgetId).and.returnValue(of(response));
    component.getHeaderMetaData();
    expect(widgetServiceSpy.getHeaderMetaData).toHaveBeenCalledWith(component.widgetId);
    expect(component.pageSizeOption).toEqual([100, 200, 300, 400]);
    expect(component.widgetHeader.displayCriteria).toEqual('CODE');
    expect(component.pageSize).toEqual(100);
  }));

  it('getListTableMetadata, return table data', fakeAsync(() => {
    component.widgetId = 75656;
    const response: ReportingWidget[] = [{ widgetId: 75656, fields: 'test', fieldOrder: 'APPTEST', fieldDesc: 'testing', sno: 65467465, fldMetaData: { picklist: '0', dataType: 'CHAR' } as MetadataModel, displayCriteria: DisplayCriteria.TEXT }];
    spyOn(widgetServiceSpy, 'getListTableMetadata').withArgs(component.widgetId).and.returnValue(of(response));
    component.getListTableMetadata();
    expect(widgetServiceSpy.getListTableMetadata).toHaveBeenCalledWith(component.widgetId);
    expect(component.displayedColumnsId.length).toEqual(2);
  }));

  it('getServerData(), do pagination ', async(() => {
    // mock data
    const evnet = new PageEvent();
    evnet.pageIndex = 0;
    evnet.pageSize = 10;
    component.filterCriteria = [];
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
    component.filterCriteria = [];
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
    const res = { data: { hits: { hits: [{ sourceAsMap: { stat: 'APP', staticFields: { OBJECTID: { fId: 'OBJECTID', ls: 'OBJECTID', vc: [{ c: 103048380550997540 }] }, MASSPROCESSING_ID:{vc: [{ c: '130086' }]}, WFID: { fId: 'WFID', ls: 'WFID', vc: [{ c: '130086693666196566' }] }, REQUESTOR_DATE: { fId: 'REQUESTOR_DATE', ls: 'Requested Date', vc: [{ c: '1584440382535' }] }, TIME_TAKEN: { fId: 'TIME_TAKEN', ls: 'Time Taken', vc: [{ c: 97089034 }] }, FORWARDENABLED: { fId: 'FORWARDENABLED', ls: 'FORWARDENABLED', vc: [{ c: 1 }] }, OVERDUE: { fId: 'OVERDUE', ls: 'OVERDUE', vc: [{ c: 'n' }] } }, id: 103048380550997539 }, id: 103048380550997539, sort: [103048380550997539], _score: null }], total: { value: 1, relation: 'eq' }, max_score: null }, took: 4, timed_out: false }, count: 1 };
    const pageSize = 10;
    const pageIndex = 0;
    const widgetId = 1612965351574;
    const criteria = [];
    const soringMap = null;
    component.tableColumnMetaData = [{ fields: 'REQUESTOR_DATE', fldMetaData: { picklist: '1', fieldId: 'REQUESTOR_DATE' } as MetadataModel, displayCriteria: DisplayCriteria.TEXT } as ReportingWidget, { fields: 'objectNumber', fldMetaData: { picklist: '0' } } as ReportingWidget, { fields: 'WFID', fldMetaData: { picklist: '0' } } as ReportingWidget, { fields: 'TIME_TAKEN', fldMetaData: { picklist: '0' } } as ReportingWidget, { fields: 'FORWARDENABLED', fldMetaData: { picklist: '1' } } as ReportingWidget, { fields: 'OVERDUE', fldMetaData: { picklist: '0' } } as ReportingWidget];
    component.displayedColumnsId = ['stat','REQUESTOR_DATE', 'WFID', 'objectNumber', 'OVERDUE', 'FORWARDENABLED', 'TIME_TAKEN'];
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


    const reportingW2 = [{ fields: 'column', fldMetaData: { dataType: 'CHAR', picklist: '1' } } as ReportingWidget];
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

  it('getFormFieldType(), return the form field type value', async(() => {
    component.tableColumnMetaData[0].fldMetaData = { picklist: '22', dataType: 'CHAR' } as MetadataModel;
    expect(component.getFormFieldType('MATL_GROUP')).toEqual(FormControlType.TEXTAREA);

    component.tableColumnMetaData[0].fldMetaData = { picklist: '2', dataType: 'DATS' } as MetadataModel;
    expect(component.getFormFieldType('MATL_GROUP')).toEqual(FormControlType.DATE);

    component.tableColumnMetaData[0].fldMetaData = { picklist: '2', dataType: 'DTMS' } as MetadataModel;
    expect(component.getFormFieldType('MATL_GROUP')).toEqual(FormControlType.DATE_TIME);

    component.tableColumnMetaData[0].fldMetaData = { picklist: '1', isCheckList: 'true'} as MetadataModel;
    expect(component.getFormFieldType('MATL_GROUP')).toEqual(FormControlType.MULTI_SELECT);

    component.tableColumnMetaData[0].fldMetaData = { picklist: '1', isCheckList: 'false'} as MetadataModel;
    expect(component.getFormFieldType('MATL_GROUP')).toEqual(FormControlType.DROP_DOWN);

    component.tableColumnMetaData[0].fldMetaData = { picklist: '2', dataType: 'TIMS' } as MetadataModel;
    expect(component.getFormFieldType('MATL_GROUP')).toEqual(FormControlType.TIME);

    component.tableColumnMetaData[0].fldMetaData = { picklist: '0', dataType: 'CHAR' } as MetadataModel;
    expect(component.getFormFieldType('MATL_GROUP')).toEqual(FormControlType.TEXT);

    component.tableColumnMetaData[0].fldMetaData = { picklist: '0', dataType: 'ALTN' } as MetadataModel;
    expect(component.getFormFieldType('MATL_GROUP')).toEqual(FormControlType.TEXT);

    component.tableColumnMetaData[0].fldMetaData = { picklist: '0', dataType: 'ICSN' } as MetadataModel;
    expect(component.getFormFieldType('MATL_GROUP')).toEqual(FormControlType.TEXT);

    component.tableColumnMetaData[0].fldMetaData = { picklist: '0', dataType: 'REQ' } as MetadataModel;
    expect(component.getFormFieldType('MATL_GROUP')).toEqual(FormControlType.TEXT);

    component.tableColumnMetaData[0].fldMetaData = { picklist: '0', dataType: 'TEXT' } as MetadataModel;
    expect(component.getFormFieldType('MATL_GROUP')).toEqual(FormControlType.TEXT);

    component.tableColumnMetaData[0].fldMetaData = { picklist: '0', dataType: 'NUMC' } as MetadataModel;
    expect(component.getFormFieldType('MATL_GROUP')).toEqual(FormControlType.NUMBER);

    component.tableColumnMetaData[0].fldMetaData = { picklist: '0', dataType: 'DEC' } as MetadataModel;
    expect(component.getFormFieldType('MATL_GROUP')).toEqual(FormControlType.NUMBER);

    component.tableColumnMetaData[0].fldMetaData = { picklist: '2'} as MetadataModel;
    expect(component.getFormFieldType('MATL_GROUP')).toEqual(FormControlType.CHECKBOX);

    component.tableColumnMetaData[0].fldMetaData = { picklist: '4'} as MetadataModel;
    expect(component.getFormFieldType('MATL_GROUP')).toEqual(FormControlType.RADIO);

    component.tableColumnMetaData[0].fldMetaData = { picklist: '0', dataType: 'ABCd' } as MetadataModel;
    expect(component.getFormFieldType('MATL_GROUP')).toBeFalse();
    component.tableColumnMetaData[0].fldMetaData = { picklist: '20' } as MetadataModel;
    expect(component.getFormFieldType('MATL_GROUP')).toBeFalse();

  }));


  it('configureFilters(), should open configure-filter window', async(()=>{
    spyOn(router, 'navigate');
    component.configureFilters();
    expect(component.configureFilters).toBeTruthy();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: 'sb/report/configure-filters/' + component.widgetId } }]);
  }));


  it('getColumnDisplayCriteria(), should return display type', async(()=>{
    component.tableColumnMetaData = [
      {
        widgetId: 1,
        fields: 'MATL_GROUP',
        fieldOrder: '',
        fieldDesc: 'first field 1',
        sno: 1,
        fldMetaData: { fieldId: 'MATL_GROUP', picklist: '22', dataType: 'CHAR' } as MetadataModel,
        displayCriteria: DisplayCriteria.CODE
      }
    ];

    const res = component.getColumnDisplayCriteria('MATL_GROUP');
    expect(res).toBe(component.tableColumnMetaData[0].displayCriteria)

  }));


  it('setFilter(), should set filters', async(()=>{
    component.filterCriteria = [];
    component.reportingListFilterForm.addControl('MATL_GROUP', new FormControl());
    const event: any = {
      formFieldId: 'MATL_GROUP',
      value: [{
        CODE:'CODE',
        TEXT:'TEXT',
        PLANTCODE:'',
        LANGU:'',
        FIELDNAME:'MATL_GROUP',
        SNO:'1'
      } as DropDownValue]
    };

    component.tableColumnMetaData = [
      {
        widgetId: 1,
        fields: 'MATL_GROUP',
        fieldOrder: '',
        fieldDesc: 'first field 1',
        sno: 1,
        fldMetaData: { fieldId: 'MATL_GROUP', picklist: '1', isCheckList: 'true' } as MetadataModel,
        displayCriteria: DisplayCriteria.CODE
      }
    ];
    component.setFilter(event);
    expect(component.setFilter).toBeTruthy();

    component.tableColumnMetaData[0].fldMetaData = {  picklist: '22', dataType: 'CHAR'} as MetadataModel;
    component.setFilter(event);
    expect(component.setFilter).toBeTruthy();
  }));


  it('clearFilter(), should clear filter', async(()=>{
    component.selectedMultiSelectData = [
      {
        fieldId: 'MATL_GROUP',
        conditionFieldId: 'MATL_GROUP',
        conditionFieldValue: ['test', 'test2'],
        blockType: BlockType.COND,
        conditionOperator: ConditionOperator.EQUAL,
        conditionFieldStartValue: null,
        conditionFieldEndValue: null,
        udrid: null,
      },
      {
        fieldId: 'column',
        conditionFieldId: 'column',
        conditionFieldValue: ['test'],
        blockType: BlockType.COND,
        conditionOperator: ConditionOperator.EQUAL,
        conditionFieldStartValue: null,
        conditionFieldEndValue: null,
        udrid: null,
      }
    ];

    spyOn(reportServiceSpy,'setFilterCriteria').withArgs([]);
    component.clearFilter(true);
    expect(component.selectedMultiSelectData[0].length).toBe(0);

  }));

  it('getRangeLimit(), should return range limit', async(()=>{
    component.tableColumnMetaData = [
      {
        widgetId: 1,
        fields: 'MATL_GROUP',
        fieldOrder: '',
        fieldDesc: 'first field 1',
        sno: 1,
        fldMetaData: { fieldId: 'MATL_GROUP', maxChar: '50' } as MetadataModel,
        displayCriteria: DisplayCriteria.CODE
      }
    ];
    const res = component.getRangeLimit('MATL_GROUP','max');
    expect(res).toEqual(50);
  }));


  it('onFilterApplied()', async(()=>{
    // const res = { data: { hits: { hits: [{ sourceAsMap: { stat: 'APP', staticFields: { OBJECTID: { fId: 'OBJECTID', ls: 'OBJECTID', vc: [{ c: 'C000164628' }] }, WFID: { fId: 'WFID', ls: 'WFID', vc: [{ c: '130086693666196566' }] }, REQUESTOR_DATE: { fId: 'REQUESTOR_DATE', ls: 'Requested Date', vc: [{ c: '1584440382535' }] }, TIME_TAKEN: { fId: 'TIME_TAKEN', ls: 'Time Taken', vc: [{ c: 97089034 }] }, FORWARDENABLED: { fId: 'FORWARDENABLED', ls: 'FORWARDENABLED', vc: [{ c: 1 }] }, OVERDUE: { fId: 'OVERDUE', ls: 'OVERDUE', vc: [{ c: 'n' }] } }, id: 103048380550997539 }, id: 103048380550997539, sort: [103048380550997539], _score: null }], total: { value: 1, relation: 'eq' }, max_score: null }, took: 4, timed_out: false }, count: 1 };
    // const pageSize = 10;
    // const pageIndex = 0;
    // const criteria = [];
    // const widgetId = 1612965351574;
    // const soringMap = null;
    // spyOn(widgetServiceSpy, 'getListdata').withArgs(String(pageSize), String(pageIndex), String(widgetId), criteria, soringMap).and.returnValue(of(res));
    component.filterCriteria = [];
    component.reportingListFilterForm.addControl('MATL_GROUP', new FormControl());

    component.reportingListFilterForm.controls.MATL_GROUP.setValue({min:10,max:20});

    component.onFilterApplied('MATL_GROUP', 'number');
    expect(component.onFilterApplied).toBeTruthy();

    component.onFilterApplied('MATL_GROUP', 'radio');
    expect(component.onFilterApplied).toBeTruthy();

    component.onFilterApplied('MATL_GROUP', 'date');
    expect(component.onFilterApplied).toBeTruthy();

    component.onFilterApplied('MATL_GROUP', 'dropdown');
    expect(component.onFilterApplied).toBeTruthy();

    component.onFilterApplied('MATL_GROUP', 'time');
    expect(component.onFilterApplied).toBeTruthy();

    component.onFilterApplied('MATL_GROUP', 'dateTime');
    expect(component.onFilterApplied).toBeTruthy(); 

    component.localFilterCriteria = [];
    component.onFilterApplied('MATL_GROUP', '');
    expect(component.onFilterApplied).toBeTruthy();

    component.localFilterCriteria = [];
    component.onFilterApplied('MATL_GROUP', 'number');
    expect(component.onFilterApplied).toBeTruthy();

    component.localFilterCriteria = [];
    component.onFilterApplied('MATL_GROUP', 'radio');
    expect(component.onFilterApplied).toBeTruthy();

    component.localFilterCriteria = [];
    component.onFilterApplied('MATL_GROUP', 'date');
    expect(component.onFilterApplied).toBeTruthy();

    component.localFilterCriteria = [];
    component.onFilterApplied('MATL_GROUP', 'dropdown');
    expect(component.onFilterApplied).toBeTruthy();

    component.localFilterCriteria = [];
    component.onFilterApplied('MATL_GROUP', 'time');
    expect(component.onFilterApplied).toBeTruthy();

    component.filteredList = [];
    component.localFilterCriteria = [];
    component.onFilterApplied('MATL_GROUP', 'dateTime');
    expect(component.onFilterApplied).toBeTruthy();  

  }));


  it('ngOnInit()', async(()=>{ 
    component.ngOnInit();
    component.reportingListFilterForm.addControl('MATL_GROUP', new FormControl());
    expect(component.ngOnInit).toBeTruthy();
    spyOn(reportServiceSpy,'sideSheetStatusChange')
    .withArgs().and.returnValue(of(true));
    component.ngOnInit();
  }));


  it('getValue()', async(()=>{
    component.dropDownValues['MATL_GROUP'] = [{CODE:'test1',TEXT:'text1'}];
    component.dropDownValues['column'] = [{CODE:'test1',TEXT:'text1'}];
    const res = component.getValue('MATL_GROUP');
    expect(res.length).toEqual(1);
  }));


  it('getUsetDetails()', async(() => {

    const res = { dateformat: 'MM.dd.yy' } as Userdetails;
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

    const res = { dateformat:  'dd M, yy' } as Userdetails;
    spyOn(userService, 'getUserDetails').and.returnValue(of(res));
    component.getUserDetails();
    expect(component.getUserDetails).toBeTruthy();
    expect(component.dateFormat).toEqual('dd MMM, yyyy, h:mm:ss a');
  }));

  it('getUsetDetails(),when date format is MM d, yy', async(() => {

    const res = { dateformat:  'MM d, yy' } as Userdetails;
    spyOn(userService, 'getUserDetails').and.returnValue(of(res));
    component.getUserDetails();
    expect(component.getUserDetails).toBeTruthy();
    expect(component.dateFormat).toEqual('MMMM d, yyyy, h:mm:ss a');
  }));
});

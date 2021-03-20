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

describe('ReportingListComponent', () => {
  let component: ReportingListComponent;
  let fixture: ComponentFixture<ReportingListComponent>;
  let widgetServiceSpy: WidgetService
  let router: Router;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportingListComponent ],
      imports:[AppMaterialModuleForSpec,HttpClientTestingModule,MatMenuModule, RouterTestingModule, SharedModule],
      providers:[ WidgetService ]
    })
    .compileComponents();
    router = TestBed.inject(Router);

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingListComponent);
    component = fixture.componentInstance;
    widgetServiceSpy = fixture.debugElement.injector.get(WidgetService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getHeaderMetaData, return header data', async (() => {
    component.widgetId = 75656;
    const response: WidgetHeader = new WidgetHeader();
    spyOn(widgetServiceSpy, 'getHeaderMetaData').withArgs(component.widgetId).and.returnValue(of(response));
    component.getHeaderMetaData();
    expect(widgetServiceSpy.getHeaderMetaData).toHaveBeenCalledWith(component.widgetId);

  }));

  it('getListTableMetadata, return table data', async (() => {
    component.widgetId = 75656;
    const response: ReportingWidget[] = [{widgetId:75656, fields:'test', fieldOrder:'APPTEST', fieldDesc:'testing', sno:65467465, fldMetaData:null}];
    spyOn(widgetServiceSpy, 'getListTableMetadata').withArgs(component.widgetId).and.returnValue(of(response));
    component.getListTableMetadata();
    expect(widgetServiceSpy.getListTableMetadata).toHaveBeenCalledWith(component.widgetId);
    expect(component.displayedColumnsId.length).toEqual(2);
  }));

  it('getServerData(), do pagination ', async(()=>{
    // mock data
    const evnet = new PageEvent();
    evnet.pageIndex= 0;
    evnet.pageSize= 10;

    const actualData =  component.getServerData(evnet);
    expect(evnet.pageSize).toEqual(actualData.pageSize);
    expect(evnet.pageIndex).toEqual(actualData.pageIndex);
  }));

  // it('details(), get the url', async(() =>{
  //   const data = {ObjectNumber:''};
  //   component.objectType = '';
  //   component.details(data);
  //   expect(component.details(data)).not.toBe(null);
  // }))
  it('downloadCSV, download the data', async (() => {
    spyOn(router, 'navigate');
    const widgetId= component.widgetId;
    component.downloadCSV()
    expect(router.navigate).toHaveBeenCalledWith(['',{ outlets: { sb: `sb/report/download-widget/${widgetId}` }}],  {queryParamsHandling: 'preserve'});
  }));

  it('sortTable(), sort the data in asc or desc ', async(() =>{
    const sort: Sort = {active:'2',direction: 'asc'} as Sort;
    component.sortTable(sort);

    expect(component.sortTable(sort)).not.toBe(null);

    const sort1: Sort = {active:'2', direction: ''} as Sort;
    component.sortTable(sort1);

    expect(component.sortTable(sort1)).not.toBe(null);

    expect(component.sortTable(null)).not.toBe(null);
  }));

  it('ngOnChanges(), should check if there are new filter criteria', async(() => {
    const filterCriteria = [{fieldId:'test'} as Criteria,{fieldId:'test1'} as Criteria];
    const chnages: SimpleChanges = {filterCriteria:{currentValue:filterCriteria, previousValue: null, firstChange:null, isFirstChange:null}};
    spyOn(component.reportingListWidget, 'next');
    component.ngOnChanges(chnages);
    expect(component.reportingListWidget.next).toHaveBeenCalled();
  }));

  it('getListdata(), should return the data of field', async(() => {
    const res = {data:{hits:{hits:[{_index:'localhost_workflow_do_0_en',_type:'_doc',sourceAsMap:{stat:'APP',staticFields:{OBJECTID:{fId:'OBJECTID',ls:'OBJECTID',vc:[{c:'C000164628'}]},WFID:{fId:'WFID',ls:'WFID',vc:[{c:'130086693666196566'}]},REQUESTOR_DATE:{fId:'REQUESTOR_DATE',ls:'Requested Date',vc:[{c:'1584440382535'}]},TIME_TAKEN:{fId:'TIME_TAKEN',ls:'Time Taken',vc:[{c:97089034}]},FORWARDENABLED:{fId:'FORWARDENABLED',ls:'FORWARDENABLED',vc:[{c:1}]},OVERDUE:{fId:'OVERDUE',ls:'OVERDUE',vc:[{c:'n'}]}},id:103048380550997539},id:103048380550997539,sort:[103048380550997539],_score:null}],total:{value:1,relation:'eq'},max_score:null},took:4,timed_out:false},count:1};
    const pageSize = 10;
    const pageIndex = 0;
    const widgetId = 1612965351574;
    const criteria = [];
    const soringMap = null;
    component.displayedColumnsId = ['objectNumber','REQUESTOR_DATE','WFID','TIME_TAKEN','FORWARDENABLED','OVERDUE'];
    const reportingW = [{ fields: 'REQUESTOR_DATE', fldMetaData: { dataType: 'DTMS' } } as ReportingWidget, { fields: 'objectNumber', fldMetaData: { dataType: '0' } } as ReportingWidget,{ fields: 'WFID', fldMetaData: { dataType: '0' } } as ReportingWidget,{ fields: 'TIME_TAKEN', fldMetaData: { dataType: '0' } } as ReportingWidget,{ fields: 'FORWARDENABLED', fldMetaData: { dataType: '1' } } as ReportingWidget, { fields: 'OVERDUE', fldMetaData: { dataType: '0' } } as ReportingWidget];
    component.reportingListWidget.next(reportingW);
    component.widgetHeader = {displayCriteria: DisplayCriteria.CODE} as WidgetHeader;
    spyOn(widgetServiceSpy,'getListdata').withArgs(String(pageSize), String(pageIndex), String(widgetId), criteria, soringMap).and.returnValue(of(res));

    component.getListdata(pageSize, pageIndex, widgetId, criteria, soringMap);

    expect(widgetServiceSpy.getListdata).toHaveBeenCalledWith(String(pageSize), String(pageIndex), String(widgetId), criteria, soringMap);
    expect(component.resultsLength).toEqual(1);
    expect(component.listData[0].REQUESTOR_DATE).toEqual('1584440382535');
    expect(component.listData[0].WFID).toEqual('130086693666196566');
    expect(component.listData[0].OVERDUE).toEqual('n');
    expect(component.listData[0].FORWARDENABLED).toEqual('1');
    expect(component.listData[0].TIME_TAKEN).toEqual('97089034');
    expect(component.listData[0].objectNumber).toEqual('C000164628');

    component.widgetHeader = {displayCriteria: DisplayCriteria.TEXT} as WidgetHeader;
    component.getListdata(pageSize, pageIndex, widgetId, criteria, soringMap);

    expect(widgetServiceSpy.getListdata).toHaveBeenCalledWith(String(pageSize), String(pageIndex), String(widgetId), criteria, soringMap);
    expect(component.resultsLength).toEqual(1);
    expect(component.listData[0].REQUESTOR_DATE).toEqual('1584440382535');
    expect(component.listData[0].WFID).toEqual('130086693666196566');
    expect(component.listData[0].OVERDUE).toEqual('No');
    expect(component.listData[0].FORWARDENABLED).toEqual('Yes');
    expect(component.listData[0].TIME_TAKEN).toEqual('1 d 2 h 58 m 9 s');
    expect(component.listData[0].objectNumber).toEqual('C000164628');

    component.widgetHeader = {displayCriteria: DisplayCriteria.CODE_TEXT} as WidgetHeader;
    component.getListdata(pageSize, pageIndex, widgetId, criteria, soringMap);

    expect(widgetServiceSpy.getListdata).toHaveBeenCalledWith(String(pageSize), String(pageIndex), String(widgetId), criteria, soringMap);
    expect(component.resultsLength).toEqual(1);
    expect(component.listData[0].REQUESTOR_DATE).toEqual('1584440382535');
    expect(component.listData[0].WFID).toEqual('130086693666196566');
    expect(component.listData[0].OVERDUE).toEqual('No');
    expect(component.listData[0].FORWARDENABLED).toEqual('Yes');
    expect(component.listData[0].TIME_TAKEN).toEqual('1 d 2 h 58 m 9 s');
    expect(component.listData[0].objectNumber).toEqual('C000164628');
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
});

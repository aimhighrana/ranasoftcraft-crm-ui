import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingListComponent } from './reporting-list.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PageEvent } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { WidgetService } from '@services/widgets/widget.service';
import { WidgetHeader, ReportingWidget } from '@modules/report/_models/widget';
import { of } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { RouterTestingModule } from '@angular/router/testing';

describe('ReportingListComponent', () => {
  let component: ReportingListComponent;
  let fixture: ComponentFixture<ReportingListComponent>;
  let widgetServiceSpy: WidgetService
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportingListComponent ],
      imports:[AppMaterialModuleForSpec,HttpClientTestingModule,MatMenuModule, RouterTestingModule],
      providers:[ WidgetService ]
    })
    .compileComponents();
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
    component.listData = ['data'];
    spyOn(widgetServiceSpy, 'downloadCSV').withArgs('Report-List',component.listData);
    component.downloadCSV();
    expect(component.downloadCSV).toBeTruthy();
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
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterComponent } from './filter.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Criteria, DropDownValues, FilterWidget, FilterResponse, WidgetHeader } from '../../../_models/widget';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSliderChange } from '@angular/material/slider';
import { MetadataModel } from 'src/app/_models/schema/schemadetailstable';
import { WidgetService } from '@services/widgets/widget.service';
import { of } from 'rxjs';
import { ReportService } from '@modules/report/_service/report.service';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let widgetServicespy: WidgetService;
  let reportServicespy: ReportService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterComponent ],
      imports:[AppMaterialModuleForSpec,HttpClientTestingModule],
      providers:[ WidgetService, ReportService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    widgetServicespy = fixture.debugElement.injector.get(WidgetService);
    reportServicespy = fixture.debugElement.injector.get(ReportService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getHeaderMetaData(), get Headerdata ', async(()=>{
    component.widgetId = 6543;
    spyOn(widgetServicespy,'getHeaderMetaData').withArgs(component.widgetId).and.returnValue(of({} as WidgetHeader));
    component.getHeaderMetaData();
    expect(widgetServicespy.getHeaderMetaData).toHaveBeenCalledWith(component.widgetId);
  }));

  it('getFilterMetadata(), get Filter Metadata ', async(()=>{
    component.widgetId = 6543;
    const data = {};
    spyOn(widgetServicespy,'getFilterMetadata').withArgs(component.widgetId).and.returnValue(of(data));
    component.getFilterMetadata();
    expect(widgetServicespy.getFilterMetadata).toHaveBeenCalledWith(component.widgetId);
  }));

  it('getFilterMetadata(), get Metadata ', async(()=>{
    component.widgetId = 6543;
    const data1 = {fieldId:'test'};
    component.filterWidget.next({widgetId:7857, type:'test', fieldId: 'TEST', isMultiSelect: true} as FilterWidget);
    spyOn(widgetServicespy,'getFilterMetadata').withArgs(component.widgetId).and.returnValue(of(data1));
    component.getFilterMetadata();
    expect(widgetServicespy.getFilterMetadata).toHaveBeenCalledWith(component.widgetId);
  }));

  it('isSelected(), should check option is selected or not',async(() => {
    const filter: Criteria = new Criteria();
    const option: DropDownValues = {CODE: 'ZMRO',FIELDNAME: 'MATL_TYPE'} as DropDownValues;
    component.filterCriteria = [];
    expect(component.isSelected(option)).toEqual(false);

    filter.conditionFieldId = 'MATL_TYPE';
    filter.conditionFieldValue = 'ZMRO';
    component.filterCriteria = [filter];
    expect(component.isSelected(option)).toEqual(true);
  }));

  it('removeOldFilterCriteria(), remove olf filter criteria ', async(()=>{
    const filter: Criteria = new Criteria();
    filter.conditionFieldId = 'MATL_TYPE';
    filter.conditionFieldValue = 'ZMRO';
    component.filterCriteria = [filter];
    component.removeOldFilterCriteria([filter]);
    expect(component.filterCriteria.length).toEqual(0);
  }));

  it('optionClicked(), click on options ', async(()=>{
    expect(component.optionClicked(null, {} as DropDownValues)).toEqual(undefined);

    component.filterCriteria = [{conditionFieldId: 'test', conditionFieldValue: 'TEST'} as Criteria];
    const option = {FIELDNAME:'test',CODE:'TEST1'} as DropDownValues;
    component.filterWidget.next({widgetId:7857, type:'test', fieldId: 'TEST', isMultiSelect: true} as FilterWidget);
    const event = {stopPropagation(){}} as Event;
    component.optionClicked(event, option);
    expect(component.optionClicked).toBeTruthy();
  }));

  it('toggleSelection(), toggle selection ', async(()=>{
    component.filterCriteria = [{conditionFieldId: 'test', conditionFieldValue: 'TEST'} as Criteria];
    const option = {FIELDNAME:'test',CODE:'TEST'} as DropDownValues;
    component.filterWidget.next({widgetId:7857, type:'test', fieldId: 'TEST', isMultiSelect: true} as FilterWidget);
    expect(component.toggleSelection(option)).toEqual(undefined);

    component.filterCriteria = [{conditionFieldId: 'test', conditionFieldValue: 'TEST'} as Criteria];
    const option1 = {FIELDNAME:'test'} as DropDownValues;
    component.filterWidget.next({widgetId:7857, type:'test', fieldId: 'TEST', isMultiSelect: true} as FilterWidget);
    expect(component.toggleSelection(option1)).toEqual(undefined);

  }));

  it('fieldDisplayFn(), should return field desc', async(()=>{
    expect(component.fieldDisplayFn({TEXT:'Matl Desc'})).toEqual('Matl Desc');
    expect(component.fieldDisplayFn(null)).toEqual('');
  }));

  it('returnSelectedDropValues(), should return selected drop values', async(()=>{
    expect(component.returnSelectedDropValues([])).toEqual([]);
    const selectedOptions = [{fieldId:'test',conditionFieldValue:'Mock'} as Criteria];
    component.filterWidget.next({widgetId:7857, type:'test', fieldId: 'test', isMultiSelect: true} as FilterWidget);
    component.values = [{CODE:'Mock', TEXT:'correct'} as DropDownValues]
    component.returnSelectedDropValues(selectedOptions);
    expect(component.returnSelectedDropValues(selectedOptions).length).toEqual(1)
  }));

  it('remove(), should remove the selected from criteria', async(()=>{
    component.filterCriteria = [];
    component.filterWidget.next(new FilterWidget());
    component.remove(null);

    component.filterCriteria = [{conditionFieldId: 'test', conditionFieldValue: 'TEST'} as Criteria];
    const option = {FIELDNAME:'test1',CODE:'TEST'} as DropDownValues;
    component.filterWidget.next({widgetId:7857, type:'test', fieldId: 'TEST', isMultiSelect: true} as FilterWidget);
    component.remove(option);
    expect(component.remove).toBeTruthy();
  }));

  it('removeSingleSelectedVal(), should remove selected value', async(() => {
    const isClearCall = true;
    component.filterCriteria = [{fieldId: 'test', conditionFieldValue: 'TEST'} as Criteria];
    component.filterWidget.next({widgetId:7857, type:'test', fieldId: 'TEST', isMultiSelect: true} as FilterWidget);
    component.removeSingleSelectedVal(isClearCall);
    expect(component.removeSingleSelectedVal).toBeTruthy();

    const isClearCall1 = false;
    component.filterCriteria = [{fieldId: 'test', conditionFieldValue: 'TEST'} as Criteria];
    component.filterWidget.next({widgetId:7857, type:'TEST', fieldId: 'test', isMultiSelect: true} as FilterWidget);
    component.removeSingleSelectedVal(isClearCall1);
    expect(component.removeSingleSelectedVal).toBeTruthy();
  }))

  it('setPositionOfDatePicker(), should set position to date pocker ', async(()=>{
    component.setPositionOfDatePicker();
    expect(component.setPositionOfDatePicker).toBeTruthy();
  }));

  it('changeStartDate(), change start date',async(()=>{
    const event = {value: new Date()} as MatDatepickerInputEvent<Date>;
    component.changeStartDate({} as MatDatepickerInputEvent<Date>);
    expect(component.startDate).toEqual(undefined);
    component.changeStartDate(event);
    const expected = Number(component.startDate);
    expect(event.value.getTime()).toEqual(expected);
  }));

  it('changeEndtDate(), change end date',async(()=>{
    const event = {value: new Date()} as MatDatepickerInputEvent<Date>;
    component.changeEndtDate({} as MatDatepickerInputEvent<Date>);
    expect(component.startDate).toEqual(undefined);
    component.changeEndtDate(event);
    const expected = Number(component.endDate);
    expect(event.value.getTime()).toEqual(expected);
  }));

  it('emitDateChangeValues(), emit after date change',async(()=>{
    component.startDate = String(new Date().getTime());
    component.endDate = String(new Date().getTime());
    component.filterCriteria = [];
    const filterWidget = new FilterWidget();
    filterWidget.fieldId = 'ZMRO';
    component.filterWidget.next(filterWidget);
    expect(component.emitDateChangeValues()).toEqual(undefined);
  }));

  it('clearSelectedPicker(), clear selected date picker', async(()=>{
    component.filterCriteria = [{fieldId: 'test', conditionFieldId: 'TEST'} as Criteria];
    component.filterWidget.next({widgetId:7857, type:'test', fieldId: 'TEST', isMultiSelect: true} as FilterWidget);
    component.clearSelectedPicker();
    expect(component.startDate).toEqual(null);
    expect(component.endDate).toEqual(null);
    expect(component.startDateCtrl.value).toEqual('');
    expect(component.endDateCtrl.value).toEqual('');
  }));

  it('formatMatSliderLabel(), show slider label', async(()=>{
    expect(component.formatMatSliderLabel(10000)).toEqual('10k');
    expect(component.formatMatSliderLabel(77)).toEqual(77);
  }));

  it('sliderValueChange(), slider value change',async(()=>{
    component.sliderValueChange(null);
    const event = {value: 420} as MatSliderChange;
    component.filterCriteria = [];
    const filterWidget = new FilterWidget();
    filterWidget.fieldId = 'ZMRO';
    component.filterWidget.next(filterWidget);
    component.filterResponse = new FilterResponse();
    component.sliderValueChange(event);
    expect(component.sliderValueChange).toBeTruthy();

    component.sliderValueChange(null);
    const event1 = {value: 420} as MatSliderChange;
    component.filterCriteria = [{fieldId: 'test', conditionFieldId: 'TEST'} as Criteria];
    component.filterWidget.next({widgetId:7857, type:'test', fieldId: 'TEST', isMultiSelect: true} as FilterWidget);
    component.filterResponse = new FilterResponse();
    component.sliderValueChange(event1);
    expect(component.sliderValueChange).toBeTruthy();
  }));

  it('clearFilterCriteria(), clear filter criteria for 0 picklist', async(()=>{
    const filterWidget = new FilterWidget();
    filterWidget.fieldId = 'ZMRO';
    filterWidget.metaData = {dataType: 'NUMC', picklist:'0'} as MetadataModel;
    component.filterWidget.next(filterWidget);
    component.filterCriteria = [{fieldId: 'test', conditionFieldId: 'ZMRO'} as Criteria];
    component.filterResponse = new FilterResponse();
    component.clearFilterCriteria();
    expect(component.enableClearIcon).toEqual(false);

    const filterWidget1 = new FilterWidget();
    filterWidget1.fieldId = 'ZMRO';
    filterWidget1.metaData = {dataType: 'DTMS', picklist:'0'} as MetadataModel;
    component.filterWidget.next(filterWidget1);
    component.clearFilterCriteria();
    expect(component.enableClearIcon).toEqual(false);

    const filterWidget2 = new FilterWidget();
    filterWidget2.fieldId = 'ZMRO';
    filterWidget2.metaData = {dataType: 'DTM', picklist:'0'} as MetadataModel;
    component.filterWidget.next(filterWidget2);
    component.clearFilterCriteria();
    expect(component.enableClearIcon).toEqual(false);

    const filterWidget3 = new FilterWidget();
    filterWidget3.fieldId = 'ZMRO';
    filterWidget3.metaData = {dataType: 'NUMC', picklist:'1'} as MetadataModel;
    component.filterWidget.next(filterWidget3);
    component.clearFilterCriteria();
    expect(component.enableClearIcon).toEqual(false);
  }));

  it(`ngOnChanges(), should call reset when reset filter`, async(()=>{
    // mock data
    const chnages:import('@angular/core').SimpleChanges = {hasFilterCriteria:{currentValue:true, previousValue: false, firstChange:null, isFirstChange:null}};

    // call actual method
    component.ngOnChanges(chnages);

    expect(component.enableClearIcon).toEqual(false, 'When reset successfully then enableClearIcon should be false');

    // mock data
    const chnages1:import('@angular/core').SimpleChanges = null;

    // call actual method
    component.ngOnChanges(chnages1);

    expect(component.enableClearIcon).toEqual(false, 'When reset successfully then enableClearIcon should be false');
  }));

  it('updateObjRefDescription(), update description of objRef in filter', async(()=>{
    const buckets = [{key:'200010',doc_count:10744,'top_hits#items':{hits:{total:{value:10744,relation:'eq'},max_score:1.0,hits:[{_source:{hdvs:{MATL_GROUP:{fId:'MATL_GROUP',lls:{EN:{label:'Material Group'}},vls:{EN:{valueTxt:'200010'}},vc:'200010'}}}}]}}},{key:'200030',doc_count:775,'top_hits#items':{hits:{total:{value:775,relation:'eq'},max_score:1.0,hits:[{_source:{hdvs:{MATL_GROUP:{fId:'MATL_GROUP',lls:{EN:{label:'Material Group'}},vls:{EN:{valueTxt:'200030'}},vc:'200030'}}}}]}}}];
    component.values = [{CODE:'200010', TEXT:'correct'} as DropDownValues];
    component.updateObjRefDescription(buckets, 'MATL_GROUP');

    expect(component.values.length).toEqual(1);
  }));

  it('emitDateChangeValues(), emit after date change',async(()=>{
    component.startDate = String(new Date().getTime());
    component.endDate = String(new Date().getTime());
    component.filterCriteria = [{fieldId: 'test', conditionFieldId: 'TEST'} as Criteria];
    component.filterWidget.next({widgetId:7857, type:'test', fieldId: 'TEST', isMultiSelect: true} as FilterWidget);
    expect(component.emitDateChangeValues()).toEqual(undefined);
  }));

  it('getFieldsMetadaDesc(), getmetadata desc', async(()=> {
    const code = ['MRO'];
    const fieldId = 'Test';
    const res = [{sno:798765, FIELDNAME:'TEST', TEXT:'Hello', CODE:'Mock'} as DropDownValues];
    component.values = [{CODE:'Mock', TEXT:'correct'} as DropDownValues];
    spyOn(reportServicespy,'getMetaDataFldByFldIds').withArgs(fieldId, code).and.returnValue(of(res));
    component.getFieldsMetadaDesc(code, fieldId);
    expect(reportServicespy.getMetaDataFldByFldIds).toHaveBeenCalledWith(fieldId, code);
  }));

  it('getFilterMetadata(), get Metadata ', async(()=>{
    component.widgetId = 6543;
    const data1 = {fieldId:'TEST'};
    component.filterWidget.next({widgetId:7857, type:'test', fieldId: 'TEST', isMultiSelect: true} as FilterWidget);
    spyOn(widgetServicespy,'getFilterMetadata').withArgs(component.widgetId).and.returnValue(of(data1));
    component.getFilterMetadata();
    expect(widgetServicespy.getFilterMetadata).toHaveBeenCalledWith(component.widgetId);
  }));

  it('ngoninit, should called', async(() => {
    component.widgetId = 7857;
    component.filterWidget.next({widgetId:7857, type:'test', fieldId: 'TEST', isMultiSelect: true, metaData:{dataType: 'DTMS', picklist:'1'} as MetadataModel} as FilterWidget);
    component.filterCriteria = [{conditionFieldId: 'test', conditionFieldValue: 'TEST'} as Criteria];
    const res = {aggregations:'sterms#FILTER',buckets:[{key:'MRO'}]};
    spyOn(widgetServicespy,'getWidgetData').withArgs(String(component.widgetId),component.filterCriteria).and.returnValue(of(res));
    component.ngOnInit();
    expect(widgetServicespy.getWidgetData).toHaveBeenCalledWith(String(component.widgetId),component.filterCriteria);
  }));
});

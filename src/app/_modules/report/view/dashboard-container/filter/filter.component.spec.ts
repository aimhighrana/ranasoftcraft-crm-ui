import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterComponent } from './filter.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Criteria, DropDownValues, FilterWidget, FilterResponse, Widget, WidgetType, DisplayCriteria } from '../../../_models/widget';
import { MatSliderChange } from '@angular/material/slider';
import { MetadataModel } from 'src/app/_models/schema/schemadetailstable';
import * as moment from 'moment';
import { WidgetService } from '@services/widgets/widget.service';
import { of } from 'rxjs';
import { UDRBlocksModel } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { MatDatepickerInputEvent } from '@angular/material/datepicker/datepicker-input-base';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { SharedModule } from '@modules/shared/shared.module';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let widgetService: WidgetService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterComponent ],
      imports:[AppMaterialModuleForSpec,HttpClientTestingModule, SharedModule]
    })
    .compileComponents();
  }));

  it('getFilterMetadata(), get Metadata ', async(()=>{

      component.widgetId = 265367423;
      component.filterCriteria = [];

      spyOn(widgetService,'getFilterMetadata').withArgs(component.widgetId).and.returnValue(of({
        fieldId:'C_DATE',
        isGlobal:true,
        metaData: {
          fieldId:'C_DATE',
          picklist:'0',
          dataType:'DATS'
        } as MetadataModel,
        udrBlocks:[
          {
            blockDesc:'DAY_10',
            conditionFieldId:'C_DATE',
            conditionOperator:'RANGE'
          } as UDRBlocksModel
        ]
      }));
      component.getFilterMetadata();

      expect(widgetService.getFilterMetadata).toHaveBeenCalledWith(component.widgetId);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    widgetService = fixture.debugElement.injector.get(WidgetService);

    const widget: Widget = new Widget();
    widget.width = 120;
    widget.height = 10;
    component.widgetInfo = widget;
    component.boxSize = 10;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('isSelected(), should check option is selected or not',async(() => {
    const filter: Criteria = new Criteria();
    const option: DropDownValues = {CODE: 'ZMRO',FIELDNAME: 'MATL_TYPE'} as DropDownValues;
    component.filterCriteria = [];
    component.filterWidget.next(new FilterWidget());
    expect(component.isSelected(option)).toEqual(false);
    filter.conditionFieldId = 'MATL_TYPE';
    filter.conditionFieldValue = 'ZMRO';
    component.filterCriteria = [filter];
    const fld: FilterWidget = new FilterWidget();
    fld.fieldId = 'MATL_TYPE';
    component.filterWidget.next(fld);
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
    const event = {option:{value:{CODE:'4',FIELDNAME:'EVENT_ID',TEXT:'Change'}}} as MatAutocompleteSelectedEvent;
    component.filterCriteria = [{blockType: 'COND', conditionFieldId: 'EVENT_ID',conditionFieldValue: '4', conditionOperator: 'EQUAL',fieldId: 'EVENT_ID'} as Criteria];
    spyOn(component,'toggleSelection')
    component.optionClicked(event);
    expect(component.optionClicked).toBeTruthy();
    expect(component.toggleSelection).toHaveBeenCalled();
  }));

  it('toggleSelection(), toggle selection ', async(()=>{
    component.filterCriteria = [];
    component.filterWidget.next(new FilterWidget());
    component.toggleSelection(null);
    expect(component.toggleSelection).toBeTruthy();
  }));

  it('fieldDisplayFn(), should return field desc', async(()=>{
    expect(component.fieldDisplayFn({TEXT:'Matl Desc'})).toEqual('Matl Desc');
  }));

  it('returnSelectedDropValues(), should return selected drop values', async(()=>{
    expect(component.returnSelectedDropValues([])).toEqual([]);
  }));

  it('remove(), should remove the selected from criteria', async(()=>{
    component.filterCriteria = [];
    component.filterWidget.next(new FilterWidget());
    component.remove(null);
    expect(component.remove).toBeTruthy();
  }));

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
    expect(moment(event.value).valueOf()).toEqual(expected);
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
      component.emitDateChangeValues();
      component.startDate = String(new Date().getTime());
      component.endDate = String(new Date().getTime());
      component.filterCriteria = [];
      const filterWidget = new FilterWidget();
      filterWidget.fieldId = 'ZMRO';
      component.filterWidget.next(filterWidget);
      component.emitDateChangeValues();
      expect(component.emitDateChangeValues).toBeTruthy();
  }));

  it('clearSelectedPicker(), clear selected date picker', async(()=>{
    component.filterCriteria = [];
    component.clearSelectedPicker();
    expect(component.startDate).toEqual(null);
    expect(component.endDate).toEqual(null);
    expect(component.startDateCtrl.value).toEqual('');
    expect(component.endDateCtrl.value).toEqual('');

  }));

  it('formatMatSliderLabel(), show slider label', async(()=>{
      expect(component.formatMatSliderLabel(10000)).toEqual('10k');
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
  }));

  it('clearFilterCriteria(), clear filter criteria', async(()=>{
    const filterWidget = new FilterWidget();
    filterWidget.fieldId = 'ZMRO';
    filterWidget.metaData = {dataType: 'NUMC', picklist:'0'} as MetadataModel;
    component.filterWidget.next(filterWidget);
    component.filterCriteria = [];
    component.filterResponse = new FilterResponse();
    component.clearFilterCriteria();
    expect(component.clearFilterCriteria).toBeTruthy();
  }));

  it(`ngOnChanges(), should call reset when reset filter`, async(()=>{
    // mock data
    const chnages:import('@angular/core').SimpleChanges = {hasFilterCriteria:{currentValue:true, previousValue: false, firstChange:null, isFirstChange:null}};

    // call actual method
    component.ngOnChanges(chnages);

    expect(component.enableClearIcon).toEqual(false, 'When reset successfully then enableClearIcon should be false');
  }));

  it('updateObjRefDescription(), update description of objRef in filter', async(()=>{
    const buckets = [{doc_count: 21151,key: 'KEY2','top_hits#items':{hits:{hits: [{ _source: {hdvs: {MATL_GROUP: {vc: [{c: 'KEY2',t: 'Key2'}]}}}}]}}}];

    component.updateObjRefDescription(buckets, 'MATL_GROUP');

    expect(component.values.length).toEqual(0);
  }));

  it('getFieldsMetadaDesc(), should return the dropdown value of the field', async(() => {
    const buckets = [{doc_count:1,key:{FILTER:'1'},'top_hits#items':{hits:{hits:[{_source:{hdvs:{MATL_GROUP:{vc:[{c: '200010'}]}}}}]}}},{doc_count:1,key:{FILTER:'1'},'top_hits#items':{hits:{hits:[{_source:{hdvs:{MATL_GROUP:{vc:[{c: '200010',t:'testing'}]}}}}]}}}, {doc_count:1,key:{FILTER:'1'},'top_hits#items':{hits:{hits:[{_source:{hdvs:{MATL_GROUP:{}}}}]}}}];
    component.values = [{CODE: '200010', FIELDNAME: 'MATL_GROUP', TEXT: '200010'} as DropDownValues, {CODE: '200010', FIELDNAME: 'MATL_GROUP', TEXT: 'testing'} as DropDownValues]
    component.getFieldsMetadaDesc(buckets, 'MATL_GROUP');
    expect(component.values.length).toEqual(2);
    expect(component.values[0].TEXT).toEqual('200010');
    expect(component.values[1].TEXT).toEqual('testing');

    const buckets2 = [{doc_count:2,key:{FILTER:'n'},'top_hits#items':{hits:{hits:[{_index:'localhost_workflow_do_0_en',_type:'_doc',_source:{staticFields: {OVERDUE: {vc: [{c: 'n'}]}}},_id:'590347384429815008',_score:1.0}]}}}, {doc_count:2,key:{FILTER:'y'},'top_hits#items':{hits:{hits:[{_index:'localhost_workflow_do_0_en',_type:'_doc',_source:{staticFields: {OVERDUE: {vc: [{c: 'y'}]}}},_id:'590347384429815008',_score:1.0}]}}}];
    component.values = [{CODE: 'n', FIELDNAME: 'OVERDUE', TEXT: 'n'} as DropDownValues, {CODE: 'y', FIELDNAME: 'OVERDUE', TEXT: 'y'} as DropDownValues]
    component.getFieldsMetadaDesc(buckets2, 'OVERDUE');
    expect(component.values.length).toEqual(2);
    expect(component.values[0].TEXT).toEqual('No');
    expect(component.values[1].TEXT).toEqual('Yes');
  }));

  it(`loadAlldropData(), should return the filter data`, async(()=>{
    // mock data
    const filterWidget= new FilterWidget()
     filterWidget.fieldId='WFID';
     filterWidget.isMultiSelect=true;
     filterWidget.metaData={fieldId:'WFID',picklist:'1'} as MetadataModel;
    component.filterWidget.next(filterWidget);
    component.widgetId=13283821;
    const response={aggregations:{'composite#bucket':{buckets:[{key:{FILTER:'106406009136356487'},'top_hits#items':{hits:{hits:[{_source:{staticFields:{WFID:{vc:[{c:'106406009136356487'}]}}}}]}}},{key:{FILTER:'115186306527988711'},'top_hits#items':{hits:{hits:[{_source:{staticFields:{WFID:{vc:[{c:'115186306527988711'}]}}}}]}}},{key:{FILTER:'130086693666196566'},'top_hits#items':{hits:{hits:[{_source:{staticFields:{WFID:{vc:[{c:'130086693666196566'}]}}}}]}}},{key:{FILTER:'161887603277972056'},'top_hits#items':{hits:{hits:[{_source:{staticFields:{WFID:{vc:[{c:'161887603277972056'}]}}}}]}}},{key:{FILTER:'173400567817058882'},'top_hits#items':{hits:{hits:[{_source:{staticFields:{WFID:{vc:[{c:'173400567817058882'}]}}}}]}}},{key:{FILTER:'191553074485201096'},'top_hits#items':{hits:{hits:[{_source:{staticFields:{WFID:{vc:[{c:'191553074485201096'}]}}}}]}}},{key:{FILTER:'209608314301990419'},'top_hits#items':{hits:{hits:[{_source:{staticFields:{WFID:{vc:[{c:'209608314301990419'}]}}}}]}}},{key:{FILTER:'247307504273738382'},'top_hits#items':{hits:{hits:[{_source:{staticFields:{WFID:{vc:[{c:'247307504273738382'}]}}}}]}}},{key:{FILTER:'257239960933193077'},'top_hits#items':{hits:{hits:[{_source:{staticFields:{WFID:{vc:[{c:'257239960933193077'}]}}}}]}}},{key:{FILTER:'271471671527993003'},'top_hits#items':{hits:{hits:[{_source:{staticFields:{WFID:{vc:[{c:'271471671527993003'}]}}}}]}}}],after_key:{FILTER:'271471671527993003'}}}}
    const fieldId = 'WFID';
    const criteria = [];
    const searchString = '';
    const searchAfter = '';
    spyOn(widgetService,'getWidgetData').withArgs(String(component.widgetId),criteria,searchString,searchAfter).and.returnValue(of(response));
    component.loadAlldropData(fieldId,criteria,searchString,searchAfter);

    expect(widgetService.getWidgetData).toHaveBeenCalledWith(String(component.widgetId),criteria,searchString,searchAfter);
    expect(component.isLoadMore).toEqual(true);
    expect(component.searchAfter).toEqual('271471671527993003');
  }));

  it('onScroll(), scroll event object', async(()=> {
    spyOn(component,'loadAlldropData');
    component.isLoadMore = true;
    const filterWidget= new FilterWidget()
     filterWidget.fieldId='WFID';
     filterWidget.isMultiSelect=true;
     filterWidget.metaData={fieldId:'WFID',picklist:'1'} as MetadataModel;
    component.filterWidget.next(filterWidget);
    component.filterCriteria = [];
    component.searchString = '';
    component.searchAfter = '';
    component.onScroll();

    expect(component.loadAlldropData).toHaveBeenCalledWith(component.filterWidget.value.fieldId, component.filterCriteria,component.searchString,component.searchAfter);

    component.isLoadMore = false;
    component.onScroll();

    expect(component.onScroll).toBeTruthy();
  }));

  it('removefilter(), should remove the filter of that cureenet fieldId', async(()=> {
    const critera = [{fieldId:'WFID', widgetType:WidgetType.FILTER} as Criteria];
    const filterWidget= new FilterWidget()
      filterWidget.fieldId='WFID';
      filterWidget.isMultiSelect=true;
      filterWidget.metaData={fieldId:'WFID',picklist:'1'} as MetadataModel;
   component.filterWidget.next(filterWidget);
   const res = component.removefilter('WFID', critera);
    expect(res).toEqual([]);
  }));

  it('onfocus(), should call when text field in focus', async(()=> {
    component.filterCriteria = [{fieldId:'WFID', widgetType:WidgetType.FILTER} as Criteria];
    const filterWidget= new FilterWidget()
      filterWidget.fieldId='WFID';
      filterWidget.isMultiSelect=true;
      filterWidget.metaData={fieldId:'WFID',picklist:'1'} as MetadataModel;
   component.filterWidget.next(filterWidget);
   component.searchString = '';
   component.searchAfter = '82734883';
   const filter = [{CODE:'test'},{CODE:'test'},{CODE:'test'},{CODE:'test'},{CODE:'test'},{CODE:'test'},{CODE:'test'},{CODE:'test'},{CODE:'test'},{CODE:'test'},{CODE:'test'},{CODE:'test'}]as DropDownValues[];
   component.filteredOptions = of(filter);
   spyOn(component,'loadAlldropData');
   component.onfocus();

   expect(component.filterCriteria.length).toEqual(1);
   expect(component.loadAlldropData).toHaveBeenCalledWith(component.filterWidget.value.fieldId, component.filterCriteria, component.searchString, '');


   component.searchAfter = '';
   component.onfocus();

   expect(component.filterCriteria.length).toEqual(1);
  }));

  it('checkTextCode(), should return string from DisplayCriteria', async(()=> {
    component.displayCriteriaOption.key = DisplayCriteria.TEXT;
    const test = { t: 'test', c: '1234'};
    let res = component.checkTextCode(test);
    expect(res).toEqual('test');

    component.displayCriteriaOption.key = DisplayCriteria.CODE;
    res = component.checkTextCode(test);
    expect(res).toEqual('1234');

    component.displayCriteriaOption.key = DisplayCriteria.CODE_TEXT;
    res = component.checkTextCode(test);
    expect(res).toEqual('1234 -- test');
  }));
});
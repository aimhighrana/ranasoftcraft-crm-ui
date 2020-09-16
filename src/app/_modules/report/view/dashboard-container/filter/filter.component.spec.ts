import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterComponent } from './filter.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Criteria, DropDownValues, FilterWidget, FilterResponse, Widget } from '../../../_models/widget';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSliderChange } from '@angular/material/slider';
import { MetadataModel } from 'src/app/_models/schema/schemadetailstable';
import * as moment from 'moment';
import { WidgetService } from '@services/widgets/widget.service';
import { of } from 'rxjs';
import { UDRBlocksModel } from '@modules/admin/_components/module/business-rules/business-rules.modal';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let widgetService: WidgetService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterComponent ],
      imports:[AppMaterialModuleForSpec,HttpClientTestingModule]
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
    component.optionClicked(null, {} as DropDownValues);
    expect(component.optionClicked).toBeTruthy();
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
    const buckets = [{key:'200010',doc_count:10744,'top_hits#items':{hits:{total:{value:10744,relation:'eq'},max_score:1.0,hits:[{_source:{hdvs:{MATL_GROUP:{fId:'MATL_GROUP',lls:{EN:{label:'Material Group'}},vls:{EN:{valueTxt:'200010'}},vc:'200010'}}}}]}}},{key:'200030',doc_count:775,'top_hits#items':{hits:{total:{value:775,relation:'eq'},max_score:1.0,hits:[{_source:{hdvs:{MATL_GROUP:{fId:'MATL_GROUP',lls:{EN:{label:'Material Group'}},vls:{EN:{valueTxt:'200030'}},vc:'200030'}}}}]}}}];

    component.updateObjRefDescription(buckets, 'MATL_GROUP');

    expect(component.values.length).toEqual(0);


  }));

});

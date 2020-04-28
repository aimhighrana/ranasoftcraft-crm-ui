import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterComponent } from './filter.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Criteria, DropDownValues, FilterWidget, FilterResponse } from '../../../_models/widget';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSliderChange } from '@angular/material/slider';
import { MetadataModel } from 'src/app/_models/schema/schemadetailstable';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterComponent ],
      imports:[AppMaterialModuleForSpec,HttpClientTestingModule]
    })
    .compileComponents();
  }));

  it('getFilterMetadata(), get Metadata ', async(()=>{
        component.getFilterMetadata();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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
    component.optionClicked(null, {} as DropDownValues);
  }));

  it('toggleSelection(), toggle selection ', async(()=>{
    component.filterCriteria = [];
    component.filterWidget.next(new FilterWidget());
    component.toggleSelection(null);
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
  }));

  it('setPositionOfDatePicker(), should set position to date pocker ', async(()=>{
    component.setPositionOfDatePicker();
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
      component.emitDateChangeValues();
      component.startDate = String(new Date().getTime());
      component.endDate = String(new Date().getTime());
      component.filterCriteria = [];
      const filterWidget = new FilterWidget();
      filterWidget.fieldId = 'ZMRO';
      component.filterWidget.next(filterWidget);
      component.emitDateChangeValues();
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
  }));

  it('clearFilterCriteria(), clear filter criteria', async(()=>{
    const filterWidget = new FilterWidget();
    filterWidget.fieldId = 'ZMRO';
    filterWidget.metaData = {dataType: 'NUMC', picklist:'0'} as MetadataModel;
    component.filterWidget.next(filterWidget);
    component.filterCriteria = [];
    component.filterResponse = new FilterResponse();
    component.clearFilterCriteria();
  }));
});

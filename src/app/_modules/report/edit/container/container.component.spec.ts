import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerComponent } from './container.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { ReactiveFormsModule, FormsModule, FormArray, FormGroup, FormControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Widget, WidgetTableModel } from '../../_models/widget';
import { MetadataModel } from 'src/app/_models/schema/schemadetailstable';
import { BreadcrumbComponent } from 'src/app/_modules/shared/_components/breadcrumb/breadcrumb.component';
import { SvgIconComponent } from '@modules/shared/_components/svg-icon/svg-icon.component';
import { ReportService } from '@modules/report/_service/report.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Metadata } from './metadatafield-control/metadatafield-control.component';

describe('ContainerComponent', () => {
  let component: ContainerComponent;
  let fixture: ComponentFixture<ContainerComponent>;
  beforeEach(async(() => {
    const schemaDetailsServiceSp = jasmine.createSpyObj(ReportService,['getDocCount']);
    TestBed.configureTestingModule({
      declarations: [ ContainerComponent, BreadcrumbComponent, SvgIconComponent ],
      imports:[AppMaterialModuleForSpec, ReactiveFormsModule, FormsModule, RouterTestingModule],
      providers:[
        {provide: ReportService,  useValue: schemaDetailsServiceSp}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('showStyle(), show style',async(()=>{
    component.showStyle(null);
    expect(component.selStyleWid).toEqual(undefined, 'If the widget is null , then Style widget should be undefined');

    // mock data
    const widget = new Widget();
    widget.widgetTableFields = [];
    component.showStyle(widget);
    expect(component.selStyleWid).toEqual(widget, 'If the widget has , then Style widget should be the same widget');
    expect(component.showProperty).toEqual(true, 'showProperty should be true');
    expect(component.chooseColumns).toEqual(widget.widgetTableFields,'Choose column array should be same to widget obj');

  }));

  it('isSelected(), check the field is selcted or not', async(()=>{
      const isSelectedObj = {fieldId:'Matl_TYPE'} as  MetadataModel;
      component.chooseColumns = [{fields:'Matl_TYPE'} as WidgetTableModel];
      expect(component.isSelected(isSelectedObj)).toEqual(true,'If the fld is exit on choose column then return true');
      component.chooseColumns = [];
      expect(component.isSelected(isSelectedObj)).toEqual(false,'If the fld is not exit on choose column then return false');

  }));

  it('ngAfterViewInit(), test ngAfterViewInit ',async(()=>{
    component.ngAfterViewInit();
    expect(component.screenWidth).toEqual(document.body.offsetWidth, 'Screen width should equal to container width');
    const expectedBoxSize = component.screenWidth / 200;
    expect(expectedBoxSize).toEqual(component.eachBoxSize, 'Check box size');
  }));

  it('preapreNewWidgetPosition(), prepare widget ',async(()=>{
    const widget = new Widget();
    widget.widgetId = '7254875287';
    component.widgetList = [];
    component.preapreNewWidgetPosition(widget);
    expect(component.widgetList.length).toEqual(1,'After push to widgetlist size should be 1');
    widget.x = 10;
    component.preapreNewWidgetPosition(widget);
    expect(component.widgetList[0].x).toEqual(10,'After update postion x');
  }));

  it('delete(), on widget delete',async(()=>{
    const widget = new Widget();
    widget.widgetId = '7254875287';
    component.widgetList = [widget];
    component.delete(widget);

    expect(component.selStyleWid).toEqual(new Widget(), 'style widget variable should be new object');
    expect(component.showProperty).toEqual(false, 'Style property panel is hide');
  }));

  it('ngOnInit(), check all pre require ', async(()=>{
    component.ngOnInit();
    const initialFrmGrp = {widgetName: '', width: '', height: '', field: '', aggregrationOp: '', filterType: '', isMultiSelect: false, groupById: '', objectType: '', imageUrl: '', htmlText: '', imagesno: '', imageName: ''};
    expect(component.subscriptions.length).toEqual(4, 'Size should be 4');
    expect(component.styleCtrlGrp.value).toEqual(initialFrmGrp, 'Initial form control value should be empty');
  }));

  it(`addMoreDefaultFilter(), should add controles to formArray`, async(()=>{
    // initialize form array
    component.defaultFilterCtrlGrp = new FormGroup({filters: new FormArray([])});
    const selStyleWid = new Widget();
    selStyleWid.widgetId = '274774721';
    component.selStyleWid = selStyleWid;
    // call actual method
    component.addMoreDefaultFilter();
    const frmArray = component.defaultFilterCtrlGrp.controls.filters as FormArray;
    expect(frmArray.length).toEqual(1, `Check length of defaultFilterCtrlGrp should be 1`);
  }));

  it('removeFilter(), should remove item from array ', async(()=>{
    // initialize form array
    component.defaultFilterCtrlGrp = new FormGroup({filters: new FormArray([new FormGroup({})])});

    // call actual method
    component.removeFilter(0);
    const frmArray = component.defaultFilterCtrlGrp.controls.filters as FormArray;
    expect(frmArray.length).toEqual(0, `After remove from array list  length should be 0`);
  }));

  it('onDefaultFilterChange(), while change value on defould filter', async(()=>{
    // mock data
    const metaData = {fieldId:'MATL_DESC', fieldDescri:'Desc'} as Metadata;
    const option = {option:{value:metaData}} as MatAutocompleteSelectedEvent;
    const index = 0;

    // call actual method
    component.defaultFilterCtrlGrp = new FormGroup({filters: new FormArray([new FormGroup({
      conditionFieldId: new FormControl('')
    })])});
    component.onDefaultFilterChange(option, index);

    const frmArray =  component.defaultFilterCtrlGrp.controls.filters as FormArray;
    expect(frmArray.length).toEqual(1, 'length should be 1');
    expect(frmArray.at(index).get('conditionFieldId').value).toEqual(metaData.fieldId, `Field id should equals ${metaData.fieldId}`);
  }));

  it('onGroupByChange(), while change value on group by id', async(()=>{
    // mock data
    const metaData = {fieldId:'MATL_DESC', fieldDescri:'Desc'} as Metadata;
    const option = {option:{value:metaData}} as MatAutocompleteSelectedEvent;

    // call actual method
    component.ngOnInit();
    component.onGroupByChange(option);
    expect(component.styleCtrlGrp.get('groupById').value).toEqual(metaData.fieldId, 'Group by id should equals ${metaData.fieldId}');
  }));

  it('onFieldChange(), while change value on field  id', async(()=>{
    // mock data
    const metaData = {fieldId:'MATL_DESC', fieldDescri:'Desc'} as Metadata;
    const option = {option:{value:metaData}} as MatAutocompleteSelectedEvent;

    // call actual method
    component.ngOnInit();
    component.onFieldChange(option);
    expect(component.styleCtrlGrp.get('field').value).toEqual(metaData.fieldId, 'Field id should equals ${metaData.fieldId}');
  }));

});

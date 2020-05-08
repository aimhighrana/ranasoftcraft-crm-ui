import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerComponent } from './container.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Widget, WidgetTableModel } from '../../_models/widget';
import { MetadataModel } from 'src/app/_models/schema/schemadetailstable';
import { BreadcrumbComponent } from 'src/app/_modules/shared/_components/breadcrumb/breadcrumb.component';

describe('ContainerComponent', () => {
  let component: ContainerComponent;
  let fixture: ComponentFixture<ContainerComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerComponent, BreadcrumbComponent ],
      imports:[AppMaterialModuleForSpec, ReactiveFormsModule, FormsModule, RouterTestingModule]
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


});

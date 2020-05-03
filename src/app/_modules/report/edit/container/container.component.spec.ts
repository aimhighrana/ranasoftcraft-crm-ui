import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerComponent } from './container.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Widget, WidgetTableModel } from '../../_models/widget';
import { MetadataModel } from 'src/app/_models/schema/schemadetailstable';

describe('ContainerComponent', () => {
  let component: ContainerComponent;
  let fixture: ComponentFixture<ContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerComponent ],
      imports:[AppMaterialModuleForSpec, ReactiveFormsModule, FormsModule, RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

});

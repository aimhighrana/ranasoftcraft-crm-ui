import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UdrConditionFormComponent } from './udr-condition-form.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl } from '@angular/forms';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { of } from 'rxjs';
import { BrConditionalFieldsComponent } from '../../br-conditional-fields/br-conditional-fields.component';
import { MetadataModel } from 'src/app/_models/schema/schemadetailstable';
import { DropDownValue, ConditionalOperator } from '../../business-rules.modal';

describe('UdrConditionFormComponent', () => {
  let component: UdrConditionFormComponent;
  let fixture: ComponentFixture<UdrConditionFormComponent>;
  let schemaService:SchemaService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UdrConditionFormComponent, BrConditionalFieldsComponent ],
      imports:[
        AppMaterialModuleForSpec, HttpClientTestingModule, ReactiveFormsModule, FormsModule
      ],
      providers:[
       SchemaService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UdrConditionFormComponent);
    component = fixture.componentInstance;
    schemaService = fixture.debugElement.injector.get(SchemaService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('possibleOperators(), get all conditional operator', async(()=>{
    // mockdata
    const ope: ConditionalOperator[] =  component.possibleOperators;
    expect(ope.length).toEqual(3);
    expect(ope[0].childs.length).toEqual(6);
    expect(ope[1].childs.length).toEqual(5);
    expect(ope[2].childs.length).toEqual(3);

  }));

  it('changeConditionalField(), after change conditional field', async(()=>{
    // mock data
    component.frmGroup = new FormGroup({
      fields: new FormControl('')
    });
    const obj: MetadataModel = {fieldId: 'MATL_DESC', picklist:'1'} as MetadataModel;
    // call actual method
    spyOn(schemaService, 'dropDownValues').withArgs(obj.fieldId, '').and.returnValue(of([]));
    component.initFrmArray();
    component.changeConditionalField(obj,0);
    expect(schemaService.dropDownValues).toHaveBeenCalledWith(obj.fieldId, '');

    const obj1 = {fieldId: 'MATL_DESC', picklist:'23'} as MetadataModel;
    component.changeConditionalField(obj1,0);
    expect(schemaService.dropDownValues).toHaveBeenCalledWith(obj1.fieldId, '');
  }));

  it('getdropDownValues(), get all dropdown values', async(()=>{
    // mockdata
    spyOn(schemaService, 'dropDownValues').withArgs('MATL_TYPE', '').and.returnValue(of([]));
    component.getdropDownValues('MATL_TYPE','');

    expect(schemaService.dropDownValues).toHaveBeenCalledWith('MATL_TYPE', '');

  }));

  it('dropValDisplayWith(), display with for description', async(()=>{
    // mockdata
    const data: DropDownValue = {CODE:'HAWA',TEXT:'Hawa material'} as DropDownValue;

    // call actual method
    const actualRes =  component.dropValDisplayWith(data);
    expect(actualRes).toEqual(data.TEXT);

    expect(component.dropValDisplayWith(null)).toEqual(null);

  }));

  it('operatorSelectionChng(), after select operator selection change', async(()=>{
    component.initFrmArray();
    component.operatorSelectionChng('Range',0);
    expect(component.frmArray.length).toEqual(1);
  }));

  // it('saveUpdateCondition(), save update conditionla field ', async(()=>{
  //   // mockdata
  //   component.frmGroup = new FormGroup({
  //     frmArray: new FormArray([new FormGroup({
  //       conditionDesc : new FormControl('32325'),
  //       fields:new FormControl('32325'),
  //       operator:new FormControl('32325'),
  //       conditionFieldValue:new FormControl(''),
  //       conditionFieldStartValue: new FormControl(''),
  //       conditionFieldEndValue: new FormControl(''),
  //       showRangeFld:new FormControl(false),
  // })])
  // });

  //   const request: UDRBlocksModel = new UDRBlocksModel();
  //   request.id = String(new Date().getTime());
  //   request.blockType = null;
  //   request.conditionFieldId = '32325';
  //   request.blockDesc = '32325';
  //   request.conditionFieldValue = '';
  //   request.conditionOperator = '32325';
  //   request.blockType = BlockType.COND;
  //   request.conditionFieldStartValue = '';
  //   request.conditionFieldEndValue = '';
  //   request.objectType = component.moduleId;
  //   // call actual method
  //   spyOn(schemaService, 'saveUpdateUdrBlock').and.callFake(()=>{return null});

  //   spyOn(component.evtAfterSaved,'emit').withArgs(null).and.callFake(()=>{return false;});
  //   component.saveUpdateCondition(request.id);

  //   expect(component.evtAfterSaved.emit).toHaveBeenCalledWith(null);

  // }));

  it('onKey(), should change the value in user input', async(() => {
    const event = {target:{value:'TEST'}};
    component.dropValues = [{TEXT:'TEST'} as DropDownValue];
    component.onKey(event);
    expect(component.dropValues.length).toEqual(1);

    component.onKey(null);
    expect(component.dropValues.length).toEqual(1);

    const event1 = {target:{value:7655}};
    component.onKey(event1);
    expect(component.dropValues.length).toEqual(1);
  }));

  it('addCondition(), should add a field',async(() => {
    component.initFrmArray();
    component.addCondition();
    expect(component.frmArray.length).toEqual(2);
  }));

  it('remove() should remove the already filled data', async(() => {
    component.initFrmArray();
    component.remove(0);
    expect(component.frmArray.length).toEqual(0);
  }));
});

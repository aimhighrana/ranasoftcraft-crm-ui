import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UdrConditionFormComponent } from './udr-condition-form.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { of } from 'rxjs';
import { BrConditionalFieldsComponent } from '../../br-conditional-fields/br-conditional-fields.component';
import { MetadataModel } from 'src/app/_models/schema/schemadetailstable';
import { DropDownValue, UDRBlocksModel } from '../../business-rules.modal';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { BlockType } from '../udr-cdktree.service';

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

  it('getBrConditionalOperator(), get all conditional operator', async(()=>{
    // mockdata
    const data: string[] = [];
    spyOn(schemaService, 'getBrConditionalOperator').and.returnValue(of(data));
    component.getBrConditionalOperator();

    expect(schemaService.getBrConditionalOperator).toHaveBeenCalledTimes(1);

  }));

  it('changeConditionalField(), after change conditional field', async(()=>{
    // mock data
    component.frmGroup = new FormGroup({
      fields: new FormControl('')
    });
    const obj: MetadataModel = {fieldId: 'MATL_DESC', picklist:'1'} as MetadataModel;
    // call actual method
    spyOn(schemaService, 'dropDownValues').withArgs(obj.fieldId, '').and.returnValue(of([]));
    component.changeConditionalField(obj);
    expect(schemaService.dropDownValues).toHaveBeenCalledWith(obj.fieldId, '');

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

  }));

  it('operatorSelectionChng(), check agrigation operator is range ', async(()=>{
    // mock data
    const data = {option:{value:'RANGE'}} as MatAutocompleteSelectedEvent;

    // call actual method
    component.operatorSelectionChng(data);

    expect(component.showRangeFld).toEqual(true);

  }));

  it('saveUpdateCondition(), save update conditionla field ', async(()=>{
    // mockdata
    component.frmGroup = new FormGroup({
      conditionDesc :new FormControl('123',Validators.required),
      fields:new FormControl('123',Validators.required),
      operator:new FormControl(''),
      conditionFieldValue:new FormControl(''),
      conditionFieldStartValue: new FormControl(''),
      conditionFieldEndValue: new FormControl(''),
    });

    const request: UDRBlocksModel = new UDRBlocksModel();
    request.id = String(new Date().getTime());
    request.blockType = null;
    request.conditionFieldId = component.frmGroup.value.fields.fieldId;
    request.blockDesc = component.frmGroup.value.conditionDesc;
    request.conditionFieldValue = typeof component.frmGroup.value.conditionFieldValue === 'string' ? component.frmGroup.value.conditionFieldValue : component.frmGroup.value.conditionFieldValue.CODE;
    request.conditionOperator = component.frmGroup.value.operator;
    request.blockType = BlockType.COND;
    request.conditionFieldStartValue = component.frmGroup.value.conditionFieldStartValue;
    request.conditionFieldEndValue = component.frmGroup.value.conditionFieldEndValue;
    // call actual method
    spyOn(schemaService, 'saveUpdateUdrBlock').withArgs([request]).and.returnValue(of([]));

    component.saveUpdateCondition(request.id);

    expect(schemaService.saveUpdateUdrBlock).toHaveBeenCalledWith([request]);

  }));


});

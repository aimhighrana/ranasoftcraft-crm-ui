import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVariantComponent } from './create-variant.component';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MetadataModel, MetadataModeleResponse } from '@models/schema/schemadetailstable';
import { SchemaService } from '@services/home/schema.service';
import { BrConditionalFieldsComponent } from '@modules/admin/_components/module/business-rules/br-conditional-fields/br-conditional-fields.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { DropDownValue } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { VariantDetails } from '@models/schema/schemalist';
import { SchemaVariantService } from '@services/home/schema/schema-variant.service';
import { DatePickerFieldComponent } from './date-picker-field/date-picker-field.component';
import { BreadcrumbComponent } from '@modules/shared/_components/breadcrumb/breadcrumb.component';
import { Router } from '@angular/router';

describe('CreateVariantComponent', () => {
  let component: CreateVariantComponent;
  let fixture: ComponentFixture<CreateVariantComponent>;
  let schemaService: SchemaService;
  let schemaDetailsServiceSpy: SchemaDetailsService;
  let schemaVariantServiceSpy: SchemaVariantService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateVariantComponent, BrConditionalFieldsComponent, DatePickerFieldComponent, BreadcrumbComponent ],
      imports:[
        AppMaterialModuleForSpec, HttpClientTestingModule, ReactiveFormsModule, FormsModule, RouterTestingModule
      ],
      providers:[
       SchemaService, SchemaDetailsService, SchemaVariantService
      ]
    })
    .compileComponents();
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVariantComponent);
    component = fixture.componentInstance;
    schemaService = fixture.debugElement.injector.get(SchemaService);
    schemaDetailsServiceSpy = fixture.debugElement.injector.get(SchemaDetailsService);
    schemaVariantServiceSpy = fixture.debugElement.injector.get(SchemaVariantService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngoninit(), load pre required', async(() => {
    component.variantId = '5545058109427633';
    component.ngOnInit();
    expect(component.frmArray.length).toEqual(1);
  }));

  it('getMetadataFields(), get existing metadata fields', async(() =>{
    component.moduleId = '1005';
    spyOn(schemaDetailsServiceSpy,'getMetadataFields').withArgs(component.moduleId).and.returnValue(of({} as MetadataModeleResponse))
    component.getMetadataFields();
    expect(schemaDetailsServiceSpy.getMetadataFields).toHaveBeenCalledWith(component.moduleId);
  }));

  it('makeMetadataControle(), help to make metadata control for all header , hierarchy and grid field ', async(()=>{
    component.metadataFields = {
      gridFields:{ADDINFO:{ADD_HEIGHT:{fieldId:'ADD_HEIGHT'}}},
      grids:{ADDINFO:{fieldId: 'ADDINFO'}}, headers:{AACR:{fieldId: 'AACR'}},
      hierarchy: [{ heirarchyId: '1', heirarchyText: 'Plant DATA' ,fieldId: 'PLANT', objectType: '1005', objnr: 1, structureId: '0002', tableName: 'PLANTDATA_0002' }],
      hierarchyFields:{1:{ABC_INDIC:{fieldId:'ABC_INDIC'}}}
    }
    component.makeMetadataControle();
    expect(component.metaDataFieldList.length).toEqual(3);
  }));

  // it('getExistingVariantData(), display the existing variant details', async(() => {
  //   component.variantId = '55450581093542';
  //   component.variantDesc = new FormControl('');
  //   component.initFrmArray();
  //   component.metaDataFieldList = [{fieldId: 'ADDINFO', picklist: '1'} as MetadataModel]
  //   const res = {
  //     variantName:'Material Type & To Date',
  //     udrBlocksModel:[{
  //       conditionFieldId: 'ADDINFO',
  //       conditionFieldValue: '2',
  //       conditionFieldStartValue: '',
  //       conditionFieldEndValue: '',
  //     } as UDRBlocksModel]
  //   } as any
  //   spyOn(schemaVariantServiceSpy,'getVariantdetailsByvariantId').withArgs(component.variantId).and.returnValue(of(res));
  //   component.getExistingVariantData();
  //   expect(schemaVariantServiceSpy.getVariantdetailsByvariantId).toHaveBeenCalledWith(component.variantId);
  // }));

  it('changeField(), after change conditional field', async(()=>{
    // mock data
    component.frmGroup = new FormGroup({
      fields: new FormControl('')
    });
    const obj = {fieldId: 'MATL_DESC', picklist:'1'} as MetadataModel;
    // call actual method
    spyOn(schemaService, 'dropDownValues').withArgs(obj.fieldId, '').and.returnValue(of([]));
    component.initFrmArray();
    component.changeField(obj,0);
    expect(schemaService.dropDownValues).toHaveBeenCalledWith(obj.fieldId, '');

    const obj1 = {fieldId: 'MATL_DESC', picklist:'23'} as MetadataModel;
    component.changeField(obj1,0);
    expect(schemaService.dropDownValues).toHaveBeenCalledWith(obj1.fieldId, '');

  }));

  it('dropValDisplayWith(), display with for description', async(()=>{
    // mockdata
    const data: DropDownValue = {CODE:'HAWA',TEXT:'Hawa material'} as DropDownValue;

    // call actual method
    const actualRes =  component.dropValDisplayWith(data);
    expect(actualRes).toEqual(data.TEXT);

    expect(component.dropValDisplayWith(null)).toEqual(null);
  }));

  it('selectComparisonValue(), after select comparison value', async(()=>{
    const event = {option:{value: 'MAT DATA'}} as MatAutocompleteSelectedEvent;
    // call actual method
    component.initFrmArray();
    component.selectComparisonValue(event,0);
    expect(component.frmArray.length).toEqual(1);

    const event1 = {option:null} as MatAutocompleteSelectedEvent;
    component.selectComparisonValue(event1,0);
    expect(component.frmArray.length).toEqual(1);
  }));

  it('operatorSelectionChng(), after select operator selection change', async(()=>{
    component.initFrmArray();
    component.operatorSelectionChng('Range',0);
    expect(component.frmArray.length).toEqual(1);
  }));

  it('remove() should remove the already filled data', async(() => {
    component.initFrmArray();
    component.remove(0);
    expect(component.frmArray.length).toEqual(0);
  }));

  it('onKey() should change the value', async(() => {
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

  it('addCondition() should emit the new array',async(() => {
    component.initFrmArray();
    component.addCondition();
    expect(component.frmArray.length).toEqual(2);
  }));

  it('conditionalFieldChange(), after select operator selection change', async(()=>{
    component.initFrmArray();
    component.conditionalFieldChange('TEST',0);
    expect(component.frmArray.length).toEqual(1);
  }));

  it('saveUpdateVariant(), should save & update the variant Details', async(()=> {
    const data: VariantDetails = new VariantDetails();
    data.schemaId = '7655656898';
    data.variantName = 'Material Type';
    data.variantId = 'new';
    component.initFrmArray();

    const res = '876568767';
    spyOn(schemaVariantServiceSpy,'saveUpdateSchemaVariant').withArgs(data as any).and.returnValue(of(res));
    component.saveUpdateVariant();
    expect(component.frmArray.length).toEqual(1);
  }));

  it('conditionalEndFieldChange(), after select operator selection change', async(()=>{
    component.initFrmArray();
    component.conditionalEndFieldChange('TEST',0);
    expect(component.frmArray.length).toEqual(1);

    component.conditionalEndFieldChange('',0);
    expect(component.frmArray.length).toEqual(1);
  }));

  it('getdropDownValues(), should returnthe dropdown value of sekected fields', async(() => {
    component.variantId = '8765498765';
    const fieldId = 'MATL_DESC';
    const index = 0;
    const res = [{CODE:'New1'} as DropDownValue]
    component.initFrmArray();
    spyOn(schemaService, 'dropDownValues').withArgs(fieldId, '').and.returnValue(of(res));
    component.getdropDownValues(fieldId,'',index);
    expect(schemaService.dropDownValues).toHaveBeenCalledWith(fieldId, '');

  }));

  it('close(), should navigate variant list', () => {
    component.moduleId = '10081',
    component.schemaId = '876567876'
    spyOn(router, 'navigate');
    component.close();
    expect(router.navigate).toHaveBeenCalledWith(['/home/schema/schema-variants', component.moduleId, component.schemaId]);
  });

});

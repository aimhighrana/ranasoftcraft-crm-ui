import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LookupFields, LookupFormData } from '@models/schema/schemadetailstable';
import { SchemaService } from '@services/home/schema.service';
import { of } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { FormInputComponent } from '../form-input/form-input.component';
import { NullStateComponent } from '../null-state/null-state/null-state.component';

import { LookupRuleComponent } from './lookup.component';

describe('LookupRuleComponent', () => {
  let component: LookupRuleComponent;
  let fixture: ComponentFixture<LookupRuleComponent>;
  let schemaService: SchemaService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LookupRuleComponent, FormInputComponent, NullStateComponent],
      imports: [AppMaterialModuleForSpec],
      providers: [
        MatSnackBarModule,
        FormsModule,
        ReactiveFormsModule,
        SchemaService,
        HttpClientModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LookupRuleComponent);
    component = fixture.componentInstance;
    schemaService = fixture.debugElement.injector.get(SchemaService);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getObjectTypes(), should call getAllObjectType', () => {
    spyOn(schemaService, 'getAllObjectType').and.returnValue(of([{ objectid: '1701', objectdesc: 'object'}]));
    component.getObjectTypes();
    expect(schemaService.getAllObjectType).toHaveBeenCalled();
    expect(component.modulesList.length).toEqual(1);
  });

  it('selectCurrentField(), should add field to selectedFields', () => {
    component.selectedFields = [];
    const fieldData = {
      option: {
        viewValue: 'Test field',
        value: '123',
      }
    }

    component.initForm();
    component.selectCurrentField(fieldData);
    expect(component.selectedFields.length).toEqual(1);
  });

  it('setLookupConfig(), should update field to selectedFields', () => {
    component.selectedFieldsCopy = [
      {
        enableUserField: false,
        fieldDescri: 'Test field',
        fieldId: 'fdg444',
        fieldLookupConfig: {
          lookupColumn: 'Table',
          lookupColumnResult: 'Field',
          moduleId: ''
        },
        lookupTargetField: 'Target',
        lookupTargetText: ''
      }
    ];

    const data: LookupFormData = {
      lookupColumn: 'Modified Table',
      lookupColumnResult: 'Modified Field',
      moduleId: ''
    }

    component.setLookupConfig(data, 0);
    const result = component.selectedFieldsCopy[0];
    expect(result.fieldLookupConfig.lookupColumn).toEqual('Modified Table');
    expect(result.fieldLookupConfig.lookupColumnResult).toEqual('Modified Field');
  });

  it('setLookupTargetField(), should emit lookup rule data', () => {
    component.selectedFieldsCopy = [
      {
        enableUserField: false,
        fieldDescri: 'Test field',
        fieldId: 'fdg444',
        fieldLookupConfig: {
          lookupColumn: 'Table',
          lookupColumnResult: 'Field',
          moduleId: ''
        },
        lookupTargetField: 'Target',
        lookupTargetText: ''
      }
    ];

    const eventEmitterSpy = spyOn(component.lookupRuleOutput, 'emit');
    component.setLookupTargetField('Target field modified', 0);
    expect(eventEmitterSpy).toHaveBeenCalled();
  });

  it('getInputValue(), should return input value', () => {
    component.modulesList = [
     { objectid: '56798',
      objectdesc: 'Value form module'}
    ];
    const result = component.getInputValue( {
      enableUserField: false,
      fieldDescri: 'Test field',
      fieldId: 'fdg444',
      fieldLookupConfig: {
        lookupColumn: 'Table',
        lookupColumnResult: 'Field',
        moduleId: '56798'
      },
      lookupTargetField: 'Target',
      lookupTargetText: ''
    });

    expect(result).toEqual('Value form module');
  });

  it('getValue(), should return ', () => {
    component.selectedFieldsCopy = [
      {
        enableUserField: false,
        fieldDescri: 'Test field',
        fieldId: 'fdg444',
        fieldLookupConfig: {
          lookupColumn: 'Table',
          lookupColumnResult: 'Field',
          moduleId: ''
        },
        lookupTargetField: 'Target',
        lookupTargetText: ''
      }
    ];

    expect(component.getValue(0,'')).toEqual(component.selectedFieldsCopy[0]);

    const value = component.getValue(0, 'fieldDescri');
    expect(value).toEqual('Test field');
  })

  it('getFieldLabel(), ', () => {
    component.fieldsObject.list = [
      {
        enableUserField: false,
        fieldDescri: 'Region',
        fieldId: 'fdg444',
        fieldLookupConfig: {
          lookupColumn: 'Table',
          lookupColumnResult: 'Field',
          moduleId: ''
        },
        lookupTargetField: 'Target',
        lookupTargetText: ''
      }
    ];

    expect(component.getFieldLabel({} as LookupFields)).toBeFalsy();

    const field = {
      fieldDescri: '',
      fieldId: 'fdg444',
      fieldLookupConfig: null,
      lookupTargetField: '',
      lookupTargetText: '',
      enableUserField: false
    }

    expect(component.getFieldLabel(field)).toEqual('Region');

    field.fieldDescri = 'Test field';
    expect(component.getFieldLabel(field)).toEqual('Test field');
  })

  it('ngOnInit()', () => {

    spyOn(component, 'initForm');
    spyOn(component, 'getObjectTypes');
    spyOn(component, 'patchLookupData');

    component.ngOnInit();

    expect(component.initForm).toHaveBeenCalledTimes(1);
    expect(component.getObjectTypes).toHaveBeenCalledTimes(1);
    expect(component.patchLookupData).toHaveBeenCalledTimes(1);

  });

  it('should patch lookup data', () => {

    component.initialLookupData = [];

    spyOn(component, 'emitLookupRuleData');
    component.patchLookupData();
    expect(component.emitLookupRuleData).toHaveBeenCalled();

  })

  it('should get autocomplete display text', () => {
    expect(component.displayFn(null)).toEqual('');
    expect(component.displayFn({fieldDescri: 'status'})).toEqual('status');
  })

  it('should check if manual input is enabled', () => {
    expect(component.isEnabled(0)).toEqual(false);

    component.selectedFieldsCopy = [{fieldId: 'region', enableUserField: true}] as LookupFields[];
    expect(component.isEnabled(0)).toEqual(true);
  })

  it('should updateTargetValue', () => {

    const obj = {labelKey: 'desc', valueKey: 'value', list: []}
    component.updateTargetValue(obj);
    expect(component.fieldsObject).toEqual(obj);
  })

});

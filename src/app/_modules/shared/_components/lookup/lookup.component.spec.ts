import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LookupFormData } from '@models/schema/schemadetailstable';
import { SchemaService } from '@services/home/schema.service';
import { of } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { LookupRuleComponent } from './lookup.component';

describe('LookupRuleComponent', () => {
  let component: LookupRuleComponent;
  let fixture: ComponentFixture<LookupRuleComponent>;
  let schemaService: SchemaService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LookupRuleComponent],
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
    spyOn(schemaService, 'getAllObjectType').and.returnValue(of(null));
    component.getObjectTypes();
    expect(schemaService.getAllObjectType).toHaveBeenCalled();
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

    const value = component.getValue(0, 'fieldDescri');
    expect(value).toEqual('Test field');
  })

  it('getFieldLabel(), ', () => {
    component.fieldsObject.list = [
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

    const value = component.getFieldLabel({
      fieldDescri: 'Test field',
      fieldId: 'fdg444',
      fieldLookupConfig: null,
      lookupTargetField: '',
      lookupTargetText: '',
      enableUserField: false
    });

    expect(value).toEqual('Test field');
  })

});

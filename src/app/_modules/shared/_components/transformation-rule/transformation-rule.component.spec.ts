import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { FieldConfiguration } from '@models/schema/schemadetailstable';

import { TransformationRuleComponent } from './transformation-rule.component';
import { BusinessRuleType } from '@modules/admin/_components/module/business-rules/business-rules.modal';

describe('TransformationRuleComponent', () => {
  let component: TransformationRuleComponent;
  let fixture: ComponentFixture<TransformationRuleComponent>;
  const dummyValue: FieldConfiguration = {
    labelKey: 'label',
    valueKey: 'val',
    list: [
      {
        label: 'Test Field',
        value: 123
      },
      {
        label: 'Test Field two',
        value: 233
      },
      {
        label: 'Test Field three',
        value: '987'
      },
    ]
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TransformationRuleComponent],
      imports: [AppMaterialModuleForSpec],
      providers: [
        FormsModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatAutocompleteModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransformationRuleComponent);
    component = fixture.componentInstance;

    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initializeForm(), form should be initialized and initial values should be patched', () => {
    component.initialTransformationData = {
      excludeScript: 'test_excludeScript',
      includeScript: 'test_includeScript',
      sourceFields: 'test_sourceFields',
      targetFields: 'test, test2',
      selectedTargetFields: [{
        fieldId: 'testId',
        fieldDescri: 'Test field'
      }]
    }
    component.initializeForm();
    expect(component.form.controls.excludeScript.value).toEqual('test_excludeScript');
    expect(component.form.controls.includeScript.value).toEqual('test_includeScript');
    expect(component.form.controls.sourceFields.value).toEqual('test_sourceFields');
    expect(component.form.controls.targetFields.value).toEqual('test, test2');
  });

  it('updateTargetValue(), target value should update', () => {
    component.updateTargetValue(dummyValue)
    expect(component.targetFieldsObject).toEqual(dummyValue);
  });

  it('updateSourceValue(), source value should update', () => {
    component.updateSourceValue(dummyValue)
    expect(component.sourceFieldsObject).toEqual(dummyValue);
  });

  it('selectTargetField() with argument event, should add passed value to selectedTargetFields ', () => {
    component.targetFieldsObject = dummyValue;
    component.initializeForm();
    const mockEvent = {
      option: {
        value: 'newVal',
        viewValue: 'New Value'
      }
    }
    component.selectTargetField(mockEvent);
    expect(component.selectedTargetFields.length).toEqual(1);
  });

  it('selectSourceField() with argument event, should add passed value to selectedSourceField ', () => {
    component.sourceFieldsObject = dummyValue;
    component.initializeForm();
    const mockEvent = {
      option: {
        value: 'newVal',
        viewValue: 'New Value'
      }
    }
    const result = {
      label: 'New Value',
      val: 'newVal'
    }
    component.selectSourceField(mockEvent);
    expect(component.selectedSourceField).toEqual(result);
  });

  it('removeTargetField(), remove from target field array', () => {
    component.selectedTargetFields = [...dummyValue.list];
    component.removeTargetField(0)
    expect(component.selectedTargetFields.length).toEqual(2);
  });

  it('isTransformationRule, isTransformationLookupRule, should check selected rule and return boolean', () => {
    component.selectedRuleType = BusinessRuleType.BR_TRANSFORMATION_RULE;
    expect(component.isTransformationRule).toBeTrue();
    expect(component.isTransformationLookupRule).toBeFalse();
  });

  it('displayFnTarget(), should return a display value', () => {
    component.targetFieldsObject = dummyValue;
    expect(component.displayFnTarget(dummyValue.list[0])).toEqual('Test Field')
  })
});

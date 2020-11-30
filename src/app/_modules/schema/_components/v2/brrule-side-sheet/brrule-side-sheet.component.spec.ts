import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrruleSideSheetComponent } from './brrule-side-sheet.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { FormInputComponent } from '@modules/shared/_components/form-input/form-input.component';
import { SetupDuplicateRuleComponent } from './duplicate-rule-config/setup-duplicate-rule/setup-duplicate-rule.component';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { MetadataModeleResponse } from '@models/schema/schemadetailstable';
import { of } from 'rxjs';
import { BusinessRuleType, ConditionalOperator } from '@modules/admin/_components/module/business-rules/business-rules.modal';

describe('BrruleSideSheetComponent', () => {
  let component: BrruleSideSheetComponent;
  let fixture: ComponentFixture<BrruleSideSheetComponent>;
  let schemaDetailsServicespy: SchemaDetailsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BrruleSideSheetComponent, FormInputComponent, SetupDuplicateRuleComponent],
      imports: [
        HttpClientTestingModule, AppMaterialModuleForSpec, RouterTestingModule
      ],
      providers: [SchemaDetailsService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrruleSideSheetComponent);
    component = fixture.componentInstance;
    component.fieldsList = [
      { fieldId: '1', fieldDescri: 'first name' }
    ];
    schemaDetailsServicespy = fixture.debugElement.injector.get(SchemaDetailsService);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init common data form', () => {

    component.buildCommonDataForm();
    expect(component.form).toBeDefined();

  });

  it('should get conditions', () => {

    expect(component.getConditions()[0]).toEqual('And');
    expect(component.getConditions().length).toEqual(2);

  });

  it('getFieldsByModuleId(), get the fields on basis of module', (() => {
    component.moduleId = '1005';
    const metadataModeleResponse = { headers: [{ fieldId: 'MATL', fieldDescri: 'material location' }] } as MetadataModeleResponse;
    spyOn(schemaDetailsServicespy, 'getMetadataFields').withArgs(component.moduleId).and.returnValue(of(metadataModeleResponse))
    component.getFieldsByModuleId();
    expect(schemaDetailsServicespy.getMetadataFields).toHaveBeenCalledWith(component.moduleId);
  }));

  it('formatLabel(), return value in string', async(() => {
    const value = 'Test';
    expect(component.formatLabel(value)).toEqual('Test');
  }));

  it('getCategories(), should call getAllCategoryInfo', () => {
    spyOn(schemaDetailsServicespy, 'getAllCategoryInfo').and.callFake(() => of(null));
    component.getCategories();
    expect(schemaDetailsServicespy.getAllCategoryInfo).toHaveBeenCalled();
  });

  it('remove(), remove the value', (() => {
    component.selectedFields = ['NDC_TYPE'];
    component.remove('NDC_TYPE', 0);
    expect(component.selectedFields.length).toEqual(0);
  }));

  it('isRegexType, sould return true if selected rule is regex type', (() => {
    component.buildCommonDataForm();
    component.form.controls.rule_type.setValue(BusinessRuleType.BR_REGEX_RULE);
    expect(component.isRegexType).toBeTrue();
  }));

  it('isTransformationRule, sould return true if selected rule is transformation type', (() => {
    component.buildCommonDataForm();
    component.form.controls.rule_type.setValue(BusinessRuleType.BR_TRANSFORMATION_RULE);
    expect(component.isTransformationRule).toBeTrue();
  }));

  it('isUDR, sould return true if selected rule is custom script type', (() => {
    component.buildCommonDataForm();
    component.form.controls.rule_type.setValue(BusinessRuleType.BR_CUSTOM_SCRIPT);
    expect(component.isUDR).toBeTrue();
  }));

  it('possibleOperators(), sould return array of all possible operators', (() => {
    const operators: ConditionalOperator[] = component.possibleOperators();
    expect(operators.length).toEqual(3);
  }));

});
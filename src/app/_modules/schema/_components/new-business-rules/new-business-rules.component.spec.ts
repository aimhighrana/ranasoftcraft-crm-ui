import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBusinessRulesComponent } from './new-business-rules.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { MetadataModeleResponse } from '@models/schema/schemadetailstable';
import { of } from 'rxjs';
import { BusinessRuleType, ConditionalOperator, CoreSchemaBrInfo } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { FormGroup } from '@angular/forms';

describe('NewBusinessRulesComponent', () => {
    let component: NewBusinessRulesComponent;
    let fixture: ComponentFixture<NewBusinessRulesComponent>;
    let schemaDetailsServicespy: SchemaDetailsService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NewBusinessRulesComponent],
            imports: [AppMaterialModuleForSpec],
            providers: [
                HttpClientTestingModule,
                SchemaDetailsService,
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: [] },
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NewBusinessRulesComponent);
        component = fixture.componentInstance;
        component.data.fields = [];
        schemaDetailsServicespy = fixture.debugElement.injector.get(SchemaDetailsService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('formatLabel(), return value in string', async(() => {
        const value = 'Test';
        expect(component.formatLabel(value)).toEqual('Test');
    }));

    it('displayFn(), has return field description', async(() => {
        const value = { fieldDescri: 'NDC TYPE', fieldId: 'NDC_TYPE' };
        expect(component.displayFn(value)).toEqual('NDC TYPE');
        const value1 = null;
        expect(component.displayFn(value1)).toEqual('');
    }));

    it('createDSByFields(), create fields on the basis of excel file', async(() => {
        component.data = { fields: [{ fieldId: 'MAL_TL', fieldDescri: 'MATERIIAL Description' }] };
        component.createDSByFields();
        expect(component.fieldsList.length).toEqual(1);
    }));

    it('getFieldsByModuleId(), get the fields on basis of module', (() => {
        component.data = { moduleId: '1005' };
        const metadataModeleResponse = { headers: [{ fieldId: 'MATL', fieldDescri: 'material location' }] } as MetadataModeleResponse;
        spyOn(schemaDetailsServicespy, 'getMetadataFields').withArgs(component.data.moduleId).and.returnValue(of(metadataModeleResponse))
        component.getFieldsByModuleId();
        expect(schemaDetailsServicespy.getMetadataFields).toHaveBeenCalledWith(component.data.moduleId);
    }));

    it('remove(), remove the value', (() => {
        component.selectedFields = ['NDC_TYPE'];
        component.remove('NDC_TYPE', 0);
        expect(component.selectedFields.length).toEqual(0);
    }));

    it('addBlock(), should add the values', async(() => {
        component.udrBlocks = [{ id: '76675675', blockTypeText: 'or', fieldId: 'NDC_TYPE', operator: 'EQUAL', comparisonValue: '78', actionDisabled: false, rangeStartValue: '', rangeEndValue: '', children: [] }, { id: '76675685', blockTypeText: 'When', fieldId: 'ND_TYPE', operator: 'EQUAL', comparisonValue: '78', actionDisabled: false, rangeStartValue: '', rangeEndValue: '', children: [] }]
        component.addBlock(false, {}, 2);
        expect(component.udrBlocks.length).toEqual(3);
    }));

    it('getCategories(), should call getAllCategoryInfo', () => {
        spyOn(schemaDetailsServicespy, 'getAllCategoryInfo').and.callFake(() => of(null));
        component.getCategories();
        expect(schemaDetailsServicespy.getAllCategoryInfo).toHaveBeenCalled();
    });

    it('createDSByFields(), should add fields to target and source fields', () => {
        component.data.fields = [
            {
                fieldDescri: 'test',
                fieldId: '123'
            }
        ];
        component.createDSByFields();
        expect(component.targetFieldsObject.list.length).toEqual(1);
        expect(component.sourceFieldsObject.list.length).toEqual(1);
    });

    it('isRegexType, sould return true if selected rule is regex type', (() => {
        component.initializeForm();
        component.form.controls.rule_type.setValue(BusinessRuleType.BR_REGEX_RULE);
        expect(component.isRegexType).toBeTrue();
    }));

    it('isTransformationRule, sould return true if selected rule is transformation type', (() => {
        component.initializeForm();
        component.form.controls.rule_type.setValue(BusinessRuleType.BR_TRANSFORMATION);
        expect(component.isTransformationRule).toBeTrue();
    }));

    it('isUDR, sould return true if selected rule is custom script type', (() => {
        component.initializeForm();
        component.form.controls.rule_type.setValue(BusinessRuleType.BR_CUSTOM_SCRIPT);
        expect(component.isUDR).toBeTrue();
    }));

    it('possibleOperators(), sould return array of all possible operators', (() => {
        const operators: ConditionalOperator[] = component.possibleOperators();
        expect(operators.length).toEqual(3);
    }));

    it('isDuplicateType, sould return true if selected rule is duplicate rule type', (() => {
        component.initializeForm();
        component.form.controls.rule_type.setValue(BusinessRuleType.BR_DUPLICATE_RULE);
        expect(component.isDuplicateType).toBeTrue();
    }));

    it('should set duplicacy rule form reference', () => {
        const form = new FormGroup({});
        component.setDuplicateFormRef(form);
        expect(component.duplicateFormRef).toEqual(form);
    });

    it('should patch duplicacy rule data', () => {

        const duplicacyField = [{
            fieldId: 'fid',
            criteria: 'Exact_Match',
            exclusion: '0',
            inverse: '0',
            weightage: '0',
            ival: 'customer',
            sval: 'vendor:supplier'
          }];

          const duplicacyMaster = [{
            ruleType: 'OLDEST',
            fieldId: 'USERMODIFIED',
            RuleId: 'OLDEST1',
            sno: ''
          }];

          const br = new CoreSchemaBrInfo();
          br.duplicacyField = duplicacyField;
          br.duplicacyMaster = duplicacyMaster;

          component.patchDuplicacyData(br);
          expect(component.duplicacyRuleData).toEqual(br);

    });

    it(`To get FormControl from fromGroup `, async(() => {
        component.initializeForm()
        const field=component.formField('rule_name');
        expect(field).toBeDefined();
       }));
});
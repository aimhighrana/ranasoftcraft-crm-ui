import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
    MatDialogRef,
    MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { BusinessRules } from '@modules/admin/_components/module/schema/diw-create-businessrule/diw-create-businessrule.component';
import { BusinessRuleType, ConditionalOperator } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { MetadataModeleResponse } from '@models/schema/schemadetailstable';
import { of, Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Regex } from '@modules/admin/_components/module/business-rules/regex-rule/regex-rule.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
    selector: 'pros-new-business-rules',
    templateUrl: './new-business-rules.component.html',
    styleUrls: ['./new-business-rules.component.scss']
})
export class NewBusinessRulesComponent implements OnInit {

    form: FormGroup;
    businessRuleTypes: BusinessRules[] = [
        { ruleDesc: 'API Rule', ruleId: '', ruleType: BusinessRuleType.BR_API_RULE, isImplemented: false },
        { ruleDesc: 'Basic', ruleId: '', ruleType: null, isImplemented: false },
        { ruleDesc: 'Dependency Rule', ruleId: '', ruleType: BusinessRuleType.BR_DEPENDANCY_RULE, isImplemented: false },
        { ruleDesc: 'Duplicate Rule', ruleId: '', ruleType: BusinessRuleType.BR_DUPLICATE_RULE, isImplemented: false },
        { ruleDesc: 'External Validation Rule', ruleId: '', ruleType: BusinessRuleType.BR_EXTERNALVALIDATION_RULE, isImplemented: false },
        { ruleDesc: 'Metadata Rule', ruleId: '', ruleType: BusinessRuleType.BR_METADATA_RULE, isImplemented: true },
        { ruleDesc: 'Missing Rule', ruleId: '', ruleType: BusinessRuleType.BR_MANDATORY_FIELDS, isImplemented: true },
        { ruleDesc: 'Regex Rule', ruleId: '', ruleType: BusinessRuleType.BR_REGEX_RULE, isImplemented: true },
        { ruleDesc: 'User Defined Rule', ruleId: '', ruleType: BusinessRuleType.BR_CUSTOM_SCRIPT, isImplemented: true },
    ];

    preDefinedRegex: Regex[] = [
        { FUNC_NAME: 'EMAIL', FUNC_TYPE: 'EMAIL', FUNC_CODE: '^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}' },
        { FUNC_NAME: 'PANCARD', FUNC_TYPE: 'PANCARD', FUNC_CODE: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$' },
        { FUNC_NAME: 'PHONE NUMBER(IN)', FUNC_TYPE: 'PHONE_NUMBER_IN', FUNC_CODE: '^(\\+91[\\-\\s]?)?[0]?(91)?[7896]\\d{9}$' },
        { FUNC_NAME: 'PHONE NUMBER(AUS)', FUNC_TYPE: 'PHONE_NUMBER_AUS', FUNC_CODE: '^\\({0,1}((0|\\+61)(2|4|3|7|8)){0,1}\\){0,1}(\\ |-){0,1}[0-9]{2}(\\ |-){0,1}[0-9]{2}(\\ |-){0,1}[0-9]{1}(\\ |-){0,1}[0-9]{3}$' },
        { FUNC_NAME: 'PHONE NUMBER(US)', FUNC_TYPE: 'PHONE_NUMBER_US', FUNC_CODE: '^\\(?([0-9]{3})\\)?[-.\\s]?([0-9]{3})[-.\\s]?([0-9]{4})$' },
        { FUNC_NAME: 'AADHAAR NUMBER', FUNC_TYPE: 'AADHAAR_NUMBER', FUNC_CODE: '^\\d{4}\\s\\d{4}\\s\\d{4}$' },
        { FUNC_NAME: 'ABN', FUNC_TYPE: 'ABN_NUMBER', FUNC_CODE: '^\\d{2}\\s*\\d{3}\\s*\\d{3}\\s*\\d{3}' },
        { FUNC_NAME: 'SSN(US)', FUNC_TYPE: 'SSN_US', FUNC_CODE: '^(?!000|666)[0-8][0-9]{2}-(?!00)[0-9]{2}-(?!0000)[0-9]{4}$' },
        { FUNC_NAME: 'GSTIN', FUNC_TYPE: 'GSTIN', FUNC_CODE: '^[0-9]{2}\\s*[A-Z]{5}[0-9]{4}[A-Z]{1}\\s*[1-9A-Z]{1}Z[0-9A-Z]{1}$' },
        { FUNC_NAME: 'ECN', FUNC_TYPE: 'ECN', FUNC_CODE: '^CN[0-9]{9}' }
    ];

    /**
     * List of fields
     */
    fieldsList = [];

    /**
     * observable for autocomplete
     */
    filteredModules: Observable<{} | string | void> = of([]);

    /**
     * array to save the selected fields
     */
    selectedFields = [];

    /**
     * list of event to consider as selection
     */
    separatorKeysCodes: number[] = [ENTER, COMMA];

    operators = [];
    submitted = false;
    initialConditions = ['And', 'Or'];

    udrBlocks = [{
        id: Math.floor(Math.random() * 1000000000000).toString(),
        blockTypeText: 'When', // when/and/or
        fieldId: '', // field id from dropdown
        operator: '', // operator value
        comparisonValue: '', // comparison value
        actionDisabled: false,
        rangeStartValue: '',
        rangeEndValue: '',
        children: []
    }];
    allUDRBlocks = [this.udrBlocks[0]];
    allhierarchies = [
        {
            parentId: '',
            leftIndex: '',
            blockRefId: this.udrBlocks[0].id
        }
    ]
    finalResponseBlocks = [];

    fieldControl = new FormControl()

    /**
     * Class contructor
     * @param dialogRef refernce to matdialog
     * @param data data recieved from parent
     * @param schemaDetailsService service class
     */
    constructor(
        private dialogRef: MatDialogRef<Component>,
        @Inject(MAT_DIALOG_DATA) public data,
        private schemaDetailsService: SchemaDetailsService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.form = new FormGroup({
            rule_type: new FormControl('', [Validators.required]),
            rule_name: new FormControl('', [Validators.required]),
            error_message: new FormControl('', [Validators.required]),
            standard_function: new FormControl(''),
            regex: new FormControl(''),
            fields: new FormControl('', [Validators.required]),
            udrTreeData: new FormControl()
        });
        if (this.data.moduleId) {
            this.getFieldsByModuleId()
        } else {
            this.createDSByFields()
        }
        this.filteredModules = this.form.controls.fields.valueChanges
            .pipe(
                startWith(''),
                map(keyword => {
                    return keyword ?
                        this.fieldsList.filter(item => {
                            return item.fieldDescri.toLowerCase().indexOf(keyword) !== -1
                        }) : this.fieldsList
                }),
            )
        this.operators = this.possibleOperators();
        this.form.controls.rule_type.valueChanges.subscribe((selectedRule) => {

            if (selectedRule === 'BR_CUSTOM_SCRIPT') {

                this.form.get('rule_name').clearValidators()
                this.form.get('error_message').clearValidators()
                this.form.get('fields').clearValidators();
                this.form.get('regex').clearValidators();
                this.form.get('standard_function').clearValidators();

                this.form.get('rule_name').setValidators(null);
                this.form.get('error_message').setValidators(null);
                this.form.get('fields').setValidators(null);
                this.form.get('regex').setValidators(null);
                this.form.get('standard_function').setValidators(null);

                this.form.get('rule_name').setErrors(null);
                this.form.get('error_message').setErrors(null);
                this.form.get('fields').setErrors(null);
                this.form.get('regex').setErrors(null);
                this.form.get('standard_function').setErrors(null);

            }
            if (selectedRule === 'BR_REGEX_RULE') {
                this.form.get('rule_name').setValidators([Validators.required])
                this.form.get('error_message').setValidators([Validators.required])
                this.form.get('fields').setValidators([Validators.required]);
                this.form.get('regex').setValidators([Validators.required]);
                this.form.get('standard_function').setValidators([Validators.required]);
            }
            if (selectedRule === 'BR_MANDATORY_FIELDS' || selectedRule === 'BR_METADATA_RULE') {
                this.form.get('rule_name').setValidators([Validators.required])
                this.form.get('error_message').setValidators([Validators.required])
                this.form.get('fields').setValidators([Validators.required]);

                this.form.get('regex').clearValidators();
                this.form.get('standard_function').clearValidators();
                this.form.get('regex').setValidators(null);
                this.form.get('standard_function').setValidators(null);
                this.form.get('regex').setErrors(null);
                this.form.get('standard_function').setErrors(null);
            }
            this.form.updateValueAndValidity();
        });

    }

    /**
     * function to create fields on the basis of excel sheet uploaded
     */
    createDSByFields() {
        this.data.fields.forEach((field) => {
            field = field.toString();
            this.fieldsList.push({
                fieldId: typeof field === 'string' ? field.replace(' ', '_') : field.toString(),
                fieldDescri: field
            })
        });
    }

    /**
     * function to get the fields on basis of module
     */
    getFieldsByModuleId() {
        this.schemaDetailsService.getMetadataFields(this.data.moduleId)
            .subscribe((metadataModeleResponse: MetadataModeleResponse) => {
                const keys = Object.keys(metadataModeleResponse.headers);
                keys.forEach((key) => {
                    this.fieldsList.push(metadataModeleResponse.headers[key])
                });
            });
    }

    /**
     * function to save the array of ids of selected fields
     * @param event selected item eent
     */
    selectedField(event) {
        const alreadyExists = this.selectedFields.find(item => item.fieldId === event.option.value);
        if (alreadyExists) {
            this.snackBar.open('This field is already selected', 'Okay');
        } else {
            this.selectedFields.push({
                fieldText: event.option.viewValue,
                fieldId: event.option.value
            });
        }
        this.form.controls.fields.setValue('');
        const txtfield = document.getElementById('fieldsInput') as HTMLInputElement;
        txtfield.value = '';
    }

    /**
     * function to remove the value
     * @param field the field to be removed
     */
    remove(field, i) {
        this.selectedFields.splice(i, 1);
    }

    /**
     * getter to show field on the basis of rule type
     */
    get isRegexType() {
        return this.form.controls.rule_type.value === BusinessRuleType.BR_REGEX_RULE
    }

    /**
     * function to set the value in the form
     * @param value entered value
     * @param field the selected field of form
     */
    getFormValue(value, field) {
        this.form.controls[field].setValue(value);
    }

    /**
     * function to close the dialog
     */
    closeDialogComponent() {
        if (this.form.pristine) {
            this.dialogRef.close();
        } else {
            this.dialogRef.close();
        }
    }

    /**
     * function to save the form data
     */
    save() {
        this.form.controls.fields.setValue(this.selectedFields.map(item => item.fieldId).join(','));
        this.submitted = true;
        if (!this.form.valid) {
            this.snackBar.open('Please enter the required fields', 'okay');
            return;
        }

        // this.dialogRef.close(this.form.value);

        const udrHierarchies = []
        const blocks = []
        this.udrBlocks.forEach((block) => {
            const blockObject = {
                id: block.id,
                conditionFieldId: block.fieldId,
                conditionValueFieldId: '',
                conditionFieldValue: block.comparisonValue,
                conditionFieldStartValue: block.rangeStartValue,
                conditionFieldEndValue: block.rangeEndValue,
                blockType: '',
                conditionOperator: block.operator,
                blockDesc: '',
                plantCode: '0'
            }

            const udrHierarchiesObject = {
                parentId: block.id,
                leftIndex: 0,
                blockRefId: block.id
            }
            blocks.push(blockObject)
            udrHierarchies.push(udrHierarchiesObject)
        });
        this.finalResponseBlocks.length = 0;
        this.allUDRBlocks.forEach((block, index) => {
            this.finalResponseBlocks.push({
                id: block.id,
                conditionFieldId: block.fieldId,
                conditionValueFieldId: null,
                conditionFieldValue: block.comparisonValue,
                conditionFieldStartValue: block.rangeStartValue,
                conditionFieldEndValue: block.rangeEndValue,
                blockType: 'COND',
                conditionOperator: block.operator,
                blockDesc: '',
                plantCode: ''
            })
        });
        const finalObject = {
            blocks: this.finalResponseBlocks,
            udrHierarchies: this.allhierarchies
        }

        this.form.controls.udrTreeData.setValue(finalObject);
        this.dialogRef.close(this.form.value)
    }

    setRegex(event) {
        const selectedRegex = this.preDefinedRegex.find(item => item.FUNC_TYPE === event.value);
        this.form.controls.regex.setValue(selectedRegex.FUNC_CODE);
    }

    get isUDR() {
        return this.form.controls.rule_type.value === 'BR_CUSTOM_SCRIPT'
    }

    /**
     * Return all possible operators
     */
    possibleOperators(): ConditionalOperator[] {
        // get generic operators
        const genericOp: ConditionalOperator = new ConditionalOperator();
        genericOp.desc = 'Common Operator';
        genericOp.childs = [];
        genericOp.childs.push('EQUAL');
        genericOp.childs.push('STARTS_WITH');
        genericOp.childs.push('ENDS_WITH');
        genericOp.childs.push('CONTAINS');
        genericOp.childs.push('EMPTY');
        genericOp.childs.push('NOT_EMPTY');

        // for numeric number field
        const onlyNum: ConditionalOperator = new ConditionalOperator();
        onlyNum.desc = 'Numeric Operators';
        onlyNum.childs = [];
        onlyNum.childs.push('RANGE');
        onlyNum.childs.push('LESS_THAN');
        onlyNum.childs.push('LESS_THAN_EQUAL');
        onlyNum.childs.push('GREATER_THAN');
        onlyNum.childs.push('GREATER_THAN_EQUAL');

        // for special operators
        const specialOpe: ConditionalOperator = new ConditionalOperator();
        specialOpe.desc = 'Special Operators';
        specialOpe.childs = [];
        specialOpe.childs.push('REGEX');
        specialOpe.childs.push('FIELD2FIELD');
        specialOpe.childs.push('LOCATION');
        return [genericOp, onlyNum, specialOpe];
    }

    setComparisonValue(value, index) {
        this.udrBlocks[index].comparisonValue = value
    }
    setComparisonValueForChild(value, child) {
        child.comparisonValue = value;
    }


    setInitialCondition(event, i) {
        this.udrBlocks[i].blockTypeText = event.value;
    }

    setRangeValueForChild(value, rangeText, childObject) {
        if (rangeText === 'start') {
            childObject.rangeStartValue = value;
        }
        if (rangeText === 'end') {
            childObject.rangeEndValue = value;
        }
    }

    deleteFromChildArray(parentBlockIndex, childIndex, child) {
        this.udrBlocks[parentBlockIndex].children.splice(childIndex, 1);
        const getBlockIndex = this.allUDRBlocks.findIndex((obj) => obj.id === child.id);
        const getHirerchyIndex = this.allhierarchies.findIndex((obj) => obj.blockRefId === child.id);
        this.allUDRBlocks.splice(getBlockIndex, 1);
        this.allhierarchies.splice(getHirerchyIndex, 1);
    }

    deleteParentBlock(i) {
        this.udrBlocks.splice(i, 1);
        this.allUDRBlocks.splice(i, 1);
        this.allhierarchies.splice(i, 1);
        console.log(this.allUDRBlocks);
    }

    getConditions() {
        return ['And', 'Or']
    }

    setRangeValue(value, rangeText, parentBlockIndex) {
        if (rangeText === 'start') {
            this.udrBlocks[parentBlockIndex].rangeStartValue = value
        }
        if (rangeText === 'end') {
            this.udrBlocks[parentBlockIndex].rangeEndValue = value
        }
    }
    setParentBlockTypeText(event, i) {
        this.udrBlocks.forEach((block, index) => {
            if (index > i) {
                block.blockTypeText = event.value;
            }
        })
    }

    addBlock(nested, parent, i) {
        const blockId = Math.floor(Math.random() * 1000000000000).toString();
        let existingBlockType = this.udrBlocks[this.udrBlocks.length - 1].blockTypeText;
        if (existingBlockType === 'When') {
            existingBlockType = 'And'
        }
        const udrBlock = {
            id: blockId,
            blockTypeText: existingBlockType, // when/and/or
            fieldId: '', // field id from dropdown
            operator: '', // operator value
            comparisonValue: '', // comparison value
            actionDisabled: false,
            children: [],
            rangeStartValue: '',
            rangeEndValue: ''
        }

        let UDRHierarchie = {
            parentId: '',
            leftIndex: '',
            blockRefId: ''
        }

        if (!nested) {
            this.udrBlocks.push(udrBlock);
            UDRHierarchie = {
                parentId: '',
                leftIndex: '',
                blockRefId: udrBlock.id
            }
        } else {
            parent.children.push(udrBlock);

            UDRHierarchie = {
                parentId: parent.id,
                leftIndex: '1',
                blockRefId: udrBlock.id
            }
        }
        this.allhierarchies.push(UDRHierarchie)
        this.allUDRBlocks.push(udrBlock)
    }
}


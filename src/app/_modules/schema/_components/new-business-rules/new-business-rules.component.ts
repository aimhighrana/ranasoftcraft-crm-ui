import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
    MatDialogRef,
    MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { BusinessRules } from '@modules/admin/_components/module/schema/diw-create-businessrule/diw-create-businessrule.component';
import { BusinessRuleType, ConditionalOperator, PRE_DEFINED_REGEX, RULE_TYPES, TransformationModel, TransformationRuleType, UDRObject } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { MetadataModeleResponse, CategoryInfo, FieldConfiguration, TransformationFormData, LookupFields, NewBrDialogResponse } from '@models/schema/schemadetailstable';
import { of, Observable } from 'rxjs';
import { startWith, map, distinctUntilChanged } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Regex } from '@modules/admin/_components/module/business-rules/regex-rule/regex-rule.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BlockType } from '@modules/report/_models/widget';

@Component({
    selector: 'pros-new-business-rules',
    templateUrl: './new-business-rules.component.html',
    styleUrls: ['./new-business-rules.component.scss']
})
export class NewBusinessRulesComponent implements OnInit {

    /**
     * main rule form
     */
    form: FormGroup;

    /**
     * hold the form controls in this variable
     */
    currentControls: any = {};

    /**
     * all available business rules
     */
    businessRuleTypes: BusinessRules[] = RULE_TYPES;

    /**
     * Pre defined regex for regex rule
     */
    preDefinedRegex: Regex[] = PRE_DEFINED_REGEX;

    /**
     * current rule
     */
    currentSelectedRule: string;

    /**
     * Lookup data from transformation rule component
     */
    lookupData: LookupFields[] = [];

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
     * target fields for transformation rule
     */
    targetFieldsObject: FieldConfiguration = {
        list: [],
        labelKey: '',
        valueKey: ''
    }

    /**
     * source fields for transformation rule
     */
    sourceFieldsObject: FieldConfiguration = {
        list: [],
        labelKey: '',
        valueKey: ''
    }

    /**
     * list of event to consider as selection
     */
    separatorKeysCodes: number[] = [ENTER, COMMA];

    operators = [];

    /**
     * hold the form submitted state in order
     * to share it with another child component
     */
    submitted = false;

    /**
     * Available conditions
     */
    initialConditions = ['And', 'Or'];

    /**
     * List of categories
     */
    categoryList: CategoryInfo[] = []

    /**
     * UDR object model
     */
    udrBlocks: UDRObject[] = [{
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

    /**
     * Hold the ist of UDR blocks
     */
    allUDRBlocks: UDRObject[] = [this.udrBlocks[0]];

    /**
     * Hold the hierarchy
     */
    allhierarchies = [
        {
            parentId: '',
            leftIndex: '',
            blockRefId: this.udrBlocks[0].id
        }
    ]
    finalResponseBlocks = [];
    fieldControl = new FormControl();
    tempRuleId: string;

    /**
     * Transformation Data model
     */
    transformationData: TransformationFormData;

    /**
     * Existing transformation schema used to
     * patch transformation rule for Regex
     */
    transformationSchema: TransformationModel;

    /**
     * Existing transformation schema used to
     * patch transformation rule for Lookup
     */
    transformationLookUpData: LookupFields[] = [];
    /**
     * Class contructor
     * @param snackBar refernce to matSnackbar
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


    get transformationType() {
        return TransformationRuleType;
    }

    get selectedTransformationType() {
        if (this.form && this.form.controls) {
            return this.form.controls.transformationRuleType.value;
        }
        return '';
    }

    ngOnInit(): void {
        // initialize form Object
        this.initializeForm();

        this.operators = this.possibleOperators();
        this.getCategories();

        // Patch data if working with existing business rule
        if (this.data && this.data.createRuleFormValues) {
            this.tempRuleId = (this.data && this.data.tempId) ? this.data.tempId : '';
            const {
                rule_type,
                rule_name,
                error_message,
                standard_function,
                regex,
                fields,
                udrTreeData,
                weightage,
                categoryId,
                transFormationSchema } = this.data.createRuleFormValues;
            this.patchTransformationFormData(transFormationSchema)
            this.form.patchValue({
                rule_type,
                rule_name,
                error_message,
                standard_function,
                regex,
                fields,
                weightage,
                categoryId,
            });

            this.form.controls.rule_type.disable();
            this.form.controls.weightage.disable();
            if (udrTreeData && udrTreeData.blocks) {
                const temp: UDRObject[] = [];
                udrTreeData.blocks.map((block) => {
                    const { id, blockType, conditionFieldId, conditionOperator,
                        conditionFieldValue, rangeStartValue, rangeEndValue,
                        children } = block;

                    temp.push({
                        id,
                        blockTypeText: blockType,
                        fieldId: conditionFieldId,
                        operator: conditionOperator,
                        comparisonValue: conditionFieldValue,
                        actionDisabled: false,
                        rangeStartValue,
                        rangeEndValue,
                        children
                    })
                })
                this.udrBlocks = [...temp];
                this.allUDRBlocks = [...temp];
                this.allhierarchies = [...udrTreeData.udrHierarchies]
            }
        }

        if (this.data.moduleId) {
            this.getFieldsByModuleId();
        } else {
            // Patch selected fields here
            this.patchSelectedFields();
        }

        // Initializing autocomplete
        this.initiateAutocomplete();
    }


    /**
     * Patch transformation form data
     * @param transformationSchema transformation rule details to be passed
     */
    patchTransformationFormData(transformationSchema: TransformationModel[]) {
        const currentType = this.getTrRuleType(transformationSchema);
        this.form.controls.transformationRuleType.setValue(currentType);
        if (currentType === this.transformationType.REGEX) {
            if (transformationSchema && transformationSchema.length > 0) {
                const data: TransformationModel = transformationSchema[0];
                const { excludeScript, includeScript, sourceFld, targetFld, transformationRuleType, udrBlockModel } = data;
                this.transformationData = {
                    excludeScript,
                    includeScript,
                    sourceFld,
                    targetFld,
                    parameter: udrBlockModel
                    // selectedTargetFields: []
                }
            }
        }
        if (currentType === this.transformationType.LOOKUP) {
            if (transformationSchema.length > 0) {
                const lookupFields: LookupFields[] = [];
                transformationSchema.map((schema) => {
                    lookupFields.push({
                        enableUserField: false,
                        fieldDescri: '',
                        fieldId: schema.sourceFld,
                        fieldLookupConfig: {
                            lookupColumn: schema.udrBlockModel.conditionFieldId,
                            lookupColumnResult: schema.udrBlockModel.conditionValueFieldId,
                            moduleId: schema.udrBlockModel.objectType
                        },
                        lookupTargetField: schema.targetFld,
                        lookupTargetText: ''
                    })
                });

                this.transformationLookUpData = lookupFields;
            }
        }
    }

    /**
     * get transformation sub type
     * @param transformationSchema pass the transformation schema Object
     */
    getTrRuleType(transformationSchema: TransformationModel[]) {
        if (transformationSchema && transformationSchema.length > 0) {
            const schema = transformationSchema[0];
            if (schema.transformationRuleType === this.transformationType.LOOKUP) {
                return this.transformationType.LOOKUP;
            }
            if (schema.transformationRuleType === this.transformationType.REGEX) {
                return this.transformationType.REGEX;
            }
        }
    }

    /**
     * Get all categories from the api
     */
    getCategories() {
        this.categoryList = [];
        this.schemaDetailsService.getAllCategoryInfo().subscribe((response) => {
            this.categoryList.push(...response)
        })
    }

    /**
     * Initialize the form object and
     * subscribe to any required control value changes
     */
    initializeForm() {
        const controls = {
            rule_type: new FormControl('', [Validators.required]),
            rule_name: new FormControl('', [Validators.required]),
            error_message: new FormControl('', [Validators.required]),
            standard_function: new FormControl(''),
            regex: new FormControl(''),
            fields: new FormControl(''),
            sourceFld: new FormControl(''),
            targetFld: new FormControl(''),
            excludeScript: new FormControl(''),
            includeScript: new FormControl(''),
            udrTreeData: new FormControl(),
            weightage: new FormControl(0, [Validators.required]),
            categoryId: new FormControl(''),
            transformationRuleType: new FormControl('')
        };

        this.currentControls = controls;
        this.form = new FormGroup(controls);
        // Apply conditional validation based on rule type
        this.form.controls.rule_type.valueChanges
            .pipe(distinctUntilChanged())
            .subscribe((selectedRule) => {
                this.applyValidatorsByRuleType(selectedRule);
            });
        this.form.controls.transformationRuleType.valueChanges
            .pipe(distinctUntilChanged())
            .subscribe(() => {
                this.applyValidatorsByRuleType(this.form.controls.rule_type.value);
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
                if (this.data && this.data.createRuleFormValues && this.data.createRuleFormValues.fields) {
                    this.patchFieldvalues(this.data.createRuleFormValues.fields);
                }
                this.targetFieldsObject = {
                    labelKey: 'fieldDescri',
                    valueKey: 'fieldId',
                    list: this.fieldsList
                }
                this.sourceFieldsObject = {
                    labelKey: 'fieldDescri',
                    valueKey: 'fieldId',
                    list: this.fieldsList
                }
            });
    }


    /**
     * Patch the selected excel field values
     */
    patchSelectedFields() {
        this.createDSByFields().then(() => {
            if (this.data && this.data.createRuleFormValues && this.data.createRuleFormValues.fields) {
                this.patchFieldvalues(this.data.createRuleFormValues.fields);
            }
        });
    }

    /**
     * patch selected field values, common function to be used with
     * excel and mudule fields
     * @param fields pass the comma separated fields
     */
    patchFieldvalues(fields) {
        const arr = fields.split(',');
        if (arr && arr.length > 0) {
            arr.map((selected) => {
                const fieldObj = this.fieldsList.filter((field) => field.fieldId === selected);
                if (fieldObj && fieldObj.length > 0) {
                    const tempObj = fieldObj[0];
                    this.selectedFields.push({
                        fieldDescri: tempObj.fieldDescri,
                        fieldId: tempObj.fieldId
                    });
                }
            });
        }
    }

    /**
     * Initialize autocomplete for field names
     */
    initiateAutocomplete() {
        this.filteredModules = this.form.controls.fields.valueChanges
            .pipe(
                startWith(''),
                map(keyword => {
                    return keyword ?
                        this.fieldsList.filter(item => {
                            return item.fieldDescri.toString().toLowerCase().indexOf(keyword) !== -1
                        }) : this.fieldsList
                }),
            )
    }

    /**
     * Apply conditional form validation based on rule type
     * keep the required field updated based on a selected rule type
     * loop through the required keys and add validators to all required fields
     * also nullify validators for all not required fields at the same time
     * @param selectedRule selected rule type
     */
    applyValidatorsByRuleType(selectedRule: string) {
        this.currentSelectedRule = selectedRule;
        const controlKeys: any[] = Object.keys(this.currentControls);
        let requiredKeys: string[] = [];
        if (selectedRule === BusinessRuleType.BR_CUSTOM_SCRIPT) {
            requiredKeys = ['rule_type', 'categoryId'];
        }
        if (selectedRule === BusinessRuleType.BR_REGEX_RULE) {
            requiredKeys = ['rule_type', 'categoryId', 'rule_name', 'error_message', 'fields', 'regex', 'standard_function'];
        }
        if (selectedRule === BusinessRuleType.BR_MANDATORY_FIELDS || selectedRule === BusinessRuleType.BR_METADATA_RULE) {
            requiredKeys = ['rule_type', 'categoryId', 'rule_name', 'error_message', 'fields'];
        }
        if (selectedRule === BusinessRuleType.BR_TRANSFORMATION) {
            if (this.selectedTransformationType === this.transformationType.REGEX) {
                requiredKeys = ['rule_type', 'rule_name', 'transformationRuleType', 'error_message', 'sourceFld', 'targetFld', 'excludeScript', 'includeScript'];
            } else if (this.selectedTransformationType === this.transformationType.LOOKUP) {
                requiredKeys = ['rule_type', 'rule_name', 'transformationRuleType', 'error_message'];
            }
        }

        controlKeys.map((key) => {
            const index = requiredKeys.findIndex(reqKey => reqKey === key);
            if (index === -1) {
                this.form.get(key).setValidators(null);
                this.form.get(key).clearValidators();
                if (key !== 'rule_type' && key !== 'weightage' && !this.data.createRuleFormValues) {
                    this.form.get(key).setValue('');
                }
            } else {
                this.form.get(key).setValidators([Validators.required]);
            }
        });

        this.form.updateValueAndValidity();
    }

    /**
     * function to create fields on the basis of excel sheet uploaded
     */
    createDSByFields() {
        return new Promise((resolve, reject) => {
            try {
                this.data.fields.forEach((field) => {
                    this.fieldsList.push({
                        fieldId: field.fieldId,
                        fieldDescri: field.fieldDescri
                    });
                });
                this.targetFieldsObject = {
                    labelKey: 'fieldDescri',
                    valueKey: 'fieldId',
                    list: this.fieldsList
                }
                this.sourceFieldsObject = {
                    labelKey: 'fieldDescri',
                    valueKey: 'fieldId',
                    list: this.fieldsList
                }
                resolve();
            } catch (error) {
                reject(error)
            }
        });
    }



    /**
     * function to save the array of ids of selected fields
     * @param event selected item eent
     */
    selectedField(event) {
        const alreadyExists = this.selectedFields.find(item => item.fieldId === event.option.value);
        if (alreadyExists) {
            this.snackBar.open('This field is already selected', 'Okay', { duration: 5000 });
        } else {
            this.selectedFields.push({
                fieldDescri: event.option.viewValue,
                fieldId: this.data.moduleId ? event.option.value : event.option.value.replace(' ', '_')
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
        this.dialogRef.close();
    }

    /**
     * function to save the form data
     */
    save() {
        this.form.controls.fields.setValue(this.selectedFields.map(item => item.fieldId).join(','));
        this.submitted = true;

        if (!this.form.valid) {
            this.snackBar.open('Please enter the required fields', 'okay', { duration: 5000 });
            return;
        }

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
                blockType: block.blockTypeText,
                conditionOperator: block.operator,
                children: block.children,
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
                blockType: block.blockTypeText,
                conditionOperator: block.operator,
                blockDesc: '',
                plantCode: '',
                children: block.children
            })
        });
        const finalObject = {
            blocks: this.finalResponseBlocks,
            udrHierarchies: this.allhierarchies
        }

        this.form.controls.udrTreeData.setValue(finalObject);
        let data: NewBrDialogResponse = null;
        if (!this.form.pristine) {
            data = { formData: this.form.value, tempId: this.tempRuleId, lookupData: this.lookupData };
        }
        this.dialogRef.close(data);
    }

    setRegex(event) {
        const selectedRegex = this.preDefinedRegex.find(item => item.FUNC_TYPE === event.value);
        this.form.controls.regex.setValue(selectedRegex.FUNC_CODE);
    }

    get isUDR() {
        return this.form.controls.rule_type.value === BusinessRuleType.BR_CUSTOM_SCRIPT;
    }

    get isTransformationRule() {
        return this.form.controls.rule_type.value === BusinessRuleType.BR_TRANSFORMATION;
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
        if (getBlockIndex > -1) {
            this.allUDRBlocks.splice(getBlockIndex, 1);
        }
        this.allhierarchies.splice(getHirerchyIndex, 1);
    }

    deleteParentBlock(i) {
        this.udrBlocks.splice(i, 1);
        this.allUDRBlocks.splice(i, 1);
        this.allhierarchies.splice(i, 1);
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
        const udrBlock: UDRObject = {
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
        this.allhierarchies.push(UDRHierarchie);
        if (!nested) {
            this.allUDRBlocks.push(udrBlock);
        }
    }

    getBlockType(type: string) {
        return BlockType[type.toUpperCase()];
    }

    displayFn(value) {
        return value ? value.fieldDescri : '';
    }

    formatLabel(value) {
        return `${value}`;
    }

    /**
     * Set transformation data output from Transformation rule to business rule form
     * @param transformationData pass transformation data
     */
    setTransformationFormData(transformationData: TransformationFormData) {
        const {
            targetFld,
            sourceFld,
            excludeScript,
            includeScript,
            selectedTargetFields
        } = transformationData;
        this.form.controls.targetFld.setValue(selectedTargetFields.map(item => item[this.targetFieldsObject.valueKey]).join(','));
        this.form.controls.sourceFld.setValue(sourceFld);
        this.form.controls.excludeScript.setValue(excludeScript);
        this.form.controls.includeScript.setValue(includeScript);
    }

    /**
     * Set lookup data output to business rule form
     * @param lookupData pass lookup data
     */
    setLookupData(lookupData: LookupFields[]) {
        this.lookupData = lookupData;
    }
}


import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { NewBusinessRulesComponent } from './new-business-rules.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { LookupFields, MetadataModeleResponse, TransformationFormData } from '@models/schema/schemadetailstable';
import { of } from 'rxjs';
import { BusinessRuleType, ConditionalOperator, CoreSchemaBrInfo, PRE_DEFINED_REGEX, TransformationModel, UDRObject } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { FormControl, FormGroup } from '@angular/forms';
import { SharedModule } from '@modules/shared/shared.module';
import { BlockType } from '@modules/admin/_components/module/business-rules/user-defined-rule/udr-cdktree.service';

describe('NewBusinessRulesComponent', () => {
    let component: NewBusinessRulesComponent;
    let fixture: ComponentFixture<NewBusinessRulesComponent>;
    let schemaDetailsServicespy: SchemaDetailsService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NewBusinessRulesComponent],
            imports: [AppMaterialModuleForSpec, SharedModule],
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
        spyOn(component, 'patchFieldvalues');
        component.data = {
            moduleId: '1005',
        };
        const metadataModeleResponse = { headers: [{ fieldId: 'MATL', fieldDescri: 'material location' }] } as MetadataModeleResponse;
        spyOn(schemaDetailsServicespy, 'getMetadataFields').withArgs(component.data.moduleId).and.returnValue(of(metadataModeleResponse))
        component.getFieldsByModuleId();
        expect(schemaDetailsServicespy.getMetadataFields).toHaveBeenCalledWith(component.data.moduleId);

        component.data = {
            moduleId: '1005',
            createRuleFormValues: {
                fields: 'email'
            }
        };
        component.getFieldsByModuleId();
        expect(schemaDetailsServicespy.getMetadataFields).toHaveBeenCalledWith(component.data.moduleId);
    }));

    it('remove(), remove the value', (() => {
        component.selectedFields = ['NDC_TYPE'];
        component.remove('NDC_TYPE', 0);
        expect(component.selectedFields.length).toEqual(0);
    }));

    it('addBlock(), should add the values', async(() => {
        const parent = {
            id: 123,
            children: []
        }
        component.udrBlocks = [{ id: '76675675', blockTypeText: 'or', fieldId: 'NDC_TYPE', operator: 'EQUAL', comparisonValue: '78', actionDisabled: false, rangeStartValue: '', rangeEndValue: '', children: [] }, { id: '76675685', blockTypeText: 'When', fieldId: 'ND_TYPE', operator: 'EQUAL', comparisonValue: '78', actionDisabled: false, rangeStartValue: '', rangeEndValue: '', children: [] }]
        component.addBlock(true, parent, 2);
        expect(component.udrBlocks.length).toEqual(2);

        component.addBlock(false, parent, 2);
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
        const data = null;
        component.duplicacyRuleData = {} as CoreSchemaBrInfo;
        component.patchDuplicacyData(data);
        expect(component.duplicacyRuleData).toEqual({} as CoreSchemaBrInfo)


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
        const field = component.formField('rule_name');
        expect(field).toBeDefined();
    }));

    it('showValidationError(), should hide validation message', fakeAsync(() => {
        component.validationError = {
            status: false,
            message: ''
        }

        const message = 'Please fill the required fields.'
        component.showValidationError(message);
        expect(component.validationError.status).toEqual(true);
        tick(3500);
        expect(component.validationError.status).toEqual(false);
    }));

    it('getConditions(), should return conditions accordingly', async () => {
        const res = component.getConditions();
        expect(res.length).toEqual(2)
    });

    it('setLookupData(), should set lookup rule', async () => {
        const lookupData = [
            {
                fieldId: 'L2'
            }
        ] as LookupFields[];

        component.setLookupData(lookupData);
        expect(component.lookupData).toEqual(lookupData)
    });

    it('getBlockType(), should return block type', async () => {
        const type = 'When';
        const res = component.getBlockType(type);

        expect(res).toEqual(BlockType.AND);


        const type2 = 'And';
        const res2 = component.getBlockType(type2);

        expect(res2).toEqual('AND')
    });

    it('getTrRuleType(), should return transformation rule types information', async () => {
        const transformationSchema = [
            {
                brId: '1234',
                transformationRuleType: component.transformationType.LOOKUP
            }
        ] as TransformationModel[];

        let res = component.getTrRuleType(transformationSchema);
        expect(res).toEqual(component.transformationType.LOOKUP);

        transformationSchema[0].transformationRuleType = component.transformationType.REGEX;
        res = component.getTrRuleType(transformationSchema);

        expect(res).toEqual(component.transformationType.REGEX);
    });

    it('setRangeValue(), should set range value', async () => {
        const parentBlockIndex = 0;
        let rangeText = 'start';
        const value = '21';
        component.udrBlocks = [
            {
                rangeStartValue: '12',
                rangeEndValue: '24'
            }
        ] as UDRObject[];

        component.setRangeValue(value, rangeText, parentBlockIndex);
        expect(component.udrBlocks[parentBlockIndex].rangeStartValue).toEqual(value);

        rangeText = 'end';
        component.setRangeValue(value, rangeText, parentBlockIndex);
        expect(component.udrBlocks[parentBlockIndex].rangeEndValue).toEqual(value);
    });

    it('deleteParentBlock(), should delete parent block of user defined', async () => {
        component.udrBlocks = [
            {
                id: '1'
            }
        ] as UDRObject[];

        component.allUDRBlocks = [
            {
                id: '1'
            }
        ] as UDRObject[];

        component.allhierarchies = [
            {
                parentId: '1',
                leftIndex: '0',
                blockRefId: ''
            }
        ];

        component.deleteParentBlock(0);
        expect(component.udrBlocks.length).toEqual(0)
    })

    it('setRangeValue(), should set range value', async () => {
        let rangeText = 'start';
        const value = '21';
        const childObject = {
            rangeEndValue: '10',
            rangeStartValue: '10'
        } as UDRObject;

        component.setRangeValueForChild(value, rangeText, childObject);
        expect(component.setRangeValueForChild).toBeTruthy();

        rangeText = 'end';
        component.setRangeValueForChild(value, rangeText, childObject);
        expect(component.setRangeValueForChild).toBeTruthy();
    });

    it('setTransformFormData(), should set data to transformation rule while editing transformation rule', async () => {
        const transformationData = {
            sourceFld: 'material',
            excludeScript: 'ashish kumar goyal',
            includeScript: 'ashish goyal',
            selectedTargetFields: ['datascope v1', 'mobile number']
        } as TransformationFormData;
        component.form = new FormGroup({
            sourceFld: new FormControl(''),
            excludeScript: new FormControl(''),
            includeScript: new FormControl(''),
            targetFld: new FormControl('')
        });

        component.setTransformationFormData(transformationData);
        expect(component.form.controls.sourceFld.value).toEqual('material');

        transformationData.sourceFld = '';
        transformationData.excludeScript = '';
        transformationData.includeScript = '';

        component.setTransformationFormData(transformationData);
        expect(component.setTransformationFormData).toBeTruthy();
    });

    it('deleteFromChildArray(), should delete from child array', async () => {
        const parentBlockIndex = 0;
        const childIndex = 0;
        const child = {
            id: '034349'
        };

        component.udrBlocks = [
            {
                children: [
                    {
                        id: '13435A'
                    }
                ]
            }
        ] as UDRObject[];
        component.allUDRBlocks = [
            {
                id: '034349'
            }
        ] as UDRObject[];
        component.allhierarchies = [
            {
                parentId: 'AJUHA901',
                leftIndex: '0',
                blockRefId: '034349'
            }
        ]

        component.deleteFromChildArray(parentBlockIndex, childIndex, child);
        expect(component.allhierarchies.length).toEqual(0);
        expect(component.allUDRBlocks.length).toEqual(0);

        component.udrBlocks = [
            {
                children: [
                    {
                        id: '13435A'
                    }
                ]
            }
        ] as UDRObject[];
        component.allUDRBlocks = [
            {
                id: '034347'
            }
        ] as UDRObject[];
        component.allhierarchies = [
            {
                parentId: 'AJUHA901',
                leftIndex: '0',
                blockRefId: '034349'
            }
        ]
        component.deleteFromChildArray(parentBlockIndex, childIndex, child);
        expect(component.allUDRBlocks.length).toEqual(1);
    });

    it('setParentBlockTypeText(), should set the type of parent block', async () => {
        const event = {
            value: 'AshishK'
        };
        const i = 0;
        component.udrBlocks = [
            {
                blockTypeText: 'AshishKumarGoyal'
            }
        ] as UDRObject[];

        component.setParentBlockTypeText(event, i);
        expect(component.udrBlocks[i].blockTypeText).toEqual(event.value);
    });

    it('setInitialCondition(), should set the type of parent block', async () => {
        const event = {
            value: 'AshishK'
        };
        const i = 0;
        component.udrBlocks = [
            {
                blockTypeText: 'AshishKumarGoyal'
            }
        ] as UDRObject[];

        component.setInitialCondition(event, i);
        expect(component.udrBlocks[i].blockTypeText).toEqual(event.value);
    });

    it('setComparisonValue(), should set comparision value for user defined business rule', async () => {
        const value = 'AshishK'

        const index = 0;
        component.udrBlocks = [
            {
                comparisonValue: 'AshishKumarGoyal'
            }
        ] as UDRObject[];

        component.setComparisonValue(value, index);
        expect(component.udrBlocks[index].comparisonValue).toEqual(value);
    });

    it('setComparisonValueForChild(), should set the comparision value for child block of user defined', async () => {
        const value = 'AshishK'

        // const index = 0;
        const child = {
            comparisonValue: 'AshishKumarGoyal'
        }


        component.setComparisonValueForChild(value, child);
        expect(component.setComparisonValueForChild).toBeTruthy();
    });

    it('getFormValue(), should set value into the form field', async()=>{
        const value = 'Ashish Goyal Kumar';
        const field = 'sourceFld';

        component.form = new FormGroup({
            sourceFld: new FormControl(''),
        });
        component.getFormValue(value, field);
        expect(component.form.controls.sourceFld.value).toEqual(value);
    });

    it('setRegex(), should set regex into form regex field', async()=>{
        component.preDefinedRegex = PRE_DEFINED_REGEX;
        const event = {
            value: 'EMAIL'
        };
        component.form = new FormGroup({
            regex: new FormControl(''),
        });
        component.setRegex(event);

        expect(component.form.controls.regex.value).toEqual('^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}')
    });

    it('patchFieldValues(), should set field values', async() => {
        let fields = 'email,address';
        component.fieldsList = [{
            fieldId: 'email'
        }];

        component.patchFieldvalues(fields);
        expect(component.selectedFields.length).toEqual(1);

        component.selectedFields = [];
        fields = '';
        component.patchFieldvalues(fields);
        expect(component.selectedFields.length).toEqual(0)
    });

    it('initiateAutocomplete(), should initiate autocomplete', async()=>{
        component.form = new FormGroup({
            fields: new FormControl('')
        });
        component.fieldsList = [
            {
                fieldDescri: 'email'
            }
        ]

        component.initiateAutocomplete();
        component.form.controls.fields.setValue('email');

        component.filteredModules.subscribe(res => {
            expect(res).toEqual(component.fieldsList);
        })
    });

    it('patchTransformationFormData(), should patch transformation rule data', fakeAsync(() => {
        const transformationSchema = [
            {
                brId: '1234',
                transformationRuleType: component.transformationType.LOOKUP,
                sourceFld: 'ashish',
                udrBlockModel: {
                    conditionFieldId: 'ashish',
                    conditionValueFieldId: '123',
                    objectType: 'MatGrp'
                },
                targetFld: 'ashishkumar'
            }
        ] as TransformationModel[];
        component.form = new FormGroup({
            transformationRuleType: new FormControl('')
        })
        spyOn(component, 'getTrRuleType').and.returnValue(((component.transformationType.LOOKUP)));

        component.patchTransformationFormData(transformationSchema);

        expect(component.getTrRuleType).toHaveBeenCalled();
        expect(component.form.controls.transformationRuleType.value).toEqual(component.transformationType.LOOKUP);

        transformationSchema.length = 0;
        component.form = new FormGroup({
            transformationRuleType: new FormControl('')
        })
        component.patchTransformationFormData(transformationSchema);

        expect(component.getTrRuleType).toHaveBeenCalled();
    }));

    it('patchTransformationFormData(), should patch transformation rule data', async() => {
        const transformationSchema = [
            {
                brId: '1234',
                transformationRuleType: component.transformationType.REGEX,
                sourceFld: 'ashish',
                udrBlockModel: {
                    conditionFieldId: 'ashish',
                    conditionValueFieldId: '123',
                    objectType: 'MatGrp'
                },
                targetFld: 'ashishkumar'
            }
        ] as TransformationModel[];
        component.form = new FormGroup({
            transformationRuleType: new FormControl('')
        })
        spyOn(component, 'getTrRuleType').and.returnValue(((component.transformationType.REGEX)));

        component.patchTransformationFormData(transformationSchema);

        expect(component.getTrRuleType).toHaveBeenCalled();
        expect(component.form.controls.transformationRuleType.value).toEqual(component.transformationType.REGEX);

        transformationSchema.length = 0;
        component.form = new FormGroup({
            transformationRuleType: new FormControl('')
        })
        component.patchTransformationFormData(transformationSchema);

        expect(component.getTrRuleType).toHaveBeenCalled();
    });

    it('ngOnInit(), should call oninit after component setup', async()=>{
        spyOn(component, 'getFieldsByModuleId');
        spyOn(component, 'patchSelectedFields');
        spyOn(component, 'patchTransformationFormData');
        spyOn(component, 'patchDuplicacyData');
        spyOn(component, 'possibleOperators');
        spyOn(component, 'getCategories');

        component.data = {
            maxWeightageLimit: 90,
            createRuleFormValues: {
                rule_type: 'metadata rule',
                rule_name: 'businessrule',
                error_message: 'error_not',
                standard_function: 'sdfgt34@#$%^',
                regex: 'hkjdfh',
                fields: 'email',
                apiKey: 'ajksdjdjjdnfhnw3434',
                udrTreeData: {
                    blocks: [{
                        id: 1,
                        blockDesc: 'blockoe',
                        conditionFieldId: 12334,
                        conditionOperator: 'AND',
                        conditionFieldValue: 'AshishMaterialGrp',
                        rangeStartValue: 12,
                        rangeEndValue: 98,
                        children: ''
                    }],
                    udrHierarchies: [
                        {
                            parentId: '',
                            blockRefId: 1,
                            leftIndex: 1
                        }
                    ]
                },
                weightage: 90,
                categoryId: '13133',
                transformationSchema: '',
                duplicacyRuleData: ''
            },
            // moduleId: '1334',
            tempId: '12314'
        }

        component.ngOnInit();
        expect(component.ngOnInit).toBeTruthy();

        component.data = {
            maxWeightageLimit: 90,
            createRuleFormValues: {
                rule_type: 'metadata rule',
                rule_name: 'businessrule',
                error_message: 'error_not',
                standard_function: 'sdfgt34@#$%^',
                regex: 'hkjdfh',
                fields: 'email',
                apiKey: 'ajksdjdjjdnfhnw3434',
                udrTreeData: {
                    blocks: [{
                        id: 1,
                        blockDesc: 'blockoe',
                        conditionFieldId: 12334,
                        conditionOperator: 'AND',
                        conditionFieldValue: 'AshishMaterialGrp',
                        rangeStartValue: 12,
                        rangeEndValue: 98,
                        children: ''
                    }],
                    udrHierarchies: [
                        {
                            parentId: '',
                            blockRefId: 1,
                            leftIndex: 1
                        }
                    ]
                },
                weightage: 90,
                categoryId: '13133',
                transformationSchema: '',
                duplicacyRuleData: ''
            },
            moduleId: '1334',
            tempId: '12314'
        }

        component.ngOnInit();
        expect(component.ngOnInit).toBeTruthy();

        component.data = {
            maxWeightageLimit: 90,
            createRuleFormValues: {
                rule_type: 'metadata rule',
                rule_name: 'businessrule',
                error_message: 'error_not',
                standard_function: 'sdfgt34@#$%^',
                regex: 'hkjdfh',
                fields: 'email',
                apiKey: 'ajksdjdjjdnfhnw3434',
                udrTreeData: {
                    blocks: [{
                        id: 1,
                        blockDesc: 'blockoe',
                        conditionFieldId: 12334,
                        conditionOperator: 'AND',
                        conditionFieldValue: 'AshishMaterialGrp',
                        rangeStartValue: 12,
                        rangeEndValue: 98,
                        children: ''
                    }],
                    udrHierarchies: [
                        {
                            parentId: '1334',
                            blockRefId: 1,
                            leftIndex: 1
                        }
                    ]
                },
                weightage: 90,
                categoryId: '13133',
                transformationSchema: '',
                duplicacyRuleData: ''
            },
            moduleId: '1334',
            tempId: '12314'
        }

        // component.data.createRuleFormValues.udrTreeData.udrHierarchies[0].parentId = '1323';
        component.ngOnInit();
        expect(component.ngOnInit).toBeTruthy();

        component.data = {
            maxWeightageLimit: 90,
            createRuleFormValues: {
                rule_type: 'metadata rule',
                rule_name: 'businessrule',
                error_message: 'error_not',
                standard_function: 'sdfgt34@#$%^',
                regex: 'hkjdfh',
                fields: 'email',
                apiKey: 'ajksdjdjjdnfhnw3434',
                udrTreeData: {
                    blocks: [{
                        id: 1,
                        blockDesc: 'blockoe',
                        conditionFieldId: 12334,
                        conditionOperator: 'AND',
                        conditionFieldValue: 'AshishMaterialGrp',
                        rangeStartValue: 12,
                        rangeEndValue: 98,
                        children: ''
                    }],
                    udrHierarchies: [
                        {
                            parentId: '1334',
                            blockRefId: 1,
                            leftIndex: 1
                        }
                    ]
                },
                weightage: 90,
                categoryId: '13133',
                transformationSchema: '',
                duplicacyRuleData: ''
            },
            moduleId: '1334',
            // tempId: '12314'
        }
        component.ngOnInit();
        expect(component.ngOnInit).toBeTruthy();


        component.data = {
            maxWeightageLimit: 90,
            createRuleFormValues: {
                rule_type: 'metadata rule',
                rule_name: 'businessrule',
                error_message: 'error_not',
                standard_function: 'sdfgt34@#$%^',
                regex: 'hkjdfh',
                fields: 'email',
                apiKey: 'ajksdjdjjdnfhnw3434',
                udrTreeData: {},
                weightage: 90,
                categoryId: '13133',
                transformationSchema: '',
                duplicacyRuleData: ''
            },
            moduleId: '1334',
            // tempId: '12314'
        }

        component.ngOnInit();
        expect(component.ngOnInit).toBeTruthy();

        component.data = {
            maxWeightageLimit: 90,
            moduleId: '1334',
        }

        component.ngOnInit();
        expect(component.ngOnInit).toBeTruthy();

        component.data = null;

        component.ngOnInit();
        expect(component.ngOnInit).toBeTruthy();

    });

    it('selectedTransformationType(), should get selected transformation rule type', async()=> {
        component.form = null;
        const res = component.selectedTransformationType;
        expect(res).toEqual('');
    })
});
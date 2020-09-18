import { Component, OnInit } from '@angular/core';
import { BusinessRules } from '@modules/admin/_components/module/schema/diw-create-businessrule/diw-create-businessrule.component';
import { BusinessRuleType, ConditionalOperator, CoreSchemaBrInfo, UDRBlocksModel, UdrModel, UDRHierarchyModel } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { MetadataModeleResponse } from '@models/schema/schemadetailstable';
import { of, Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Regex } from '@modules/admin/_components/module/business-rules/regex-rule/regex-rule.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemaService } from '@services/home/schema.service';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { BlockType } from '@modules/admin/_components/module/business-rules/user-defined-rule/udr-cdktree.service';
@Component({
  selector: 'pros-brrule-side-sheet',
  templateUrl: './brrule-side-sheet.component.html',
  styleUrls: ['./brrule-side-sheet.component.scss']
})
export class BrruleSideSheetComponent implements OnInit {

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


    udrForm: FormGroup;


    operators = [];
    submitted = false;
    initialConditions = ['And', 'Or'];
  /**
   * Current schema id which is from activated router ..
   */
  schemaId: string;

  /**
   * Current module  id which is from activated router ..
   */
  moduleId: string;

  /**
   * Current business rule id  id which is from activated router ..
   */
  brId: string;

  /**
   * While edit hold br information ..
   */
  coreSchemaBrInfo: CoreSchemaBrInfo = new CoreSchemaBrInfo();

  udrNodeForm: FormGroup;
    /**
     * Class contructor
     * @param dialogRef refernce to matdialog
     * @param data data recieved from parent
     * @param schemaDetailsService service class
     */
    constructor(
        private schemaDetailsService: SchemaDetailsService,
        private snackBar: MatSnackBar,
        private activatedRouter: ActivatedRoute,
        private schemaService: SchemaService,
        private router: Router,
        private sharedService: SharedServiceService,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {

      this.activatedRouter.params.subscribe(res=>{
        this.moduleId = res.moduleId;
        this.schemaId = res.schemaId;
        this.brId = res.brId ? (res.brId !== 'new' ? res.brId : '') : '';
        if(this.brId) {
          this.schemaService.getBusinessRuleInfo(this.brId).subscribe(resp=>{
            this.coreSchemaBrInfo = resp;
            this.setValueToElement(resp);
            if(res.brType === BusinessRuleType.BR_CUSTOM_SCRIPT) {
              this.editUdr(resp);
            }
          }, error=> console.error(`Error : ${error.message}`));
        }
      });


        this.form = new FormGroup({
            rule_type: new FormControl('', [Validators.required]),
            rule_name: new FormControl('', [Validators.required]),
            error_message: new FormControl('', [Validators.required]),
            standard_function: new FormControl(''),
            regex: new FormControl(''),
            fields: new FormControl('', [Validators.required]),
            udrTreeData: new FormControl()
        });
        this.getFieldsByModuleId()

        if (this.filteredModules) {
            this.filteredModules = this.form.controls.fields.valueChanges
                .pipe(
                    startWith(''),
                    map(value => {
                        this.filter(value)
                    }))
        }

        this.filteredModules = of(this.fieldsList);
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


        this.udrNodeForm = this.formBuilder.group({
          frmArray: this.formBuilder.array([ this.formBuilder.group({
            blockDesc: new FormControl('When'),
            blockType: new FormControl(BlockType.AND),
            conditionFieldEndValue: new FormControl(''),
            conditionFieldId: new FormControl(''),
            conditionFieldStartValue: new FormControl(''),
            conditionFieldValue: new FormControl(''),
            conditionOperator: new FormControl(''),
            conditionValueFieldId: new FormControl(''),
            id: new FormControl(Math.floor(Math.random() * 1000000000000).toString()),
            objectType: new FormControl(this.moduleId),
            udrid: new FormControl(this.brId),
            childs: this.formBuilder.array([])
          })
          ])
        });

        this.udrNodeForm.valueChanges.subscribe(res=>{
          console.log(res);
        })
    }

    /**
     * Set br inf to form while editing ..
     */
    setValueToElement(br: CoreSchemaBrInfo) {
      this.form.get('rule_type').setValue(br.brType);
      this.form.get('rule_type').disable({onlySelf:true,emitEvent:true});
      this.form.get('rule_name').setValue(br.brInfo);
      this.form.get('error_message').setValue(br.message);
      this.form.get('standard_function').setValue(br.standardFunction);
      this.form.get('regex').setValue(br.regex);
      // this.form.get('fields').setValue(br.regex);
    }


    /**
     * Initilize form while edit ..
     * @param br initilize form while edit ..
     */
    editUdr(br: CoreSchemaBrInfo) {
      const blocks: UDRBlocksModel[] = br.udrDto ? (br.udrDto.blocks ? br.udrDto.blocks : []) : [];
      const blockHierarchy: UDRHierarchyModel[] = br.udrDto ? (br.udrDto.udrHierarchies ? br.udrDto.udrHierarchies : []) : [];
      blockHierarchy.forEach((hie, idx)=>{
        const blck = blocks.filter(fil=> fil.id === hie.blockRefId)[0];
        if(blck) {
          if(idx === 0) {
            this.udrNodeForm.get('frmArray').setValue([{
              blockDesc: blck.blockDesc,
              blockType: blck.blockType,
              conditionFieldEndValue: blck.conditionFieldEndValue,
              conditionFieldId: blck.conditionFieldId,
              conditionFieldStartValue: blck.conditionFieldStartValue,
              conditionFieldValue: blck.conditionFieldValue,
              conditionOperator: blck.conditionOperator,
              conditionValueFieldId: blck.conditionValueFieldId,
              id: blck.id,
              objectType: blck.blockType,
              udrid: blck.udrid,
              childs: []
            }]);
          } else {
            if(!hie.parentId) {
              this.addParentBlock(blck);
            } else {
              const parentBlock = blocks.filter(fil => fil.id === hie.parentId)[0];
              const pIndex = blocks.indexOf(parentBlock);
              this.addChildBlock(pIndex, blck);
            }
          }
        }


      })
    }

    addParentBlock(udr?: UDRBlocksModel) {
      const parentArray = (this.udrNodeForm.get('frmArray') as  FormArray);
      parentArray.push(this.blockCtrl(udr));
    }

    blockCtrl(udr?: UDRBlocksModel): FormGroup {
      return this.formBuilder.group({
        blockDesc:  new FormControl( udr ? udr.blockDesc : 'And'),
        blockType: new FormControl(udr ? udr.blockType :  BlockType.COND),
        conditionFieldEndValue: new FormControl(udr ? udr.conditionFieldEndValue : ''),
        conditionFieldId: new FormControl(udr ? udr.conditionFieldId : ''),
        conditionFieldStartValue: new FormControl(udr ? udr.conditionFieldStartValue : ''),
        conditionFieldValue: new FormControl(udr ? udr.conditionFieldValue : ''),
        conditionOperator: new FormControl(udr ? udr.conditionOperator : ''),
        conditionValueFieldId: new FormControl(udr ? udr.conditionValueFieldId : ''),
        id: new FormControl(udr ? udr.id : Math.floor(Math.random() * 1000000000000).toString()),
        objectType: new FormControl(this.moduleId),
        udrid: new FormControl(this.brId),
        childs: this.formBuilder.array([])
      });
    }

    /**
     * Add childs block..
     * @param parentBlockIndx parent index item where add childs ..
     */
    addChildBlock(parentBlockIndx: number, udr?: UDRBlocksModel) {
      const chldArray = this.getChildAsControl(parentBlockIndx);
      chldArray.push(this.blockCtrl(udr));
    }

    /**
     * Get parent node array .
     */
    udrNodeArray(): FormArray {
      return this.udrNodeForm.get('frmArray') as FormArray
    }

    /**
     * Get childs form array ..
     * @param index get childs node by parent id
     */
    getChildAsControl(index: number): FormArray {
      return this.udrNodeArray().at(index).get('childs') as FormArray
    }

    /**
     * Remove parent node..
     * @param index removeable index
     */
    removeParentNode(index: number) {
      const frmArray = this.udrNodeArray();
      frmArray.removeAt(index);
    }

    /**
     * Remove child node element
     * @param parentNodeId parent node id ..
     * @param childNodeId child node id ..
     */
    removeChildNode(parentNodeId: number, childNodeId: number) {
      const chldArray = this.getChildAsControl(parentNodeId);
      chldArray.removeAt(childNodeId);
    }


    /**
     * function to get the fields on basis of module
     */
    getFieldsByModuleId() {
        this.schemaDetailsService.getMetadataFields(this.moduleId)
            .subscribe((metadataModeleResponse: MetadataModeleResponse) => {
                const keys = Object.keys(metadataModeleResponse.headers);
                keys.forEach((key) => {
                    this.fieldsList.push(metadataModeleResponse.headers[key])
                });

                this.filteredModules = of(this.fieldsList);

                if(this.brId) {
                  try{
                    const fldIds = this.coreSchemaBrInfo.fields ? this.coreSchemaBrInfo.fields.split(',') : [];
                    this.selectedFields = [];
                    fldIds.forEach(fld=>{
                      const fldCtrl = this.fieldsList.filter(fil=> fil.fieldId === fld)[0];
                      if(fldCtrl) {
                        this.selectedFields.push({fieldText: fldCtrl.fieldDescri, fieldId: fld});
                      }
                    });
                  }catch(ex){console.error(ex)}
                }

            });
    }

    /**
     * function to filter the list
     * @param val fitering text
     */
    filter(val: string): string[] {
        return this.fieldsList.filter(option => {
            return option.fieldDescri.toLowerCase().indexOf(val.toLowerCase()) === 0;
        })
    }

    /**
     * function to save the array of ids of selected fields
     * @param event selected item eent
     */
    selectedField(event) {
        const alreadyExists = this.selectedFields.find(item => item.fieldId === event.option.value);
        if (alreadyExists) {
            this.snackBar.open('This field is already selected', 'error', {duration: 5000});
        } else {
            this.selectedFields.push({
                fieldText: event.option.viewValue,
                fieldId: event.option.value
            });
        }

        this.form.controls.fields.setValue('');
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
    close() {
      this.router.navigate([{ outlets: { sb: null }}]);
    }

    /**
     * function to save the form data
     */
    save() {
        this.form.controls.fields.setValue(this.selectedFields.map(item => item.fieldId).join(','));
        this.submitted = true;
        if (!this.form.valid) {
            this.snackBar.open('Please enter the required fields', 'okay', {duration:5000});
            return;
        }

        let brType: string = this.form.value ? this.form.value.rule_type : '';
        brType = brType ? brType : this.coreSchemaBrInfo.brType;
        if(brType!== 'BR_CUSTOM_SCRIPT') {
          const request: CoreSchemaBrInfo = new CoreSchemaBrInfo();
          request.brId = this.brId ? this.brId : '';
          request.brType = brType;
          request.message = this.form.value.error_message;
          request.brInfo = this.form.value.rule_name;
          request.fields = this.form.value.fields;
          request.regex = this.form.value.regex;
          request.standardFunction = this.form.value.standard_function;
          request.schemaId = this.schemaId;
          request.categoryId = this.coreSchemaBrInfo.categoryId ? this.coreSchemaBrInfo.categoryId : null;

          this.schemaService.createBusinessRule(request).subscribe(res=>{
            console.log(res);
            this.sharedService.setAfterBrSave(res);
            this.router.navigate([{ outlets: { sb: null }}]);
          }, err=> console.error(`Error : ${err.message}`));
        } else {
          // for user defined rule
          console.log(this.udrNodeForm.value);
          const udrDto: UdrModel = new UdrModel();
          udrDto.brInfo = {brId: this.brId, brIdStr: this.brId,
            brType, brInfo:this.form.value.rule_name, message: this.form.value.error_message,
            schemaId: this.schemaId, categoryId: this.coreSchemaBrInfo.categoryId } as CoreSchemaBrInfo;

          const blocks: UDRBlocksModel[] = [];
          const frm = this.udrNodeArray();
          for(let i =0; i<frm.length; i++) {
            blocks.push(frm.at(i).value as UDRBlocksModel)
          }
          const blockHierarchy: UDRHierarchyModel[] = [];
          blocks.forEach(block=>{
            const hie: UDRHierarchyModel = new UDRHierarchyModel();
            hie.blockRefId = block.id;
            hie.leftIndex = 0;
            blockHierarchy.push(hie);

            block.childs.forEach(bb=>{
              bb.blockType = BlockType.COND;
              blocks.push(bb);
              const chldHie: UDRHierarchyModel = new UDRHierarchyModel();
              chldHie.blockRefId = bb.id;
              chldHie.leftIndex = 1;
              chldHie.parentId = block.id;
              blockHierarchy.push(chldHie);
            });

          });
          udrDto.blocks = blocks;
          udrDto.objectType = this.moduleId;
          udrDto.udrHierarchies = blockHierarchy;

          this.schemaService.saveUpdateUDR(udrDto).subscribe(res=>{
            this.snackBar.open(`Successfully saved !`, 'Close',{duration:5000});
            console.log(res);
            this.sharedService.setAfterBrSave(res);
            this.router.navigate([{ outlets: { sb: null }}]);
          },error=> {
            this.snackBar.open(`Something went wrong `, 'Close',{duration:5000});
          });

        }



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

    setComparisonValue(value: string, index: number) {
      const array = this.udrNodeArray().at(index);
      array.get('conditionFieldValue').setValue(value);
    }

    setComparisonValueForChild(value, chldNode: number , parentNode: number) {
        const childArray = this.getChildAsControl(parentNode).at(chldNode);
        childArray.get('conditionFieldValue').setValue(value);
    }



    setRangeValueForChild(value, rangeText, childObject, parentIndex) {
      const childArray = this.getChildAsControl(parentIndex).at(childObject);
      if (rangeText === 'start') {
        childArray.get('conditionFieldStartValue').setValue(value);
      }
      if (rangeText === 'end') {
        childArray.get('conditionFieldEndValue').setValue(value);
      }
    }



    getConditions() {
        return ['And', 'Or']
    }

    setRangeValue(value, rangeText, parentBlockIndex) {
      const control = this.udrNodeArray().at(parentBlockIndex);
      if (rangeText === 'start') {
        control.get('conditionFieldStartValue').setValue(value);
      }
      if (rangeText === 'end') {
        control.get('conditionFieldEndValue').setValue(value);
      }
    }


}
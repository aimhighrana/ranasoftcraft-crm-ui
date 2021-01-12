import { Component, OnInit } from '@angular/core';
import { Breadcrumb } from '@models/breadcrumb';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MetadataModel, MetadataModeleResponse } from '@models/schema/schemadetailstable';
import { SchemaService } from '@services/home/schema.service';
import { DropDownValue, ConditionalOperator, UDRBlocksModel } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { of, Observable } from 'rxjs';
import { SchemaVariantService } from '@services/home/schema/schema-variant.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { BlockType } from '@modules/admin/_components/module/business-rules/user-defined-rule/udr-cdktree.service';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { UserService } from '@services/user/userservice.service';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'pros-create-variant',
  templateUrl: './create-variant.component.html',
  styleUrls: ['./create-variant.component.scss']
})
export class CreateVariantComponent implements OnInit {

  breadcrumb: Breadcrumb = {
    heading: 'Create Variant',
    links: [
      {
        link: '/home/schema',
        text: 'Schema List'
      }, {
        link: '/home/schema/schema-variants',
        text: ''
      }
    ]
  };

  schemaId: string;
  moduleId: string;
  variantId: string;

  /**
   * store the Variant Name
   */
  variantDesc: FormControl = new FormControl('');

  /**
   * Assigned Dropdown list
   */
  dropValues: DropDownValue[];
  dropValuesOb: Observable<DropDownValue[]> = of([]);

  /**
   * Hold all UDR values
   */
  conditionList: UDRBlocksModel[];

  // possible / implemented operators
  conditionalOperators: ConditionalOperator[] = this.possibleOperators;
  frmGroup: FormGroup;

  /**
   * Hold all Metadata fields
   */
  metadataFields: MetadataModeleResponse;
  metaDataFieldList: MetadataModel[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private activatedRouter: ActivatedRoute,
    private schemaService: SchemaService,
    private schemaVariantService: SchemaVariantService,
    private snackBar: MatSnackBar,
    private router: Router,
    private schemaDetailsService: SchemaDetailsService,
    private schemaListService: SchemalistService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.activatedRouter.params.subscribe(params => {
      this.moduleId = params.moduleId;
      this.schemaId = params.schemaId;
      this.variantId = params.variantId ? (params.variantId.toLowerCase() === 'new' ? '' : params.variantId) : '';
    });

    /**
     * update breadcrum for variant list
     */
    this.breadcrumb.links[1].link = `/home/schema/schema-variants/${this.moduleId}/${this.schemaId}`;

    this.schemaListService.getSchemaDetailsBySchemaId(this.schemaId).subscribe(data => {
      this.breadcrumb.links[1].text = data.schemaDescription + ' Variant(s)';
    }, error => {
      console.error('Error while fetching schema details');
    });

    if(this.variantId) {
      this.getMetadataFields();
    }

    this.initFrmArray();
  }

  /**
   * Should call http for get all fields
   */
  getMetadataFields() {
    this.schemaDetailsService.getMetadataFields(this.moduleId).subscribe(response => {
      this.metadataFields = response;
      this.makeMetadataControle();
    }, error => {
      console.error(`Error ${error}`);
    });
  }

  makeMetadataControle(): void {
    const allMDF = this.metadataFields;
    this.metaDataFieldList = [];
    if(allMDF) {
      if(allMDF.headers) {
        Object.keys(allMDF.headers).forEach(header =>{
          this.metaDataFieldList.push(allMDF.headers[header]);
        });
      }

      // grid
      if(allMDF.grids) {
        Object.keys(allMDF.grids).forEach(grid =>{
          if(allMDF.gridFields[grid]) {
            Object.keys(allMDF.gridFields[grid]).forEach(fldId => {
              this.metaDataFieldList.push(allMDF.gridFields[grid][fldId]);
            });
          }
        });
      }

      // // heirerchy
      if(allMDF.hierarchy) {
        Object.keys(allMDF.hierarchy).forEach(heiId =>{
          const heId = allMDF.hierarchy[heiId].heirarchyId;
          if(allMDF.hierarchyFields[heId]) {
            Object.keys(allMDF.hierarchyFields[heId]).forEach(fldId => {
              this.metaDataFieldList.push(allMDF.hierarchyFields[heId][fldId]);
            });
          }
        });
      }
    }
    this.getExistingVariantData();
  }

  /**
   * Get exiting added Variant Details
   */
  getExistingVariantData() {
    this.userService.getUserDetails().pipe(distinctUntilChanged()).subscribe(user => {
      this.schemaVariantService.getVariantdetailsByvariantId(this.variantId, user.currentRoleId, user.plantCode, user.userName).subscribe(res => {
        if(res) {
          this.frmArray.clear();
          this.variantDesc.setValue(res.variantName);
          // this.conditionList = res.udrBlocksModel;
          this.conditionList.forEach((each,index) => {
            const frmArray =this.frmArray;
            const field = this.metaDataFieldList.filter(fld=>
              fld.fieldId === each.conditionFieldId)[0];
            frmArray.push(this.formBuilder.group({
              fields:field,
              operator:each.conditionOperator,
              conditionFieldValue:each.conditionFieldValue,
              conditionFieldStartValue: each.conditionFieldStartValue,
              conditionFieldEndValue: each.conditionFieldEndValue,
              showRangeFld:false
            }));
            if(field && field.picklist === '1') {
              this.getdropDownValues(field.fieldId, '', index);
            }
          });
        }
      })
    })
  }

  /**
   * Init form array
   */
  initFrmArray() {
    this.frmGroup = this.formBuilder.group({
      frmArray: this.formBuilder.array([this.formBuilder.group({
        fields:['',Validators.required],
        operator:['',Validators.required],
        conditionFieldValue:'',
        conditionFieldStartValue: '',
        conditionFieldEndValue: '',
        showRangeFld:false
      })])
    });
  }

  changeField(obj: MetadataModel, index: number) {
    if(obj && obj.picklist === '1') {
      this.getdropDownValues(obj.fieldId, '', index);
    }
    const frmArray = this.frmArray;
    const frmCtrl =  frmArray.at(index);
    const val =  frmCtrl.value;
    val.fields = obj;
    val.conditionFieldValue = '';
    frmCtrl.setValue(val);
  }

  onKey(event: any) {
    const data = event? event.target.value: '';
    if(typeof data === 'string') {
      const filteredObjectTypes = this.dropValues.filter(module => (module.TEXT.toLowerCase().indexOf(data.toLowerCase())) !== -1);
      this.dropValuesOb = of(filteredObjectTypes);
    } else {
      this.dropValuesOb = of(this.dropValues);
    }
  }

  getdropDownValues(fieldId: string, queryString: string, index: number) {
    this.schemaService.dropDownValues(fieldId, queryString).subscribe(res=>{
      this.dropValues = res;
      this.dropValuesOb = of(res);
      if(this.variantId && this.variantId !== 'new') {
        const frmCtrl = this.frmArray.at(index);
        const val = frmCtrl.value;
        if(val.conditionFieldValue) {
          const dropValue = this.dropValues.filter(fill=> fill.CODE === val.conditionFieldValue);
          val.conditionFieldValue = dropValue[0];
        } else {
          val.conditionFieldValue = '';
        }
        frmCtrl.setValue(val);
      }
    },error=>console.error(`Error: ${error}`))
  }

  dropValDisplayWith(obj: DropDownValue): string {
    return obj ? obj.TEXT : null;
  }

  /**
   * While selection object from object type this method will help us to get assigned schema(s)
   *  event
   */
  selectComparisonValue(event: MatAutocompleteSelectedEvent, index: number): void {
    const frmArray = this.frmArray;
    const frmCtrl =  frmArray.at(index);
    const val =  frmCtrl.value;
    const selData =  event.option? event.option.value : '';
    if(selData) {
      val.conditionFieldValue = selData;
    }
  }

  operatorSelectionChng(option: string, index: number) {
    const frmArray = this.frmArray;
    const frmCtrl =  frmArray.at(index);
    const val =  frmCtrl.value;
    val.operator = option;
    val.showRangeFld = option=== 'RANGE' ? true : false;
    frmCtrl.setValue(val);
  }

  conditionalFieldChange(fldValue: string, index: number) {
    const frmArray = this.frmArray;
    const frmCtrl =  frmArray.at(index);
    const val =  frmCtrl.value;
    if(val.showRangeFld === true) {
      val.conditionFieldStartValue = fldValue;
      val.conditionFieldValue = '';
    } else {
      val.conditionFieldValue = fldValue;
      val.conditionFieldStartValue = '';
      val.conditionFieldEndValue = '';
    }
    frmCtrl.setValue(val);
  }

  conditionalEndFieldChange(fldValue: string, index: number) {
    const frmArray = this.frmArray;
    const frmCtrl =  frmArray.at(index);
    const val =  frmCtrl.value;
    if(fldValue) {
      val.conditionFieldEndValue = fldValue;
      val.conditionFieldValue = '';
    } else {
      val.conditionFieldEndValue = '';
    }
    frmCtrl.setValue(val);
  }

  /**
   * Add More condition
   */
  addCondition() {
    const frmArray = this.frmArray;
    frmArray.push(this.formBuilder.group({
      fields:['',Validators.required],
      operator:['',Validators.required],
      conditionFieldValue:'',
      conditionFieldStartValue: '',
      conditionFieldEndValue: '',
      showRangeFld:false
    }));
  }

  /**
   * Remove condition block
   * @param index Removeable index number
   */
  remove(index: number) {
    const frmArray = this.frmArray;
    frmArray.removeAt(index);
  }

  get possibleOperators(): ConditionalOperator[] {
    // for numeric number field
    const onlyNum:ConditionalOperator = new ConditionalOperator();
    onlyNum.desc = 'Numeric Operators';
    onlyNum.childs = [];
    onlyNum.childs.push('RANGE');
    onlyNum.childs.push('EQUAL');
    onlyNum.childs.push('LESS_THAN');
    onlyNum.childs.push('LESS_THAN_EQUAL');
    onlyNum.childs.push('GREATER_THAN');
    onlyNum.childs.push('GREATER_THAN_EQUAL');
    return [onlyNum];
  }

  /**
   * Save or update Variant Details
   */
  saveUpdateVariant(id?: string) {
    const frmArray = this.frmArray;
    if(this.variantDesc.value === '' || !frmArray.valid) {
      this.snackBar.open(`Please enter required field(s)`,'Close',{duration:5000});
      return false;
    }

    const arrayReq: UDRBlocksModel[] = [];
    for(let i=0; i<frmArray.length; i++) {
      const ctrl = frmArray.at(i);
      const request: UDRBlocksModel = new UDRBlocksModel();
      request.id = id ? id : String(Math.floor(Math.random() * 1000000000));
      request.conditionFieldId = ctrl.value.fields.fieldId ? ctrl.value.fields.fieldId : '';
      request.conditionOperator = ctrl.value.operator;
      request.blockType = BlockType.COND;
      request.conditionFieldStartValue = ctrl.value.conditionFieldStartValue;
      request.conditionFieldEndValue = ctrl.value.conditionFieldEndValue;
      request.conditionFieldValue = typeof ctrl.value.conditionFieldValue === 'string' ? ctrl.value.conditionFieldValue : ctrl.value.conditionFieldValue.CODE;
      request.objectType = this.moduleId;
      arrayReq.push(request);
    }

    // const data: VariantDetails = new VariantDetails();
    // data.schemaId = this.schemaId;
    // data.variantName = this.variantDesc.value;
    // data.variantId = this.variantId;
    // data.udrBlocksModel = arrayReq;

    // // call service for save variant details
    // this.schemaVariantService.saveUpdateSchemaVariant([data]).subscribe(res=>{
    //   console.log('create update Variant Response = ', res);
    //   if(res) {
    //     this.variantId = res;
    //     this.router.navigate(['/home/schema/schema-variants', this.moduleId, this.schemaId]);
    //     this.snackBar.open(`Successfully saved`, 'Close',{duration:5000});
    //   }
    // },error=>console.error(`Error ${error}`));
  }

  /**
   * While click on Discard should be route schema Variant Page
   */
  close() {this.router.navigate(['/home/schema/schema-variants', this.moduleId, this.schemaId]);
}
  /***
   * Get form array controles
   */
  get frmArray() {
    return this.frmGroup.get('frmArray') as FormArray;
  }
}

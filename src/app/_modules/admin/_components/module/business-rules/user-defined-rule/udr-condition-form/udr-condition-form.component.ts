import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import { MetadataModel } from 'src/app/_models/schema/schemadetailstable';
import { of, Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { DropDownValue, UDRBlocksModel } from '../../business-rules.modal';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BlockType } from '../udr-cdktree.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'pros-udr-condition-form',
  templateUrl: './udr-condition-form.component.html',
  styleUrls: ['./udr-condition-form.component.scss']
})
export class UdrConditionFormComponent implements OnInit, OnChanges {

  @Input()
  schemaId: string;

  @Input()
  moduleId: string;

  @Input()
  svdClicked: boolean;

  @Output()
  evtAfterSaved: EventEmitter<string[]> = new EventEmitter<string[]>();

  conditionalOperators: string[];
  conditionalOperatorsOb: Observable<string[]> = of([]);

  dropValues: DropDownValue[];
  dropValuesOb: Observable<DropDownValue[]> = of([]);

  frmGroup: FormGroup;
  showRangeFld = false;
  constructor(
    private schemaDetailsService: SchemaDetailsService,
    private formBuilder: FormBuilder,
    private schemaService: SchemaService,
    private snackBar: MatSnackBar
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes && changes.svdClicked && changes.svdClicked.previousValue !== changes.svdClicked.currentValue) {
      if(changes.svdClicked.currentValue.toString() === 'true') {
        this.saveUpdateCondition();
      }
    }
  }

  ngOnInit(): void {

    // get all operator http call
    this.getBrConditionalOperator();

    // form builder
    this.initFrmArray();

    // track change values
    // this.frmGroup.valueChanges.subscribe(val=>{
    //   console.log(val);
    // });

    // // filter operators
    // this.frmGroup.get('operator').valueChanges.subscribe(val=>{
    //   if(val) {
    //     this.conditionalOperatorsOb = of(this.conditionalOperators.filter(fill => fill.toLocaleLowerCase().indexOf(val.toLocaleLowerCase())!==-1));
    //   } else {
    //     this.conditionalOperatorsOb = of(this.conditionalOperators);
    //   }
    // });

    // // filter dropdown values
    // this.frmGroup.get('conditionFieldValue').valueChanges.subscribe(val=>{
    //   if(typeof val === 'string') {
    //     this.getdropDownValues(this.frmGroup.get('fields').value.fieldId, val);
    //   }
    // });
  }

  /**
   * Init form array
   */
  initFrmArray() {
    this.frmGroup = this.formBuilder.group({
      frmArray: this.formBuilder.array([this.formBuilder.group({
        conditionDesc :['',Validators.required],
        fields:['',Validators.required],
        operator:['',Validators.required],
        conditionFieldValue:'',
        conditionFieldStartValue: '',
        conditionFieldEndValue: '',
        showRangeFld:false
  })])
  });
  }

  getBrConditionalOperator() {
    this.schemaService.getBrConditionalOperator().subscribe(res=>{
      this.conditionalOperators = res;
      this.conditionalOperatorsOb = of(res);
    },error=>console.error(`Error: ${error}`));
  }

  changeConditionalField(obj: MetadataModel, index: number) {
    if(obj && obj.picklist === '1') {
      this.getdropDownValues(obj.fieldId, '');
    }
    const frmArray = this.frmArray;
    const frmCtrl =  frmArray.at(index);
    const val =  frmCtrl.value;
    val.fields = obj;
    frmCtrl.setValue(val);
  }

  getdropDownValues(fieldId: string, queryString: string) {
    this.schemaService.dropDownValues(fieldId, queryString).subscribe(res=>{
      this.dropValues = res;
      this.dropValuesOb = of(res);
    },error=>console.error(`Error: ${error}`))
  }

  dropValDisplayWith(obj: DropDownValue): string {
    return obj ? obj.TEXT : null;
  }

  operatorSelectionChng(option: MatAutocompleteSelectedEvent, index: number) {
    const frmArray = this.frmArray;
    const frmCtrl =  frmArray.at(index);
    const val =  frmCtrl.value;
    val.showRangeFld = option.option.value === 'RANGE' ? true : false;
    frmCtrl.setValue(val);
    // frmCtrl.get('showRangeFld').setValue(option.option.value === 'RANGE' ? true : false);
  }

  /**
   * Add More condition
   */
  addCondition() {
    const frmArray = this.frmArray;
    frmArray.push(this.formBuilder.group({
      conditionDesc :['',Validators.required],
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

  saveUpdateCondition(id?: string) {
    const frmArray = this.frmArray;
    console.log(frmArray);
    if(!frmArray.valid) {
      this.snackBar.open(`Please enter required field(s)`,'Close',{duration:5000});
      return false;
    }
    const arrayReq: UDRBlocksModel[] = [];

    for(let i=0; i<frmArray.length; i++) {
      const ctrl = frmArray.at(i);
      const request: UDRBlocksModel = new UDRBlocksModel();
      request.id = id ? id : String(new Date().getTime());
      request.conditionFieldId = ctrl.value.fields.fieldId ? ctrl.value.fields.fieldId : '';
      request.blockDesc = ctrl.value.conditionDesc;
      request.conditionFieldValue = typeof ctrl.value.conditionFieldValue === 'string' ? ctrl.value.conditionFieldValue : ctrl.value.conditionFieldValue.CODE;
      request.conditionOperator = ctrl.value.operator;
      request.blockType = BlockType.COND;
      request.conditionFieldStartValue = ctrl.value.conditionFieldStartValue;
      request.conditionFieldEndValue = ctrl.value.conditionFieldEndValue;
      request.objectType = this.moduleId;

      arrayReq.push(request);
    }

    // call service for save conditional blocks
    this.schemaService.saveUpdateUdrBlock(arrayReq).subscribe(response=>{
      if(response) {
        this.snackBar.open(`Successfully saved `,'Close',{duration:5000});
        this.frmGroup.reset();
        this.initFrmArray();
        this.evtAfterSaved.emit(response);
      }
    },error=>console.error(`Error : ${error}`));
  }

  /***
   * Get form array controles
   */
  get frmArray() {
    return this.frmGroup.get('frmArray') as FormArray;
  }

}

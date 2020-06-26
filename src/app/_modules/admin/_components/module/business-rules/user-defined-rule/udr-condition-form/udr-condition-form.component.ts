import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import { MetadataModel } from 'src/app/_models/schema/schemadetailstable';
import { of, Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
export class UdrConditionFormComponent implements OnInit {

  @Input()
  schemaId: string;

  @Input()
  moduleId: string;

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

  ngOnInit(): void {

    // get all operator http call
    this.getBrConditionalOperator();

    // form builder
    this.frmGroup = this.formBuilder.group({
        conditionDesc :['',Validators.required],
        fields:['', Validators.required],
        operator:['', Validators.required],
        conditionFieldValue:[''],
        conditionFieldStartValue: [''],
        conditionFieldEndValue: ['']
    });

    // track change values
    this.frmGroup.valueChanges.subscribe(val=>{
      console.log(val);
    });

    // filter operators
    this.frmGroup.get('operator').valueChanges.subscribe(val=>{
      if(val) {
        this.conditionalOperatorsOb = of(this.conditionalOperators.filter(fill => fill.toLocaleLowerCase().indexOf(val.toLocaleLowerCase())!==-1));
      } else {
        this.conditionalOperatorsOb = of(this.conditionalOperators);
      }
    });

    // filter dropdown values
    this.frmGroup.get('conditionFieldValue').valueChanges.subscribe(val=>{
      if(typeof val === 'string') {
        this.getdropDownValues(this.frmGroup.get('fields').value.fieldId, val);
      }
    });
  }

  getBrConditionalOperator() {
    this.schemaService.getBrConditionalOperator().subscribe(res=>{
      this.conditionalOperators = res;
      this.conditionalOperatorsOb = of(res);
    },error=>console.error(`Error: ${error}`));
  }

  changeConditionalField(obj: MetadataModel) {
    this.frmGroup.get('fields').setValue(obj);
    if(obj && obj.picklist === '1') {
      this.getdropDownValues(obj.fieldId, '');
    }
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

  operatorSelectionChng(option: MatAutocompleteSelectedEvent) {
    this.showRangeFld = (option.option.value === 'RANGE') ? true : false;
  }

  saveUpdateCondition(id?: string) {
    if(!this.frmGroup.valid) {
      this.snackBar.open(`Please enter require field(s)`,'Close',{duration:5000});
      return false;
    }
    const request: UDRBlocksModel = new UDRBlocksModel();
    request.id = id ? id : String(new Date().getTime());
    request.blockType = null;
    request.conditionFieldId = this.frmGroup.value.fields.fieldId;
    request.blockDesc = this.frmGroup.value.conditionDesc;
    request.conditionFieldValue = typeof this.frmGroup.value.conditionFieldValue === 'string' ? this.frmGroup.value.conditionFieldValue : this.frmGroup.value.conditionFieldValue.CODE;
    request.conditionOperator = this.frmGroup.value.operator;
    request.blockType = BlockType.COND;
    request.conditionFieldStartValue = this.frmGroup.value.conditionFieldStartValue;
    request.conditionFieldEndValue = this.frmGroup.value.conditionFieldEndValue;
    request.objectType = this.moduleId;

    this.schemaService.saveUpdateUdrBlock([request]).subscribe(response=>{
      if(response) {
        this.snackBar.open(`Successfully saved `,'Close',{duration:5000});
        this.frmGroup.reset();
        this.evtAfterSaved.emit(response);
      }
    },error=>console.error(`Error : ${error}`));
  }

}

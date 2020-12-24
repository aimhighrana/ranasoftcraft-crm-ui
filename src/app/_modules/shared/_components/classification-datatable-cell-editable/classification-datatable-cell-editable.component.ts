import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DropDownValue } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SchemaService } from '@services/home/schema.service';
import { NounModifierService } from '@services/home/schema/noun-modifier.service';
import { UserService } from '@services/user/userservice.service';
import { Observable, of } from 'rxjs';

export enum CellDataFor {
  LOCAL_NOUN = 'LOCAL_NOUN',
  LOCAL_MODIFIER = 'LOCAL_MODIFIER',
  LOCAL_ATTRIBUTE = 'LOCAL_ATTRIBUTE',
  GSN_NOUN = 'GSN_NOUN',
  GSN_MODIFIER = 'GSN_MODIFIER',
  GSN_ATTRIBUTE = 'GSN_ATTRIBUTE',

}

@Component({
  selector: 'pros-classification-datatable-cell-editable',
  templateUrl: './classification-datatable-cell-editable.component.html',
  styleUrls: ['./classification-datatable-cell-editable.component.scss']
})
export class ClassificationDatatableCellEditableComponent implements OnInit, AfterViewInit {

  @Input()
  fieldId: string;


  @Input()
  cellDataFor: CellDataFor;

  @Input()
  preSuggestedValues: DropDownValue[] = [];

  @Input()
  objectNumber: string;

  @Input()
  nounCode: string;

  @Input()
  modCode: string;

  @Input()
  schemaId: string;

  @Input()
  rundId: string;

  @Input()
  brType: string;

  @Output()
  inputBlur = new EventEmitter<any>();

  @ViewChild('input') input: ElementRef;


  selectFieldOptions: DropDownValue[] = [];
  filterdOptionsObs: Observable<DropDownValue[]>;

  searchControl = new FormControl();

  constructor(
    private schemaService: SchemaService,
    private nounModifierService: NounModifierService,
    private userService: UserService
  ) { }

  ngOnInit(): void {

    if(this.fieldId === 'NOUN_CODE') {
      this.getSuggestedNouns();
    } else if(this.fieldId === 'MODE_CODE') {
      this.getSuggestedModifiers();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.input.nativeElement.focus();
    }, 10)

  }

  emitChngSelectValue(event: MatAutocompleteSelectedEvent) {
    const selVal = event.option.value;
    this.emitInputBlur(selVal);
  }

  emitInputBlur(value) {
    this.inputBlur.emit(value);
  }



  getSuggestedNouns(searchString?: string) {
    this.nounModifierService.getSuggestedNouns(this.schemaId,this.rundId,this.objectNumber,this.brType,searchString) .subscribe(res=>{
      if(searchString) {
        this.selectFieldOptions = this.preSuggestedValues.filter(fil=> (fil.CODE.indexOf(searchString) !==-1 || fil.TEXT.indexOf(searchString) !==-1));
      } else {
        this.selectFieldOptions = this.preSuggestedValues;
      }

      res.forEach(r=>{
        const drop: DropDownValue = {CODE: r.NOUN_CODE,FIELDNAME:this.fieldId,TEXT:r.NOUN_LONG ? r.NOUN_LONG : r.NOUN_CODE} as DropDownValue;
        this.selectFieldOptions.push(drop);
      });
      this.filterdOptionsObs = of(this.selectFieldOptions);

      if(!searchString) {
        this.searchControl.valueChanges.subscribe(val=>{
          this.getSuggestedNouns(val.trim());
        });
      }

    }, err => console.error(`Exception ${err.message}`));
  }


  getSuggestedModifiers(searchString?: string) {
    this.nounModifierService.getSuggestedModifiers(this.schemaId,this.rundId,this.objectNumber,this.brType,this.nounCode,searchString) .subscribe(res=>{
      if(searchString) {
        this.selectFieldOptions = this.preSuggestedValues.filter(fil=> (fil.CODE.indexOf(searchString) !==-1 || fil.TEXT.indexOf(searchString) !==-1));
      } else {
        this.selectFieldOptions = this.preSuggestedValues;
      }

      res.forEach(r=>{
        const drop: DropDownValue = {CODE: r.MODE_CODE,FIELDNAME:this.fieldId,TEXT:r.MOD_LONG ? r.MODE_CODE : r.NOUN_CODE} as DropDownValue;
        this.selectFieldOptions.push(drop);
      });
      this.filterdOptionsObs = of(this.selectFieldOptions);

      if(!searchString) {
        this.searchControl.valueChanges.subscribe(val=>{
          this.getSuggestedModifiers(val.trim());
        });
      }

    }, err => console.error(`Exception ${err.message}`));
  }

}
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { Metadata } from '@modules/report/edit/container/metadatafield-control/metadatafield-control.component';
import { Observable, of, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { MetadataModeleResponse } from '@models/schema/schemadetailstable';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'pros-generic-field-control',
  templateUrl: './generic-field-control.component.html',
  styleUrls: ['./generic-field-control.component.scss']
})
export class GenericFieldControlComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  moduleId: string;

  /**
   * Pre selected values
   */
  @Input()
  selectedFldId: string[];

  /**
   * Is multiSelect dropdown
   */
  @Input()
  isMultiSelection: boolean;

  /**
   * mat-label
   */
  @Input()
  lebel: string;

  /**
   * After option selection change event should be emit
   */
  @Output()
  selectionChange: EventEmitter<Metadata[]> = new EventEmitter<Metadata[]>();

  fields: Metadata[] = [];
  fieldsObs: Observable<Metadata[]> = of([]);
  fieldFrmCtrl: FormControl = new FormControl('');
  preSelectedCtrl: Metadata[] = [];

  /**
   * All the http or normal subscription will store in this array
   */
  subscriptions: Subscription[] = [];


  constructor(
    private schemaDetailsService: SchemaDetailsService
  ) { }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>{
      sub.unsubscribe();
    });
  }

  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    if(changes && changes.moduleId && changes.moduleId.currentValue !== changes.moduleId.previousValue) {
      this.moduleId = changes.moduleId.currentValue;
      this.getFields();
    }

    if(changes && changes.selectedFldId && changes.selectedFldId.currentValue !== changes.selectedFldId.previousValue) {
      this.preSelectedCtrl = this.returnSelectedFldCtrl(changes.selectedFldId.currentValue);
    }
  }

  openPanel(): void {
    this.fieldFrmCtrl.setValue('');
  }

  ngOnInit(): void {
    this.fieldFrmCtrl.valueChanges.subscribe(val=>{
      if(val && typeof val === 'string' && val.trim() !== '') {
        const groups = Array.from(this.fields.filter(fil =>fil.isGroup));
        const matchedData: Metadata[] = [];
        groups.forEach(grp=>{
          const changeAble = {isGroup:grp.isGroup, fieldId: grp.fieldId,childs: grp.childs,fieldDescri: grp.fieldDescri};
          const chld: Metadata[] = [];
          changeAble.childs.forEach(child=>{
              if(child.fieldDescri.toLocaleLowerCase().indexOf(val.toLocaleLowerCase()) !==-1) {
                chld.push(child);
              }
            });
            if(chld.length) {
              changeAble.childs = chld;
              matchedData.push(changeAble);
            }
        });
        this.fieldsObs = of(matchedData);
      } else {
        this.fieldsObs = of(this.fields);
        // if(typeof val === 'string' && val.trim() === '') {
        //   this.selected(null);
        // }
      }
    })
  }

  /**
   * Should call http for get all fields
   */
  getFields() {
    if(this.moduleId) {
      const allfldSub = this.schemaDetailsService.getMetadataFields(this.moduleId).subscribe(response => {
        const res = this.transformFieldRes(response);
        this.fields = res;
        this.fieldsObs = of(res);
        if(this.selectedFldId) {
          this.preSelectedCtrl = this.returnSelectedFldCtrl(this.selectedFldId);
        }
      }, error => {
        console.error(`Error : ${error}`);
      });
      this.subscriptions.push(allfldSub);
    }
  }

  /**
   * Help to transform data from MetadataModeleResponse to Metadata[]
   * @param response metadata response from server
   */
  transformFieldRes(response: MetadataModeleResponse): Metadata[] {
    const metadata: Metadata[] = [];

    // for header
    const headerChilds: Metadata[] = [];
    if(response.headers) {
      Object.keys(response.headers).forEach(header=>{
        const res = response.headers[header];
        headerChilds.push({
          fieldId: res.fieldId,
          fieldDescri: res.fieldDescri,
          isGroup: false,
          childs: []
        });
      });
    }
    metadata.push({
      fieldId: 'header_fields',
      fieldDescri: 'Header fields',
      isGroup: true,
      childs: headerChilds
    });

    // for grid response transformations
    if(response && response.grids) {
      Object.keys(response.grids).forEach(grid=>{
        const childs : Metadata[] = [];
        if(response.gridFields && response.gridFields.hasOwnProperty(grid)) {
          Object.keys(response.gridFields[grid]).forEach(fld=>{
            const fldCtrl = response.gridFields[grid][fld];
              childs.push({
                fieldId: fldCtrl.fieldId,
                fieldDescri: fldCtrl.fieldDescri,
                isGroup: false,
                childs:[]
              });
          });
        }
        metadata.push({
          fieldId: grid,
          fieldDescri: response.grids[grid].fieldDescri,
          isGroup: true,
          childs
        });
      })
    }

    // for hierarchy response transformations
    if(response && response.hierarchy) {
      response.hierarchy.forEach(hierarchy => {
        const childs: Metadata[] = [];
        if(response.hierarchyFields && response.hierarchyFields.hasOwnProperty(hierarchy.heirarchyId)) {
          Object.keys(response.hierarchyFields[hierarchy.heirarchyId]).forEach(fld=>{
            const fldCtrl = response.hierarchyFields[hierarchy.heirarchyId][fld];
              childs.push({
                fieldId: fldCtrl.fieldId,
                fieldDescri: fldCtrl.fieldDescri,
                isGroup: false,
                childs:[]
              });
          });
        }
        metadata.push({
          fieldId: hierarchy.heirarchyId,
          fieldDescri: hierarchy.heirarchyText,
          isGroup: true,
          childs
        });
      });
    }
    return metadata;
  }

  /**
   * Should return selected field control
   * @param fieldId seldcted field id
   */
  returnSelectedFldCtrl(fieldId: string[]): Metadata[] {
    const returnCtrl: Metadata[] = [];
    fieldId.forEach(f=>{
      this.fields.forEach(fld=>{
        const match = fld.childs.filter(fil=> fil.fieldId === f);
        if(match.length) {
          returnCtrl.push(match[0]);
        }
      });
    });
    return returnCtrl;
  }

  /**
   * Should return field descriptions
   * @param obj curret render object
   */
  displayFn(obj: Metadata): string {
    return obj? obj.fieldDescri: null;
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  /**
   * Should emit after value change
   * @param selected selected option from ui
   */
  selected(selected:MatAutocompleteSelectedEvent) {
    const option = selected.option.value as Metadata;
    if(option) {
      if(this.isMultiSelection) {
        const preVal =  this.preSelectedCtrl.filter(fil=> fil.fieldId === option.fieldId)[0];
        if(preVal) {
          this.preSelectedCtrl.splice(this.preSelectedCtrl.indexOf(preVal), 1);
        } else {
          this.preSelectedCtrl.push(option);
        }
      } else {
        this.preSelectedCtrl = [option];
      }
    }
    this.selectionChange.emit(this.preSelectedCtrl);
  }

  /**
   * Should remove selected items
   * @param option removeable option
   */
  remove(option: Metadata) {
    if(option) {
      const op = this.preSelectedCtrl.filter(fil=> fil.fieldId === option.fieldId)[0];
      if(op) {
        this.preSelectedCtrl.splice(this.preSelectedCtrl.indexOf(op), 1);
        this.selectionChange.emit(this.preSelectedCtrl);
      }
    }
  }

}

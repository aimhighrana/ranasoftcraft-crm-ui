import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { MetadataModel, MetadataModeleResponse, SchemaTableViewRequest, SchemaTableViewFldMap } from 'src/app/_models/schema/schemadetailstable';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { SharedServiceService } from '../../_services/shared-service.service';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';

@Component({
  selector: 'pros-table-column-settings',
  templateUrl: './table-column-settings.component.html',
  styleUrls: ['./table-column-settings.component.scss']
})
export class TableColumnSettingsComponent implements OnInit{
  getMdmr: MetadataModeleResponse[];
  headerFieldObs: Observable<MetadataModel[]> = of([]);
  header : MetadataModel[] = [];
  hierarchy : MetadataModel[] = [];
  grid : MetadataModel[] = [];
  globalFormControl: FormControl = new FormControl('');

  hierarchyList = {} as any;
  gridList = {} as any;
  heText = {} as any;
  val: any = {} as any;
  markedFields: string[] = [];
  dynamicSearchVal = '';
  matchCount = 0;
  index = 0;
  data = null;
  allChecked = false;
  allIndeterminate = false;
  hierarchyChecked = false;
  hierarchyIndeterminate = false;
  gridChecked = false;
  gridIndeterminate = false;
  headerArray = [];
  gridArray = [];
  hierarchyArray = [];

  /**
   * Hold fields of all suggested fields
   */
  suggestedFlds: string[] = [];

  constructor(
    private sharedService: SharedServiceService,
    private router: Router,
    private schemaDetailsService: SchemaDetailsService
  ){}

  ngOnInit() {
    this.sharedService.getChooseColumnData().subscribe(data=>{
      this.data = data;
      this.headerDetails();
      this.manageStateOfCheckBox();
    });
  }

  // header
  public headerDetails() {
    this.header = [];
    if(this.data && this.data.selectedFields && this.data.selectedFields.length > 0){
      for(const fldid of this.data.selectedFields) {
        if(this.data.fields.headers[fldid]) {
          this.header.push(this.data.fields.headers[fldid]);
        }
      }
    }
    if(this.data && this.data.fields && this.data.fields.headers && this.data.selectedFields){
      for(const hekey in this.data.fields.headers){
        if(this.data.selectedFields.length > 0){
          if(this.data.selectedFields.indexOf(hekey) === -1)
          {
            this.header.push(this.data.fields.headers[hekey]);
          }
        }
        else {
          this.header.push(this.data.fields.headers[hekey]);
        }
      }
    }
    this.headerFieldObs = of(this.header);
    this.headerArray = this.header.map(he=> he.fieldId);
  }
  close()
  {
    this.router.navigate([{ outlets: { sb: null }}]);
  }

  public persistenceTableView(selFld: string[]) {
    const schemaTableViewRequest: SchemaTableViewRequest = new SchemaTableViewRequest();
    schemaTableViewRequest.schemaId = this.data.schemaId;
    schemaTableViewRequest.variantId = this.data.variantId;
    const fldObj: SchemaTableViewFldMap[] = [];
    let order = 0;
    selFld.forEach(fld => {
      const schemaTableVMap: SchemaTableViewFldMap = new SchemaTableViewFldMap();
      schemaTableVMap.fieldId = fld;
      schemaTableVMap.order = order;
      order ++;
      fldObj.push(schemaTableVMap);
    });
    schemaTableViewRequest.schemaTableViewMapping = fldObj;
    this.schemaDetailsService.updateSchemaTableView(schemaTableViewRequest).subscribe(response => {
      console.log(response);
      this.sharedService.setChooseColumnData(this.data);
      this.close();
    }, error => {
      console.error('Exception while persist table view');
    });
  }

  /**
   * Manage select all checkbox state
   */
  manageStateOfCheckBox() {
    if(this.header.length === this.data.selectedFields.length) {
      this.allChecked = true;
      this.allIndeterminate = false;
    } else if(this.data.selectedFields.length !== 0){
      this.allIndeterminate = true;
      this.allChecked = false;
    }
  }


  /**
   * Search field by value change
   * @param value changed input value
   */
  searchFld(value: string) {
    if(value) {
      const sugg = this.header.filter(fill=> fill.fieldDescri.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !==-1);
      // this.headerFieldObs = of(sugg);
      this.suggestedFlds = sugg.map(map => map.fieldId);
      const data = document.getElementById(this.suggestedFlds[0]).offsetTop;
      (document.getElementsByTagName('mat-card')[0]).scrollTo(0,data-40);
    } else {
      this.headerFieldObs = of(this.header);
      this.suggestedFlds = [];
      (document.getElementsByTagName('mat-card')[0]).scrollTo(0,0);
    }
  }

  /**
   * While change checkbox state ..
   * @param fld changeable checkbox
   */
  selectionChange(fld: MetadataModel) {
    const selIndex =  this.data.selectedFields.indexOf(fld.fieldId);
    if(selIndex !==-1) {
      this.data.selectedFields.splice(selIndex, 1)
    } else {
      this.data.selectedFields.push(fld.fieldId);
    }
    this.manageStateOfCheckBox();
  }

  /**
   * checked is checked
   * @param fld field for checking is selected or not
   */
  isChecked(fld: MetadataModel): boolean {
    const selCheck = this.data.selectedFields.indexOf(fld.fieldId);
    return selCheck !==-1 ? true : false;
  }

  /**
   * State of select all checkbox ..
   */
  selectAll() {
    this.data.selectedFields = [];
    if(this.allChecked) {
      this.allChecked  = true;
      this.allIndeterminate = false;
      this.data.selectedFields = this.headerArray;
    } else {
      this.allChecked = false;
      this.allIndeterminate = false;
    }
  }

  /**
   * While drag and drop on list elements
   * @param event dragable elemenet
   */
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  /**
   * Submit selected columns ..
   */
  submitColumn() {
    const orderFld: string[] = [];
    const hdlFld = this.header.map(map=> map.fieldId);
    hdlFld.forEach(fld=>{
      if(this.data.selectedFields.indexOf(fld) !==-1) {
        orderFld.push(fld);
      }
    });
    this.data.selectedFields = orderFld;
    this.persistenceTableView(orderFld);
  }

}

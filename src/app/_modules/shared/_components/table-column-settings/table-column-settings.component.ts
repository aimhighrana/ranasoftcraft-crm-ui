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
  constructor(
    private sharedService: SharedServiceService,
    private router: Router,
    private schemaDetailsService: SchemaDetailsService
  ){}

  ngOnInit() {
    this.sharedService.getChooseColumnData().subscribe(data=>{
      this.data = data;
      this.headerDetails();
      this.hierarchyDetails();
      this.gridDetails();
      if(this.data.selectedFields && this.data.selectedFields.length > 0){
        this.selectCheckbox();
      }
      this.search();
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
    // hierarchy
  public hierarchyDetails() {
    this.hierarchy = [];
    if(this.data && this.data.selectedHierarchyIds && this.data.selectedHierarchyIds.length>0) {
      for(const hefldId of this.data.selectedHierarchyIds) {
        if(this.data.fields.hierarchyFields[hefldId]) {
          if(this.data.selectedFields.length > 0) {
            for(const fldid of this.data.selectedFields){
              if(this.data.fields.hierarchyFields[hefldId][fldid]){
                this.hierarchy.push(this.data.fields.hierarchyFields[hefldId][fldid])
              }
            }
          }
          for( const heKey in this.data.fields.hierarchyFields[hefldId]) {
            if(this.data.selectedFields.length > 0) {
              if(this.data.selectedFields.indexOf(heKey) === -1) {
                this.hierarchy.push(this.data.fields.hierarchyFields[hefldId][heKey]);
              }
            }
            else {
              this.hierarchy.push(this.data.fields.hierarchyFields[hefldId][heKey])
            }
          }
          const hedesc = this.data.fields.hierarchy.filter(hedId =>
            hedId.heirarchyId === hefldId
          )[0];
          this.heText[hefldId] = hedesc.heirarchyText
        }
        this.hierarchyList[hefldId] = this.hierarchy;
        this.hierarchyArray =this.hierarchy.map(hr=> hr.fieldId);

      }
    }
  }

    // grid
  public gridDetails() {
    this.grid = [];
    if(this.data && this.data.selectedGridIds && this.data.selectedGridIds.length>0) {
      for(const grfldId of this.data.selectedGridIds) {
        if(this.data.fields.gridFields[grfldId]) {
          if(this.data.selectedFields.length > 0) {
            for(const fldid of this.data.selectedFields) {
              if(this.data.fields.gridFields[grfldId][fldid]) {
                this.grid.push(this.data.fields.gridFields[grfldId][fldid]);
              }
            }
          }
          for( const grKey in this.data.fields.gridFields[grfldId]) {
            if(this.data.selectedFields.length > 0) {
              if(this.data.selectedFields.indexOf(grKey) === -1) {
                this.grid.push(this.data.fields.gridFields[grfldId][grKey]);
              }
            }
            else {
              this.grid.push(this.data.fields.gridFields[grfldId][grKey])
            }
          }
          this.val = this.data.fields.grids[grfldId];
        }
        this.gridList[grfldId] = this.grid;
        this.gridArray =this.grid.map(gr=> gr.fieldId);
      }
    }
  }

  public selectCheckbox() {
    let hierarchyCount = 0;
    let gridCount = 0;
    let headerCount = 0;
    const allArray = this.headerArray.concat(this.hierarchyArray).concat(this.gridArray);
    this.data.selectedFields.forEach( field => {
      if(this.headerArray.indexOf(field) !== -1){
        headerCount++;
      }
      else if(this.gridArray.length > 0 && this.gridArray.indexOf(field) !== -1) {
        gridCount++;
      }
      else if(this.hierarchyArray.length > 0 && this.hierarchyArray.indexOf(field) !== -1) {
        hierarchyCount++;
      }
    });
    const allCount = headerCount + hierarchyCount + gridCount;
      if(allCount === allArray.length){
        this.allIndeterminate = false;
        this.allChecked = true;
        this.hierarchyIndeterminate = false;
        this.hierarchyChecked = true;
        this.gridIndeterminate = false;
        this.gridChecked = true;
      }
    else if(allCount > 0) {
      this.allIndeterminate = true;
      if(gridCount < this.gridArray.length || hierarchyCount < this.hierarchyArray.length) {
        this.hierarchyIndeterminate = true;
        this.hierarchyChecked = false;
        this.gridIndeterminate = true;
        this.gridChecked = false;
      }else if(hierarchyCount === this.hierarchyArray.length || gridCount === this.gridArray.length) {
        this.hierarchyIndeterminate = false;
        this.hierarchyChecked = true;
        this.gridIndeterminate = false;
        this.gridChecked = true;
      }
    }
    else {
      this.allIndeterminate = false;
      this.allChecked = false;
      this.hierarchyIndeterminate = false;
      this.hierarchyChecked = false;
      this.gridIndeterminate = false;
      this.gridChecked = false;
    }
  }
  // search
  search() {
    // Header Search
    this.globalFormControl.valueChanges.subscribe(data => {
      if(data && data !== '') {
        this.markedFields = [];
        Object.keys(this.data.fields.headers).forEach( fldid => {
          const fldDesc = this.data.fields.headers[fldid].fieldDescri;
            if(fldDesc.toLowerCase().indexOf(data.toLowerCase()) === 0) {
              if(this.markedFields.indexOf(fldid) === -1)
                this.markedFields.push(fldid);
                this.onWindowScroll();
              }
        });
        this.headerFieldObs = of(this.header);
        // Hierarchy Search
        this.data.selectedHierarchyIds.forEach(hefldId => {
          if(this.data.fields.hierarchyFields[hefldId]) {
            Object.keys(this.data.fields.hierarchyFields[hefldId]).forEach(heKey =>{
              const heDesc = this.data.fields.hierarchyFields[hefldId][heKey].fieldDescri;
              if(heDesc.toLowerCase().indexOf(data.toLowerCase()) === 0){
                if(this.markedFields.indexOf(heKey) === -1)
                  this.markedFields.push(heKey);
                  this.onWindowScroll();
              }
            });
          }
        });
        this.hierarchyList = this.hierarchyList;
        // grid
        this.data.selectedGridIds.forEach(grfldId => {
          if(this.data.fields.gridFields[grfldId]) {
            Object.keys(this.data.fields.gridFields[grfldId]).forEach(grKey => {
              const grDesc = this.data.fields.gridFields[grfldId][grKey].fieldDescri;
              if(grDesc.toLowerCase().indexOf(data.toLowerCase()) === 0){
                if(this.markedFields.indexOf(grKey) === -1)
                  this.markedFields.push(grKey);
                  this.onWindowScroll();
              }
            });
          }
        });
        this.gridList = this.gridList;

      }
      else {
        this.headerFieldObs = of(this.header);
        this.hierarchyList = this.hierarchyList;
        this.gridList = this.gridList;
        this.markedFields = [];
        }
    });
  }

  // drag-drop
  drop(event: CdkDragDrop<MetadataModel[]>, from:string, gridheirarchyId: string) {
    if(from === 'hierarchy') {
      moveItemInArray(this.hierarchy, event.previousIndex, event.currentIndex);

    }
    else if(from === 'header') {
    moveItemInArray(this.header, event.previousIndex, event.currentIndex);
    }
    else if(from === 'grid') {
      moveItemInArray(this.grid, event.previousIndex, event.currentIndex);
    }
  }
  // search
  isMarked(fldId: string): boolean {
    return this.markedFields.indexOf(fldId) !==-1 ? true : false;
  }
  onWindowScroll() {
    const data = document.getElementById(this.headerArray[this.headerArray.length-1]).offsetTop;
    if((this.headerArray.filter(head => head === this.markedFields[this.index])).length > 0 ) {
      const y = document.getElementById(this.markedFields[this.index]).offsetTop;
      (document.getElementsByTagName('mat-card')[0]).scrollTo(0,y-40);
    } else if((this.hierarchyArray.filter(her => her === this.markedFields[this.index])).length > 0 || (this.gridArray.filter(gr => gr === this.markedFields[this.index])).length > 0) {
      const y =  data + document.getElementById(this.markedFields[this.index]).offsetTop;
      (document.getElementsByTagName('mat-card')[0]).scrollTo(0,y+5);
    }
  }

  public searchKeyDown(ev) {
    if (this.dynamicSearchVal) {
        if (ev.key === 'Enter' || ev.key === 'ArrowDown' || ev.key === 'ArrowRight') {
          ev.preventDefault();
          this.findNext();
        }
        else if (ev.key === 'ArrowUp' || ev.key === 'ArrowLeft') {
          ev.preventDefault();
          this.findPrev();
        }
    }
  }

  public onTextboxChange() {
    this.index = 0;
    this.find(0);
  }

  public findNext() {
    this.find(1);
    if(this.markedFields.length > 0){
      const data = document.getElementById(this.headerArray[this.headerArray.length-1]).offsetTop;
      if((this.headerArray.filter(head => head === this.markedFields[this.index])).length > 0 ) {
        const y = document.getElementById(this.markedFields[this.index]).offsetTop;
        (document.getElementsByTagName('mat-card')[0]).scrollTo(0,y-40);
      } else if((this.hierarchyArray.filter(her => her === this.markedFields[this.index])).length > 0 || (this.gridArray.filter(gr => gr === this.markedFields[this.index])).length > 0) {
        const y =  data + document.getElementById(this.markedFields[this.index]).offsetTop;
        (document.getElementsByTagName('mat-card')[0]).scrollTo(0,y+5);
      }
    }
  }

  public findPrev() {
    this.find(-1);
    if(this.markedFields.length > 0){
      const data = document.getElementById(this.headerArray[this.headerArray.length-1]).offsetTop;
      if((this.headerArray.filter(head => head === this.markedFields[this.index])).length > 0 ) {
        const y = document.getElementById(this.markedFields[this.index]).offsetTop;
        (document.getElementsByTagName('mat-card')[0]).scrollTo(0,y-40);
      } else if((this.hierarchyArray.filter(her => her === this.markedFields[this.index])).length > 0 || (this.gridArray.filter(gr => gr === this.markedFields[this.index])).length > 0) {
        const y =  data + document.getElementById(this.markedFields[this.index]).offsetTop;
        (document.getElementsByTagName('mat-card')[0]).scrollTo(0,y+5);
      }
    }
  }

  public canMoveHighlight() {
    return this.matchCount > 1;
  }

  find(increment: number) {
    if (this.dynamicSearchVal) {
      this.matchCount = this.markedFields.length;
      this.index += increment;
      this.index = this.index < 0 ? this.matchCount - 1 : this.index;
      this.index = this.index > this.matchCount - 1 ? 0 : this.index;
    }
    else {
      this.index = 0;
    }
  }
  // select All
  public selectAll() {
    if(this.allChecked === true){
      this.gridChecked = true;
      this.hierarchyChecked = true;
      this.gridIndeterminate = false;
      this.hierarchyIndeterminate = false;
      const allArray = this.headerArray.concat(this.hierarchyArray).concat(this.gridArray);
      allArray.forEach(fldId => {
        if(this.data.selectedFields.indexOf(fldId) === -1) {
          this.data.selectedFields.push(fldId);
        }
      });
    }
    else {
      this.data.selectedFields = [];
      this.gridChecked = false;
      this.hierarchyChecked = false;
    }
  }
  // hierarchy select all
  public hierarchSelect() {
    if(this.hierarchyChecked === true){
      this.hierarchyArray.forEach(heId => {
        if(this.data.selectedFields.indexOf(heId) === -1) {
          this.data.selectedFields.push(heId);
        }
      })
      this.allIndeterminate = true;
    }
    else {
      this.hierarchyArray.forEach(heId => {
        if(this.data.selectedFields.indexOf(heId) !== -1) {
          this.data.selectedFields.splice(heId,1);
        }
      })
    }
  }
  // grid Select all
  public gridSelect() {
    if(this.gridChecked === true){
      this.gridArray.forEach(grId => {
        if(this.data.selectedFields.indexOf(grId) === -1) {
          this.data.selectedFields.push(grId);
        }
      })
      this.allIndeterminate = true;
    }
    else {
      this.gridArray.forEach(grId => {
        if(this.data.selectedFields.indexOf(grId) !== -1) {
          this.data.selectedFields.splice(grId,1);
        }
      })
    }
  }
 // selecetd Fields
  public mangeChooseColumn(event: any) {

    const res: any = event.option;
    const fldId = res._value.fieldId;
    const index = this.data.selectedFields.indexOf(fldId);
    if(index === -1) {
      this.data.selectedFields.push(fldId);
    }
    else {
      this.data.selectedFields.splice(index,1);
    }
    this.selectCheckbox();
  }
  // check field is selected or not
  isSelected(fldId: string): boolean {
    if(this.data.selectedFields){
      if(this.data.selectedFields.indexOf(fldId) !== -1){
        return true;
      }
      return false;
    }
    else {
      return false;
    }
  }

  submitColumn(){
    if(this.data.selectedFields)
    {
      const headerupdatedArray: Array<string> = new Array();
      const hierarchyupdatedArray: Array<string> = new Array();
      const gridupdatedArray: Array<string> = new Array();
      const restArray: Array<string> = new Array();
      this.data.selectedFields.forEach(res=>{
        let index = this.headerArray.indexOf(res);
        headerupdatedArray[index] = res;

        if(index === -1) {
          index = this.gridArray.indexOf(res);
          hierarchyupdatedArray[index] = res;
        }
        if(index === -1) {
          index = this.hierarchyArray.indexOf(res);
          gridupdatedArray[index] = res;
        }
        if(index === -1) {
          index = this.data.selectedFields.indexOf(res);
          restArray[index] = res;
        }
      });
      this.data.selectedFields = headerupdatedArray.concat(hierarchyupdatedArray).concat(gridupdatedArray).concat(restArray);
    }
    this.router.navigate([{ outlets: { sb: null }}]);
    this.sharedService.setChooseColumnData(this.data);
    this.persistenceTableView();
  }
  close()
  {
    this.router.navigate([{ outlets: { sb: null }}]);
  }

  public persistenceTableView() {
    const schemaTableViewRequest: SchemaTableViewRequest = new SchemaTableViewRequest();
    schemaTableViewRequest.schemaId = this.data.schemaId;
    schemaTableViewRequest.variantId = this.data.variantId;
    const fldObj: SchemaTableViewFldMap[] = [];
    let order = 0;
    this.data.selectedFields.forEach(fld => {
      const schemaTableVMap: SchemaTableViewFldMap = new SchemaTableViewFldMap();
      schemaTableVMap.fieldId = fld;
      schemaTableVMap.order = order;
      order ++;
      fldObj.push(schemaTableVMap);
    });
    schemaTableViewRequest.schemaTableViewMapping = fldObj;
    this.schemaDetailsService.updateSchemaTableView(schemaTableViewRequest).subscribe(response => {

    }, error => {
      console.error('Exception while persist table view');
    });
  }

}

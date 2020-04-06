import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { MetadataModel, MetadataModeleResponse } from 'src/app/_models/schema/schemadetailstable';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { SharedServiceService } from '../../_services/shared-service.service';

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
  schemaId: string;
  data = null;
  masterChecked = false;
  masterIndeterminate = false;
  hierarchyChecked = false;
  hierarchyIndeterminate = false;

  constructor(
    private sharedService: SharedServiceService,
    private router: Router
  ){}

  ngOnInit() {
    this.sharedService.getChooseColumnData().subscribe(data=>{
      this.data  = data;
      this.headerDetails();
      this.hierarchyDetails();
      this.gridDetails();
      this.search();
    });
  }

  // header
  public headerDetails() {
    for(const fldid in this.data.fields.headers) {
      if(this.data.fields.headers.hasOwnProperty(fldid)) {
        this.header.push(this.data.fields.headers[fldid]);
      }
    }
    this.headerFieldObs = of(this.header);

  }
    // hierarchy
  public hierarchyDetails() {
    if(this.data.selectedHierarchyIds && this.data.selectedHierarchyIds.length>0) {
      for(const hefldId of this.data.selectedHierarchyIds) {
        if(this.data.fields.hierarchyFields[hefldId]) {
          for( const heKey in this.data.fields.hierarchyFields[hefldId]) {
            if(this.data.fields.hierarchyFields[hefldId].hasOwnProperty(heKey)) {
              this.hierarchy.push(this.data.fields.hierarchyFields[hefldId][heKey])
            }
          }
          const hedesc = this.data.fields.hierarchy.filter(hedId =>
            hedId.heirarchyId === hefldId
          )[0];
          this.heText[hefldId] = hedesc.heirarchyText
        }
        this.hierarchyList[hefldId] = this.hierarchy;
      }
    }
  }
    // grid
  public gridDetails() {
    if(this.data.selectedGridIds && this.data.selectedGridIds.length>0) {
      for(const grfldId of this.data.selectedGridIds) {
        if(this.data.fields.gridFields[grfldId]) {
          for( const grKey in this.data.fields.gridFields[grfldId]) {
            if(this.data.fields.gridFields[grfldId].hasOwnProperty(grKey)) {
              this.grid.push(this.data.fields.gridFields[grfldId][grKey])
            }
          }
          this.val = this.data.fields.grids[grfldId];
        }
        this.gridList[grfldId] = this.grid;
      }
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
              if(heDesc.toLowerCase().indexOf(data.toLowerCase()) !==-1){
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
              if(grDesc.toLowerCase().indexOf(data.toLowerCase()) !==-1){
                if(this.markedFields.indexOf(grKey) === -1)
                  this.markedFields.push(grKey);
                  this.onWindowScroll();
              }
            });
          }
        });
        this.gridList = this.gridList;

      } else {
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
    const y = document.getElementById(this.markedFields[0]).offsetTop;
    (document.getElementsByTagName('mat-selection-list')[0]).scrollTo(0,y-150);
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
      const y = document.getElementById(this.markedFields[this.index]).offsetTop;
      (document.getElementsByTagName('mat-selection-list')[0]).scrollTo(0,y-150);
    }
  }

  public findPrev() {
    this.find(-1);
    if(this.markedFields.length > 0){
      const y = document.getElementById(this.markedFields[this.index]).offsetTop;
      (document.getElementsByTagName('mat-selection-list')[0]).scrollTo(0,y-150);
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
  // select ALL
  public selectAll(){
    if(this.masterChecked === true){
      const headerArray = this.header.map(he=> he.fieldId);
      const gridArray =this.grid.map(gr=> gr.fieldId);
      const hierarchyArray =this.hierarchy.map(hr=> hr.fieldId);
      const masterArray = headerArray.concat(hierarchyArray).concat(gridArray);
      masterArray.forEach(fldId=>{
        const index = this.data.selectedFields.indexOf(fldId);
        if(index === -1) {
          this.data.selectedFields.push(fldId);
        }
      });
    }
    else {
      this.data.selectedFields = [];
    }
  }
 // selecetd Fields
  public mangeChooseColumn(event: any) {
    let checkedCount = 0;
    const res: any = event.option;
    const fldId = res._value.fieldId;
    const index = this.data.selectedFields.indexOf(fldId);
    if(index === -1) {
      this.data.selectedFields.push(fldId);
    }
    else {
      this.data.selectedFields.splice(index,1);
    }
    const headerArray = this.header.map(he=> he.fieldId);
    const gridArray =this.grid.map(gr=> gr.fieldId);
    const hierarchyArray =this.hierarchy.map(hr=> hr.fieldId);
    const masterArray = headerArray.concat(hierarchyArray).concat(gridArray);
    this.data.selectedFields.forEach( field => {
      if(field)
        checkedCount++;
      });
    if(checkedCount > 0 && checkedCount < masterArray.length ){
      this.masterIndeterminate = true;
    }else if(checkedCount === masterArray.length){
      this.masterIndeterminate = false;
      this.masterChecked = true;
    }else{
      this.masterIndeterminate = false;
      this.masterChecked = false;
    }

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
    // if(this.data.selectedFields)
    // {
    //   const updatedArray: Array<string> = new Array(this.data.selectedFields.length);
    //   this.data.selectedFields.forEach(res=>{
    //     const headerMap = this.header.map(map => map.fieldId);
    //     let index = headerMap.indexOf(res);
    //     if(index === -1) {
    //       const gridMap = this.grid.map(map => map.fieldId);
    //       index = gridMap.indexOf(res);
    //     }
    //     if(index === -1) {
    //       const heiMap = this.hierarchy.map(map => map.fieldId);
    //       index = heiMap.indexOf(res);
    //     }
    //     if(this.data.selectedFields.length <= index){
    //       updatedArray[index] = res;
    //     }
    //   });
    //   this.data.selectedFields = updatedArray;

    // }
    this.sharedService.setChooseColumnData(this.data);
    this.router.navigate([{ outlets: { sb: null }}]);
  }
  close()
  {
    this.router.navigate([{ outlets: { sb: null }}]);
  }
}

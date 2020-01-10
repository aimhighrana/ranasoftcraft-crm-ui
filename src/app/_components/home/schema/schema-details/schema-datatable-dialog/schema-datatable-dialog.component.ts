import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ResponseFieldList } from 'src/app/_models/schema/schemadetailstable';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
export interface SchemaChooseColumnDialogData {
  selectedFldIds: any;
  fieldLists: ResponseFieldList[];
  schemaId: string;
  objectId: string;
}
@Component({
  selector: 'pros-schema-datatable-dialog',
  templateUrl: './schema-datatable-dialog.component.html',
  styleUrls: ['./schema-datatable-dialog.component.scss']
})
export class SchemaDatatableDialogComponent implements OnInit {
  selectedFields: ResponseFieldList[] = [];
  searchSelectedFields: Observable<ResponseFieldList[]>;
  unSelectedFields: ResponseFieldList[] = [];
  unSearchSelectedFields: Observable<ResponseFieldList[]>;
  allFieldList: ResponseFieldList[] = [];
  selectedFieldFrmCtrl: FormControl;
  constructor(public dialogRef: MatDialogRef<SchemaDatatableDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public dialogData: SchemaChooseColumnDialogData
    ) {  }

  ngOnInit() {
    this.selectedFieldFrmCtrl = new FormControl('');
    this.onloadSetSelectedField();
    this.getAllUnSelectedFields(this.selectedFields, this.allFieldList);
    this.searchSelectedFields = this.selectedFieldFrmCtrl.valueChanges.pipe(startWith(''), map(value => this._filter(value)));
  }
  private _filter(value: string): ResponseFieldList[] {
    const filterValue = value.toLowerCase();
    return this.selectedFields.filter(option => option.label.toLowerCase().includes(filterValue));
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }
  private onloadSetSelectedField() {
    /* this.dialogData.fieldLists.forEach(fldLstData => {
      this.dialogData.selectedFldIds.forEach(selFldData => {
        if (fldLstData.index === selFldData) {
          const responseFieldList: ResponseFieldList = new ResponseFieldList();
          responseFieldList.dataType = fldLstData.dataType;
          responseFieldList.index = selFldData;
          responseFieldList.hidden = fldLstData.hidden;
          responseFieldList.label = fldLstData.label;
          responseFieldList.picklist = fldLstData.picklist;
          responseFieldList.width = fldLstData.width;
          responseFieldList.editable = fldLstData.editable;
          responseFieldList.name = fldLstData.name;
          this.selectedFields.push(responseFieldList);
        }
      });
      this.allFieldList.push(fldLstData);
    }); */
  }
  private getAllUnSelectedFields(selectedFields: ResponseFieldList[], allFields: ResponseFieldList[]) {
    const unselectedArray: ResponseFieldList[] = [];
    allFields.forEach(fldData => {
      let isAllow = true;
      selectedFields.forEach(selData => {
        if (fldData.index === selData.index) {
          isAllow = false;
        }
      });
      if (isAllow) {
        unselectedArray.push(fldData);
      }
    });
    this.unSelectedFields = unselectedArray;
  }

  public removeFromSelected(event, selData: ResponseFieldList) {
    if (selData !== undefined && selData.index !== undefined) {
      const index = this.selectedFields.indexOf(selData);
      this.selectedFields.splice(index, 1);
      this.unSelectedFields.splice(0, 0, selData);
    }
  }

  public addToSelected(event, data: ResponseFieldList) {
    if (data !== undefined && data.index !== undefined) {
      console.table(data);
      this.selectedFields.push(data);
      const index = this.unSelectedFields.indexOf(data);
      this.unSelectedFields.splice(index, 1);
    }
  }

  public showSelectedFields(event) {
    this.dialogRef.close({data: this.selectedFields});
  }
}

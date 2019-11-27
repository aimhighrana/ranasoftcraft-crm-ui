import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { SchemalistService } from 'src/app/_services/home/schema/schemalist.service';
import { FilterFieldModel } from 'src/app/_models/schema/schemalist';

export interface DialogData{
  moduleId:string;
  schemaId:string;
  schemaName:string;
}

@Component({
  selector: 'pros-schema-dialog',
  templateUrl: './schema-dialog.component.html',
  styleUrls: ['./schema-dialog.component.scss']
})
export class SchemaDialogComponent implements OnInit {
  dialogFieldFormControl  = new FormControl();
  dialogValueFormControl = new FormControl();
  //fieldOptions:string[] = ['Mat 01','Mat 02','Mat 03'];
  fieldOptions:FilterFieldModel[];
  filterFieldOptions:string[]=[];
  filterFieldList:Observable<string[]>;
  constructor(
    public dialogRef: MatDialogRef<SchemaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData:DialogData,
    private _schemaListService:SchemalistService
     ) {}

  fieldContainer=[0];   
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.getFilterFields();
    this.filterFieldList = this.dialogFieldFormControl.valueChanges.pipe(startWith(''),map(value=>this._filter(value)));
  }

  private _filter(value:string):string[]{
    const filterValue = value.toLowerCase();
    return this.filterFieldOptions.filter(option=>option.toLowerCase().includes(filterValue));
  }
  addMoreField(){
    this.fieldContainer.push(this.fieldContainer.length);
  }
  removeField(removeField:any){
    let index = this.fieldContainer.indexOf(removeField);
    if(index!=undefined && index!=-1){
      this.fieldContainer.splice(index,1);
    }    
  }

  getFilterFields(){
    if(this.dialogData.moduleId==undefined || this.dialogData.schemaId==undefined){
      return false;
    }
    let fields:FilterFieldModel[] =  this._schemaListService.getAllFieldData(this.dialogData.moduleId+'_'+this.dialogData.schemaId);
    if(fields!=undefined || fields!=null){
       this.fieldOptions = fields;
       fields.forEach(element => {
         this.filterFieldOptions.push(element.fieldDesc);
       });
    }

  }



}

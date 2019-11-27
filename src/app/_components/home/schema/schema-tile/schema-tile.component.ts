import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SchemaDialogComponent } from '../schema-dialog/schema-dialog.component';

@Component({
  selector: 'pros-schema-tile',
  templateUrl: './schema-tile.component.html',
  styleUrls: ['./schema-tile.component.scss']
})
export class SchemaTileComponent implements OnInit {

  @Input()
  icon: string;
  @Input()
  title: string;
  @Input()
  color: string;   
  @Input()
  help: string;
  @Input()
  info: string;   
  @Input()
  link: string;
  @Input()
  iconColor: string;   
  @Input()
  totalValue:string;
  @Input()
  enableProgressBar:boolean;
  @Input()
  successValue:number;
  @Input()
  errorValue:number;
  @Input()
  thisWeekProgress:string;  
  @Input()
  isSchemaList:string;
  @Input()
  moduleId:string;
  @Input()
  schemaId:string;
  @Input()
  variantCount:string;
  

  linker() {     
      return this.link;     
  }
  constructor(private _dialog:MatDialog) { }

  ngOnInit() {
  }

  openDialog(): void {
    const dialogRef = this._dialog.open(SchemaDialogComponent, {
      width: '600px',
      data:{"moduleId":this.moduleId,"schemaId":this.schemaId,"schemaName":this.title}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

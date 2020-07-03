import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DiwCreateBusinessruleComponent } from '../diw-create-businessrule/diw-create-businessrule.component';

@Component({
  selector: 'pros-diw-create-schema',
  templateUrl: './diw-create-schema.component.html',
  styleUrls: ['./diw-create-schema.component.scss']
})
export class DiwCreateSchemaComponent implements OnInit {

  constructor(private  matDialog: MatDialog) { }

  ngOnInit(): void {
  }

  createbusinessrule() {
    const dialogRef = this.matDialog.open(DiwCreateBusinessruleComponent, {
      height: '706px',
      width: '1100px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}

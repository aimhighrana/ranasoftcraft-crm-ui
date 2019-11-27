import { Component, OnInit, ViewChild } from '@angular/core';
import { Schemadetailstable, SchemaDataSource } from 'src/app/_models/schema/schemadetailstable';
import { MatTableDataSource, MatPaginator, MatSort, MatTabChangeEvent, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import { SchemaDatatableDialogComponent } from '../schema-datatable-dialog/schema-datatable-dialog.component';

@Component({
  selector: 'pros-schema-datatable',
  templateUrl: './schema-datatable.component.html',
  styleUrls: ['./schema-datatable.component.scss']
})
export class SchemaDatatableComponent implements OnInit {


  tabs = ['All', 'Error', 'Success', 'Skipped', 'Draft', 'Outdated', 'Duplicate'];
  schemaDetailsTable: Schemadetailstable;
  dataSource: MatTableDataSource<SchemaDataSource>;
  displayedColumns: string[];
  selection = new SelectionModel<SchemaDataSource>(true, []);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  schemaStatusRecordCount: any = {};
  /*for checkbox column */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }
  checkboxLabel(row?: SchemaDataSource): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.materialNumber + 1}`;
  }

  constructor(private schemaDetailsService: SchemaDetailsService, private dialog: MatDialog) { }

  ngOnInit() {
    this.loadSchemaDetailsTable();
    this.getSchemaStatusCount();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  loadSchemaDetailsTable() {
    this.schemaDetailsTable =  this.schemaDetailsService.getSchemaDetailsTableData();
    const  datas: SchemaDataSource[]  = this.schemaDetailsTable.dataSource;
    this.dataSource = new MatTableDataSource<SchemaDataSource>(datas);
    this.displayedColumns = this.schemaDetailsTable.displayedColumns;
  }
  loadSchemaErrorDetailsTable() {
    this.schemaDetailsTable =  this.schemaDetailsService.getSchemaAllErrorData();
    const  datas: SchemaDataSource[]  = this.schemaDetailsTable.dataSource;
    this.dataSource = new MatTableDataSource<SchemaDataSource>(datas);
    this.displayedColumns = this.schemaDetailsTable.displayedColumns;
  }

  manageStatusCount(index: number): boolean {
    if (index < 2) {
      return false;
    } else {
      return true;
    }
  }

  getSchemaStatusCount() {
    const data = this.schemaDetailsService.getSchemaStatusCount();
    if (data !== undefined && data !== '') {
      this.schemaStatusRecordCount = data.status_count;
    }
  }

  loadSchameDataByStatus(index: number) {
    if (index != null) {
      if (this.tabs[index] === 'All') {
        this.loadSchemaDetailsTable();
      } else if (this.tabs[index] === 'Error') {
        this.loadSchemaErrorDetailsTable();
      }
    }
  }

  openChooseColumnDialog() {
    const dialogRef = this.dialog.open(SchemaDatatableDialogComponent, {
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  manageChips(index: number) {
     return (index === undefined || index < 2) ? true : false;
  }
  getHideStatusCount(status: any) {
    return '+' + (status.length - 2);
  }
}

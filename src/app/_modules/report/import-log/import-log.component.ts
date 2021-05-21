import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

interface ImportLogs {
  warning: string;
  category: string;
  status: string;
  updated: string;
}


@Component({
  selector: 'pros-import-log',
  templateUrl: './import-log.component.html',
  styleUrls: ['./import-log.component.scss']
})
export class ImportLogComponent implements OnInit {
  displayedColumns: string[] = ['warning', 'category', 'status', 'updated'];

  /**
   * warning status
   */
  status: string[] = ['Open', 'Closed'];
  warningForm: FormGroup;

  dataSource: ImportLogs[] = [
    { warning: 'Customer Module', category: 'Missing Module', status: 'Open', updated: '12/12/20' },
    { warning: 'BOM', category: 'Missing Module', status: 'Open', updated: '12/12/20' }
  ];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder
  ) { }


  ngOnInit(): void {
    this.initializeForm();
    this.getWarningList();
  }

  initializeForm() {
    this.warningForm = this.formBuilder.group({
      statusArray: this.formBuilder.array([])
    })
  }

  /**
   * While click on close should be set sb outlet to null
   */
  close() {
    this.router.navigate([{ outlets: { sb: null } }]);
  }


  /**
   * change the warning status
   * @param index index of the row in table
   */
  changeStatus(index, value) {
    console.log(index, value);
    this.dataSource[index].status = value;
  }


  /**
   * get warning list data
   * @param isLoadMore wants to load more data
   */
  getWarningList(isLoadMore?) {
    // if(isLoadMore) {
    const formArray = this.frmArray;
    this.dataSource.forEach(item => {
      formArray.push(this.formBuilder.group({
        status: item.status
      }))
    })
    // }
  }

  get frmArray() {
    return this.warningForm.get('statusArray') as FormArray;
  }

}

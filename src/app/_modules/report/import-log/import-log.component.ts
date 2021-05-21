import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface ImportLogs {
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
   * for the status of warning
   */
  status: string[] = ['Open','Closed'];

  dataSource : ImportLogs[] =  [
    {warning: 'Customer Module', category: 'Missing Module', status: 'Open', updated: '12/12/20'},
    {warning: 'BOM', category: 'Missing Module', status: 'Open', updated: '12/12/20'}
  ];

  constructor(
    private router: Router,
  ) { }


  ngOnInit(): void {
    this.getWarningList();
  }

  /**
   * While click on close should be set sb outlet to null
   */
  close() {
    this.router.navigate([{ outlets: { sb: null } }]);
  }


  /**
   * change the status of the warning
   * @param index index of the row in table
   */
 changeStatus(index){
   console.log(index, this.dataSource[index].status);
  }


/**
 * get warning list data
 * @param isLoadMore wants to load more data
 */
  getWarningList(isLoadMore?) {
    // if(isLoadMore) {
      console.log('data source====',this.dataSource);
    // }
  }
}

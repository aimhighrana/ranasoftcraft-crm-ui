import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MetadataModel } from '@models/schema/schemadetailstable';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { Observable, of, Subscription } from 'rxjs';

@Component({
  selector: 'pros-report-datatable-column-settings',
  templateUrl: './report-datatable-column-settings.component.html',
  styleUrls: ['./report-datatable-column-settings.component.scss']
})


export class ReportDatatableColumnSettingsComponent implements OnInit, OnDestroy {
  /**
   * object number/module id of the report
   */
  objectNumber: string;

  /**
   * Array of the headers meta data
   */
  headers: MetadataModel[] = [];

  /**
   * to store the complete data from shared service
   */
  data = null;

  /**
   * array to store only field Ids of headers
   */
  fieldIdArray = [];

  /**
   * to store search result of headers while searching from search bar
   */
  suggestedHeaders = [];

  /**
   * to store is all checkbox are selected or not
   */
  allCheckboxSelected = false;

  /**
   * to store indeterminate state
   */
  allIndeterminate = false;


  headersObs: Observable<MetadataModel[]> = of([]);

  /**
   * All the http or normal subscription will store in this array
   */
  subscriptions: Subscription[] = [];

  /**
   * Constructor of class
   */
  constructor(private router: Router,
    private acticatedRoute: ActivatedRoute,
    private schemaDetailsService: SchemaDetailsService,
    private sharedService: SharedServiceService) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  /**
   * ANGULAR HOOK
   */
  ngOnInit(): void {
    const reportDataTable = this.sharedService.getReportDataTableSetting().subscribe(data => {
        if(data.isRefresh === false){
          this.data = data;

        this.objectNumber = data.objectType;
        if (data.isWorkflowdataSet === null || data.isWorkflowdataSet === false) {
          this.getAllMetaDataFields(this.objectNumber);
        }
        if (data.isWorkflowdataSet === true) {
          if (data.objectType.includes(',')) {
            const objectType = data.objectType.split(',');
            this.getWorkFlowFields(objectType);
          } else {
            this.getWorkFlowFields(Array(this.objectNumber))
          }
        }
        this.manageStateOfCheckbox()
        }
    });
    this.subscriptions.push(reportDataTable);
  }

  /**
   * function to close side sheet
   */
  close() {
    this.router.navigate(['', { outlets: { sb: null } }])
  }

  /**
   * function to get all metaData
   * @param objectNumber object number of widget
   */
  getAllMetaDataFields(objectNumber: string) {
    const metadataFields = this.schemaDetailsService.getMetadataFields(objectNumber).subscribe(data => {
      if (this.data && this.data.selectedColumns && this.data.selectedColumns.length > 0) {
        this.data.selectedColumns.forEach(selectedColumn => {
          this.headers.push(selectedColumn);
        })
      }
      /**
       * building array of fieldIds of headers
       * why...because with this we can restrict duplicate entries
       */
      this.fieldIdArray = this.headers.map(header => header.fieldId);
      for (const metaData in data.headers) {
        if (data.headers[metaData]) {
          if (this.fieldIdArray.indexOf(data.headers[metaData].fieldId) === -1) {
            this.headers.push(data.headers[metaData])
          }

        }

      }
      const inarray = this.fieldIdArray.find(dt => dt === 'objectNumber')
      if (inarray === undefined) {
        const objectnumber: any = { fieldId: 'objectNumber', fieldDescri: 'Object Number' };
        this.headers.unshift(objectnumber)
      }

      this.headersObs = of(this.headers);
    }, error => {
      console.error('Error occur while getting meta data fields', error.message)
    });
    this.subscriptions.push(metadataFields);
  }

  /**
   * function to get workflow Fields of widget
   * @param objectNumber object number of widget
   */
  getWorkFlowFields(objectNumber: string[]) {
    const workflowFields = this.schemaDetailsService.getWorkflowFields(objectNumber).subscribe(data => {
      if (this.data && this.data.selectedColumns && this.data.selectedColumns.length > 0) {
        this.data.selectedColumns.forEach(selectedColumn => {
          this.headers.push(selectedColumn);
        })
      }
      /**
       * building array of fieldIds of headers
       * why...because with this we can restrict duplicate entries
       */
      this.fieldIdArray = this.headers.map(header => header.fieldId);
      const staticHeaders = data.static;
      /**
       * check and push static headers
       */
      staticHeaders.forEach((staticHeader) => {
        const index = this.fieldIdArray.indexOf(staticHeader.fieldId);
        if (index === -1) {
          this.headers.push(staticHeader);
        }
        if(index !== -1) {
          this.headers[index] = staticHeader;
        }
      })
      const dynamicHeaders = data.dynamic;
      /**
       * check existance and push dynamic headers
       */
      dynamicHeaders.forEach((dynamicHeader) => {
        if (this.fieldIdArray.indexOf(dynamicHeader.fieldId) === -1) {
          this.headers.push(dynamicHeader)
        }
      });

      this.headersObs = of(this.headers);
    }, error => {
      console.error('Error while getting report workflow fields', error.message);
    });
    this.subscriptions.push(workflowFields);
  }

  /**
   * While drag and drop on list elements
   * @param event dragable element
   */
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  /**
   * function to trigger on check/uncheck checkbox
   */
  selectionChange(checkbox: MetadataModel) {
    let flag = false;
    this.data.selectedColumns.forEach((selectedColumn, index) => {
      if (selectedColumn.fieldId === checkbox.fieldId) {
        this.data.selectedColumns.splice(index, 1);
        flag = true;
        // return flag;
      }
    })
    if (flag === false) {
      this.data.selectedColumns.push(checkbox);
    }
    this.manageStateOfCheckbox()
  }

  /**
   * function to manage the state of checkbox
   */
  manageStateOfCheckbox() {
    if(this.headers.length === this.data.selectedColumns.length){
      this.allCheckboxSelected = true;
      this.allIndeterminate = false;
    }
    if((this.headers.length !== this.data.selectedColumns.length) && this.data.selectedColumns.length !== 0){
      this.allIndeterminate = true;
      this.allCheckboxSelected = false;
    }
  }

  /**
   * function to check that it will be checked or not
   */
  isChecked(header: MetadataModel) {
    const fieldIdArray = [];
    this.data.selectedColumns.forEach(column => {
      fieldIdArray.push(column.fieldId);
    })
    const index = fieldIdArray.indexOf(header.fieldId);
    return index !== -1 ? true : false
  }

  /**
   * function to select all or unselect all checkbox.
   */
  selectAllCheckboxes(){
    if(this.allCheckboxSelected){
      this.allIndeterminate = false;
      this.data.selectedColumns = [];
      this.data.selectedColumns = this.headers;
    }else{
      this.allIndeterminate = false;
      this.data.selectedColumns = [];
    }
  }


  /**
   * function to search headers from search bar
   * @param value string to be searched
   */
  searchHeader(value: string) {
    if(value && value.trim() !== '') {
      const headers = this.headers.filter(header => header.fieldDescri.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1);
      this.headersObs = of(headers);
    } else {
      this.headersObs = of(this.headers);
    }
  }

  /**
   * function to submit column setting
   */
  submitSetting() {
    const fieldId = []
    this.data.selectedColumns.forEach((column) => {
      fieldId.push(column.fieldId);
    })
    const inOrderHeader: MetadataModel[] = [];
    this.headers.forEach((header) => {
      if (fieldId.indexOf(header.fieldId) !== -1) {
        inOrderHeader.push(header);
      }
    })
    this.updateTableView(inOrderHeader);
  }

  /**
   * function to update table view
   */
  updateTableView(headerInOrder: MetadataModel[]){
    const prepareData = [];
    let order = 0;
    headerInOrder.forEach(header => {
      const obj = {
        widgetId : this.data.widgetId,
        fields: header.fieldId,
        fieldOrder: order++
      }
      prepareData.push(obj);
    })
    const reportDataTable = this.schemaDetailsService.createUpdateReportDataTable(this.data.widgetId, prepareData).subscribe(response => {
      this.close();
      this.data.isRefresh = true;
      this.sharedService.setReportDataTableSetting(this.data);
    }, error => {
      console.error('Error while updating report data table column settings', error.message)
    });
    this.subscriptions.push(reportDataTable);
  }
}

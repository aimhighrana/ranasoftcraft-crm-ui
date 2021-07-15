import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GridFields, Heirarchy, MetadataModel } from '@models/schema/schemadetailstable';
import { DisplayCriteria } from '@modules/report/_models/widget';
import { ReportService } from '@modules/report/_service/report.service';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { Observable, of, Subscription } from 'rxjs';
import { isEqual } from 'lodash';

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
  allDisplayCriteria: DisplayCriteria;

  /** system fields for Transactional module dataset */
  systemFields = [
    {
      fieldId: 'STATUS',
      fieldDescri: 'Status',
    } as MetadataModel,
    {
      fieldId: 'USERMODIFIED',
      fieldDescri: 'User Modified',
      picklist: '37',
      dataType: 'AJAX',
    } as MetadataModel, {
      fieldId: 'APPDATE',
      fieldDescri: 'Update Date',
      picklist: '0',
      dataType: 'DTMS',
    } as MetadataModel, {
      fieldId: 'STAGE',
      fieldDescri: 'Creation Date',
      picklist: '0',
      dataType: 'DTMS',
    } as MetadataModel
  ];
  userConfigured: boolean = undefined;
  showConfiguredBanner: boolean;
  tempHeaders: MetadataModel[] = [];

  /**
   * array that stores the data of grid and hierarchy data
   */
  nestedDataSource: any[] = [];

  /**
   * array that stored the gridfields values
   */
  gvsFields: GridFields[] = [];

  /**
   * array to store the data of grid and heirarchy data
   */
  dataSource: any;

  /**
   * array to store all child nodes for hierarchy
   */
  hvyFields: MetadataModel[] = [];


  /**
   * Constructor of class
   */
  constructor(private router: Router,
    private schemaDetailsService: SchemaDetailsService,
    private sharedService: SharedServiceService,
    private reportService: ReportService,
  ) { }

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
      if (data?.isRefresh === false) {
        this.data = data;

        this.setOriginalConfigured();

        this.objectNumber = data.objectType;
        if ((data.isWorkflowdataSet === null || data.isWorkflowdataSet === false) && (data.isCustomdataSet === null || data.isCustomdataSet === false)) {
          this.getAllMetaDataFields(this.objectNumber);
        }
        if (data.isWorkflowdataSet === true && (data.isCustomdataSet === null || data.isCustomdataSet === false)) {
          if (data.objectType.includes(',')) {
            const objectType = data.objectType.split(',');
            this.getWorkFlowFields(objectType);
          } else {
            this.getWorkFlowFields(Array(this.objectNumber))
          }
        }
        if (data.isCustomdataSet === true && (data.isWorkflowdataSet === null || data.isWorkflowdataSet === false)) {
          this.getCustomFields(this.objectNumber);
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
          const index = Object.keys(data.headers).indexOf(selectedColumn.fieldId);
          if (index > -1) {
            this.headers.push(selectedColumn);
          } else {
            const ind = this.systemFields.findIndex(fields => fields.fieldId === selectedColumn.fieldId)
            if (ind > -1) {
              this.headers.push(selectedColumn);
            }
          }
        });
      }
      /**
       * building array of fieldIds of headers
       * why...because with this we can restrict duplicate entries
       */
      this.fieldIdArray = this.headers.map(header => header.fieldId);

      this.systemFields.forEach(system => {
        const index = this.fieldIdArray.indexOf(system.fieldId);
        if (index === -1) {
          this.headers.push(system);
        }
      })

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

      const gvs = [];
      Object.keys(data.grids).sort().forEach(item => {
        if (item) {
          const gridNode: any = {};
          gridNode.nodeDesc = data.grids[item].fieldDescri;
          gridNode.nodeId = item;
          const childNodeData = [];
          if (data.gridFields.hasOwnProperty(item)) {
            this.data.selectedColumns.forEach(column => {
              const selectedColumn = Object.keys(data.gridFields[item]).find(key => key === column.fieldId);
              if (selectedColumn) {
                const childNode = data.gridFields[item][selectedColumn];
                childNode.displayCriteria = column.displayCriteria;
                childNode.nodeDesc = data.gridFields[item][selectedColumn].fieldDescri;
                childNodeData.push(childNode);
              }
            })
            Object.keys(data.gridFields[item]).forEach(gridData => {
              const index = this.data.selectedColumns.findIndex(selectedColumn => selectedColumn.fieldId === gridData);
              if (index === -1) {
                const childNode = data.gridFields[item][gridData];
                const ind = this.data.selectedColumns.findIndex(column => column.fieldId === gridData);
                childNode.displayCriteria = index > -1 ? this.data.selectedColumns[ind].displayCriteria : null;
                childNode.nodeDesc = data.gridFields[item][gridData].fieldDescri;
                childNodeData.push(childNode)
              }
            });
            gridNode.child = [...childNodeData]
            this.gvsFields.push(...gridNode.child);
          }
          else {
            gridNode.child = null;
          }
          gvs.push(gridNode);
        }
      })

      const hvysData: Heirarchy[] = [];
      this.hvyFields = [];
      const hierarchyData: any = {};
      data.hierarchy.forEach((hierarchy: Heirarchy) => {
        hierarchyData.nodeDesc = hierarchy.heirarchyText;
        hierarchyData.nodeId = hierarchy.fieldId;
        const childNodeData = [];
        this.data.selectedColumns.forEach(column => {
          const selectedColumn = Object.keys(data.hierarchyFields[hierarchy.heirarchyId]).find(key => key === column.fieldId);
          if (selectedColumn) {
            const childNode = data.hierarchyFields[hierarchy.heirarchyId][selectedColumn];
            childNode.displayCriteria = column.displayCriteria;
            childNode.nodeDesc = data.hierarchyFields[hierarchy.heirarchyId][selectedColumn].fieldDescri;
            childNodeData.push(childNode);
          }
        })

        Object.keys(data.hierarchyFields[hierarchy.heirarchyId]).forEach((hierarchydata: string) => {
          const index = this.data.selectedColumns.findIndex(selectedColumn => data.hierarchyFields[hierarchy.heirarchyId][hierarchydata].fieldId === selectedColumn.fieldId);
          if (index === -1) {
            const childNode = data.hierarchyFields[hierarchy.heirarchyId][hierarchydata];
            childNode.nodeId = hierarchy.fieldId;
            childNode.displayCriteria = null;
            childNode.nodeDesc = data.hierarchyFields[hierarchy.heirarchyId][hierarchydata].fieldDescri;
            childNodeData.push(childNode);
          }
        });

        hierarchyData.child = childNodeData;
        hvysData.push({ ...hierarchyData });
        this.hvyFields.push(...childNodeData);
      })
      this.nestedDataSource = [...gvs, ...hvysData];
      this.dataSource = [...this.nestedDataSource];
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
        if (index !== -1) {
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
   * function to to copy tempHeaders and set all displayCriteria to default displayCriteria
   */
  setOriginalConfigured() {
    if (this.data && this.data.selectedColumns && this.data.selectedColumns.length > 0) {
      this.tempHeaders = JSON.parse(JSON.stringify(this.data.selectedColumns));
      this.tempHeaders.forEach(h => h.displayCriteria = this.data.displayCriteria);
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
      if (!checkbox.displayCriteria) {
        checkbox.displayCriteria = this.allDisplayCriteria ? this.allDisplayCriteria : this.data.displayCriteria;
      }
      this.data.selectedColumns.push(checkbox);
    }
    this.manageStateOfCheckbox();
    this.setOriginalConfigured();
  }

  /**
   * function to manage the state of checkbox
   */
  manageStateOfCheckbox() {
    if (this.headers.length + this.gvsFields.length + this.hvyFields.length  === this.data.selectedColumns.length) {
      this.allCheckboxSelected = true;
      this.allIndeterminate = false;
    }
    if ((this.headers.length + this.gvsFields.length + this.hvyFields.length !== this.data.selectedColumns.length) && this.data.selectedColumns.length !== 0) {
      this.allIndeterminate = true;
      this.allCheckboxSelected = false;
    }
    this.manageAllDisplayCriteria();
  }

  /**
   * function to manage all DisplayCriteria are the same
   */
  manageAllDisplayCriteria() {
    const columns: MetadataModel[] = this.data.selectedColumns;
    const text = !columns.some(s => s.displayCriteria && s.displayCriteria !== DisplayCriteria.TEXT);
    if (text) {
      this.allDisplayCriteria = DisplayCriteria.TEXT;
      return;
    }

    const code = !columns.some(s => s.displayCriteria && s.displayCriteria !== DisplayCriteria.CODE);
    if (code) {
      this.allDisplayCriteria = DisplayCriteria.CODE;
      return;
    }

    const codeText = !columns.some(s => s.displayCriteria && s.displayCriteria !== DisplayCriteria.CODE_TEXT);
    if (codeText) {
      this.allDisplayCriteria = DisplayCriteria.CODE_TEXT;
      return;
    }
    this.allDisplayCriteria = null;
  }

  /**
   * function to show or not show the Configured Banner
   */
  manageConfigure() {
    if (this.userConfigured === undefined) {
      if (isEqual(this.data.selectedColumns, this.tempHeaders)) {
        this.showConfiguredBanner = false;
      } else {
        this.showConfiguredBanner = true;
      }
    }
  }

  /**
   * function to change all selected column to a DisplayCriteria
   */
  changeAllDisplayCriteria() {
    const selectDisplayCriteria = (row: MetadataModel) => {
      if (row.picklist === '1' || row.picklist === '30' || row.picklist === '37') {
        row.displayCriteria = this.allDisplayCriteria;
      }
    }
    this.headers.forEach(row => selectDisplayCriteria(row));
    this.data.selectedColumns.forEach(row => selectDisplayCriteria(row));
    this.manageConfigure();
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
  selectAllCheckboxes() {
    if (!this.allCheckboxSelected) {
      this.allIndeterminate = false;
      this.data.selectedColumns = [];
      this.data.selectedColumns = [...JSON.parse(JSON.stringify(this.headers)), ...JSON.parse(JSON.stringify(this.gvsFields)), ...JSON.parse(JSON.stringify(this.hvyFields))];
      this.allCheckboxSelected = true;
    } else {
      this.allIndeterminate = false;
      this.data.selectedColumns = [];
      this.allCheckboxSelected = false;
    }
  }


  /**
   * function to search headers from search bar
   * @param value string to be searched
   */
  searchHeader(value: string) {
    const listData = JSON.parse(JSON.stringify(this.dataSource));
    this.nestedDataSource = [];
    if (value && value.trim() !== '') {
      const headers = this.headers.filter(header => header.fieldDescri.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1);
      this.headersObs = of(headers);
      this.nestedDataSource = value ? this.filtered(listData,value) : listData;
    } else {
      this.nestedDataSource = this.dataSource;
      this.headersObs = of(this.headers);
    }
  }

  filtered(array, text) {
    const getChildren = (result, object) => {
      const re = new RegExp(text, 'gi');
      if (object.nodeDesc.match(re)) {
        result.push(object);
        return result;
      }
      if (Array.isArray(object.child)) {
        const children = object.child.reduce(getChildren, []);
        if (children.length) result.push({ ...object, child: children });
      }
      return result;
    };
    return array.reduce(getChildren, []);
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

    this.nestedDataSource.forEach(item => {
      item.child.forEach(data => {
        const index = fieldId.findIndex((el) => el === data.fieldId)
        if (index > -1) {
          inOrderHeader.push(data);
        }
      })
    })

    this.updateTableView(inOrderHeader);
  }

  /**
   * function to update table view
   */
  updateTableView(headerInOrder: MetadataModel[]) {
    if (this.showConfiguredBanner && this.userConfigured === undefined) {
      this.setUserConfigured(true);
      return;
    }

    const prepareData = [];
    let order = 0;
    headerInOrder.forEach(header => {
      const obj = {
        widgetId: this.data.widgetId,
        fields: header.fieldId,
        sno: header.sno,
        displayCriteria: this.userConfigured ? header.displayCriteria : null,
        createdBy: this.data.userDetails.userName,
        fieldOrder: order++
      }
      prepareData.push(obj);
    });
    // const saveDisplayCriteria = this.widgetService.saveDisplayCriteria(this.data.widgetId, this.data.widgetType, null, prepareData).subscribe(res => {
    // }, error => {
    //   console.error('Error while updating report data table column settings', error.message);
    // });
    // this.subscriptions.push(saveDisplayCriteria);
    const reportDataTable = this.schemaDetailsService.createUpdateReportDataTable(this.data.widgetId, prepareData).subscribe(response => {
      this.close();
      this.data.isRefresh = true;
      this.sharedService.setReportDataTableSetting(this.data);
    }, error => {
      console.error('Error while updating report data table column settings', error.message);
    });
    this.subscriptions.push(reportDataTable);
  }

  /**
   * function to get Custom Fields of widget
   * @param objectNumber object number of widget
   */
  getCustomFields(objectNumber: string) {
    const CustomfldSub = this.reportService.getCustomDatasetFields(objectNumber).subscribe(data => {
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

      /**
       * check and push static headers
       */
      data.forEach((CustomField) => {
        const index = this.fieldIdArray.indexOf(CustomField.fieldId);
        if (index === -1) {
          this.headers.push(CustomField);
        }
        if (index !== -1) {
          this.headers[index] = CustomField;
        }
      });

      this.headersObs = of(this.headers);
    }, error => {
      console.error('Error while getting report workflow fields', error.message);
    });
    this.subscriptions.push(CustomfldSub);
  }

  /**
   * function to set this.userConfigured. If false will set all displayCriteria to the default
   */
  setUserConfigured(value: boolean) {
    this.userConfigured = value;
    if (!this.userConfigured) {
      this.headers.forEach((item) => {
        item.displayCriteria = this.data.displayCriteria;
      });

      this.hvyFields.forEach(item => {
        item.displayCriteria = this.data.displayCriteria;
      })

      this.gvsFields.forEach((item: any) => {
        item.displayCriteria = this.data.displayCriteria;
      })
    }
  }
}

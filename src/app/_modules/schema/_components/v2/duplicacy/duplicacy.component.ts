import { Component, OnInit, AfterViewInit, ViewChild, OnChanges, SimpleChanges, Input, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { FieldInputType, FilterCriteria, SchemaTableAction, SchemaTableViewFldMap, TableActionViewType } from '@models/schema/schemadetailstable';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';

import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { SchemaService } from '@services/home/schema.service';
import { SchemaStaticThresholdRes, LoadDropValueReq, SchemaListDetails, SchemaVariantsModel } from '@models/schema/schemalist';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { AddFilterOutput } from '@models/schema/schema';
import { MatMenuTrigger } from '@angular/material/menu';
import { DropDownValue } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { MatDialog } from '@angular/material/dialog';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { SchemaVariantService } from '@services/home/schema/schema-variant.service';

import { DoCorrectionRequest, MasterRecordChangeRequest, RECORD_STATUS, RECORD_STATUS_KEY, RequestForCatalogCheckData } from '@models/schema/duplicacy';
import { CatalogCheckService } from '@services/home/schema/catalog-check.service';
import { MatPaginator } from '@angular/material/paginator';
import { DuplicacyDataSource } from './duplicacy-data-source';
import { EndpointsClassicService } from '@services/_endpoints/endpoints-classic.service';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';
import { ContainerRefDirective } from '@modules/shared/_directives/container-ref.directive';
import { TableCellInputComponent } from '@modules/shared/_components/table-cell-input/table-cell-input.component';
import { Userdetails } from '@models/userdetails';
import { UserService } from '@services/user/userservice.service';

@Component({
  selector: 'pros-duplicacy',
  templateUrl: './duplicacy.component.html',
  styleUrls: ['./duplicacy.component.scss']
})
export class DuplicacyComponent implements OnInit, OnChanges, AfterViewInit {

  dataSource: DuplicacyDataSource;

  /**
   * Selected group id, 0 for all groups
   */
  groupId: string;

  /**
   * Selected group key
   */
  groupKey: string;



  /**
   * Module / dataset id
   */
  @Input()
  moduleId: string;

  /**
   * Schema id
   */
  @Input()
  schemaId: string;

  /**
   * Current active tab..
   */
  activeTab = 'error';

  /**
   * Variant id if have otherwise by default is 0 for all
   */
  variantId = '0';

  /**
   * Variant name if have otherwise by default is entire dataset
   */
  variantName = 'Entire dataset';

  /**
   * Hold meta data map , fieldId as key and metadamodel as value
   */
  metadataFldLst: any = {};

  /**
   * Current selected field based on schemaId , variantId and userId
   */
  selectedFields: SchemaTableViewFldMap[] = [];

  /**
   * Static column for actions
   */
  startColumns = ['select', 'action', 'OBJECTNUMBER', RECORD_STATUS_KEY];
  // 'avatar',

  /**
   * All display column fieldid should be here
   */
  displayedFields: BehaviorSubject<string[]> = new BehaviorSubject(this.startColumns);

  /**
   * Make table header row visiable
   */
  tableHeaderActBtn: string[] = [];


  /**
   * Executed statics of schema
   */
  statics: SchemaStaticThresholdRes;

  /**
   * Use only for fiter criteria while filtering data ...
   * why subject .. when value change then should send request for table data...
   */
  filterCriteria: BehaviorSubject<FilterCriteria[]> = new BehaviorSubject<FilterCriteria[]>(null);

  /**
   * Contains sort order here ..
   */
  sortOrder: any = {};

  /**
   * Show table loading ...
   */
  showTableLoading = false;

  /**
   * Conatins all selected rows ..
   */
  selection = new SelectionModel<any>(true, []);


  /**
   * Hold info about for try to load value for
   * selected field id with preselcted ..
   */
  loadDopValuesFor: LoadDropValueReq;

  /**
   * Flag for re inilize filterable field ..
   */
  reInilize = true;

  /**
   * Input value for search by object number ..
   */
  preInpVal = '';

  /**
   * Store all data scopes ...  as a variants
   */
  dataScope: SchemaVariantsModel[] = [];

  /**
   * Current schema info ..
   */
  schemaInfo: SchemaListDetails;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  lastScrollTop: number;

  inlineSearchSubject: Subject<string> = new Subject();

  RECORD_STATUS = RECORD_STATUS;

  RECORD_STATUS_KEY = RECORD_STATUS_KEY;

  FIELD_TYPE = FieldInputType;

  userDetails: Userdetails;

  /**
   * data fetch page index
   */
  pageIndex = 0;

  TableActionViewType = TableActionViewType;

  tableActionsList: SchemaTableAction[] = [
    { actionText: 'Approve', isPrimaryAction: true, isCustomAction: false, actionViewType: TableActionViewType.ICON_TEXT },
    { actionText: 'Reject', isPrimaryAction: true, isCustomAction: false, actionViewType: TableActionViewType.ICON_TEXT },
    { actionText: 'Delete', isPrimaryAction: true, isCustomAction: false, actionViewType: TableActionViewType.ICON_TEXT }
  ] as SchemaTableAction[];



  constructor(
    private activatedRouter: ActivatedRoute,
    private schemaDetailService: SchemaDetailsService,
    private router: Router,
    private sharedServices: SharedServiceService,
    private schemaService: SchemaService,
    private endpointservice: EndpointsClassicService,
    private snackBar: MatSnackBar,
    private matDialog: MatDialog,
    private schemaListService: SchemalistService,
    private schemaVariantService: SchemaVariantService,
    private catalogService: CatalogCheckService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private userService: UserService

  ) { }


  ngOnChanges(changes: SimpleChanges): void {


    let isRefresh = false;

    if (changes && changes.moduleId && changes.moduleId.currentValue !== changes.moduleId.previousValue) {
      this.moduleId = changes.moduleId.currentValue;
      isRefresh = true;
    }

    if (changes && changes.schemaId && changes.schemaId.currentValue !== changes.schemaId.previousValue) {
      this.schemaId = changes.schemaId.currentValue;
      isRefresh = true;
    }

    /* if(changes && changes.variantId && changes.variantId.currentValue !== changes.variantId.previousValue) {
      this.variantId = changes.variantId.currentValue ? changes.variantId.currentValue : '0';
    } */

    if (isRefresh) {
      this.dataSource = new DuplicacyDataSource(this.catalogService, this.snackBar);
      this.groupId = null;
      this.groupKey = null;
      this.variantId = '0';
      this.variantName = 'Entire dataset';
      this.sortOrder = {};
      this.getDataScope();
      this.getSchemaStatics();
      this.getSchemaDetails();
      this.getSchemaTableActions();
      // this.getData();
      if (this.variantId !== '0') {
        this.getVariantDetails();
      }


      // reset filter and sort order
      this.filterCriteria.next(null);
      this.preInpVal = '';

      // get tabe headers details
      this.getTableHeaders();

    }
  }


  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(res => {
      this.sortOrder = {};
      if (res.direction) {
        const fldId = res.active ? res.active : '';
        const order = res.direction ? res.direction : '';
        // this.sortOrder = {};
        this.sortOrder[fldId] = order;
      }
      this.getData();
    });

  }

  ngOnInit(): void {

    this.sharedServices.getDataScope().subscribe(res => {
      if (res) {
        this.getDataScope();
      }
    })

    /**
     * After choose columns get updated columns ..
     */
    this.sharedServices.getChooseColumnData().pipe(skip(1)).subscribe(result => {
      if (result && !result.editActive) {
        this.selectedFields = result.selectedFields;
        this.calculateDisplayFields();
        if (result.tableActionsList && result.tableActionsList.length) {
          this.tableActionsList = result.tableActionsList
        }
      }
    });

    /**
     * After filter applied should call for get data
     */
    this.filterCriteria.subscribe(res => {
      if (res !== null) {
        this.getData();
      }
    });

    /**
     * While row selection change then control the header actions..
     */
    this.selection.changed.subscribe(res => {
      if (res.source.selected.length > 0) {
        this.tableHeaderActBtn = ['common_actions_header'];
      } else {
        this.tableHeaderActBtn = [];
      }
    });

    /**
     * inline search changes
     */
    this.inlineSearchSubject.pipe(
      debounceTime(100),
      distinctUntilChanged()
    ).subscribe(value => this.inlineSearch(value));

    this.userService.getUserDetails().subscribe(res => {
      this.userDetails = res;
    }, error => console.error(`Error : ${error.message}`));


  }

  /**
   * Get schema info ..
   */
  getSchemaDetails() {
    this.schemaListService.getSchemaDetailsBySchemaId(this.schemaId).subscribe(res => {
      this.schemaInfo = res;
    }, error => console.error(`Error : ${error.message}`))
  }

  getTableHeaders() {
    /**
     * Combine obserable for metadata and selected field by user
     */
    combineLatest([this.schemaDetailService.getMetadataFields(this.moduleId),
    this.schemaDetailService.getAllSelectedFields(this.schemaId, this.variantId)])
      .subscribe(res => {
        if (res) {
          console.log(res);
          this.metadataFldLst = res[0];
          this.selectedFields = res[1];
          this.calculateDisplayFields();
          // this.displayedFields.next(this.startColumns.concat(res[1]));
        }
      });
  }


  /**
   * Call service for get schema statics based on schemaId and latest run
   */
  getSchemaStatics() {
    this.schemaService.getSchemaThresholdStatics(this.schemaId, this.variantId).subscribe(res => {
      this.statics = res;
    }, error => {
      this.statics = new SchemaStaticThresholdRes();
      console.error(`Error : ${error}`);
    })
  }

  /**
   * Get schema variant details ..
   */
  getVariantDetails() {
    this.schemaVariantService.getVariantdetailsByvariantId(this.variantId).subscribe(res => {
      if (res) {
        const inline = res.filterCriteria.filter(fil => fil.fieldId === 'id')[0];
        if (inline) {
          this.preInpVal = inline.values ? inline.values.toString() : '';
        }
        const finalFiletr: FilterCriteria[] = [inline];
        res.filterCriteria.forEach(fil => {
          const filter: FilterCriteria = new FilterCriteria();
          filter.fieldId = fil.fieldId;
          filter.type = fil.type;
          filter.values = fil.values;

          const dropVal: DropDownValue[] = [];
          filter.values.forEach(val => {
            const dd: DropDownValue = { CODE: val, FIELDNAME: fil.fieldId } as DropDownValue;
            dropVal.push(dd);
          });

          filter.filterCtrl = { fldCtrl: fil.fldCtrl, selectedValues: dropVal };
          finalFiletr.push(filter);
        });

        this.filterCriteria.next(finalFiletr);
      }
    }, error => {
      console.error(`Error : ${error.message}`);
    });
  }


  /**
   * Get table data from service ..
   * @param filterCriteria have default filter or apply filter as request...
   * @param sort apply some sorting on column ..
   */
  getData(isLoadingMore?) {

    if (isLoadingMore) {
      this.pageIndex++;
    } else {
      this.pageIndex = 0;
    }

    const request = new RequestForCatalogCheckData();
    request.schemaId = this.schemaId;
    request.groupId = this.groupId;
    request.page = this.pageIndex ;
    request.size = 20;
    request.key = this.groupKey;
    request.runId = '';
    request.filterCriterias = this.filterCriteria.getValue() || [];
    request.plantCode = '0';
    request.sort = this.sortOrder;
    request.requestStatus = this.activeTab;
    // request.runId = this.schemaInfo && this.schemaInfo.runId ?  this.schemaInfo.runId : '';

    this.dataSource.getTableData(request, isLoadingMore);

  }

  /**
   * Calculate fields based on user view ..
   *
   */
  calculateDisplayFields(): void {
    const allMDF = this.metadataFldLst;
    const fields = [];
    const select = [];
    // const metadataLst: any = {};
    this.startColumns.forEach(col => fields.push(col));
    for (const headerField in allMDF.headers) {
      if (allMDF.headers.hasOwnProperty(headerField)) {

        const index = this.selectedFields.findIndex(f => f.fieldId === headerField);
        if (fields.indexOf(headerField) < 0 && (index !== -1)) {
          select[index] = headerField;
        }
        // metadataLst[headerField] = allMDF.headers[headerField];
      }
    }
    // TODO for hierarchy and grid logic ..
    // this.metadataFldLst = metadataLst;
    select.forEach(fldId => fields.push(fldId));
    this.displayedFields.next(fields);
  }


  /**
   * Navigate particular tab by tab status
   * @param status get tab name to navigate
   */
  changeTabStatus(status: string) {

    if (this.activeTab === status) {
      console.log('Already loaded for tab {}', status)
      return false;
    }
    this.dataSource.reset();
    this.activeTab = status;
    this.groupId = null;
    // this.getData();
    this.router.navigate(['/home/schema/schema-details', this.moduleId, this.schemaId], { queryParams: { status} });

  }

  /**
   * Oen choose column side sheet ..
   */
  openTableColumnSettings() {
    const data = {
      schemaId: this.schemaId, variantId: this.variantId, fields: this.metadataFldLst,
      selectedFields: this.selectedFields, editActive: true
    }
    this.sharedServices.setChooseColumnData(data);
    this.router.navigate(['', { outlets: { sb: 'sb/schema/table-column-settings' } }], { preserveQueryParams: true });
  }

  /**
   * Method for download error or execution logs
   */
  /* downloadExecutionDetails() {
    const downloadLink = document.createElement('a');
    downloadLink.href = this.endpointservice.downloadExecutionDetailsUrl(this.schemaId, this.activeTab) + '?runId=';
    downloadLink.setAttribute('target', '_blank');
    document.body.appendChild(downloadLink);
    downloadLink.click();


  /**
   * After value change on text input
   * @param value current value after change on
   */
  inlineSearch(value: string) {
    console.log('inline***')
    const filterCValue = this.filterCriteria.getValue() ? this.filterCriteria.getValue() : [];
    const haveInline = filterCValue.filter(fil => fil.type === 'INLINE')[0];
    if (value && value.trim() !== '') {
      if (haveInline) {
        const idx = filterCValue.indexOf(haveInline);
        filterCValue.splice(idx, 1);
        haveInline.values = [value];
        filterCValue.push(haveInline);
      } else {
        const filterC = new FilterCriteria();
        filterC.fieldId = 'id';
        filterC.type = 'INLINE';
        filterC.values = [value];
        filterCValue.push(filterC);
      }
    } else {
      const idx = filterCValue.indexOf(haveInline);
      filterCValue.splice(idx, 1);
    }
    this.filterCriteria.next(filterCValue);
  }



  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.docLength();
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.docValue().forEach(row => this.selection.select(row));
  }


  /**
   *
   * @param type type of request is inline or submit all
   * @param row if request  type is inline then submit single rec ..
   */
  approveRecords(type: string, row?: any) {
    const objNumbs: string[] = [];
    if (type === 'inline') {
      const docId = row ? row.OBJECTNUMBER.fieldData : '';
      if (docId) {
        objNumbs.push(docId);
      }
    } else {
      if (this.selection.selected.length) {
        const selected = this.selection.selected;
        selected.forEach(sel => {
          const docId = sel.OBJECTNUMBER.fieldData;
          objNumbs.push(docId);
        });

      }
    }
    console.log(objNumbs);

    this.catalogService.approveDuplicacyCorrection(this.schemaId, this.schemaInfo.runId, objNumbs,this.userDetails.userName)
    .subscribe(res => {
        // this.getData();
        this.snackBar.open('Successfully approved !', 'close', {duration: 1500});

        if (type === 'inline') {
          row.OBJECTNUMBER.isReviewed = true;
        } else {
          this.selection.selected.forEach(record => {
            record.OBJECTNUMBER.isReviewed = true;
          })
        }
        this.selection.clear();
    }, error => {
      this.snackBar.open(`Something went wrong !`, 'Close', { duration: 2000 });
      console.error(`Error :: ${error.message}`);
    });
  }

  /**
   *
   * @param type type of request is inline or submit all
   * @param row if request  type is inline then submit single rec ..
   */
  rejectRecords(type: string, row?: any) {
    const objNumbs: string[] = [];
    if (type === 'inline') {
      const docId = row ? row.OBJECTNUMBER.fieldData : '';
      if (docId) {
        objNumbs.push(docId);
      }
    } else {
      if (this.selection.selected.length) {
        const selected = this.selection.selected;
        selected.forEach(sel => {
          const docId = sel.OBJECTNUMBER.fieldData;
          objNumbs.push(docId);
        });

      }
    }
    console.log(objNumbs);

    this.catalogService.rejectDuplicacyCorrection(this.schemaId, this.schemaInfo.runId, objNumbs,this.userDetails.userName)
    .subscribe(res => {
        this.selection.clear();
        this.getData();
        /* if (type === 'inline') {
          row.OBJECTNUMBER.isReviewed = false;
        } else {
          this.selection.selected.forEach(record => {
            record.OBJECTNUMBER.isReviewed = false;
          })
        } */

    }, error => {
      this.snackBar.open(`Something went wrong !`, 'Close', { duration: 2000 });
      console.error(`Error :: ${error.message}`);
    });
  }

  /**
   * Make control for prepare filter for ...
   * @param fld ready for applied filter control
   */
  makeFilterControl(fld: AddFilterOutput) {
    console.log(fld);
    this.trigger.closeMenu();

    const exitingFilterCtrl = this.filterCriteria.getValue() ? this.filterCriteria.getValue() : [];
    const extFld = exitingFilterCtrl.filter(fil => fil.fieldId === fld.fldCtrl.fieldId)[0];

    const filterCtrl: FilterCriteria = new FilterCriteria();
    filterCtrl.fieldId = fld.fldCtrl.fieldId;
    filterCtrl.type = 'DROPDOWN';
    filterCtrl.filterCtrl = fld;
    filterCtrl.values = fld.selectedValues.map(map => map.CODE);

    if (extFld) {
      exitingFilterCtrl.splice(exitingFilterCtrl.indexOf(extFld), 1);
    }
    exitingFilterCtrl.push(filterCtrl);
    this.filterCriteria.next(exitingFilterCtrl);
  }

  /**
   * Preapare data to show as a labal ..
   * @param ctrl get filter control and prepare data for view
   */
  prepareTextToShow(ctrl: FilterCriteria): string {
    const selCtrl = ctrl.filterCtrl.selectedValues.filter(fil => fil.FIELDNAME === ctrl.fieldId);
    if (selCtrl && selCtrl.length > 1) {
      const fld = this.filterCriteria.getValue().filter(fil => fil.fieldId === ctrl.fieldId);
      if (fld && fld.length > 0) {
        const sel = fld[0].filterCtrl.selectedValues.filter(f => f.FIELDNAME === ctrl.fieldId);
        return String(sel.length);
      }
    }
    return ((selCtrl && selCtrl.length === 1) ? (selCtrl[0].TEXT ? selCtrl[0].TEXT : selCtrl[0].CODE) : 'Unknown');
  }

  /**
   * Remove applied filter ..
   * @param ctrl control for remove applied filter
   */
  removeAppliedFilter(ctrl: FilterCriteria) {
    const exitingFilterCtrl = this.filterCriteria.getValue() ? this.filterCriteria.getValue() : [];
    const extFld = exitingFilterCtrl.filter(fil => fil.fieldId === ctrl.fieldId)[0];
    if (extFld) {
      exitingFilterCtrl.splice(exitingFilterCtrl.indexOf(extFld), 1);
      this.filterCriteria.next(exitingFilterCtrl);
    }
  }

  /**
   * Submit reviewed records
   */
  /* submitReviewRec() {
    this.schemaDetailService.submitReviewedRecords(this.schemaId).subscribe(res => {
      if (res.acknowledge) {
        this.snackBar.open(`Successfully submitted !`, 'Close', { duration: 2000 });
      }
    }, error => {
      this.snackBar.open(`${error.statusText}: Please review atleast one record(s)`, 'Close', { duration: 2000 });
    });
  } */


  /**
   * Set selected drop requet .. for load values ..
   * @param fldC get cliked fld control
   */
  loadDropValues(fldC: FilterCriteria) {
    if (fldC) {
      const dropArray: DropDownValue[] = [];
      fldC.values.forEach(val => {
        const drop: DropDownValue = { CODE: val, FIELDNAME: fldC.fieldId } as DropDownValue;
        dropArray.push(drop);
      });
      this.loadDopValuesFor = { fieldId: fldC.fieldId, checkedValue: dropArray };
    }
  }

  /**
   * Open dialog for save applied filters ..
   */
  /* opnDialogSaveVariant() {
    const ref = this.matDialog.open(SaveVariantDialogComponent, {
      width: '600px',
      height: '450px',
      data: { schemaInfo: this.schemaInfo, variantId: this.variantId, moduleId: this.moduleId, filterData: this.filterCriteria.getValue() }
    });

    ref.afterClosed().subscribe(res => {
      console.log(res);
    });
  } */

  /**
   * Reset applied filter
   */
  resetAppliedFilter() {
    this.filterCriteria.next([]);
    this.preInpVal = '';
  }

  /**
   * Updated selected drop values ...
   * @param dropValue updated dropvalues
   */
  updateFilterCriteria(dropValue: DropDownValue[]) {
    console.log(dropValue);
    const fillData = this.filterCriteria.getValue() ? this.filterCriteria.getValue() : [];
    const filterControl = fillData.filter(fill => fill.fieldId === this.loadDopValuesFor.fieldId)[0];
    if (filterControl) {
      if (dropValue && dropValue.length > 0) {
        filterControl.values = dropValue.map(map => map.CODE);
        filterControl.filterCtrl = { fldCtrl: filterControl.filterCtrl.fldCtrl, selectedValues: dropValue };
      } else {
        fillData.slice(fillData.indexOf(filterControl), 1);
      }
      this.filterCriteria.next(fillData);
    }

  }

  refreshData(variantId) {
    if (this.variantId !== variantId) {
      this.variantId = variantId;
      this.variantName = this.variantId === '0' ? 'Entire dataset'
        : this.schemaInfo.variants.find(v => v.variantId === this.variantId).variantName;
      this.getData();
      if (this.variantId !== '0') {
        this.getVariantDetails();
      }
    }
  }

  /**
   * Mark a record as master
   * @param row record details
   */
  markAsMasterRecord(row) {

    const request = new MasterRecordChangeRequest();
    request.id = row.OBJECTNUMBER.fieldData;
    request.schemaId = this.schemaId;
    request.runId = this.schemaInfo.runId;
    request.oldId = '';

    this.catalogService.markAsMasterRecord(request)
      .subscribe(resp => {
        console.log(resp);
      });
  }

  /**
   * mark record for deletion
   * @param row record to be marked for deletion
   */
  markForDeletion(row) {
    const objectNumber = row.OBJECTNUMBER.fieldData;
    if (!objectNumber || row[RECORD_STATUS_KEY].fieldData === RECORD_STATUS.DELETABLE) {
      return;
    }
    this.catalogService.markForDeletion(objectNumber, this.moduleId, this.schemaId, this.schemaInfo.runId)
      .subscribe(resp => {
        this.snackBar.open('Successfully marked for deletion !', 'close', {duration: 1500});
        row[RECORD_STATUS_KEY].fieldData = RECORD_STATUS.DELETABLE;
        console.log(resp);
      }, error => {
        console.log(error);
      });
  }



  /** The label for the checkbox on the passed row */
  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }

  updateSelectedGroup(event) {
    if (event.groupId === this.groupId) {
      return;
    }
    this.groupId = event.groupId;
    this.groupKey = event.groupKey;
    this.getData();
  }

  isStaticColumn(dynCol) {
    return this.startColumns.includes(dynCol);
  }

  /**
   * load more records on scroll end
   * @param event scrol details
   */
  onScroll(event) {

    if (event.target.clientHeight + event.target.scrollTop >= event.target.scrollHeight) {
      if (event.target.scrollTop > this.lastScrollTop) {
        console.log('End ', event.target.scrollTop);
        this.getData(true);
      }

    }
    this.lastScrollTop = event.target.scrollTop;
  }

  /**
   * Get data scopes .. or variants ...
   */
  getDataScope() {
    this.schemaVariantService.getDataScope(this.schemaId, 'RUNFOR').subscribe(res => {
      this.dataScope = res;
    }, (error) => console.error(`Something went wrong while getting variants : ${error.message}`));
  }

  /**
   * Function to open data scope side sheet
   */
  openDataScopeSideSheet() {
    this.router.navigate([{ outlets: { sb: `sb/schema/data-scope/${this.moduleId}/${this.schemaId}/new/sb` } }])
  }

  /**
   * Function to open summary side sheet of schema
   */
  openSummarySideSheet() {
    this.router.navigate([{ outlets: { sb: `sb/schema/check-data/${this.moduleId}/${this.schemaId}` } }])
  }

  /**
   * inline search input changes
   */
  newInlineSearchText(value) {
    this.inlineSearchSubject.next(value);
  }

  getRecordStatusClass(row) {
    return row[RECORD_STATUS_KEY].fieldData === RECORD_STATUS.MASTER ? 'success-status'
      : row[RECORD_STATUS_KEY].fieldData === RECORD_STATUS.NOT_DELETABLE ? 'warning-status'
        : 'unselected';
  }

  getTableRowClass(row) {
    const classList = [];
    if (row[RECORD_STATUS_KEY].fieldData !== RECORD_STATUS.MASTER) {
      classList.push('not-master-row')
    }
    if (row[RECORD_STATUS_KEY].fieldData === RECORD_STATUS.DELETABLE) {
      classList.push('row-deletable')
    }
    return classList;
  }

  /**
   *
   * @param fldid editable field id
   * @param row entire row should be here
   */
  editCurrentCell(fldid: string, row: any, rIndex: number, containerRef: ContainerRefDirective) {
    console.log(fldid);
    console.log(row);

    const field = this.selectedFields.find(f => f.fieldId === fldid);
    if (field && !field.editable) {
      console.log('Edit is disabled for this field ! ', fldid);
      return;
    }

    if (document.getElementById('inpctrl_' + fldid + '_' + rIndex)) {
      const inpCtrl = document.getElementById('inpctrl_' + fldid + '_' + rIndex) as HTMLDivElement;
      const viewCtrl = document.getElementById('viewctrl_' + fldid + '_' + rIndex) as HTMLSpanElement;
      // const inpValCtrl = document.getElementById('inp_'+ fldid + '_' + rIndex) as HTMLInputElement;

      inpCtrl.style.display = 'block';
      // inpValCtrl.focus();
      viewCtrl.style.display = 'none';

      // add a dynamic cell input component
      this.addDynamicInput(fldid, row, rIndex, containerRef);

    }
  }

  /**
   * After value change on & also call service for do correction
   * @param fldid fieldid that have blur triggered
   * @param value current changed value
   * @param row row data ..
   */
  emitEditBlurChng(fldid: string, value: any, row: any, rIndex: number, viewContainerRef?: ViewContainerRef) {
    console.log(value);
    if (document.getElementById('inpctrl_' + fldid + '_' + rIndex)) {

      // DOM control after value change ...
      const inpCtrl = document.getElementById('inpctrl_' + fldid + '_' + rIndex) as HTMLDivElement;
      const viewCtrl = document.getElementById('viewctrl_' + fldid + '_' + rIndex) as HTMLSpanElement;

      // clear the dynamic cell input component
      viewContainerRef.clear();

      inpCtrl.style.display = 'none';
      viewCtrl.innerText = value;
      viewCtrl.style.display = 'block';

      // DO correction call for data
      const objctNumber = row.OBJECTNUMBER.fieldData;
      const oldVal = row[fldid] ? row[fldid].fieldData : '';
      if (objctNumber && oldVal !== value) {
        console.log('correction request....')
        const request: DoCorrectionRequest = {
          id: objctNumber, fldId: fldid, vc: value, oc: oldVal,
          groupIdold: this.groupId, groupIdnew: '', isReviewed: 'false', groupField: this.groupKey
        } as DoCorrectionRequest;
        this.catalogService.doCorrection(this.schemaId, this.schemaInfo.runId, request).subscribe(res => {
          // row[fldid].fieldData = value;
          if(res && res.count) {
            this.statics.correctedCnt = res.count;
          }
        }, error => {
          this.snackBar.open(`Something went wrong !`, 'Close', { duration: 2000 });
          console.error(`Error :: ${error.message}`);
        });
      } else {
        console.error(`Wrong with object number or can't change if old and new same  ... `);
      }
    }

  }

  addDynamicInput(fldid: string, row: any, rIndex: number, containerRef: ContainerRefDirective) {

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      TableCellInputComponent
    );

    // add the input component to the cell
    const componentRef = containerRef.viewContainerRef.createComponent(componentFactory);
    // binding dynamic component inputs/outputs
    componentRef.instance.fieldId = fldid;
    componentRef.instance.inputType = this.getFieldInputType(fldid);
    componentRef.instance.value = row[fldid] ? row[fldid].fieldData : '';
    componentRef.instance.inputBlur.subscribe(value => this.emitEditBlurChng(fldid, value, row, rIndex, containerRef.viewContainerRef));

  }

  /**
   * get input type when user edits a cell
   * @param fieldId the field id
   */
  getFieldInputType(fieldId) {

    if (this.metadataFldLst.headers[fieldId].picklist === '0' && this.metadataFldLst.headers[fieldId].dataType === 'NUMC') {
      return this.FIELD_TYPE.NUMBER;
    }
    if (this.metadataFldLst.headers[fieldId].picklist === '0' && (this.metadataFldLst.headers[fieldId].dataType === 'DATS' || this.metadataFldLst.headers[fieldId].dataType === 'DTMS')) {
      return this.FIELD_TYPE.DATE;
    }
    if ((this.metadataFldLst.headers[fieldId].isCheckList === 'false')
      && (this.metadataFldLst.headers[fieldId].picklist === '1' || this.metadataFldLst.headers[fieldId].picklist === '30' || this.metadataFldLst.headers[fieldId].picklist === '37')) {
      return this.FIELD_TYPE.SINGLE_SELECT;
    }
    if ((this.metadataFldLst.headers[fieldId].isCheckList === 'true')
      && (this.metadataFldLst.headers[fieldId].picklist === '1' || this.metadataFldLst.headers[fieldId].picklist === '30' || this.metadataFldLst.headers[fieldId].picklist === '37')) {
      return this.FIELD_TYPE.MULTI_SELECT;
    }

    return this.FIELD_TYPE.TEXT;

  }

  /**
   * format cell displayed value based on field type
   * @param fieldId the field id
   * @param value cell value
   */
  formatCellData(fieldId, value) {
    if (this.getFieldInputType(fieldId) === this.FIELD_TYPE.MULTI_SELECT) {
      // console.log(value);
      return value.toString();
    }
    return value;
  }

  /**
   * Function to open trend execution side sheet
   */
  openExecutionTrendSideSheet() {
    this.router.navigate(['', { outlets: { sb: `sb/schema/execution-trend/${this.moduleId}/${this.schemaId}/${this.variantId}` } }])
  }

  /**
   * get already saved schema actions
   */
  getSchemaTableActions() {
    this.schemaDetailService.getTableActionsBySchemaId(this.schemaId).subscribe(actions => {
      console.log(actions);
      if(actions && actions.length) {
        this.tableActionsList = actions;
      }
    });
  }

  get primaryActions() {
    return this.tableActionsList.filter(action => action.isPrimaryAction);
  }

  get secondaryActions() {
    return this.tableActionsList.filter(action => !action.isPrimaryAction);
  }


  get isEditer() {
    return this.schemaInfo
      && this.schemaInfo.collaboratorModels
      && this.schemaInfo.collaboratorModels.isEditer;
  }

  get isReviewer() {
    return this.schemaInfo
      && this.schemaInfo.collaboratorModels
      && this.schemaInfo.collaboratorModels.isReviewer;
  }

  get isApprover() {
    return this.schemaInfo
      && this.schemaInfo.collaboratorModels
      && (this.schemaInfo.collaboratorModels.isReviewer || this.schemaInfo.collaboratorModels.isApprover);
  }

  getActionIcon(actionText) {
    if (actionText === 'Approve') {
      return 'check-mark';
    } else if (actionText === 'Reject') {
      return 'declined';
    } else if (actionText === 'Delete') {
      return 'recycle-bin';
    }

    return '';
  }

  doAction(action: SchemaTableAction, row) {
    console.log('Action selected ', action);
    if (!action.isCustomAction && action.actionText === 'Approve' && (this.isReviewer || this.isApprover)) {
      this.approveRecords('inline', row);
    } else if (!action.isCustomAction && action.actionText === 'Reject' && (this.isReviewer || this.isApprover)) {
      this.rejectRecords('inline', row);
    }
  }

}

import { Component, OnInit, AfterViewInit, ViewChild, ComponentFactoryResolver, ViewContainerRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MetadataModeleResponse, RequestForSchemaDetailsWithBr, SchemaCorrectionReq, FilterCriteria, FieldInputType, SchemaTableViewFldMap, SchemaTableAction, TableActionViewType } from '@models/schema/schemadetailstable';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError, BehaviorSubject, combineLatest } from 'rxjs';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { SchemaDataSource } from '../../schema-details/schema-datatable/schema-data-source';
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
import { SaveVariantDialogComponent } from '../save-variant-dialog/save-variant-dialog.component';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { SchemaVariantService } from '@services/home/schema/schema-variant.service';
import { ContainerRefDirective } from '@modules/shared/_directives/container-ref.directive';
import { TableCellInputComponent } from '@modules/shared/_components/table-cell-input/table-cell-input.component';
import { EndpointsClassicService } from '@services/_endpoints/endpoints-classic.service';
import { Userdetails } from '@models/userdetails';
import { UserService } from '@services/user/userservice.service';
import { skip } from 'rxjs/operators';

@Component({
  selector: 'pros-schema-details',
  templateUrl: './schema-details.component.html',
  styleUrls: ['./schema-details.component.scss']
})
export class SchemaDetailsComponent implements OnInit, AfterViewInit, OnChanges {

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
   * Variant id if have otherwise by default is 0 for all
   */
  @Input()
  variantId = '0';

  /**
   * Variant name if have otherwise by default is entire dataset
   */
  variantName = 'Entire dataset';

  /**
   * Hold all metada control for header , hierarchy and grid fields ..
   */
  metadata: BehaviorSubject<MetadataModeleResponse> = new BehaviorSubject<MetadataModeleResponse>(null);

  /**
   * Store info about user selected field and order
   */
  selectedFieldsOb: BehaviorSubject<SchemaTableViewFldMap[]> = new BehaviorSubject(null);
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
  startColumns = ['row_more_action', '_assigned_buckets', '_score_weightage', 'OBJECTNUMBER'];

  /**
   * All display column fieldid should be here
   */
  displayedFields: BehaviorSubject<string[]> = new BehaviorSubject(this.startColumns);

  /**
   * Datasource for data table data
   */
  dataSource: SchemaDataSource;

  /**
   * Store info about active tab..
   */
  @Input()
  activeTab = 'error';

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
   * Make table header row visiable
   */
  tableHeaderActBtn: string[] = [];

  /**
   *
   */
  fetchCount = 0;


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
   * Outlet in which side sheet will be opened..
   */
  outlet = 'sb';

  /**
   * Store all data scopes ...  as a variants
   */
  dataScope: SchemaVariantsModel[] = [];

  /**
   * Current schema info ..
   */
  schemaInfo: SchemaListDetails;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  FIELD_TYPE = FieldInputType;

  selectFieldOptions: DropDownValue[] = [];

  /**
   * Hold info about current user
   */
  userDetails: Userdetails;

  /**
   * hold scroll limit reached edge
   */
  scrollLimitReached = false;
  TableActionViewType = TableActionViewType;

  tableActionsList: SchemaTableAction[] = [
    { actionText: 'Approve', isPrimaryAction: true, isCustomAction: false, actionViewType: TableActionViewType.ICON_TEXT },
    { actionText: 'Reject', isPrimaryAction: true, isCustomAction: false, actionViewType: TableActionViewType.ICON_TEXT }
  ] as SchemaTableAction[];

  /**
   * To hold running value of schema
   */
  @Input()
  isInRunning: boolean;


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
    private componentFactoryResolver: ComponentFactoryResolver,
    private userService: UserService

  ) { }


  ngOnChanges(changes: SimpleChanges): void {
    // check if any things is change then refresh again
    let isRefresh = false;

    if (changes && changes.moduleId && changes.moduleId.currentValue !== changes.moduleId.previousValue) {
      this.moduleId = changes.moduleId.currentValue;
      isRefresh = true;
    }

    if (changes && changes.schemaId && changes.schemaId.currentValue !== changes.schemaId.previousValue) {
      this.schemaId = changes.schemaId.currentValue;
      isRefresh = true;
    }

    if (changes && changes.variantId && changes.variantId.currentValue !== changes.variantId.previousValue) {
      this.variantId = changes.variantId.currentValue;
      isRefresh = true;
    }

    if(changes && changes.isInRunning && changes.isInRunning.currentValue !== changes.isInRunning.previousValue) {
      this.isInRunning = changes.isInRunning.currentValue;
    }

    if (isRefresh && !this.isInRunning) {
      this.activeTab='error';
      this.getDataScope();
      this.getFldMetadata();
      this.dataSource = new SchemaDataSource(this.schemaDetailService, this.endpointservice, this.schemaId);
      this.getSchemaStatics();
      this.getSchemaDetails();
      this.getSchemaTableActions();
      if (this.variantId !== '0') {
        this.getVariantDetails();
      }
      /**
       * Get all user selected fields based on default view ..
       */
      this.schemaDetailService.getAllSelectedFields(this.schemaId, this.variantId).subscribe(res => {
        this.selectedFieldsOb.next(res ? res : [])
      }, error => console.error(`Error : ${error}`));
      this.manageStaticColumns();
      this.dataSource.brMetadata.subscribe(res => {
        if (res) {
          this.getData();
        }
      });
    }

    // reset filter and sort order
    this.filterCriteria.next(null);
    this.preInpVal = '';

    if (changes && changes.activeTab && changes.activeTab.currentValue !== changes.activeTab.previousValue) {
      this.activeTab = changes.activeTab.currentValue;
      this.manageStaticColumns();
    }
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(res => {
      if (res.direction) {
        const fldId = res.active ? res.active : '';
        const order = res.direction ? res.direction : '';
        this.sortOrder = {};
        this.sortOrder[fldId] = order;
        this.getData(this.filterCriteria.getValue(), this.sortOrder);
      }
    });
  }

  ngOnInit(): void {

    this.sharedServices.getDataScope().subscribe(res => {
      if (res) {
        this.getDataScope(); // Get Data scope..
      }
    })

    /**
     * Get onload data ..
     */
    this.dataSource.brMetadata.subscribe(res => {
      if (res) {
        this.getData();
      }
    });

    /**
     * After choose columns get updated columns ..
     */
    this.sharedServices.getChooseColumnData().pipe(skip(1)).subscribe(result => {
      if (result && !result.editActive) {
        this.selectedFields = result.selectedFields ? result.selectedFields : [];
        this.calculateDisplayFields();
        if (result.tableActionsList && result.tableActionsList.length) {
          this.tableActionsList = result.tableActionsList
        }
      }
    });

    /**
     * Combine obserable for metadata and selected field by user
     * And calcute display field amd order
     */
    combineLatest([this.metadata, this.selectedFieldsOb]).subscribe(res => {
      if (res[0]) {
        this.selectedFields = res[1] ? res[1] : [];
        this.calculateDisplayFields();
      }
    });

    /**
     * After filter applied should call for get data
     */
    this.filterCriteria.subscribe(res => {
      if (res !== null) {
        this.getData(res, this.sortOrder);
      }
    });

    /**
     * While row selection change then control the header actions..
     */
    this.selection.changed.subscribe(res => {
      if (res.source.selected.length > 0) {
        this.tableHeaderActBtn = ['review_actions_header'];
      } else {
        this.tableHeaderActBtn = [];
      }
    });

    this.userService.getUserDetails().subscribe(res=>{
      this.userDetails  = res;
    }, err=> console.log(`Error ${err}`));

  }

  /**
   * Get schema info ..
   */
  getSchemaDetails() {
    this.schemaListService.getSchemaDetailsBySchemaId(this.schemaId).subscribe(res => {
      this.schemaInfo = res;
    }, error => console.error(`Error : ${error.message}`))
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
   * Get all fld metada based on module of schema
   */
  getFldMetadata() {
    if (this.moduleId === undefined || this.moduleId.trim() === '') {
      throwError('Module id cant be null or empty');
    }
    this.schemaDetailService.getMetadataFields(this.moduleId).subscribe(response => {
      this.metadata.next(response);
    }, error => {
      console.error(`Error : ${error.message}`);
    });
  }

  /**
   * Calculate fields based on user view ..
   *
   */
  calculateDisplayFields(): void {
    const allMDF = this.metadata.getValue();
    const fields = [];
    const select = [];
    const metadataLst: any = {};
    this.startColumns.forEach(col => fields.push(col));
    for (const headerField in allMDF.headers) {
      if (allMDF.headers.hasOwnProperty(headerField)) {
        // if selectedFields is blank then load all fields
        // if(fields.indexOf(headerField) < 0 && this.selectedFields.length === 0) {
        //   select.push(headerField);
        // }
        // else
        const index = this.selectedFields.findIndex(f => f.fieldId === headerField);
        if (fields.indexOf(headerField) < 0 && (index !== -1)) {
          select[index] = headerField;
        }
        metadataLst[headerField] = allMDF.headers[headerField];
      }
    }
    // TODO for hierarchy and grid logic ..
    this.metadataFldLst = metadataLst;
    select.forEach(fldId => fields.push(fldId));
    this.displayedFields.next(fields);
  }


  /**
   * Get table data from service ..
   * @param filterCriteria have default filter or apply filter as request...
   * @param sort apply some sorting on column ..
   */
  getData(filterCriteria?: FilterCriteria[], sort?: any, fetchCount?: number, isLoadMore?: boolean) {
    const request: RequestForSchemaDetailsWithBr = new RequestForSchemaDetailsWithBr();
    request.schemaId = this.schemaId;
    request.variantId = this.variantId;
    request.fetchCount = fetchCount ? fetchCount : 0;
    request.fetchSize = 20;
    request.requestStatus = this.activeTab;
    request.filterCriterias = filterCriteria;
    request.sort = sort;
    request.isLoadMore = isLoadMore ? isLoadMore : false;
    this.dataSource.getTableData(request);
  }


  /**
   * Navigate particular tab by tab status
   * @param status get tab name to navigate
   */
  changeTabStatus(status: string) {
    this.fetchCount = 0;
    if (this.activeTab === status) {
      console.log('Already loaded for tab {}', status)
      return false;
    }
    this.activeTab = status;
    this.router.navigate(['/home/schema/schema-details', this.moduleId, this.schemaId], { queryParams: { status: this.activeTab } });

    // update state of columns
    this.manageStaticColumns();
    this.calculateDisplayFields();

    if (status === 'error' || status === 'success') {
      this.getData(this.filterCriteria.getValue(), this.sortOrder);
    } else {
      this.getData();
    }
  }

  /**
   * Oen choose column side sheet ..
   */
  openTableColumnSettings() {
    const data = { schemaId: this.schemaId, variantId: this.variantId, fields: this.metadata.getValue(), selectedFields: this.selectedFields,
      editActive: true };
    this.sharedServices.setChooseColumnData(data);
    this.router.navigate(['', { outlets: { sb: 'sb/schema/table-column-settings' } }], { preserveQueryParams: true });
  }

  /**
   * Method for download error or execution logs
   */
  downloadExecutionDetails() {
    const downloadLink = document.createElement('a');
    downloadLink.href = this.endpointservice.downloadExecutionDetailsUrl(this.schemaId, this.activeTab) + '?runId=';
    downloadLink.setAttribute('target', '_blank');
    document.body.appendChild(downloadLink);
    downloadLink.click();

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
        const request: SchemaCorrectionReq = { id: [objctNumber], fldId: fldid, vc: value, isReviewed: null } as SchemaCorrectionReq;
        this.schemaDetailService.doCorrection(this.schemaId, request).subscribe(res => {
          row[fldid].fieldData = value;
          if (res.acknowledge) {
            this.statics.correctedCnt = res.count ? res.count : 0;
          }
        }, error => {
          this.snackBar.open(`Error :: ${error}`, 'Close', { duration: 2000 });
          console.error(`Error :: ${error.message}`);
        });
      } else {
        console.error(`Wrong with object number or can't change if old and new same  ... `);
      }
    }

  }


  /**
   * After value change on text input
   * @param value current value after change on
   */
  inlineSearch(value: string) {
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

  // @HostListener('window:scroll', ['$event'])
  onTableScroll(e) {
    console.log('colled');
    const tableViewHeight = e.target.offsetHeight // viewport: ~500px
    const tableScrollHeight = e.target.scrollHeight // length of all table
    const scrollLocation = e.target.scrollTop; // how far user scrolled

    // If the user has scrolled within 200px of the bottom, add more data
    const buffer = 200;
    const limit = tableScrollHeight - tableViewHeight - buffer;
    if (scrollLocation > limit) {
      if(!this.scrollLimitReached) {
        console.log('Load more data here ...');
        this.scrollLimitReached = true;
        this.fetchCount++;
        this.getData(this.filterCriteria.getValue(), this.sortOrder, this.fetchCount, true);
      }
    } else {
      this.scrollLimitReached = false;
    }
  }

  /**
   * Manage columns based on status change
   */
  manageStaticColumns() {
    let dispCols: string[] = [];
    if (this.activeTab === 'success' || this.activeTab === 'error') {
      dispCols = ['row_more_action', '_assigned_buckets', '_score_weightage', 'OBJECTNUMBER'];
      this.tableHeaderActBtn = [];
    } else {
      dispCols = ['_select_columns', 'row_more_action', '_assigned_buckets', '_row_actions', 'OBJECTNUMBER'];
    }
    this.startColumns = dispCols;
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
    const id: string[] = [];
    if (type === 'inline') {
      const docId = row ? row.OBJECTNUMBER.fieldData : '';
      if (docId) {
        id.push(docId);
      }
    } else {
      if (this.selection.selected.length) {
        const selected = this.selection.selected;
        selected.forEach(sel => {
          const docId = sel.OBJECTNUMBER.fieldData;
          id.push(docId);
        });

      }
    }
    this.schemaDetailService.approveCorrectedRecords(this.schemaId, id, this.userDetails.currentRoleId).subscribe(res => {
      if (res.acknowledge) {
        this.getData();
        this.selection.clear();
      }
    }, error => {
      this.snackBar.open(`Error :: ${error}`, 'Close', { duration: 2000 });
      console.error(`Error :: ${error.message}`);
    });
  }

  /**
   * Reset schema corrected records ..
   * @param row which are going to reset ..
   * @param type from where ..
   */
  resetRec(row: any, type: string) {
    const id: string[] = [];
    if(type === 'inline') {
      const docId = row ? row.OBJECTNUMBER.fieldData : '';
      if(docId) {
        id.push(docId);
      }
    } else {
        if(this.selection.selected.length) {
          const selected = this.selection.selected;
          selected.forEach(sel=>{
            const docId = sel.OBJECTNUMBER.fieldData;
            id.push(docId);
          });

        }
    }
    this.schemaDetailService.resetCorrectionRecords(this.schemaId, this.schemaInfo.runId , id).subscribe(res=>{
      if(res && res.acknowledge) {
            this.statics.correctedCnt = res.count ? res.count : 0;
            this.getData();
            this.selection.clear();
        }
    }, error=>{
        this.snackBar.open(`Error :: ${error}`, 'Close',{duration:2000});
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
  opnDialogSaveVariant() {
    const ref = this.matDialog.open(SaveVariantDialogComponent, {
      width: '600px',
      height: '450px',
      data: { schemaInfo: this.schemaInfo, variantId: this.variantId, moduleId: this.moduleId, filterData: this.filterCriteria.getValue() }
    });

    ref.afterClosed().subscribe(res => {
      console.log(res);
    });
  }

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
   * get input type when user edits a cell
   * @param fieldId the field id
   */
  getFieldInputType(fieldId) {

    if (this.metadataFldLst[fieldId].picklist === '0' && this.metadataFldLst[fieldId].dataType === 'NUMC') {
      return this.FIELD_TYPE.NUMBER;
    }
    if (this.metadataFldLst[fieldId].picklist === '0' && (this.metadataFldLst[fieldId].dataType === 'DATS' || this.metadataFldLst[fieldId].dataType === 'DTMS')) {
      return this.FIELD_TYPE.DATE;
    }
    if ((this.metadataFldLst[fieldId].isCheckList === 'false')
      && (this.metadataFldLst[fieldId].picklist === '1' || this.metadataFldLst[fieldId].picklist === '30' || this.metadataFldLst[fieldId].picklist === '37')) {
      return this.FIELD_TYPE.SINGLE_SELECT;
    }
    if ((this.metadataFldLst[fieldId].isCheckList === 'true')
      && (this.metadataFldLst[fieldId].picklist === '1' || this.metadataFldLst[fieldId].picklist === '30' || this.metadataFldLst[fieldId].picklist === '37')) {
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
    value = !value || value === 'null' ? '' : value;
    if (this.getFieldInputType(fieldId) === this.FIELD_TYPE.MULTI_SELECT) {
      // console.log(value);
      return value.toString();
    }
    return value;
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
   * Get data scopes .. or variants ...
   */
  getDataScope() {
    this.schemaVariantService.getDataScope(this.schemaId, 'RUNFOR').subscribe(res => {
      this.dataScope = res;
    }, (error) => console.error(`Something went wrong while getting variants. : ${error.message}`));
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

  doAction(action: SchemaTableAction, element) {
    console.log('Action selected ', action);
    if (!action.isCustomAction &&  action.actionText === 'Approve' && (this.isReviewer || this.isApprover)) {
      this.approveRecords('inline', element);
    } else if (!action.isCustomAction && action.actionText === 'Reject' && (this.isReviewer || this.isApprover)) {
      this.resetRec(element,'inline');
    }
  }


}

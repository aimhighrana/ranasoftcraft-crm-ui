import { Component, OnInit, AfterViewInit, ViewChild, OnChanges, SimpleChanges, Input } from '@angular/core';
import { FilterCriteria, SchemaTableViewFldMap } from '@models/schema/schemadetailstable';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';

import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { EndpointService } from '@services/endpoint.service';
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

import { RequestForCatalogCheckData } from '@models/schema/duplicacy';
import { CatalogCheckService } from '@services/home/schema/catalog-check.service';
import { MatPaginator } from '@angular/material/paginator';
import { DuplicacyDataSource } from './duplicacy-data-source';

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
  startColumns = ['select', 'action', 'OBJECTNUMBER'];
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
   * Store info about active tab..
   */
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



  constructor(
    private activatedRouter: ActivatedRoute,
    private schemaDetailService: SchemaDetailsService,
    private router: Router,
    private sharedServices: SharedServiceService,
    private schemaService: SchemaService,
    private endpointservice: EndpointService,
    private snackBar: MatSnackBar,
    private matDialog: MatDialog,
    private schemaListService: SchemalistService,
    private schemaVariantService: SchemaVariantService,
    private catalogService: CatalogCheckService

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
      this.getDataScope();
      this.getSchemaStatics();
      this.getSchemaDetails();
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
        this.sortOrder = {};
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
    this.sharedServices.getChooseColumnData().subscribe(result => {
      if (result && !result.isGroupTable) {
        this.selectedFields = result.selectedFields;
        this.calculateDisplayFields();
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

    const request = new RequestForCatalogCheckData();
    request.schemaId = this.schemaId;
    request.groupId = this.groupId;
    request.from = isLoadingMore ? this.dataSource.docLength() + 1 : 1;
    request.size = 20;
    request.key = this.groupKey;
    request.runId = '';
    // request.runId = this.schemaInfo && this.schemaInfo.runId ?  this.schemaInfo.runId : '';

    this.dataSource.getTableData(request, isLoadingMore);

    /* this.catalogService.getCatalogCheckRecords(request)
        .subscribe(resp => console.log(resp)); */

    /* const request = new RequestForCatalogCheckData();
    request.schemaId = this.schemaId;
    request.variantId = this.variantId;
    request.groupId = this.groupId;
    request.pageSize = this.paginator ? this.paginator.pageSize : 10;
    request.pageIndex = this.paginator ? this.paginator.pageIndex : 0;
    request.requestStatus = this.activeTab;
    request.filterCriterias = this.filterCriteria.getValue();
    request.sort = this.sortOrder;

    this.dataTableSource.isLoading = true;
    this.catalogService.getCatalogCheckData(request)
      .subscribe(resp => {
        this.dataTableSource.data = resp.data;
        this.dataTableSource.totalCount = resp.totalCount;
        this.dataTableSource.isLoading = false;
      },
        error => {
          console.log(error);
          this.dataTableSource.isLoading = false;
        }); */
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
    this.activeTab = status;
    this.getData();
    this.router.navigate(['/home/schema/schema-details', this.moduleId, this.schemaId], { queryParams: { status: this.activeTab } });

  }

  /**
   * Oen choose column side sheet ..
   */
  openTableColumnSettings() {
    const data = {
      schemaId: this.schemaId, variantId: this.variantId, fields: this.metadataFldLst,
      selectedFields: this.selectedFields
    }
    this.sharedServices.setChooseColumnData(data);
    this.router.navigate(['', { outlets: { sb: 'sb/schema/table-column-settings' }, queryParams: { status: this.activeTab } }]);
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

  } */

  /**
   *
   * @param fldid editable field id
   * @param row entire row should be here
   */
  /* editCurrentCell(fldid: string, row: any, rIndex: number) {
    console.log(fldid);
    console.log(row);
    if (document.getElementById('inpctrl_' + fldid + '_' + rIndex)) {
      const inpCtrl = document.getElementById('inpctrl_' + fldid + '_' + rIndex) as HTMLDivElement;
      const viewCtrl = document.getElementById('viewctrl_' + fldid + '_' + rIndex) as HTMLSpanElement;
      const inpValCtrl = document.getElementById('inp_' + fldid + '_' + rIndex) as HTMLInputElement;

      inpCtrl.style.display = 'block';
      inpValCtrl.focus();
      viewCtrl.style.display = 'none';
    }
  } */

  /**
   * After value change on & also call service for do correction
   * @param fldid fieldid that have blur triggered
   * @param value current changed value
   * @param row row data ..
   */
  /*   emitEditBlurChng(fldid: string, value: string, row: any, rIndex: number) {
      console.log(value);
      if (document.getElementById('inpctrl_' + fldid + '_' + rIndex)) {

        // DOM control after value change ...
        const inpCtrl = document.getElementById('inpctrl_' + fldid + '_' + rIndex) as HTMLDivElement;
        const viewCtrl = document.getElementById('viewctrl_' + fldid + '_' + rIndex) as HTMLSpanElement;
        inpCtrl.style.display = 'none';
        viewCtrl.innerText = value;
        viewCtrl.style.display = 'block';

        // DO correction call for data
        const objctNumber = row.OBJECTNUMBER.fieldData;
        const oldVal = row.fldid ? row.fldid.fieldData : '';
        if (objctNumber && oldVal !== value) {
          const request: SchemaCorrectionReq = { id: [objctNumber], fldId: fldid, vc: value, isReviewed: null } as SchemaCorrectionReq;
          this.schemaDetailService.doCorrection(this.schemaId, request).subscribe(res => {
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

    } */


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
  /* approveRecords(type: string, row?: any) {
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
    const request: SchemaCorrectionReq = { id, fldId: null, vc: null, isReviewed: true } as SchemaCorrectionReq;
    this.schemaDetailService.doCorrection(this.schemaId, request).subscribe(res => {
      if (res.acknowledge) {
        this.getData();
        this.selection.clear();
      }
    }, error => {
      this.snackBar.open(`Error :: ${error}`, 'Close', { duration: 2000 });
      console.error(`Error :: ${error.message}`);
    });
  } */

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

  markAsMasterRecord(row) {
    this.catalogService.markAsMasterRecord(row.id)
      .subscribe(resp => row.status = 'Master record');
  }

  markForDeletion(row) {
    this.catalogService.markAsMasterRecord(row.id)
      .subscribe(resp => row.status = 'Can be deleted');
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
    this.router.navigate([{ outlets: { sb: `sb/schema/data-scope/${this.moduleId}/${this.schemaId}/new` } }])
  }

  /**
   * Function to open summary side sheet of schema
   */
  openSummarySideSheet() {
    this.router.navigate([{ outlets: { sb: `sb/schema/check-data/${this.moduleId}/${this.schemaId}` } }])
  }

}

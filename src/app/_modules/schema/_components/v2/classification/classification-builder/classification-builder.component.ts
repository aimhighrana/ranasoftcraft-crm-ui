import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, ComponentFactoryResolver, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AttributeCoorectionReq, ClassificationHeader, ClassificationNounMod, MetadataModeleResponse, SchemaMROCorrectionReq, SchemaTableAction, SchemaTableViewFldMap, TableActionViewType } from '@models/schema/schemadetailstable';
import { ModuleInfo, SchemaListDetails, SchemaNavGrab, SchemaStaticThresholdRes, SchemaVariantsModel } from '@models/schema/schemalist';
import { Userdetails } from '@models/userdetails';
import { CellDataFor, ClassificationDatatableCellEditableComponent } from '@modules/shared/_components/classification-datatable-cell-editable/classification-datatable-cell-editable.component';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';
import { ContainerRefDirective } from '@modules/shared/_directives/container-ref.directive';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { GlobaldialogService } from '@services/globaldialog.service';
import { SchemaService } from '@services/home/schema.service';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { SchemaVariantService } from '@services/home/schema/schema-variant.service';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { UserService } from '@services/user/userservice.service';
import { BehaviorSubject, forkJoin, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as XLSX from 'xlsx';

const definedColumnsMetadata = {
  OBJECTNUMBER: {
    fieldId: 'OBJECTNUMBER',
    fieldDesc: 'Material number',
    fieldValue: ''
  }, SHORT_DESC: {
    fieldId: 'SHORT_DESC',
    fieldDesc: 'Short description',
    fieldValue: ''
  },
  // LONG_DESC: {
  //   fieldId: 'LONG_DESC',
  //   fieldDesc: 'Long description',
  //   fieldValue: ''
  // },
  //  MANUFACTURER: {
  //   fieldId: 'MANUFACTURER',
  //   fieldDesc: 'Manufacturer',
  //   fieldValue: ''
  // },
  MGROUP_DESC: {
    fieldId: 'MGROUP_DESC',
    fieldDesc: 'Material group',
    fieldValue: ''
  }, NOUN_CODE: {
    fieldId: 'NOUN_CODE',
    fieldDesc: 'Noun code',
    fieldValue: '',
    isEditable: true
  } ,MODE_CODE: {
    fieldId: 'MODE_CODE',
    fieldDesc: 'Modifier code',
    fieldValue: '',
    isEditable: true
  },
  // MOD_LONG: {
  //   fieldId: 'MOD_LONG',
  //   fieldDesc: 'Modifier description',
  //   fieldValue: ''
  // }, MRO_STATUS: {
  //   fieldId: 'MRO_STATUS',
  //   fieldDesc: 'Status',
  //   fieldValue: ''
  // }, NOUN_ID: {
  //   fieldId: 'NOUN_ID',
  //   fieldDesc: 'Noun id',
  //   fieldValue: ''
  // }, NOUN_LONG: {
  //   fieldId: 'NOUN_LONG',
  //   fieldDesc: 'Noun long description',
  //   fieldValue: ''
  // },
  PARTNO: {
    fieldId: 'PARTNO',
    fieldDesc: 'Part number',
    fieldValue: ''
  }
  // ,  UNSPSC: {
  //   fieldId: 'UNSPSC',
  //   fieldDesc: 'UNSPSC',
  //   fieldValue: ''
  // }, UNSPSC_DESC: {
  //   fieldId: 'UNSPSC_DESC',
  //   fieldDesc: 'UNSPSC description',
  //   fieldValue: ''
  // },
  // MRO_LIBRARY: {
  //   fieldId: 'MRO_LIBRARY',
  //   fieldDesc: 'Mro library',
  //   fieldValue: ''
  // }
}



@Component({
  selector: 'pros-classification-builder',
  templateUrl: './classification-builder.component.html',
  styleUrls: ['./classification-builder.component.scss']
})
export class ClassificationBuilderComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {


  @Input()
  schemaId: string;

  @Input()
  moduleId: string;

  @Input()
  variantId: string;

  @Input()
  activeTab = '';

  @Output() runCompleted = new EventEmitter();

  /**
   * Hold all metada control for header , hierarchy and grid fields ..
   */
  metadata: BehaviorSubject<MetadataModeleResponse> = new BehaviorSubject<MetadataModeleResponse>(null);

  /**
   * Executed statics of schema
   */
  statics: SchemaStaticThresholdRes;

  /**
   * Current schema info ..
   */
  schemaInfo: SchemaListDetails;

  /**
   * All subscription should be here ...
   */
  subsribers: Subscription[] = [];

  /**
   * Store information about noun and modifier ..
   */
  rulesNounMods: ClassificationNounMod = { MRO_CLS_MASTER_CHECK: { info: [] }, MRO_MANU_PRT_NUM_LOOKUP: { info: [] } } as ClassificationNounMod;

  /**
   * Store info about user selected field and order
   */
  selectedFieldsOb: BehaviorSubject<SchemaTableViewFldMap[]> = new BehaviorSubject(null);

  /**
   * Store all data scopes ...  as a variants
   */
  dataScope: SchemaVariantsModel[] = [];

  /**
   * Static column for actions
   */
  startColumns = ['checkbox_select', 'assigned_bucket'];


  dataFrm: string = 'MRO_CLS_MASTER_CHECK' || 'MRO_MANU_PRT_NUM_LOOKUP';

  /**
   * Store data of table for next suggestion
   */
  tableData: any;

  /**
   * arrow mat-icon code
   */
    arrowIcon = 'chevron-left';

    widthOfSchemaNav = 260;
    boxPosition: { left: number, top: number };
    public mousePosition: { x: number, y: number };
    public status: SchemaNavGrab = SchemaNavGrab.OFF;
    @ViewChild('navscroll')navscroll:ElementRef;
    @ViewChild('listingContainer')listingContainer:ElementRef;

  /**
   * Store info about views ..
   * if has correction loaded then value should be correction
   */
  viewOf: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  displayedColumns: BehaviorSubject<string[]> = new BehaviorSubject(this.startColumns);

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);

  /**
   * Hold logedin user details
   */
  userDetails: Userdetails;

  /**
   * Store active noun code
   */
  activeNounCode: string;

  /**
   * Store active mode code
   */
  activeModeCode: string;

  /**
   * Store all pre loaded table format data ..
   */
  loadedTableTransData: any;

  /**
   * Store info about last loaded object number
   */
  isLoadMoreEnabled: boolean;

  /**
   * Data table container scroll end
   */
  scrollLimitReached = false;

  /**
   * data table search input
   */
  @ViewChild('tableSearchInput') tableSearchInput: SearchInputComponent;

  /**
   * Inline data table search text
   */
  tableSearchString = '';

  /**
   * data table search input subject
   */
  tableSearchSubject: Subject<string> = new Subject();

  TableActionViewType = TableActionViewType;

  tableActionsList: SchemaTableAction[] = [
    { actionText: 'Approve', isPrimaryAction: true, isCustomAction: false, actionViewType: TableActionViewType.ICON_TEXT },
    { actionText: 'Reject', isPrimaryAction: true, isCustomAction: false, actionViewType: TableActionViewType.ICON_TEXT }
  ] as SchemaTableAction[];

  @Input()
  isInRunning: boolean;

  /**
   * Variant name if have otherwise by default is entire dataset...
   */
  variantName = 'Entire dataset';

  /**
   * holds module info
   */
   moduleInfo: ModuleInfo;

   /**
    * Hold the breadcurmb information ...
    */
   innerBreadcurmbtxt = '';

   /**
    * Column header with metada for MRO_CLS_MASTER_CHECK
    */
   colsAndMetadata: ClassificationHeader[] = [];

   /**
    * Search noun modifier form control
    */
   searchNounNavCtrl: FormControl = new FormControl();

  constructor(
    private schemaDetailService: SchemaDetailsService,
    private schemaService: SchemaService,
    private schemaListService: SchemalistService,
    private schemavariantService: SchemaVariantService,
    private sharedServices: SharedServiceService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private snackBar: MatSnackBar,
    private globalDialogService: GlobaldialogService,
    private userService: UserService
  ) { }


  ngOnDestroy(): void {
    this.subsribers.forEach(sub=>{
      sub.unsubscribe();
    });
    this.displayedColumns.complete();
    this.displayedColumns.unsubscribe();
    this.viewOf.complete();
    this.viewOf.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    let refresh = false;
    if(changes && changes.isInRunning && changes.isInRunning.currentValue !== changes.isInRunning.previousValue) {
      this.isInRunning = changes.isInRunning.currentValue;
      refresh = true;
    }

    if (changes && changes.moduleId && changes.moduleId.previousValue !== changes.moduleId.currentValue) {
      this.moduleId = changes.moduleId.currentValue;
      refresh = true;
    }

    if (changes && changes.variantId && changes.variantId.currentValue !== changes.variantId.previousValue) {
      this.variantId = changes.variantId.currentValue;
      refresh = true;
    }

    if (changes && changes.schemaId && changes.schemaId.currentValue !== changes.schemaId.previousValue) {
      this.schemaId = changes.schemaId.currentValue;
      refresh = true;
    }

    if (refresh) {
      this.getFldMetadata();
    }

    const datascopeObervable = this.getDataScope();
    forkJoin({getDatascope: datascopeObervable}).pipe(debounceTime(300)).subscribe((res) => {
      if (res) {
        this.getSchemaDetails();
      }
    });

    if(!this.isInRunning && refresh) {
      this.getSchemaStatics();
      this.getSchemaTableActions();
      // this.getFieldsByUserView();
    }
  }

  ngOnInit(): void {
  if(!this.isInRunning) {
    this.sharedServices.getDataScope().subscribe(res => {
      if (res) {
        this.getDataScope(res);
      }
    })
  }

    const definedColumnOrder = Object.keys(definedColumnsMetadata);
    const previousCls = this.displayedColumns.getValue();
    definedColumnOrder.forEach(e => previousCls.push(e));
    this.displayedColumns.next(previousCls);

    this.viewOf.subscribe(res=>{
      if(res !== null) {
        this.activeTab = res;
        const columns = this.displayedColumns.getValue();
        if(res === 'correction' && columns.indexOf('row_action') === -1) {
          columns.splice(2,0,'row_action');
          this.displayedColumns.next(columns);
          this.dataSource = new MatTableDataSource<any>([]);
        } else if(!res && columns.indexOf('row_action') !== -1) {
          columns.splice(columns.indexOf('row_action'),1);
          this.displayedColumns.next(columns);
        }
        this.getClassificationNounMod(this.searchNounNavCtrl.value);



      }
    });

    this.userService.getUserDetails().subscribe(res=>{
      this.userDetails = res;
    }, err=> console.error(`Error ${err.message}`));


    this.tableSearchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => {
        this.filterTableData(value);
    });

    /**
     * Get the module information
     */
    this.getModuleInfo(this.moduleId);

    /**
     * After saved mappings reload the left panel ...
     */
     this.sharedServices.getAfterMappingSaved().subscribe(res=>{
       if(res) {
        this.getClassificationNounMod(this.searchNounNavCtrl.value);
        this.getSchemaStatics();
       }
     },err=> console.error(`Error : ${err.message}`));


     this.searchNounNavCtrl.valueChanges.pipe(distinctUntilChanged(), debounceTime(300)).subscribe(va=>{
      this.getClassificationNounMod(va, true);
     });
  }

  ngAfterViewInit(){
    // this.enableResize();
  }
  /**
   * Get all fld metada based on module of schema
   */
  getFldMetadata() {
    if (this.moduleId === undefined || this.moduleId.trim() === '') {
      throw new Error('Module id cant be null or empty');
    }
    const sub = this.schemaDetailService.getMetadataFields(this.moduleId).subscribe(response => {
      this.metadata.next(response);
    }, error => {
      console.error(`Error : ${error.message}`);
    });
    this.subsribers.push(sub);
  }

  /**
   * Call service for get schema statics based on schemaId and latest run
   */
  getSchemaStatics() {
    const sub = this.schemaService.getSchemaThresholdStatics(this.schemaId, this.variantId).subscribe(res => {
      this.statics = res;
    }, error => {
      console.error(`Error : ${error}`);
    });
    this.subsribers.push(sub);
  }

  /**
   * Get all user selected fields based on default view ..
   */
  getFieldsByUserView() {
    const sub = this.schemaDetailService.getAllSelectedFields(this.schemaId, this.variantId ? this.variantId : '0').subscribe(res => {
      this.selectedFieldsOb.next(res ? res : [])
    }, error => console.error(`Error : ${error}`));
    this.subsribers.push(sub);
  }

  /**
   * Get schema info ..
   */
  getSchemaDetails() {
    const sub = this.schemaListService.getSchemaDetailsBySchemaId(this.schemaId).subscribe(res => {
      this.schemaInfo = res;
      if (this.schemaInfo.variantId) {
        this.variantChange(this.schemaInfo.variantId);
      }
      this.getClassificationNounMod(this.searchNounNavCtrl.value);
    }, error => console.error(`Error : ${error.message}`));
    this.subsribers.push(sub);
  }

  /**
   * Get classification nouns and modifiers .
   */
  getClassificationNounMod(searchStrng?: string, skippedFstActive?: boolean) {
    const viewFor: string = this.viewOf.getValue();
    const sub = this.schemaDetailService.getClassificationNounMod(this.schemaId, this.schemaInfo.runId,viewFor, this.variantId, searchStrng).subscribe(res => {
      this.rulesNounMods = res;
      // skipe the next logic
      if(skippedFstActive) {
        return false;
      }
      if (this.rulesNounMods.MRO_CLS_MASTER_CHECK && this.rulesNounMods.MRO_CLS_MASTER_CHECK.info) {
        const fisrtNoun = this.rulesNounMods.MRO_CLS_MASTER_CHECK.info[0];
        this.innerBreadcurmbtxt = `Master library`;
        if(fisrtNoun) {
          const modifierCode = fisrtNoun.modifier[0] ? fisrtNoun.modifier[0].modCode : '';
          this.innerBreadcurmbtxt+= ` / ${fisrtNoun?.nounDesc}`;
          if (fisrtNoun.nounCode) {
            this.dataFrm = 'MRO_CLS_MASTER_CHECK';
            this.innerBreadcurmbtxt+= ` / ${fisrtNoun.modifier[0]?.modDesc ? fisrtNoun.modifier[0]?.modDesc : 'Unknown'}`;
            this.getColumnWithMetadata('MRO_CLS_MASTER_CHECK', fisrtNoun.nounCode, modifierCode);
          }
          else {
            this.activeNounCode = '';
            this.activeModeCode = '';
            this.dataFrm = '';
          }
        }
      }
    }, err => console.error(`Execption while fetching .. classification noun and mod. ${err.message}`));
    this.subsribers.push(sub);
  }

  /**
   * Get data scopes .. or variats
   */
  getDataScope(activeVariantId?: string) {
    const obsv = this.schemavariantService.getDataScope(this.schemaId, 'RUNFOR');
    const sub = obsv.subscribe(res => {
      this.dataScope = res;
      if(activeVariantId) {
        this.variantChange(activeVariantId);
      }
    }, err => console.error(`Exception : ${err.message}`));
    this.subsribers.push(sub);

    return obsv;
  }

  applyFilter(nounCode: string, modifierCode: string, brType: string, isSearchActive?: boolean, objectNumberAfter?: string,fromShowMore?: boolean) {

    this.dataFrm = brType;
    this.activeNounCode = nounCode; this.activeModeCode = modifierCode;

    if(!isSearchActive && this.tableSearchInput) {
      this.tableSearchString = '';
      this.tableSearchInput.clearSearch(true);
    }

    const sub = this.schemaDetailService.getClassificationData(this.schemaId, this.schemaInfo.runId, nounCode, modifierCode, brType,this.viewOf.getValue(), this.tableSearchString, objectNumberAfter ? objectNumberAfter : '').subscribe(res => {

      if(!fromShowMore) {
        this.selection.clear();
        this.tableData = res ? res : [];
        const r = Object.keys(res);
        this.isLoadMoreEnabled = r.length !==20 ? false : true;
        if(res && r.length >0) {
          this.tableData = res;
          const actualData = this.transformData(res, brType);
          this.loadedTableTransData = actualData;
          if(this.dataFrm === 'MRO_MANU_PRT_NUM_LOOKUP' || this.dataFrm === 'unmatched') {
            const columns = Object.keys(actualData[0]);
            const disPlayedCols = this.viewOf.getValue() === 'correction'?
                                  ['checkbox_select', 'assigned_bucket', 'row_action', 'OBJECTNUMBER', 'SHORT_DESC', 'MGROUP_DESC', 'NOUN_CODE', 'MODE_CODE', 'PARTNO'] :
                                  ['checkbox_select', 'assigned_bucket', 'OBJECTNUMBER', 'SHORT_DESC', 'MGROUP_DESC', 'NOUN_CODE', 'MODE_CODE', 'PARTNO'] ;
            columns.forEach(key => {
              if (disPlayedCols.indexOf(key) === -1 && key !== '__aditionalProp') {
                disPlayedCols.push(key);
              }
              definedColumnsMetadata[key] = actualData[0][key];
            });
            this.displayedColumns.next(disPlayedCols);
          }
          this.dataSource = new MatTableDataSource<any>(actualData);
        } else {
          this.dataSource = new MatTableDataSource<any>([]);
        }
      } else {
        const rows = Object.keys(res);
        rows.forEach(r=>{
          this.tableData[r] = res[r];
        });
        this.isLoadMoreEnabled = rows.length !==20 ? false : true;
        console.log(this.loadedTableTransData);
        const actualData = this.transformData(res, brType);
        this.loadedTableTransData.push(...actualData)
        this.dataSource = new MatTableDataSource<any>(this.loadedTableTransData);
      }
    }, err => console.error(`Exception while getting data : ${err.message}`));
    this.subsribers.push(sub);
    console.log(`nounCode : ${nounCode} and modifier ${modifierCode}`)
  }

  filterTableData(searchText) {
    if((this.activeNounCode &&  this.activeModeCode) || this.dataFrm) {
      this.tableSearchString = searchText || '';
      this.applyFilter(this.activeNounCode,this.activeModeCode, this.dataFrm, true);
    }
  }


  transformData(res: any, brType: string): any {
    const row = [];
    if (res) {
      console.log(res);
      Object.keys(res).forEach(objNr => {
        console.log(objNr);
        const columns = res[objNr][0];
        console.log(columns);
        const rowData: any = {};
        Object.keys(columns).forEach(col => {
          switch (col) {
            case 'OBJECTNUMBER':
              const ob = { fieldId: col, fieldDesc: { fieldId: col, fieldDesc: definedColumnsMetadata[col].fieldDesc,fieldValue: ''}.fieldDesc,fieldValue: ''};
              ob.fieldValue = objNr ? objNr : '';
              rowData.OBJECTNUMBER = ob;
              break;

            // case 'LONG_DESC':
            //   const longDesc = { fieldId: col, fieldDesc: definedColumnsMetadata[col].fieldDesc,fieldValue: ''};
            //   longDesc.fieldValue = columns[col] ? columns[col] : '';
            //   rowData.LONG_DESC = longDesc;
            //   break;

            // case 'MANUFACTURER':
            //   const manufacturer = { fieldId: col, fieldDesc: { fieldId: col, fieldDesc: definedColumnsMetadata[col].fieldDesc,fieldValue: ''}.fieldDesc,fieldValue: ''};
            //   manufacturer.fieldValue = columns[col] ? columns[col] : '';
            //   rowData.MANUFACTURER = manufacturer;
            //   break;

            case 'MGROUP':
              const mggroup = { fieldId: col, fieldDesc: 'Material group id',fieldValue: ''};
              mggroup.fieldValue = columns[col] ? columns[col] : '';
              rowData.MGROUP = mggroup;
              break;

            case 'MGROUP_DESC':
              const mggroupDesc = { fieldId: col, fieldDesc: definedColumnsMetadata[col].fieldDesc,fieldValue: ''};
              mggroupDesc.fieldValue = columns[col] ? columns[col] : '';
              rowData.MGROUP_DESC = mggroupDesc;
              break;

            case 'MODE_CODE':
              const modeCode = { fieldId: col, fieldDesc: definedColumnsMetadata[col].fieldDesc,fieldValue: '', isEditable: true};
              modeCode.fieldValue = columns[col] ? columns[col] : '';
              rowData.MODE_CODE = modeCode;
              break;

            // case 'MOD_LONG':
            //   const modLong = { fieldId: col, fieldDesc: definedColumnsMetadata[col].fieldDesc,fieldValue: ''};
            //   modLong.fieldValue = columns[col] ? columns[col] : '';
            //   rowData.MOD_LONG = modLong;
            //   break;


            // case 'MRO_STATUS':
            //   const mroStatus = { fieldId: col, fieldDesc: definedColumnsMetadata[col].fieldDesc,fieldValue: ''};
            //   mroStatus.fieldValue = columns[col] ? columns[col] : '';
            //   rowData.MRO_STATUS = mroStatus;
            //   break;


            // case 'MRO_LIBRARY':
            //   const mroLib = { fieldId: col, fieldDesc: definedColumnsMetadata[col].fieldDesc,fieldValue: ''};
            //   mroLib.fieldValue = columns[col] ? columns[col] : '';
            //   rowData.MRO_LIBRARY = mroLib;
            //   break;


            case 'NOUN_CODE':
              const nounCode = { fieldId: col, fieldDesc: definedColumnsMetadata[col].fieldDesc,fieldValue: '', isEditable: true};
              nounCode.fieldValue = columns[col] ? columns[col] : '';
              rowData.NOUN_CODE = nounCode;
              break;



            // case 'NOUN_ID':
            //   const nounId = { fieldId: col, fieldDesc: definedColumnsMetadata[col].fieldDesc,fieldValue: ''};
            //   nounId.fieldValue = columns[col] ? columns[col] : '';
            //   rowData.NOUN_ID = nounId;
            //   break;



            // case 'NOUN_LONG':
            //   const nounLong = { fieldId: col, fieldDesc: definedColumnsMetadata[col].fieldDesc,fieldValue: ''};
            //   nounLong.fieldValue = columns[col] ? columns[col] : '';
            //   rowData.NOUN_LONG = nounLong;
            //   break;


            case 'PARTNO':
              const partNo = { fieldId: col, fieldDesc: definedColumnsMetadata[col].fieldDesc,fieldValue: ''};
              partNo.fieldValue = columns[col] ? columns[col] : '';
              rowData.PARTNO = partNo;
              break;


            case 'SHORT_DESC':
              const shortDesc = { fieldId: col, fieldDesc: definedColumnsMetadata[col].fieldDesc,fieldValue: ''};
              shortDesc.fieldValue = columns[col] ? columns[col] : '';
              rowData.SHORT_DESC = shortDesc;
              break;



            // case 'UNSPSC':
            //   const unspsc = { fieldId: col, fieldDesc: definedColumnsMetadata[col].fieldDesc,fieldValue: ''};
            //   unspsc.fieldValue = columns[col] ? columns[col] : '';
            //   rowData.UNSPSC = unspsc;
            //   break;



            // case 'UNSPSC_DESC':
            //   const unspscDesc = { fieldId: col, fieldDesc: definedColumnsMetadata[col].fieldDesc,fieldValue: ''};
            //   unspscDesc.fieldValue = columns[col] ? columns[col] : '';
            //   rowData.UNSPSC_DESC = unspscDesc;
            //   break;


            case '__aditionalProp':
              const aditionalProp = columns[col];
              rowData.__aditionalProp = {isReviewed : aditionalProp.isReviewed ? aditionalProp.isReviewed : false, isSubmitted: aditionalProp.isSubmitted ? aditionalProp.isSubmitted : false, hasLatestDescGenerated : aditionalProp.hasLatestDescGenerated ? aditionalProp.hasLatestDescGenerated : false};
              break;


            case 'ATTRIBUTES':
              const attributest = columns[col] ? columns[col] : [];
              if(this.dataFrm === 'MRO_CLS_MASTER_CHECK') {
                this.colsAndMetadata.forEach(c=>{
                  if(!rowData[c.colId]) {
                    const attrFrmRow = attributest.find(f => f.ATTR_CODE === c.colId);
                    const attrVal = attrFrmRow && attrFrmRow.ATTRIBUTES_VALUES ? attrFrmRow.ATTRIBUTES_VALUES : [];
                    let attrValue = '';
                    if (attrVal[0]) {
                      attrValue = attrVal[0].SHORT_VALUE;
                    }
                    rowData[c.colId] = { fieldId: c.colId, fieldDesc: c.desc, fieldValue: attrValue,
                      isEditable: true, fieldType: c.fieldType ,length: c.length , order: c.order, dropdown: c.dropdown, descActive: c.descActive , mandatory: c.mandatory };
                  }
                });
              } else {
                attributest.forEach(att => {
                  const attrCode = att.ATTR_CODE;
                  const attrDesc = att.ATTR_DESC;
                  const attrVal = att.ATTRIBUTES_VALUES ? att.ATTRIBUTES_VALUES : [];
                  let attrValue = '';
                  if (attrVal[0]) {
                    attrValue = attrVal[0].SHORT_VALUE;
                  }

                  rowData[attrCode] = { fieldId: attrCode, fieldDesc: attrDesc, fieldValue: attrValue, isEditable: true };
                });
              }
              break;


          }

        });
        row.push(rowData);
      });


    }
    return row;
  }



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

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }



  /**
   *
   * @param fldid editable field id
   * @param row entire row should be here
   */
  editCurrentCell(fldid: string, row: any, rIndex: number,containerRef: ContainerRefDirective) {
    if(this.dataFrm === 'MRO_MANU_PRT_NUM_LOOKUP') {
      console.log(`Sorry can't edit the Connekthub lib. records ... `);
      return false;
    }
    const objNr = row.OBJECTNUMBER ? row.OBJECTNUMBER.fieldValue : '';

    const selcFldCtrl = row[fldid] ? row[fldid].isEditable : null;
    if(selcFldCtrl === null || !selcFldCtrl) {
      console.log(`Can\'t edit not editable `);
      return false;
    }

    if(document.getElementById('inpctrl_'+fldid + '_' + rIndex)) {
      const inpCtrl = document.getElementById('inpctrl_'+fldid + '_'+ rIndex) as HTMLDivElement;
      const viewCtrl = document.getElementById('viewctrl_'+fldid + '_' + rIndex) as HTMLSpanElement;
      // const inpValCtrl = document.getElementById('inp_'+ fldid + '_' + rIndex) as HTMLInputElement;

      inpCtrl.style.display = 'block';
      // inpValCtrl.focus();
      viewCtrl.style.display = 'none';

      const nounCode = row.NOUN_CODE ? row.NOUN_CODE.fieldValue : '';
      const modCode = row.MODE_CODE ? row.MODE_CODE.fieldValue : '';

      // add a dynamic cell input component
      this.addDynamicInput(fldid, row, rIndex,objNr,containerRef, nounCode, modCode);

    }
  }

  /**
   * After value change on & also call service for do correction
   * @param fldid fieldid that have blur triggered
   * @param value current changed value
   * @param row row data ..
   */
  emitEditBlurChng(fldid: string, value: any, row: any, rIndex: number,celldataFor: CellDataFor, viewContainerRef? : ViewContainerRef) {

    if(document.getElementById('inpctrl_'+fldid + '_' + rIndex)) {

      // DOM control after value change ...
      const inpCtrl = document.getElementById('inpctrl_'+fldid + '_'+ rIndex) as HTMLDivElement;
      const viewCtrl = document.getElementById('viewctrl_'+fldid + '_' + rIndex) as HTMLSpanElement;

      // DO correction call for data
      const objctNumber = row.OBJECTNUMBER.fieldValue;

      const nounCode = row.NOUN_CODE.fieldValue ? row.NOUN_CODE.fieldValue : '';
      const modeCode = row.MODE_CODE.fieldValue ? row.MODE_CODE.fieldValue : '';

      const oldVal = row[fldid] ? row[fldid].fieldValue : '';

      // clear the dynamic cell input component
      viewContainerRef.clear();
      inpCtrl.style.display = 'none';
      viewCtrl.style.display = 'block';

      if(fldid === 'NOUN_CODE' && !value) {
        console.log(`Noun code can't be null`);
        return false;
      }

      if(objctNumber && oldVal !== value) {
        const correctionReq: SchemaMROCorrectionReq = {id: objctNumber,masterLibrary: ((this.dataFrm === 'MRO_CLS_MASTER_CHECK' || this.dataFrm === 'unmatched') ? true : false)} as SchemaMROCorrectionReq;
        if(fldid === 'NOUN_CODE') {
          correctionReq.nounCodeoc = oldVal;
          correctionReq.nounCodevc = value;
        } else if(fldid === 'MODE_CODE') {
          correctionReq.nounCodevc = nounCode;
          correctionReq.modCodeoc = oldVal;
          correctionReq.modCodevc = value;
        } else {
          correctionReq.nounCodevc = nounCode;
          correctionReq.modCodevc = modeCode;
          correctionReq.attributeCorReq = [{
            attributeCodeoc:fldid,
            attributeCodevc:fldid,
            attributeValoc:oldVal,
            attributeValvc: value
          } as AttributeCoorectionReq];
        }

        // for unmatched send flag to swap
        if(this.dataFrm === 'unmatched') {
          correctionReq.fromUnmatch = true;
        }

        this.schemaDetailService.doCorrectionForClassification(this.schemaId, fldid, correctionReq).subscribe(res=>{

          viewCtrl.innerText = value;
          row[fldid].fieldValue = value;
          if(res.acknowledge) {
            this.schemaInfo.correctionValue = res.count ? res.count : this.schemaInfo.correctionValue;

            // update the api call for mapped data
            if(fldid === 'NOUN_CODE' || fldid === 'MODE_CODE') {
              // refresh the tree
              this.getClassificationNounMod('',true);
              this.searchNounNavCtrl.setValue('');
              // refresh the table
              if(this.dataFrm === 'unmatched') {
                this.applyFilter('', '', 'unmatched');
              } else {
                this.applyFilter(this.activeNounCode, this.activeModeCode, this.dataFrm);
              }

            } else if(this.activeTab ==='correction'){
              this.applyFilter(this.activeNounCode, this.activeModeCode, this.dataFrm);
            }

          }
        }, error=>{
          viewCtrl.innerText = oldVal;
          this.snackBar.open(`${error.error ? error.error.err_msg : 'Something went wrong'}`, 'Close',{duration:2000});
          console.error(`Error :: ${error.error}`);
        });
      } else {
        viewCtrl.innerText = oldVal;
        console.error(`Wrong with object number or can't change if old and new same  ... `);
      }
    }

  }

  addDynamicInput(fldid: string, row: any, rIndex: number,objectNumber: string, containerRef: ContainerRefDirective, nounCode?: string, modCode?: string){

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      ClassificationDatatableCellEditableComponent
    );


      let celldataFor = CellDataFor.LOCAL_NOUN;
      if(fldid === 'NOUN_CODE' && this.dataFrm === 'MRO_CLS_MASTER_CHECK') {
        celldataFor = CellDataFor.LOCAL_NOUN;
      } else if(fldid === 'MODE_CODE' && this.dataFrm === 'MRO_CLS_MASTER_CHECK') {
        celldataFor = CellDataFor.LOCAL_MODIFIER;
      } else if(fldid === 'ATTR_CODE' && this.dataFrm === 'MRO_CLS_MASTER_CHECK') {
        celldataFor = CellDataFor.LOCAL_ATTRIBUTE;
      } else if(fldid === 'NOUN_CODE' && this.dataFrm === 'MRO_MANU_PRT_NUM_LOOKUP') {
        celldataFor = CellDataFor.GSN_NOUN;
      } else if(fldid === 'MODE_CODE' && this.dataFrm === 'MRO_MANU_PRT_NUM_LOOKUP') {
        celldataFor = CellDataFor.GSN_MODIFIER;
      } else if(fldid === 'ATTR_CODE' && this.dataFrm === 'MRO_MANU_PRT_NUM_LOOKUP') {
        celldataFor = CellDataFor.GSN_ATTRIBUTE;
      }

    let isDropdown = false;
    // check whether the editable is dropdown or normal value
    const hasFld = this.colsAndMetadata.find(f => f.colId === fldid);
    if(hasFld && hasFld.dropdown) {
      isDropdown = true;
    }

    const val: string = row[fldid] ? row[fldid].fieldValue : '';

    // add the input component to the cell
    const componentRef = containerRef.viewContainerRef.createComponent(componentFactory);
    // binding dynamic component inputs/outputs
    componentRef.instance.fieldId = fldid;
    componentRef.instance.cellDataFor = celldataFor;
    componentRef.instance.schemaId = this.schemaId;
    componentRef.instance.rundId = this.schemaInfo.runId;
    componentRef.instance.objectNumber = objectNumber;
    componentRef.instance.nounCode = nounCode;
    componentRef.instance.modCode = modCode;
    componentRef.instance.brType = this.dataFrm;
    componentRef.instance.attrControl = hasFld;
    componentRef.instance.matlgrp = row.MGROUP ? row.MGROUP.fieldValue : '';
    componentRef.instance.value = val;
    componentRef.instance.controlType = ['NOUN_CODE','MODE_CODE'].indexOf(fldid) !==-1 || isDropdown ? 'dropdown' : 'inputText';
    componentRef.instance.inputBlur.subscribe(value => this.emitEditBlurChng(fldid, value, row, rIndex, celldataFor, containerRef.viewContainerRef));

  }

  /**
   * Oen choose column side sheet ..
   */
  openTableColumnSettings() {
    const metadadata: MetadataModeleResponse = { headers: definedColumnsMetadata } as MetadataModeleResponse;
    const fields = this.displayedColumns.getValue();
    const array: string[] = [];
    fields.forEach(f => array.push(f));
    const data = { schemaId: this.schemaId, variantId: this.variantId, fields: metadadata, selectedFields: array }
    this.sharedServices.setChooseColumnData(data);
    this.router.navigate(['', { outlets: { sb: 'sb/schema/table-column-settings' } }], {queryParamsHandling: 'preserve'});
  }

  /**
   * Approve rec ...
   * @param row Row which are going to approve
   * @param rIndex row index
   */
  approveRec(row: any, rIndex: number, fromWhere?:string) {
    const objNrs: string[] = [];
    if(fromWhere === 'all') {
      const selectedDocs = this.selection.selected.filter(sel => !sel.__aditionalProp.isReviewed);
      const objs = selectedDocs.map(map => map.OBJECTNUMBER);
      objNrs.push(...objs.map(m=> m.fieldValue));
    } else {
      objNrs.push(row.OBJECTNUMBER ? row.OBJECTNUMBER.fieldValue : '');
    }
    if(!objNrs.length) {
      throw new Error(`Objectnumber is required`);
    }

    this.schemaDetailService.approveClassification(this.schemaId,this.schemaInfo.runId,objNrs).subscribe(res=>{
      /* if(document.getElementById('approveBtn_'+rIndex))
        document.getElementById('approveBtn_'+rIndex).remove(); */
        // if (fromWhere === 'all') {
        //   this.selection.selected.forEach(record => {
        //     record.__aditionalProp.isReviewed = true;
        //   })
        // } else {
        //   row.__aditionalProp.isReviewed = true;
        // }
        setTimeout(()=>{
          this.getClassificationNounMod(this.searchNounNavCtrl.value, true);
          this.applyFilter(this.activeNounCode, this.activeModeCode, this.dataFrm);
        }, 1000);
        this.selection.clear();
      this.snackBar.open(`Successfully approved`,'Close',{duration:5000});
    }, err=>{
      console.error(`Error ${err.message}`);
      this.snackBar.open(`${err.message}`,'Close',{duration:5000});
    });
  }

  /**
   * Reject mro classification records ..
   * @param row current row which are going to reject ..
   * @param rIndex row index ..
   */
  rejectRec(row: any, rIndex: number, fromWhere?: string) {
    const objNrs: string[] = [];
    if(fromWhere === 'all') {
      const selectedDocs = this.selection.selected.filter(sel => !sel.__aditionalProp.isReviewed);
      const objs = selectedDocs.map(map => map.OBJECTNUMBER);
      objNrs.push(...objs.map(m=> m.fieldValue));
    } else {
      objNrs.push(row.OBJECTNUMBER ? row.OBJECTNUMBER.fieldValue : '');
    }
    if(!objNrs.length) {
      throw new Error(`Objectnumber is required`);
    }
    // const nounCode = row.NOUN_CODE ? row.NOUN_CODE.fieldValue : '';
    // const modCode = row.MODE_CODE ? row.MODE_CODE.fieldValue : '';

    this.schemaDetailService.rejectClassification(this.schemaId,this.schemaInfo.runId,objNrs).subscribe(res=>{
      if(res) {
        setTimeout(()=>{
          this.getClassificationNounMod(this.searchNounNavCtrl.value, true);
          this.applyFilter(this.activeNounCode, this.activeModeCode, this.dataFrm);
        },1000);
        this.schemaInfo.correctionValue = res.count;
      }
      this.snackBar.open(`Rejected successfully `,'Close',{duration:5000});
    }, err=>{
      console.error(`Error ${err.message}`);
      this.snackBar.open(`${err.message}`,'Close',{duration:5000});
    });
  }

  /**
   * Generate mro description ...
   * @param row current row selected ...
   * @param rIndex row index ...
   * @param fromWhere from whare ...
   */
  generateDesc(row: any, rIndex: number, fromWhere?: string) {
    console.log(row);
    const objNrs: string[] = [];
    if(fromWhere === 'all') {
      const selectedDocs = this.selection.selected;
      const objs = selectedDocs.map(map => map.OBJECTNUMBER);
      objNrs.push(...objs.map(m=> m.fieldValue));
    } else {
      objNrs.push(row.OBJECTNUMBER ? row.OBJECTNUMBER.fieldValue : '');
    }
    if(!objNrs.length) {
      throw new Error(`Objectnumber is required`);
    }

    // validate the mandatory value ...
    const hasError = this._valid(row);
    if(hasError) {
      const dataSource = this.dataSource.data;
      const idx = dataSource.findIndex(d=> d.OBJECTNUMBER.fieldValue === objNrs[0]);
      if(idx !==-1) {
        // delete err_msg
        Object.keys(dataSource[idx]).forEach(k=>{
          delete dataSource[idx][k].err_msg;
        });

        Object.keys(hasError).forEach(key=>{
          dataSource[idx][key].err_msg = hasError[key];
        });
      }
      console.log(dataSource);
      return false;
    }

    this.schemaDetailService.generateMroClassificationDescription(this.schemaId, this.schemaInfo.runId, objNrs, this.dataFrm === 'MRO_CLS_MASTER_CHECK' ? true : false).subscribe(res=>{
      console.log(res);
      if(res)  {
        setTimeout(()=>{
          this.applyFilter(this.activeNounCode, this.activeModeCode, this.dataFrm);
        },1000);
      }
    }, err=>{
      console.error(`Error : ${err.message}`);
      this.snackBar.open(`Something went wrong `, 'Close', {duration:5000});
    });


    // generateMroClassificationDescription
  }


  onTableScroll(e) {
    console.log('colled');
    const tableViewHeight = e.target.offsetHeight // viewport: ~500px
    const tableScrollHeight = e.target.scrollHeight // length of all table
    const scrollLocation = e.target.scrollTop; // how far user scrolled

    // If the user has scrolled within 200px of the bottom, add more data
    const buffer = 200;
    const limit = tableScrollHeight - tableViewHeight - buffer;
    if ((scrollLocation > limit) && !this.scrollLimitReached) {
       console.log('Load more data here ...');
       this.scrollLimitReached = true;
       if(this.isLoadMoreEnabled) {
        const keys =  Object.keys(this.tableData);
        const objAfter = keys[keys.length -1] ? keys[keys.length -1] : '';
        this.applyFilter(this.activeNounCode, this.activeModeCode, this.dataFrm,true,objAfter,true);
       }
    } else {
      this.scrollLimitReached = false;
    }
  }

  getDownloadAbledataforMroExecution() {
    this.schemaDetailService.getDownloadAbledataforMroExecution(this.schemaId, this.schemaInfo.runId, this.activeNounCode, this.activeModeCode,
      this.dataFrm, this.viewOf.getValue(), this.tableSearchString).subscribe(res=>{
        console.log(res);
        const actualData = this.transformData(res, this.dataFrm);
        console.log(actualData);
        const exportAbleData = [];

        const actualColumnsOrde = this.displayedColumns.getValue();
        const applicableFlds = []; actualColumnsOrde.forEach(f=> applicableFlds.push(f));
        applicableFlds.splice(0, actualColumnsOrde.indexOf('OBJECTNUMBER'));
        actualData.forEach(dd=>{
          const rowData = {};
          applicableFlds.forEach(or=>{
            rowData[definedColumnsMetadata[or] ?  definedColumnsMetadata[or].fieldDesc : or] =  dd[or] && dd[or].fieldValue ? `${dd[or].fieldValue}` : '';
          });
          exportAbleData.push(rowData);
        });
        try {
          const wb = XLSX.utils.book_new()
          const ws = XLSX.utils.json_to_sheet(exportAbleData);
          XLSX.utils.book_append_sheet(wb, ws, 'Data')
          XLSX.writeFile(wb, 'mro - execution data.csv')
        } catch (e) { }


      }, err=>{
        console.error(`Error : ${err}`);
        this.snackBar.open(`Something went wrong `, 'Close', {duration:5000});
      });
  }


  columnName(columnId): string {
    if(this.dataFrm === 'MRO_CLS_MASTER_CHECK') {
      const obj = this.colsAndMetadata.find(f=> f.colId === columnId);
      return obj && obj.desc ? obj.desc : columnId;
    } else {
      return definedColumnsMetadata[columnId] ? definedColumnsMetadata[columnId].fieldDesc : columnId;
    }
  }

  /**
   * Function to open data scope side sheet
   */
  openDataScopeSideSheet() {
    this.router.navigate([{ outlets: { sb: `sb/schema/data-scope/${this.moduleId}/${this.schemaId}/new/sb` } }], {queryParamsHandling: 'preserve'})
  }

  /**
   * Function to open summary side sheet of schema
   */
  openSummarySideSheet() {
    this.router.navigate([{ outlets: { sb: `sb/schema/check-data/${this.moduleId}/${this.schemaId}` } }], {queryParamsHandling: 'preserve'})
  }

  /**
   * open attribute mapping side sheet
   */
  openAttributeMapping(nounCode: string, modCode: string, isMapped = false) {
    this.router.navigate(['', { outlets: { sb: `sb/schema/attribute-mapping/${this.moduleId}/${this.schemaId}/${nounCode}/${modCode}` } }], {
      queryParams: {
        isMapped
      }
    })
  }

  /**
   * Function to open trend execution side sheet
   */
  openExecutionTrendSideSheet() {
    this.router.navigate(['', { outlets: { sb: `sb/schema/execution-trend/${this.moduleId}/${this.schemaId}/${this.variantId}` } }], {queryParamsHandling: 'preserve'})
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

  // getActionIcon(actionText) {
  //   if (actionText === 'Approve') {
  //     return 'check-mark';
  //   } else if (actionText === 'Reject') {
  //     return 'declined';
  //   } else if (actionText === 'Delete') {
  //     return 'recycle-bin';
  //   }

  //   return '';
  // }

  doAction(action: SchemaTableAction, row, rowIndex) {
    console.log('Action selected ', action);
    if (!action.isCustomAction && action.actionText === 'Approve' && (this.isReviewer || this.isApprover)) {
      this.approveRec(row, rowIndex);
    } else if (!action.isCustomAction && action.actionText === 'Reject' && (this.isReviewer || this.isApprover)) {
      this.rejectRec(row, rowIndex);
    }
  }

  variantChange(variantId) {
    if (this.variantId !== variantId) {
      this.variantId = variantId;
      this.variantName = this.variantId === '0' ? 'Entire dataset'
        : this.dataScope.find(v => v.variantId === this.variantId).variantName;

      this.getSchemaStatics();
      this.viewOf.next('');

    }
  }

  get isGlobalActionsEnabled() {
    return this.selection.selected.some(row => !row.__aditionalProp.isReviewed);
  }

  toggleSideBar() {
    if (this.arrowIcon === 'chevron-left') {
      this.arrowIcon = 'chevron-right';
      this.widthOfSchemaNav=0;

    }
    else {
      this.arrowIcon = 'chevron-left';
      this.widthOfSchemaNav=246;
    }
  }

  // @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent){
    this.mousePosition = { x: event.clientX, y: event.clientY };
    if (this.status === SchemaNavGrab.RESIZE) {
      this.resize();
      this.navscroll.nativeElement.style.cursor = 'col-resize';
    }
    else {
      this.navscroll.nativeElement.style.cursor = 'default';
    }
  }

  public setNavDivPositions() {
    const { left, top } = this.navscroll.nativeElement.getBoundingClientRect();
    this.boxPosition = { left, top };
  }

  public resize() {
    const maxWidth=this.listingContainer.nativeElement.clientWidth/3;
    this.widthOfSchemaNav = Number(this.mousePosition.x > this.boxPosition.left) ?
      Number(this.mousePosition.x - this.boxPosition.left < maxWidth) ?
        this.mousePosition.x - this.boxPosition.left : maxWidth : 0;
        this.widthOfSchemaNav<30 ? this.arrowIcon='chevron-right': this.arrowIcon='chevron-left';
  }

  public setStatus(event: MouseEvent, status: number) {
    if (status === 1) event.stopPropagation();
    else this.setNavDivPositions();
    this.status = status;
  }

  public enableResize(){
    const grabberElement = document.createElement('div');
    grabberElement.style.height = '100%';
    grabberElement.style.width = '2px';
    grabberElement.style.backgroundColor = '#ffffff';
    grabberElement.style.position = 'absolute';
    grabberElement.style.cursor = 'col-resize';
    grabberElement.style.resize = 'horizontal';
    grabberElement.style.overflow = 'auto';
    grabberElement.style.right = '0%';
    this.navscroll.nativeElement.appendChild(grabberElement);

  }

  /**
   * get module info based on module id
   * @param id module id
   */
   getModuleInfo(id) {
    this.schemaService.getModuleInfoByModuleId(id).subscribe(res => {
      if (res && res.length) {
        this.moduleInfo = res[0];
      }
    }, error => {
      console.log(`Error:: ${error.message}`)
    });
  }

  /**
   * Get the dynamic columns based on selected nounCode & modifierCode
   * @param ruleType the rule type generally the MRO_CLS_MASTER_CHECK
   * @param nounCode the selected noun code
   * @param modCode the selected modifier code
   */
  getColumnWithMetadata(ruleType: string, nounCode: string, modCode: string) {
    this.schemaDetailService.getClassificationDatatableColumns(this.schemaId,ruleType,nounCode, modCode).subscribe(cols=>{
      this.colsAndMetadata = cols ? cols : [];

      // refresh columns
      const disPlayedCols = this.viewOf.getValue() === 'correction'? ['checkbox_select', 'assigned_bucket', 'row_action', 'OBJECTNUMBER'] : ['checkbox_select', 'assigned_bucket', 'OBJECTNUMBER'] ;
      this.colsAndMetadata.sort((c1,c2)=> c1.order - c2.order);
      disPlayedCols.push(...this.colsAndMetadata.map(m => m.colId));
      this.displayedColumns.next(disPlayedCols);

      // get data
      this.applyFilter(nounCode, modCode, 'MRO_CLS_MASTER_CHECK');

    },err => console.error(`Error : ${err.message}`));
  }

  /**
   * Check whether column is mandatory or not
   * @param colId mostily the atrribute
   * @returns If the column is mandatory then return true otherwise false
   */
  isMandatory(colId: string): boolean {
    const hasKey = this.colsAndMetadata.find(f=> f.colId === colId);
    return hasKey && hasKey.mandatory ? true : false;
  }

  /**
   * Validate the row before sending for generate desc
   * @param row current row
   */
  _valid(row: any): any {
    const msgs = {};
    // check bor mandatory
    const allMandatory = this.colsAndMetadata.filter(f=> f.mandatory);
    allMandatory.forEach(m=>{
      if(row[m.colId] && !row[m.colId].fieldValue) {
        msgs[m.colId] = 'Please enter the value';
      }
    });

    // check for numeric
    const allNumeric = this.colsAndMetadata.filter(f=> f.fieldType === 'NUMERIC');
    allNumeric.forEach(f=>{
      if(row[f.colId] && !msgs[f.colId] && !row[f.colId].fieldValue.match('^[0-9]*$')) {
        msgs[f.colId] = 'Invalid type , Only numeric allowed';
      }
    });
    return Object.keys(msgs).length >0 ? msgs : null;
  }

  onRunCompleted($event) {
    this.isInRunning = false;
    this.runCompleted.emit($event);
  }

  isEditEnabled(fldid: string, row: any, rIndex: number) {
    const selectedFields = this.selectedFieldsOb.getValue() || [];
    const field = selectedFields.find(f => f.fieldId === fldid);
    if (field && !field.isEditable) {
      return false;
    }

    const el = document.getElementById('inpctrl_' + fldid + '_' + rIndex);

    if (el) {
      const inpCtrl = document.getElementById('inpctrl_' + fldid + '_' + rIndex) as HTMLDivElement;
      if (inpCtrl.style.display === 'block') {
        return true;
      }
    }

    return false;
  }
}

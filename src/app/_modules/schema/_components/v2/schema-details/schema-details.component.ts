import { Component, OnInit, AfterViewInit, ViewChild, ComponentFactoryResolver, ViewContainerRef, Input, OnChanges, SimpleChanges, OnDestroy, ElementRef, Output, EventEmitter } from '@angular/core';
import { MetadataModeleResponse, RequestForSchemaDetailsWithBr, SchemaCorrectionReq, FilterCriteria, FieldInputType, SchemaTableViewFldMap, SchemaTableAction, TableActionViewType, SchemaTableViewRequest, STANDARD_TABLE_ACTIONS } from '@models/schema/schemadetailstable';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, forkJoin, Subject, Subscription } from 'rxjs';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { SchemaDataSource } from '../../schema-details/schema-datatable/schema-data-source';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { SchemaService } from '@services/home/schema.service';
import { SchemaStaticThresholdRes, LoadDropValueReq, SchemaListDetails, SchemaVariantsModel, SchemaNavGrab, ModuleInfo } from '@models/schema/schemalist';
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
import { debounceTime, distinctUntilChanged, filter, skip, take } from 'rxjs/operators';
import { TransientService } from 'mdo-ui-library';
import { SchemaExecutionNodeType, SchemaExecutionTree } from '@models/schema/schema-execution';
import { DownloadExecutionDataComponent } from '../download-execution-data/download-execution-data.component';

@Component({
  selector: 'pros-schema-details',
  templateUrl: './schema-details.component.html',
  styleUrls: ['./schema-details.component.scss']
})
export class SchemaDetailsComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

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
   * Selected Variant total count
   */
  variantTotalCnt = 0;

  /**
   * doc count for entire dataset
   */
  totalVariantsCnt = 0;

  /**
   * Hold all metada control for header , hierarchy and grid fields ..
   */
  metadata: BehaviorSubject<MetadataModeleResponse> = new BehaviorSubject<MetadataModeleResponse>(null);

  /**
   * Store info about user selected field and order
   */
  selectedFieldsOb: Subject<boolean> = new Subject();
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
  startColumns = ['_assigned_buckets', '_score_weightage', '_row_actions', 'OBJECTNUMBER'];

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

  @ViewChild('navscroll')navscroll:ElementRef;
  @ViewChild('listingContainer')listingContainer:ElementRef;

  FIELD_TYPE = FieldInputType;

  selectFieldOptions: DropDownValue[] = [];

  /**
   * Emit event to details builder component when schema running is completed
   */
  @Output() runCompleted = new EventEmitter();

  /**
   * Hold info about current user
   */
  userDetails: Userdetails;

  /**
   * arrow mat-icon code
   */
  arrowIcon = 'chevron-left';

  /**
   * hold scroll limit reached edge
   */
  scrollLimitReached = false;
  TableActionViewType = TableActionViewType;

  tableActionsList: SchemaTableAction[] = [
    { actionText: 'Approve', isPrimaryAction: true, isCustomAction: false, actionViewType: TableActionViewType.ICON_TEXT, actionCode: STANDARD_TABLE_ACTIONS.APPROVE, actionIconLigature: 'check' },
    { actionText: 'Reject', isPrimaryAction: true, isCustomAction: false, actionViewType: TableActionViewType.ICON_TEXT, actionCode: STANDARD_TABLE_ACTIONS.REJECT, actionIconLigature: 'ban' }
  ] as SchemaTableAction[];

  /**
   * To hold running value of schema
   */
  @Input()
  isInRunning: boolean;

  inlineSearchSubject: Subject<string> = new Subject();

  widthOfSchemaNav = 236;
  boxPosition: { left: number, top: number };
  public mousePosition: { x: number, y: number };
  public status: SchemaNavGrab = SchemaNavGrab.OFF;

  /**
   * All subscription should be in this variable ..
   */
  subscribers: Subscription[] = [];

  activeNode: SchemaExecutionTree = new SchemaExecutionTree();

  // holds execution tree details of schema...
  executionTreeHierarchy: SchemaExecutionTree;

  /**
   * holds file upload progress screen show/hide status
   */
  isFileUploading: boolean;

  /**
   * holds module info
   */
  moduleInfo: ModuleInfo;

  /**
   * All selected columns , header , hierrachy or grid as a key and string [] as a columns
   */
  columns: any = {};

  /**
   * Selected node id ....
   */
  nodeId = 'header';

  /**
   * Selected node type ...
   */
  nodeType = 'HEADER';

  /**
   * flag to enable/disable resizeable
   */
   grab = false;

   isRefresh = false;

   executionTreeObs: Subject<SchemaExecutionTree> = new Subject();

  constructor(
    public activatedRouter: ActivatedRoute,
    private schemaDetailService: SchemaDetailsService,
    private router: Router,
    private sharedServices: SharedServiceService,
    private schemaService: SchemaService,
    private endpointservice: EndpointsClassicService,
    private matDialog: MatDialog,
    private schemaListService: SchemalistService,
    private schemaVariantService: SchemaVariantService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private userService: UserService,
    private schemaDetailsService: SchemaDetailsService,
    private transientService: TransientService
  ) { }

  ngOnDestroy(): void {
    this.subscribers.forEach(s=>{
      s.unsubscribe();
    });
  }


  ngOnChanges(changes: SimpleChanges): void {
    // check if any things is change then refresh again
    this.isRefresh = false;

    if (changes && changes.moduleId && changes.moduleId.currentValue !== changes.moduleId.previousValue) {
      this.moduleId = changes.moduleId.currentValue;
      this.isRefresh = true;
      this.getModuleInfo(this.moduleId);
      this.metadata.next(null);
    }

    if (changes && changes.schemaId && changes.schemaId.currentValue !== changes.schemaId.previousValue) {
      this.schemaId = changes.schemaId.currentValue;
      this.isRefresh = true;
    }

    if (changes && changes.variantId && changes.variantId.currentValue !== changes.variantId.previousValue) {
      this.variantId = changes.variantId.currentValue;
      this.isRefresh = true;
    }

    if(changes && changes.isInRunning && changes.isInRunning.currentValue !== changes.isInRunning.previousValue) {
      this.isInRunning = changes.isInRunning.currentValue;
      this.isRefresh = true;
    }

    const sub = this.getDataScope();
    forkJoin({getDataScope: sub}).subscribe((res) => {
      if (res) {
        this.getSchemaDetails();
      }
    });
    if (this.isRefresh && !this.isInRunning) {
      this.activeTab='error';
      this.getFldMetadata();
      this.dataSource = new SchemaDataSource(this.schemaDetailService, this.endpointservice, this.schemaId);
      this.getSchemaStatics();
      this.getSchemaTableActions();
      if (this.variantId !== '0') {
        this.getVariantDetails();
      } else {
        this.variantId = '0';
      }
      this.executionTreeObs = new Subject();
      if (this.userDetails && this.userDetails.userName) {
        this.getSchemaExecutionTree(this.userDetails.plantCode, this.userDetails.userName);
      } else {
        this.executionTreeHierarchy = new SchemaExecutionTree();
      }

      combineLatest([this.metadata, this.executionTreeObs]).pipe(
        filter(res => !!res[0] && !!res[1]),
        take(1)
      )
      .subscribe(res => {
          const params = this.activatedRouter.snapshot.queryParamMap;
          const nodeId = params.get('node') || 'header';
          const treeArray = this.getExectionArray(this.executionTreeHierarchy);
          this.activeNode = treeArray.find(n => n.nodeId === nodeId);
          this.selectedNodeChange(params);
      });
    }

    this.manageStaticColumns();
    // this.dataSource.brMetadata.subscribe(res => {
    //   if (res) {
      //   // this.getData();
      // }
    // });

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
        const order = res.direction;
        this.sortOrder = {};
        this.sortOrder[fldId] = order;
        this.getData(this.filterCriteria.getValue(), this.sortOrder);
      }
    });
    // this.setNavDivPositions();
    // this.enableResize();
  }

  ngOnInit(): void {
    this.activatedRouter.queryParamMap.subscribe(ar=>{
      if(!this.isRefresh) {
        const nodeId = ar.get('node') || 'header';
        if(nodeId !== this.nodeId) {
        this.selectedNodeChange(ar);
        }
      }
      this.isRefresh = false;
    });

    this.sharedServices.getDataScope().subscribe(res => {
      if (res) {
        this.getDataScope(res); // Get Data scope..
      }
    })

    /**
     * After choose columns get updated columns ..
     */
    this.sharedServices.getChooseColumnData().pipe(skip(1)).subscribe(result => {
      if (result && !result.editActive) {
        this.updateColumnBasedOnNodeSelection(this.nodeId, this.nodeType);
        this.getData(this.filterCriteria.getValue(), this.sortOrder);
        if (result.tableActionsList && result.tableActionsList.length) {
          this.tableActionsList = result.tableActionsList
        }
      }
    });

    /**
     * Combine obserable for metadata and selected field by user
     * And calcute display field and order
     */
    this.selectedFieldsOb.subscribe(updateTableView => {
        if(updateTableView) {
          const schemaTableViewRequest: SchemaTableViewRequest = new SchemaTableViewRequest();
          schemaTableViewRequest.schemaId = this.schemaId;
          schemaTableViewRequest.variantId = this.variantId ? this.variantId: '0';
          schemaTableViewRequest.schemaTableViewMapping = this.selectedFields;
          const sub =  this.schemaDetailsService.updateSchemaTableView(schemaTableViewRequest).subscribe(response => {
            console.log(response);
          }, error => {
            console.error('Exception while persist table view');
          });
          this.subscribers.push(sub);
        }
        this.calculateDisplayFields();
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

    const userDataSub = this.userService.getUserDetails().subscribe(res=>{
      this.userDetails  = res;
    }, err=> console.log(`Error ${err}`));

    const userDataForSchemaTree = this.userService.getUserDetails().pipe(
      filter(details => !!details && !!details.userName),
      distinctUntilChanged(),
      take(1)
      ).subscribe(res=>{
        this.getSchemaExecutionTree(res.plantCode, res.userName);
    }, err=> console.log(`Error ${err}`));

    this.subscribers.push(userDataForSchemaTree);
    this.subscribers.push(userDataSub);

    /**
     * inline search changes
     */
    this.inlineSearchSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(value => this.inlineSearch(value));

  }

  selectedNodeChange(params: ParamMap) {
      this.nodeId = params.get('node') || 'header';
      this.nodeType = params.get('node-level') || 'HEADER';
      this.updateColumnBasedOnNodeSelection(this.nodeId, this.nodeType);
      setTimeout(() => {
        this.getData(this.filterCriteria.getValue(), this.sortOrder);
      }, 300);
  }

  /**
   * Get schema info..
   */
  getSchemaDetails() {
   const sub =  this.schemaListService.getSchemaDetailsBySchemaId(this.schemaId).subscribe(res => {
      this.schemaInfo = res;
      if (this.schemaInfo.variantId) {
        this.variantChange(this.schemaInfo.variantId);
      }
    }, error => console.error(`Error : ${error.message}`));
    this.subscribers.push(sub);
  }


  /**
   * Call service for get schema statics based on schemaId and latest run
   */
  getSchemaStatics() {
    const sub =  this.schemaService.getSchemaThresholdStatics(this.schemaId, this.variantId).subscribe(res => {
      this.statics = res;
    }, error => {
      this.statics = new SchemaStaticThresholdRes();
      console.error(`Error : ${error}`);
    });
    this.subscribers.push(sub);
  }

  /**
   * Call service to get schema execution tree
   */
  getSchemaExecutionTree(plantCode, userName) {
    const sub = this.schemaService.getSchemaExecutionTree(this.moduleId, this.schemaId, this.variantId, plantCode, userName, this.activeTab).subscribe(res => {
      this.executionTreeHierarchy = res;
      this.executionTreeObs.next(res);
      }, error => {
      this.executionTreeHierarchy = new SchemaExecutionTree();
      console.error(error);
    });
    this.subscribers.push(sub);
  }

  /**
   * Get schema variant details ..
   */
  getVariantDetails() {
   const sub =  this.schemaVariantService.getVariantdetailsByvariantId(this.variantId, this.userDetails.currentRoleId, this.userDetails.plantCode, this.userDetails.userName).subscribe(res => {
      if (res) {
        const finalFiletr: FilterCriteria[] = [];
        const inline = res.filterCriteria.filter(fil => fil.fieldId === 'id')[0];
        if (inline) {
          this.preInpVal = inline.values ? inline.values.toString() : '';
          finalFiletr.push(inline);
        }
        res.filterCriteria.forEach(fil => {
          const fltr: FilterCriteria = new FilterCriteria();
          fltr.fieldId = fil.fieldId;
          fltr.type = fil.type;
          fltr.values = fil.values;

          const dropVal: DropDownValue[] = [];
          if (fltr.values) {
            fltr.values.forEach(val => {
              const dd: DropDownValue = { CODE: val, FIELDNAME: fil.fieldId } as DropDownValue;
              dropVal.push(dd);
            });
          }

          fltr.filterCtrl = { fldCtrl: fil.fldCtrl, selectedValues: dropVal };
          finalFiletr.push(fltr);
        });

        this.filterCriteria.next(finalFiletr);
      }
    }, error => {
      console.error(`Error : ${error.message}`);
    });
    this.subscribers.push(sub);
  }

  /**
   * Get all fld metada based on module of schema
   */
  getFldMetadata() {
    if (this.moduleId === undefined || this.moduleId.trim() === '') {
      throw new Error('Module id cant be null or empty');
    }
    const sub =  this.schemaDetailService.getMetadataFields(this.moduleId).subscribe(response => {
      this.metadata.next(response);
    }, error => {
      console.error(`Error : ${error.message}`);
    });
    this.subscribers.push(sub);
  }

  /**
   * Calculate fields based on user view ..
   *
   */
  calculateDisplayFields(): void {

    const metaFld = this.getAllNodeFields(this.activeNode);

    const fields = [];
    const select = [];
    const metadataLst: any = {};
    this.startColumns.forEach(col => fields.push(col));
    for (const headerField in metaFld) {
      if (metaFld.hasOwnProperty(headerField)) {
        const index = this.selectedFields.findIndex(f => f.fieldId === headerField);
        if (fields.indexOf(headerField) < 0 && (index !== -1)) {
          select[index] = headerField;
        }
        metadataLst[headerField] = metaFld[headerField];
      }
    }

    this.metadataFldLst = metadataLst;
    select.forEach(fldId => fields.push(fldId));
    this.displayedFields.next(fields);
    console.log(this.displayedFields.getValue());
  }

  getAllNodeFields(node: SchemaExecutionTree) {

    if(!node || !node.nodeId) {
      return this.metadata.getValue() ? this.metadata.getValue().headers: {};
    }
    let fields = {};
    const parentNode = this.getParentNode(node.nodeId);
    if(parentNode) {
      if (node.nodeType === SchemaExecutionNodeType.HEADER) {
        fields = this.metadata.getValue() ? this.metadata.getValue().headers || {} : {};
        Object.keys(fields).forEach(f => {
          fields[f] = {...fields[f],nodeId:node.nodeId,nodeType:node.nodeType};
        });
        const parentFields = this.getAllNodeFields(parentNode);
        fields = {...fields, ...parentFields};
      } else if (node.nodeType === SchemaExecutionNodeType.HEIRARCHY) {
        fields = this.metadata.getValue() ? this.metadata.getValue().hierarchyFields[node.nodeId] || {} : {};
        Object.keys(fields).forEach(f => {
          fields[f] = {...fields[f],nodeId:node.nodeId,nodeType:node.nodeType};
        });
        const parentFields = this.getAllNodeFields(parentNode);
        fields = {...fields, ...parentFields};
      } else if (node.nodeType === SchemaExecutionNodeType.GRID) {
        fields = this.metadata.getValue() ? this.metadata.getValue().gridFields[node.nodeId] || {} : {};
        Object.keys(fields).forEach(f => {
          fields[f] = {...fields[f],nodeId:node.nodeId,nodeType:node.nodeType};
        });
        const parentFields = this.getAllNodeFields(parentNode);
        fields = {...fields, ...parentFields};
      }
    } else {
      if (node.nodeType === SchemaExecutionNodeType.HEADER) {
        fields = this.metadata.getValue() ? this.metadata.getValue().headers || {} : {};
      } else if (node.nodeType === SchemaExecutionNodeType.HEIRARCHY) {
        fields = this.metadata.getValue() ? this.metadata.getValue().hierarchyFields[node.nodeId] || {} : {};
      } else if (node.nodeType === SchemaExecutionNodeType.GRID) {
        fields = this.metadata.getValue() ? this.metadata.getValue().gridFields[node.nodeId] || {} : {};
      }
      Object.keys(fields).forEach(f => {
        fields[f] = {...fields[f],nodeId:node.nodeId,nodeType:node.nodeType};
      });
    }

    return fields;
  }

  getParentNode(nodeId) {
    const executionTreeArray = this.getExectionArray(this.executionTreeHierarchy) || [];
    const node = executionTreeArray.find(n => (n.nodeId === nodeId));
    if(node && node.parentNodeId) {
      return executionTreeArray.find(n => n.nodeId === node.parentNodeId);
    }
    return null;
  }

  /**
   * Map schema execution tree to an array
   * @param node root node
   * @param parentNodeId parent id
   * @returns execution array
   */
  getExectionArray(node: SchemaExecutionTree, parentNodeId?: string) {
    let executionTreeArray = [];
    const index = executionTreeArray.findIndex(n => n.nodeId === node.nodeId) ;
    if(index !== -1){
      executionTreeArray[index] = {...node, parentNodeId} ;
    } else {
      executionTreeArray.push({...node, parentNodeId});
    }

    if(node && node.childs && node.childs.length) {
      node.childs.forEach(child => {
        executionTreeArray =  executionTreeArray.concat(this.getExectionArray(child, node.nodeId));
      })
    }

    return executionTreeArray;
  }

  getNodeParentsHierarchy(childNode: SchemaExecutionTree) {
    if(!childNode || !childNode.nodeId) {
      return ['header'];
    }
    const parentNode = this.getParentNode(childNode.nodeId);
    if(parentNode) {
      return [childNode.nodeId].concat(this.getNodeParentsHierarchy(parentNode));
    } else {
      return ['header'];
    }
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
    request.nodeId = this.nodeId ? this.nodeId : '';
    request.nodeType = this.nodeType ? this.nodeType :'';
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
    this.router.navigate(['/home/schema/schema-details', this.moduleId, this.schemaId], {
      queryParams: { status: this.activeTab }, queryParamsHandling: 'merge'
    });

    // update state of columns
    this.manageStaticColumns();
    this.calculateDisplayFields();
    this.selection.clear();
    if (status === 'error' || status === 'success') {
      this.getData(this.filterCriteria.getValue(), this.sortOrder);
    } else {
      this.dataSource.setDocValue([]);
      this.getData();
    }

    if (this.userDetails) {
      this.getSchemaExecutionTree(this.userDetails.plantCode, this.userDetails.userName);
    }
  }

  /**
   * Oen choose column side sheet..
   */
  openTableColumnSettings() {
    const data = { schemaId: this.schemaId, variantId: this.variantId, fields: this.metadata.getValue(), selectedFields: this.selectedFields,
      editActive: true, activeNode: this.activeNode, allNodeFields: this.getAllNodeFields(this.activeNode)};
    this.sharedServices.setChooseColumnData(data);
    this.router.navigate(['', { outlets: { sb: 'sb/schema/table-column-settings' } }], {queryParamsHandling: 'preserve'});
  }

  /**
   * Method for download error or execution logs
   */
  downloadExecutionDetails() {
    const data = {
      moduleId: this.moduleId,
      schemaId: this.schemaId,
      runId: this.schemaInfo.runId,
      requestStatus: this.activeTab,
      executionTreeHierarchy: this.executionTreeHierarchy && this.executionTreeHierarchy.nodeId ? this.executionTreeHierarchy: null
    }

    this.matDialog.open(DownloadExecutionDataComponent, {
      width: '600px',
      data
    });
  }

  /**
   *
   * @param fldid editable field id
   * @param row entire row should be here
   */
  editCurrentCell(fldid: string, row: any, rIndex: number, containerRef: ContainerRefDirective) {
    console.log(fldid);
    console.log(row);

    if(this.activeNode && this.activeNode.nodeId !== this.metadataFldLst[fldid].nodeId) {
      return;
    }

    const field = this.selectedFields.find(f => f.fieldId === fldid);
    if (field && !field.isEditable) {
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

  isEditEnabled(fldid: string, row: any, rIndex: number) {
    const field = this.selectedFields.find(f => f.fieldId === fldid);
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

  isFieldEditable(fldid) {
    const field = this.selectedFields.find(f => f.fieldId === fldid);
    if (field && this.activeNode.nodeId === field.nodeId && field.isEditable) {
      return true;
    }

    return false;
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
        if(this.nodeType === 'GRID') {
          request.gridId = this.nodeId;
        } else if(this.nodeType === 'HEIRARCHY') {
          request.heirerchyId = this.nodeId;
        }

        // get the rowsno ...
        if(this.nodeType === 'GRID' || this.nodeType === 'HEIRARCHY') {
          request.rowSno = row.objnr ? row.objnr.fieldData : '';
        }

        const sub =  this.schemaDetailService.doCorrection(this.schemaId, request).subscribe(res => {
          if(this.activeTab === 'review') {
            row[fldid].oldData = value;
          } else if (row[fldid])  {
            row[fldid].fieldData = value;
          }

          if (res.acknowledge) {
            this.statics.correctedCnt = res.count ? res.count : 0;
          }
        }, error => {
          this.transientService.open(`Error :: ${error}`, 'Close', { duration: 2000 });
          console.error(`Error :: ${error.message}`);
        });
        this.subscribers.push(sub);
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
      dispCols = ['_select_columns', '_assigned_buckets', '_score_weightage', '_row_actions', 'OBJECTNUMBER'];
      this.tableHeaderActBtn = [];
    } else {
      dispCols = ['_select_columns', '_assigned_buckets', '_row_actions', 'OBJECTNUMBER'];
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
   * @param row if request  type is inline then submit single rec..
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
        const selected = this.selection.selected.filter(sel => !sel.OBJECTNUMBER.isReviewed);
        selected.forEach(sel => {
          const docId = sel.OBJECTNUMBER.fieldData;
          id.push(docId);
        });

      }
    }
    const sub =  this.schemaDetailService.approveCorrectedRecords(this.schemaId, id, this.userDetails.currentRoleId).subscribe(res => {
      if (res === true) {
        this.dataSource.setDocValue([]);
        this.getData();
        this.selection.clear();
        this.transientService.open('Correction is approved', 'Okay', { duration: 2000 });
      }
    }, error => {
      this.transientService.open(`Error :: ${error}`, 'Close', { duration: 2000 });
      console.error(`Error :: ${error.message}`);
    });
    this.subscribers.push(sub);
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
          const selected = this.selection.selected.filter(sel => !sel.OBJECTNUMBER.isReviewed);
          selected.forEach(sel=>{
            const docId = sel.OBJECTNUMBER.fieldData;
            id.push(docId);
          });

        }
    }
    const sub =  this.schemaDetailService.resetCorrectionRecords(this.schemaId, this.schemaInfo.runId , id).subscribe(res=>{
      if(res && res.acknowledge) {
        this.transientService.open('Correction is rejected', 'Okay', { duration: 2000 });
            this.statics.correctedCnt = res.count ? res.count : 0;
            this.dataSource.setDocValue([]);
            this.getData();
            this.selection.clear();
        }
    }, error=>{
        this.transientService.open(`Error :: ${error}`, 'Close',{duration:2000});
        console.error(`Error :: ${error.message}`);
    });
    this.subscribers.push(sub);

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

  variantChange(variantId) {
    if (this.variantId !== variantId) {
      this.variantId = variantId;
      const scope = this.dataScope.find(v => v.variantId === this.variantId);
      this.variantName = this.variantId === '0' ? 'Entire dataset' : scope?.variantName;
      this.variantTotalCnt = this.variantId === '0' ? this.totalVariantsCnt : scope?._totalDoc;
      if (this.variantId !== '0') {
        this.getVariantDetails();
      } else {
        this.filterCriteria.next([]);
      }
    }
  }

  /**
   * get input type when user edits a cell
   * @param fieldId the field id
   */
  getFieldInputType(fieldId) {

    if (this.metadataFldLst[fieldId] && this.metadataFldLst[fieldId].picklist === '0' && this.metadataFldLst[fieldId].dataType === 'NUMC') {
      return this.FIELD_TYPE.NUMBER;
    }
    if (this.metadataFldLst[fieldId] && this.metadataFldLst[fieldId].picklist === '0' && (this.metadataFldLst[fieldId].dataType === 'DATS' || this.metadataFldLst[fieldId].dataType === 'DTMS')) {
      return this.FIELD_TYPE.DATE;
    }
    if (this.metadataFldLst[fieldId] && (this.metadataFldLst[fieldId].isCheckList === 'false')
      && (this.metadataFldLst[fieldId].picklist === '1' || this.metadataFldLst[fieldId].picklist === '30' || this.metadataFldLst[fieldId].picklist === '37')) {
      return this.FIELD_TYPE.SINGLE_SELECT;
    }
    if (this.metadataFldLst[fieldId] && (this.metadataFldLst[fieldId].isCheckList === 'true')
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
    componentRef.instance.value =  this.activeTab !== 'review' ?( row[fldid] ? row[fldid].fieldData : '') : ( row[fldid] ? row[fldid].oldData : '');
    // componentRef.instance.value =  row[fldid] ? row[fldid].fieldData : '';
    componentRef.instance.inputBlur.subscribe(value => this.emitEditBlurChng(fldid, value, row, rIndex, containerRef.viewContainerRef));

  }

  /**
   * Get data scopes .. or variants ...
   */
  getDataScope(activeVariantId?: string) {
    const observable = this.schemaVariantService.getDataScope(this.schemaId, 'RUNFOR');
    const sub = observable.subscribe(res => {
      this.dataScope = res;
      if(activeVariantId) {
        this.variantChange(activeVariantId);
      }
    }, (error) => console.error(`Something went wrong while getting variants. : ${error.message}`));
    this.subscribers.push(sub);

    return observable;
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
   * Function to open trend execution side sheet
   */
  openExecutionTrendSideSheet() {
    this.router.navigate(['', { outlets: { sb: `sb/schema/execution-trend/${this.moduleId}/${this.schemaId}/${this.variantId}` } }], {queryParamsHandling: 'preserve'})
  }

  /**
   * get already saved schema actions
   */
  getSchemaTableActions() {
    const sub =  this.schemaDetailService.getTableActionsBySchemaId(this.schemaId).subscribe(actions => {
      console.log(actions);
      if(actions && actions.length) {
        this.tableActionsList = actions;
      }
    });
    this.subscribers.push(sub);
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

  doAction(action: SchemaTableAction, element) {
    console.log('Action selected ', action);
    if (!action.isCustomAction &&  action.actionCode === STANDARD_TABLE_ACTIONS.APPROVE && (this.isReviewer || this.isApprover)) {
      this.approveRecords('inline', element);
    } else if (!action.isCustomAction && action.actionCode === STANDARD_TABLE_ACTIONS.REJECT && (this.isReviewer || this.isApprover)) {
      this.resetRec(element,'inline');
    } else {
      this.generateCrossEntry(element, action.refBrId);
    }
  }

  get isGlobalActionsEnabled() {
    return this.selection.selected.some(row => !row.OBJECTNUMBER.isReviewed);
  }

  /**
   * check if the user is allowed to make an action
   * @param action action to be performed
   */
  hasActionPermission(action: SchemaTableAction) {
    if (action.actionCode === STANDARD_TABLE_ACTIONS.APPROVE) {
      return this.isReviewer || this.isApprover;
    }

    if (action.actionCode === STANDARD_TABLE_ACTIONS.REJECT) {
      return this.isReviewer || this.isApprover;
    }

    return true;

  }

  /**
   * Help to generate / create cross module ..
   * @param row get selected row data
   */
  generateCrossEntry(row: any, crossbrId?) {
    const tragetFld = this.dataSource.targetField;
    if (!tragetFld) {
      throw new Error('Tragetfield cant be null or empty ');
    }
    const objNr = row && row.OBJECTNUMBER ? row.OBJECTNUMBER.fieldData : '';
    if (!objNr) {
      throw new Error(`Objectnumber must be required !!!`);
    }
    const sub = this.schemaDetailService.generateCrossEntry(this.schemaId, this.moduleId, objNr, crossbrId || '').subscribe(res=>{
      if(res) {
        const oldData = this.dataSource.docValue();
        const sameDoc = oldData.filter(fil => (fil as any).OBJECTNUMBER.fieldData === objNr)[0];
        if (sameDoc[tragetFld]) {
          sameDoc[tragetFld].fieldData = res;
        } else {
          sameDoc[tragetFld] = { fieldData: res, fieldDesc: '', fieldId: tragetFld };
        }

        this.dataSource.setDocValue(oldData);

        // put into correction tab
        const request: SchemaCorrectionReq = { id: [objNr], fldId: tragetFld, vc: res, isReviewed: null } as SchemaCorrectionReq;
        const doCorrectionRequest =  this.schemaDetailService.doCorrection(this.schemaId, request).subscribe(r => {
          if (r.acknowledge) {
            this.statics.correctedCnt = r.count ? r.count : 0;
          }
        }, error => {
          this.transientService.open(`Something went wrong `, 'Close', { duration: 2000 });
          console.error(`Error :: ${error.message}`);
        });
        this.subscribers.push(doCorrectionRequest);
      } else {
        this.transientService.open(`Something went wrong `, 'Close', { duration: 2000 });
      }
    }, error => { console.error(`Exception while generating coss module .. ${error.message}`) });
    this.subscribers.push(sub);
  }

  /**
   * Open side sheet for upload corrected data in correction index ..
   */
  uploadCorrectedData() {
    this.router.navigate([{outlets: { sb: `sb/schema/upload-data/${this.moduleId}/${this.outlet}`}}], {queryParams:{importcorrectedRec: true, schemaId: this.schemaId, runid: this.schemaInfo.runId}});
  }

  /**
   * Opens files in local system for uploading csv
   */
  uploadCorrectedDataCsv() {
    if (document.getElementById('uploadFileCtrl')) {
      document.getElementById('uploadFileCtrl').click();
    }

    return true;
  }

  /**
   * function to toggle the icon
   * and emit the toggle event
   */
  toggleSideBar() {
    if (this.arrowIcon === 'chevron-left') {
      this.arrowIcon = 'chevron-right';
      this.widthOfSchemaNav=0;

    }
    else {
      this.arrowIcon = 'chevron-left';
      this.widthOfSchemaNav=292;
    }
  }

  public setNavDivPositions() {
    const { left, top } = this.navscroll.nativeElement.getBoundingClientRect();
    this.boxPosition = { left, top };
  }

  public setStatus(event: MouseEvent, status: number) {
    console.log(event,status)
    if (status === 1) event.stopPropagation();
    else this.setNavDivPositions();
    this.status = status;
  }

  public enableResize(){
    const sidebar = document.getElementById('navscroll')
    const grabberElement = document.createElement('div');
    grabberElement.style.height = '100%';
    grabberElement.style.width = '2px';
    grabberElement.style.backgroundColor = '#ffffff';
    grabberElement.style.position = 'absolute';
    grabberElement.style.cursor = 'col-resize';
    grabberElement.style.resize = 'horizontal';
    grabberElement.style.overflow = 'auto';
    grabberElement.style.right = '0%';

    grabberElement.addEventListener('mousedown', () => {
      this.grab = true;
      sidebar.style.cursor = 'col-resize';
    });

    grabberElement.addEventListener('mouseup', () => {
      this.grab = false;
      sidebar.style.cursor = 'default';
    });

    sidebar.addEventListener('mouseup', () => {
      this.grab = false;
      sidebar.style.cursor = 'default';
      grabberElement.style.backgroundColor = '#fff';
    });

    document.addEventListener('mouseup', () => {
      if (this.grab) {
        this.grab = false;
        sidebar.style.cursor = 'default';
      }
    })

    document.addEventListener('mousemove', (e) => {
      if (this.grab) {
        this.mousePosition = { x: e.clientX, y: e.clientY };
      if (this.status === SchemaNavGrab.RESIZE) {
        this.navscroll.nativeElement.style.cursor = 'col-resize';
      } else {
        this.navscroll.nativeElement.style.cursor = 'default';
      }

      const maxWidth=this.listingContainer.nativeElement.clientWidth/3;
      this.widthOfSchemaNav = Number(this.mousePosition.x > this.boxPosition.left) ?
        Number(this.mousePosition.x - this.boxPosition.left < maxWidth) ?
          this.mousePosition.x - this.boxPosition.left : maxWidth : 0;
          this.widthOfSchemaNav<30 ? this.arrowIcon='chevron-right': this.arrowIcon='chevron-left';
        }
    });

    this.navscroll.nativeElement.prepend(grabberElement);

  }

  /**
   * uploads csv file
   * @param evt file event
   */
  fileChange(evt: Event) {
    const validResponse = this.checkForValidFile(evt);
    if (validResponse.file) {
      const activeNodeId = this.activeNode.nodeId || 'header';
      const activeNodeType = this.activeNode.nodeType || 'HEADER';
      const moduleDesc = this.moduleInfo.moduleDesc ? `${this.moduleInfo.moduleDesc} Number` : '';
      this.schemaDetailService.uploadCsvFileData(validResponse.file, this.schemaId, activeNodeId, activeNodeType, '', moduleDesc)
        .subscribe(res => {
          if (res) {
            this.isFileUploading = true;
          }
      }, error => {
        console.log(`Error:: ${error.message}`);
      });
    } else {
      const errMsg = validResponse.errMsg || 'Unable to upload file';
      this.transientService.open(`Error :: ${errMsg}`, 'Close', { duration: 2000 });
      console.error(`Error :: ${errMsg}`);
    }
  }

  /**
   * Validates for valid csv file and file size limit
   * @param evt file event
   * @returns returns file or error message
   */
  checkForValidFile(evt: Event) {
    const res = {
      errMsg: '',
      file: null
    };
    if (evt !== undefined) {
      const target: DataTransfer = (evt.target) as unknown as DataTransfer;
      if (target.files.length !== 1) {
        res.errMsg = 'Cannot use multiple files';
      }
      // check file type
      let type = '';
      try {
        type = target.files[0].name.split('.')[1];
      } catch (ex) {
        console.error(ex)
      }
      if (type === 'xlsx' || type === 'xls' || type === 'csv') {
        // check size of file
        const size = target.files[0].size;

        const sizeKb = Math.round((size / 1024));
        if (sizeKb > (10 * 1024)) {
          res.errMsg = `File size too large , upload less then 10 MB`;
        }
        res.file = target.files[0];
      } else {
        res.errMsg = `Unsupported file format, allowed file formats are .xlsx, .xls and .csv`;
      }
    }

    return res;
  }

  /**
   * Closes file upload progress screen along with a toast message
   * @param msg output message from upload progress screen
   */
  fileUploaded(msg) {
    this.isFileUploading = false;
    if (msg) {
      this.transientService.open(msg, 'Okay', { duration: 2000 });
    }
  }

  onRunCompleted($event) {
     this.isInRunning = false;
     this.runCompleted.emit($event);
  }

  /**
   * get module info based on module id
   * @param id module id
   */
  getModuleInfo(id) {
    this.schemaService.getModuleInfoByModuleId(id).subscribe(res => {
      if (res && res.length) {
        this.moduleInfo = res[0];
        this.totalVariantsCnt = this.moduleInfo.datasetCount || 0;
      }
    }, error => {
      console.log(`Error:: ${error.message}`)
    });
  }

  /**
   * Navigate the detail page based on node clicked ....
   * @param node selected / clicked node details
   */
   loadNodeData(node: SchemaExecutionTree) {

    if(node.nodeId === this.activeNode.nodeId) {
      console.log('Already active');
      return;
    }
    this.activeNode = node;
    console.log(node);
    this.router.navigate([], {
      relativeTo: this.activatedRouter,
      queryParams: {
        node: node.nodeId,
        'node-level': node.nodeType
      },
      queryParamsHandling: 'merge',
      skipLocationChange: false
    });
  }
  /**
   * Enable collapsiable icon ...
   * @param col column ...
   * @returns will return true  or false
   */
  enableIcon(col: string): boolean {
    let found = false;
    if(this.columns.header && (this.columns.header.indexOf(col) === this.columns.header.length-1)) {
      found = true;
    }
    return found && (this.nodeId !== 'header');
  }
  /**
   * Manage column collapsiable or expandable ..
   * @param evt events
   * @param state state will be open || close based on that manage columns
   * @param fld operation on this field...
   */
  doColumnsCollapsible(evt, state: string, fld: string) {
    if(state === 'open') {

      switch(fld) {
        case '___header__collapsible':
          const __header_coll_indx = this.displayedFields.getValue().indexOf('___header__collapsible');
          const array = this.displayedFields.getValue().splice(0,__header_coll_indx);
          array.push(...this.columns.header);
          if(this.nodeId !== 'header') {
            array.push(...this.columns[this.nodeId]);
          }
          this.displayedFields.next(array);
          break;

        case '___grid__collapsible':
          const __grid_coll_indx = this.displayedFields.getValue().indexOf('___grid__collapsible');
          const grid_array = this.displayedFields.getValue().splice(0,__grid_coll_indx);
          grid_array.push(...this.columns[this.nodeId]);
          this.displayedFields.next(grid_array);
          break;

        case '___hierarchy__collapsible':
          const __hie_coll_indx = this.displayedFields.getValue().indexOf('___hierarchy__collapsible');
          const hie_array = this.displayedFields.getValue().splice(0,__hie_coll_indx);
          hie_array.push(...this.columns[this.nodeId]);
          this.displayedFields.next(hie_array);
          break;

      }

    } else if(state === 'close') {
      const objNrIdx = this.displayedFields.getValue().indexOf('OBJECTNUMBER');
      const array = this.displayedFields.getValue().splice(0,objNrIdx+1);
      let keyFor = null;
      for(const cl in this.columns) {
        if(this.columns[cl].indexOf(fld) !== -1) {
          keyFor = cl;
          break;
        }
      }
      if(keyFor === 'header') {
        array.push('___header__collapsible');
        console.log(this.columns[this.nodeId]);
        if(this.nodeId !== 'header') {
          array.push(...this.columns[this.nodeId]);
        }
      } else if(keyFor !== null && this.nodeType === 'GRID') {
        array.push(...this.columns.header);
        array.push('___grid__collapsible');
      } else if(keyFor !== null && this.nodeType === 'HEIRARCHY') {
        array.push(...this.columns.header);
        array.push('___hierarchy__collapsible');
      }
      console.log(array)
      this.displayedFields.next(array);
    }
  }
  /**
   * Update the selected columns ... based on selected node
   * @param nodeId selected node id ...
   * @param nodeType selected node type ...
   */
  updateColumnBasedOnNodeSelection(nodeId: string, nodeType: string) {
    const nodeIds = this.getNodeParentsHierarchy(this.activeNode);
    this.schemaDetailService.getSelectedFieldsByNodeIds(this.schemaId, this.variantId, nodeIds.reverse())
      .subscribe(res => {
        const allFields = [];
        let updateTableView = false;
        this.columns = {};
        const metadata = this.metadata.getValue();
        if(res && res.length) {
          res.forEach(node => {
            if(node.fieldsList && node.fieldsList.length) {
              this.columns[node.nodeId] = [];
              node.fieldsList = node.fieldsList.sort((a, b) => a.order - b.order);
              node.fieldsList.forEach(f => {
                if(!allFields.find(fld => fld.fieldId === f.fieldId)) {
                  allFields.push(f);
                  this.columns[node.nodeId].push(f.fieldId);
                }
              });
            } else {
              let fields = [];
              const nType = this.getNodeTypeById(node.nodeId);
              if(nType === 'HEIRARCHY') {
                if(metadata && metadata.hierarchyFields && metadata.hierarchyFields.hasOwnProperty(node.nodeId)) {
                  fields = Object.keys(metadata.hierarchyFields[node.nodeId]).slice(0,10);
                  this.columns[node.nodeId] = fields;
                  fields.forEach((f, index) => {
                    const fldMap = new SchemaTableViewFldMap();
                    fldMap.fieldId = f;
                    fldMap.order = index;
                    fldMap.nodeId = node.nodeId;
                    fldMap.nodeType = nType;
                    allFields.push(fldMap);
                  });
                  updateTableView = true;
                }
              } else if(nType === 'GRID') {
                if(metadata && metadata.gridFields && metadata.gridFields.hasOwnProperty(node.nodeId)) {
                  fields = Object.keys(metadata.gridFields[node.nodeId]).slice(0,10);
                  this.columns[node.nodeId] = fields;
                  fields.forEach((f,index) => {
                    const fldMap = new SchemaTableViewFldMap();
                    fldMap.fieldId = f;
                    fldMap.order = index;
                    fldMap.nodeId = node.nodeId;
                    fldMap.nodeType = nType;
                    allFields.push(fldMap);
                  });
                  updateTableView = true;
                }
              } else if(nType === 'HEADER') {
                if(metadata && metadata.headers) {
                  fields = Object.keys(metadata.headers).slice(0,10);
                  this.columns[node.nodeId] = fields;
                  fields.forEach((f,index) => {
                    const fldMap = new SchemaTableViewFldMap();
                    fldMap.fieldId = f;
                    fldMap.order = index;
                    fldMap.nodeId = node.nodeId;
                    fldMap.nodeType = nType;
                    allFields.push(fldMap);
                  });
                  updateTableView = true;
                }
              }
            }
          });
          this.selectedFields = allFields;
          this.selectedFields.map((x) => x.isEditable = true);
          this.selectedFieldsOb.next(updateTableView);
        };

      }, error => {
        console.error(`Error:: ${error.message}`);
      });

  }

  getNodeTypeById(nodeId: string) {
    const treeArray = this.getExectionArray(this.executionTreeHierarchy);
    const nodeDetails = treeArray.find(n => n.nodeId === nodeId);
    return nodeDetails && nodeDetails.nodeType;
  }

  isHeaderColumn(dynCols) {
    return this.columns.header?.includes(dynCols);
  }

}

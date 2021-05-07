import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { MetadataModel, MetadataModeleResponse, SchemaTableViewRequest, SchemaTableViewFldMap, TableActionViewType, SchemaTableAction, CrossMappingRule, DetailView, STANDARD_TABLE_ACTIONS } from 'src/app/_models/schema/schemadetailstable';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { SharedServiceService } from '../../_services/shared-service.service';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import { Userdetails } from '@models/userdetails';
import { UserService } from '@services/user/userservice.service';
import { SchemaListDetails } from '@models/schema/schemalist';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { take } from 'rxjs/operators';
import { GlobaldialogService } from '@services/globaldialog.service';


@Component({
  selector: 'pros-table-column-settings',
  templateUrl: './table-column-settings.component.html',
  styleUrls: ['./table-column-settings.component.scss']
})
export class TableColumnSettingsComponent implements OnInit{
  getMdmr: MetadataModeleResponse[];
  headerFieldObs: Observable<MetadataModel[]> = of([]);
  header : MetadataModel[] = [];
  hierarchy : MetadataModel[] = [];
  grid : MetadataModel[] = [];
  globalFormControl: FormControl = new FormControl('');

  hierarchyList = {} as any;
  gridList = {} as any;
  heText = {} as any;
  val: any = {} as any;
  markedFields: string[] = [];
  dynamicSearchVal = '';
  matchCount = 0;
  index = 0;
  data = null;
  allChecked = false;
  allIndeterminate = false;
  hierarchyChecked = false;
  hierarchyIndeterminate = false;
  gridChecked = false;
  gridIndeterminate = false;
  headerArray = [];
  gridArray = [];
  hierarchyArray = [];
  editEnabledList = [];

  /**
   * Hold fields of all suggested fields
   */
  suggestedFlds: string[] = [];

  @ViewChild('scrollableContainer', {read: ElementRef}) scrollable : ElementRef<any>;

  userDetails = new Userdetails();

  /**
   * Current schema info ..
   */
  schemaInfo: SchemaListDetails;

  actionsForm: FormGroup;

  actionsList: SchemaTableAction[] = [];

  configTabSelectedIndex = 0;

  COMMON_ACTIONS = [
    {actionText: 'Approve', schemaCategories: [DetailView.DATAQUALITY_VIEW, DetailView.DUPLICACY_VIEW, DetailView.MRO_CLASSIFICATION_VIEW, DetailView.POTEXT_VIEW],
    actionCode: STANDARD_TABLE_ACTIONS.APPROVE, actionIconLigature: 'check' },
    {actionText: 'Reject', schemaCategories: [DetailView.DATAQUALITY_VIEW, DetailView.DUPLICACY_VIEW, DetailView.MRO_CLASSIFICATION_VIEW, DetailView.POTEXT_VIEW],
    actionCode: STANDARD_TABLE_ACTIONS.REJECT, actionIconLigature: 'ban'},
    {actionText: 'Delete', schemaCategories: [DetailView.DUPLICACY_VIEW], actionCode: STANDARD_TABLE_ACTIONS.DELETE, actionIconLigature: 'trash-alt'},
    {actionText : 'Generate description', actionIconLigature: 'file-alt', schemaCategories: [DetailView.MRO_CLASSIFICATION_VIEW], actionCode: STANDARD_TABLE_ACTIONS.GENERATE_DESC}
  ];

  TableActionViewType = TableActionViewType;

  crossMappingRules: CrossMappingRule[]= [];

  /**
   * hold initial selected fields
   */
  initialSelectedFields: SchemaTableViewFldMap[] = [];

  /**
   * hold initial configured actions
   */
  initialActionsList: SchemaTableAction[] = [];

  /**
   * hold initial action text while edit starts
   */
  previousActionText = '';

  constructor(
    private sharedService: SharedServiceService,
    private router: Router,
    private schemaDetailsService: SchemaDetailsService,
    private userService: UserService,
    private schemaListService: SchemalistService,
    private glocalDialogService: GlobaldialogService
  ){}

  ngOnInit() {

    this.sharedService.getChooseColumnData().pipe(take(1)).subscribe(data=>{
      console.log(data);
      if (data) {
        if (data.editActive) {
          this.data = JSON.parse(JSON.stringify(data));
          this.getSchemaDetails();
          this.initialSelectedFields = data.selectedFields;
          this.initialActionsList = data.tableActionsList;
          this.headerDetails();
          this.manageStateOfCheckBox();
        }
      } else {
        this.close();
      }
    });

    this.userService.getUserDetails().subscribe(res => {
      this.userDetails = res;
    }, error => console.error(`Error : ${error.message}`));

  }

  // header
  public headerDetails() {
    this.header = [];

    const fields = this.data.allNodeFields ? this.data.allNodeFields :  (this.data.fields ? this.data.fields.headers: {});
    if(this.data && this.data.selectedFields && this.data.selectedFields.length > 0){
      for(const field of this.data.selectedFields) {
        if(fields[field.fieldId]) {
          this.header.push(fields[field.fieldId]);
        }
      }
    }
    if(this.data && fields && this.data.selectedFields){
      for(const hekey in fields){
        if(this.data.selectedFields.length > 0){
          if(this.data.selectedFields.findIndex( f => f.fieldId === hekey) === -1)
          {
            this.header.push(fields[hekey]);
          }
        }
        else {
          this.header.push(fields[hekey]);
        }
      }
    }

    this.headerFieldObs = of(this.header);
    this.headerArray = this.header.map(he=> he.fieldId);
  }

  close()
  {
    // this.sharedService.setChooseColumnData({...this.data, tableActionsList: this.actionsList, editActive: false});
    this.router.navigate([{ outlets: { sb: null }}],  {queryParamsHandling: 'preserve'});
  }

  public persistenceTableView(selFld: SchemaTableViewFldMap[]) {
    const schemaTableViewRequest: SchemaTableViewRequest = new SchemaTableViewRequest();
    schemaTableViewRequest.schemaId = this.data.schemaId;
    schemaTableViewRequest.variantId = this.data.variantId ? this.data.variantId: '0';
    schemaTableViewRequest.schemaTableViewMapping = selFld;

    this.schemaDetailsService.updateSchemaTableView(schemaTableViewRequest).subscribe(response => {
      console.log(response);
      // this.sharedService.setChooseColumnData(this.data);
      this.sharedService.setChooseColumnData({...this.data, tableActionsList: this.initialActionsList, editActive: false});
      this.close();
    }, error => {
      console.error('Exception while persist table view');
    });
  }

  /**
   * Manage select all checkbox state
   */
  manageStateOfCheckBox() {
    if(this.header.length === this.data.selectedFields.length) {
      this.allChecked = true;
      this.allIndeterminate = false;
    } else if(this.data.selectedFields.length !== 0){
      this.allIndeterminate = true;
      this.allChecked = false;
    }
  }


  /**
   * Search field by value change
   * @param value changed input value
   */
  searchFld(value: string) {
    if(value) {
      const sugg = this.header.filter(fill=> fill.fieldDescri.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !==-1);
      this.suggestedFlds = sugg.map(map => map.fieldId);
      if (this.suggestedFlds.length && this.scrollable){
        const item = document.getElementById(this.suggestedFlds[0]);
        this.scrollable.nativeElement.scrollTo(0, item.offsetTop - item.scrollHeight);
      }
    } else {
      this.headerFieldObs = of(this.header);
      this.suggestedFlds = [];
      if(this.scrollable) {
        this.scrollable.nativeElement.scrollTo(0, 0);
      }
    }
  }

  /**
   * While change checkbox state ..
   * @param fld changeable checkbox
   */
  selectionChange(fld: MetadataModel) {
    const selIndex =  this.data.selectedFields.findIndex(f => f.fieldId === fld.fieldId);
    if(selIndex !==-1) {
      this.data.selectedFields.splice(selIndex, 1)
    } else {
      const fieldView = new SchemaTableViewFldMap();
      fieldView.fieldId = fld.fieldId;
      fieldView.editable = false;
      this.data.selectedFields.push(fieldView);
    }
    // this.submitColumn();
    this.manageStateOfCheckBox();
  }

  /**
   * checked is checked
   * @param fld field for checking is selected or not
   */
  isChecked(fld: MetadataModel): boolean {
    const selCheck = this.data.selectedFields.findIndex(f => (f.fieldId ? f.fieldId : f) === fld.fieldId);
    return selCheck !==-1 ? true : false;
  }

  /**
   * State of select all checkbox ..
   */
  selectAll() {
    this.data.selectedFields = [];
    if(this.allChecked) {
      this.allChecked  = true;
      this.allIndeterminate = false;
      this.data.selectedFields = this.headerArray.map(header => {
        const fieldView = new SchemaTableViewFldMap();
        fieldView.fieldId = header;
        fieldView.editable = false;
        return fieldView;
      });
    } else {
      this.allChecked = false;
      this.allIndeterminate = false;
    }
  }

  /**
   * While drag and drop on list elements
   * @param event dragable elemenet
   */
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  /**
   * Submit selected columns ..
   */
  submitColumn() {
    const orderFld: SchemaTableViewFldMap[] = [];
    // const hdlFld = this.header.map(map=> map.fieldId);
    let choosenField ;
    let order = 0;
    this.header.forEach(h=>{
      choosenField = this.data.selectedFields.find(field =>field.fieldId === h.fieldId);
      if( choosenField ) {
        choosenField.order = order;
        choosenField.isEditable = choosenField.editable;
        choosenField.nodeId = h.nodeId;
        choosenField.nodeType = h.nodeType;
        orderFld.push(choosenField);
        order++;
      }
    });
    this.data.selectedFields = orderFld;
    this.persistenceTableView(orderFld);
  }

  editableChange(fld: MetadataModel){
    const field = this.data.selectedFields.find(f => f.fieldId === fld.fieldId);
    if (field){
      field.editable = !field.editable;
    }
    // this.submitColumn();
  }

  isEditEnabled(fld : MetadataModel){
    return this.data.selectedFields.findIndex(field => (field.fieldId === fld.fieldId) && field.editable ) !== -1;
  }

  /**
   * Get schema info ..
   */
  getSchemaDetails() {
    this.schemaListService.getSchemaDetailsBySchemaId(this.data.schemaId).subscribe(res => {
      this.schemaInfo = res;
      if(this.isActionConfigAllowed) {
        this.getSchemaActions();
        this.getCrossMappingRules();
      }
    }, error => console.error(`Error : ${error.message}`))
  }

  getCrossMappingRules() {
    this.schemaDetailsService.getCrossMappingRules('0')
      .subscribe(rules => this.crossMappingRules = rules);
  }

  /**
   * get already saved schema actions
   */
  getSchemaActions() {
    this.schemaDetailsService.getTableActionsBySchemaId(this.data.schemaId).subscribe(actions => {
      console.log(actions);
      if(actions && actions.length) {
        this.actionsList = actions;
      } else {
        this.addCommonActions();
      }
    });
  }

  /**
   * create common actions if table actions list is empty
   */
  addCommonActions() {
    this.COMMON_ACTIONS.forEach( commonAction  => {
      if(commonAction.schemaCategories.includes(this.schemaInfo.schemaCategory as DetailView)) {
        const action = { schemaId: this.data.schemaId, isPrimaryAction: true, isCustomAction: false,
          actionViewType: TableActionViewType.ICON_TEXT, actionText:commonAction.actionText, createdBy: this.userDetails.userName,
          actionCode: commonAction.actionCode, actionIconLigature: commonAction.actionIconLigature } as SchemaTableAction;

          this.actionsList.push(action);
      }
    })
  }



  /**
   * update action on change
   * @param rowIndex action index
   * @param attributeKey changed key
   * @param attributeValue new value
   */
  actionChanged(rowIndex: number, attributeKey: string, attributeValue) {
    this.actionsList[rowIndex][attributeKey] = attributeValue;
  }

  // /**
  //  * create update a schema action
  //  * @param action to be updated
  //  * @param rowIndex inside the actions list
  //  */
  // createUpdateAction(action: SchemaTableAction, rowIndex?: number) {
  //   this.schemaDetailsService.createUpdateSchemaAction(action).subscribe(resp => {
  //     console.log(resp);
  //     rowIndex !== undefined ? this.actionsList[rowIndex] = resp : this.actionsList.splice(0, 0, resp);
  //     this.sharedService.setChooseColumnData({selectedFields: this.initialSelectedFields, tableActionsList: this.actionsList, editActive: false});
  //   })
  // }

  /**
   * add a new custom action
   */
  addCustomAction() {
    const action = {schemaId: this.data.schemaId, actionText: `My custom action ${this.actionsList.length}`, isPrimaryAction: false,
      actionViewType: TableActionViewType.TEXT, isCustomAction: true, createdBy: this.userDetails.userName, actionOrder: 0} as SchemaTableAction;

    this.actionsList.splice(0, 0, action);

  }

  /**
   * remove an existing custom action
   * @param rowIndex custom action index
   */
  removeCustomAction(rowIndex: number) {

    this.glocalDialogService.confirm({label:'Are you sure to delete ?'}, (resp) => {
      this.removeActionAfterConfirm(resp, rowIndex);
    })


  }

  removeActionAfterConfirm(resp, rowIndex) {
    if (resp && resp === 'yes') {
      const action = this.actionsList[rowIndex];
      if (!action.sno) {
        this.actionsList.splice(rowIndex, 1);
      } else {
        this.schemaDetailsService.deleteSchemaTableAction(this.data.schemaId, action.actionCode)
          .subscribe(result =>  {
            this.actionsList.splice(rowIndex, 1);
      });
      }
    }
  }

  /**
   * check if current user has actions config permission
   */
  get isActionConfigAllowed() {
    return this.schemaInfo && (this.schemaInfo.createdBy === this.userDetails.userName);
  }


  get primaryActions() {
    return this.actionsList.filter(action => action.isPrimaryAction);
  }

  get secondaryActions() {
    return this.actionsList.filter(action => !action.isPrimaryAction);
  }

  editActionText(rowIndex: number) {
    console.log(rowIndex);

    if (!this.actionsList[rowIndex].isCustomAction) {
      console.log('Only custom actions can be renamed');
      return;
    }

    this.previousActionText = this.actionsList[rowIndex].actionText;

    if (document.getElementById('inpctrl_' + rowIndex)) {
      const inpCtrl = document.getElementById('inpctrl_' + rowIndex) as HTMLDivElement;
      const viewCtrl = document.getElementById('viewctrl_'+ rowIndex) as HTMLSpanElement;
      inpCtrl.style.display = 'block';
      // inpValCtrl.focus();
      viewCtrl.style.display = 'none';
    }
  }

  emitActionTextBlur(rowIndex: number, value) {
    if (document.getElementById('inpctrl_' + rowIndex)) {
      const inpCtrl = document.getElementById('inpctrl_' + rowIndex) as HTMLDivElement;
      const viewCtrl = document.getElementById('viewctrl_'+ rowIndex) as HTMLSpanElement;
      inpCtrl.style.display = 'none';
      viewCtrl.style.display = 'block';
      if (value && value !== this.previousActionText) {
        this.actionChanged(rowIndex, 'actionText', value);
      } else {
        this.actionsList[rowIndex].actionText = this.previousActionText;
      }
    }
  }

  getActionViewTypeDesc(viewType: TableActionViewType) {
    if (viewType === TableActionViewType.ICON) {
      return 'Icon only';
    }
    else if (viewType === TableActionViewType.ICON_TEXT) {
      return 'Icon and text';
    }
    else {
      return 'Text only';
    }
  }

  /**
   * create update a list of schema actions
   */
  saveTableActionsConfig() {
    this.actionsList.forEach((action, index) => action.actionOrder = index);
    this.schemaDetailsService.createUpdateSchemaActionsList(this.actionsList).subscribe(actions => {
      console.log(actions);
      this.sharedService.setChooseColumnData({selectedFields: this.initialSelectedFields, tableActionsList: actions, editActive: false});
      this.close();
    }, error => {
      console.log('something went wrong!')
    })
  }

  /**
   * save updated config
   * @param activeTab current active tab 0-columns/1-actions
   */
  save(activeTab: number) {

    if (activeTab === 0) {
      this.submitColumn();
    } else if (activeTab === 1) {
      this.saveTableActionsConfig();
    }
  }

}

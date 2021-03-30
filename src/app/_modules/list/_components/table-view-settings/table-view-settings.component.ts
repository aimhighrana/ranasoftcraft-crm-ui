import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { Userdetails } from '@models/userdetails';
import { UserService } from '@services/user/userservice.service';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { ListService } from '@services/list/list.service';
import { ListPageViewDetails, ListPageViewFldMap } from '@models/list-page/listpage';
import { CoreService } from '@services/core/core.service';
import { FieldMetaData } from '@models/core/coreModel';

@Component({
  selector: 'pros-table-view-settings',
  templateUrl: './table-view-settings.component.html',
  styleUrls: ['./table-view-settings.component.scss']
})
export class TableViewSettingsComponent implements OnInit, OnDestroy {

  /**
   * Hold current module id
   */
  moduleId: string;

  /**
   * Hold current view id
   */
  viewId: string;

  metadataFldLst: FieldMetaData[];

  /**
   * Hold fields of all suggested fields
   */
  suggestedFlds: FieldMetaData[] = [];

  allChecked = false;
  allIndeterminate = false;


  @ViewChild('scrollableContainer', {read: ElementRef}) scrollable : ElementRef<any>;

  userDetails = new Userdetails();

  /**
   * Hold current view config details
   */
  viewDetails = new ListPageViewDetails();

  subscriptions: Subscription[] = [];

  submitted = false;

  constructor(
    private sharedService: SharedServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private listService: ListService,
    private coreService: CoreService,
    private userService: UserService
    ){}

  ngOnInit() {

    const subs = this.userService.getUserDetails().subscribe(res => {
      this.userDetails = res;
    }, error => console.error(`Error : ${error.message}`));
    this.subscriptions.push(subs);

    const subs1 = this.activatedRoute.params.subscribe(params => {
      this.moduleId = params.moduleId;
      this.getFldMetadata();

      this.viewId = params.viewId !== 'new' ? params.viewId: '';
      if(this.viewId) {
        this.getTableViewDetails();
      }
    });
    this.subscriptions.push(subs1);

  }

  /**
   * get table view details
   */
  getTableViewDetails() {
    const sub =  this.listService.getListPageViewDetails(this.viewId, this.userDetails.userName, this.userDetails.currentRoleId, this.userDetails.plantCode, this.moduleId)
      .subscribe(response => {
          this.viewDetails = response;
    }, error => {
      console.error(`Error : ${error.message}`);
    });
    this.subscriptions.push(sub);
  }

  /**
   * Get all fld metada based on module id
   */
   getFldMetadata() {
    if (this.moduleId === undefined || this.moduleId.trim() === '') {
      throw new Error('Module id cant be null or empty');
    }
    const sub = this.coreService.getAllFieldsForView(this.moduleId).subscribe(response => {
      this.metadataFldLst = response || [];
      this.suggestedFlds = this.metadataFldLst;
    }, error => {
      console.error(`Error : ${error.message}`);
    });
    this.subscriptions.push(sub);
  }

  /**
   * close sidesheet
   */
  close() {
    this.router.navigate([{ outlets: { sb: null }}],  {queryParamsHandling: 'preserve'});
  }

  /**
   * Save view details
   */
  public save() {

    this.submitted = true;
    if (!this.viewDetails.viewName) {
      return;
    }

    this.viewDetails.moduleId = this.moduleId;
    this.viewDetails.fieldsReqList.map((field, index) => field.fieldOrder = `${index}`);

    const isUpdate = !!this.viewDetails.viewId;

    this.listService.upsertListPageViewDetails(this.viewDetails, this.userDetails.userName, this.userDetails.currentRoleId, this.userDetails.plantCode, this.moduleId)
      .subscribe(response => {
          this.sharedService.setViewDetailsData({
            isUpdate,
            viewDetails: {...this.viewDetails, viewId: response.viewId}
          });
          this.close();
    }, error => {
      console.error('Exception while persist table view');
    });
  }

  /**
   * Search field by value change
   * @param value changed input value
   */
  searchFld(value: string) {
    if(value) {
      this.suggestedFlds = this.metadataFldLst.filter(fill=> fill.fieldDescri.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !==-1);
    } else {
      this.suggestedFlds = this.metadataFldLst;
      this.scrollable.nativeElement.scrollTo(0, 0);
    }
  }

  /**
   * While change checkbox state ..
   * @param fld changeable checkbox
   */
  selectionChange(fld: FieldMetaData) {
    const selIndex =  this.viewDetails.fieldsReqList.findIndex(f => f.fieldId === fld.fieldId);
    if(selIndex !==-1) {
      this.viewDetails.fieldsReqList.splice(selIndex, 1)
    } else {
      const fieldView = new ListPageViewFldMap();
      fieldView.fieldId = fld.fieldId;
      fieldView.isEditable = false;
      this.viewDetails.fieldsReqList.push(fieldView);
    }
  }

  /**
   * checked is checked
   * @param fld field for checking is selected or not
   */
  isChecked(fld: FieldMetaData): boolean {
    const selCheck = this.viewDetails.fieldsReqList.findIndex(f => (f.fieldId ? f.fieldId : f) === fld.fieldId);
    return selCheck !==-1 ? true : false;
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

  editableChange(fld: FieldMetaData){
    const field = this.viewDetails.fieldsReqList.find(f => f.fieldId === fld.fieldId);
    if (field){
      field.isEditable = !field.isEditable;
    }
  }

  isEditEnabled(fld : FieldMetaData){
    return this.viewDetails.fieldsReqList.findIndex(field => (field.fieldId === fld.fieldId) && field.isEditable ) !== -1;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    })
  }

}

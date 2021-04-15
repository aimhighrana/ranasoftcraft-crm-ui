import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { ListService } from '@services/list/list.service';
import { ListPageViewDetails, ListPageViewFldMap } from '@models/list-page/listpage';
import { CoreService } from '@services/core/core.service';
import { FieldMetaData } from '@models/core/coreModel';
import { sortBy } from 'lodash';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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

  allChecked = false;
  allIndeterminate = false;

  /**
   * Hold current view config details
   */
  viewDetails = new ListPageViewDetails();

  subscriptions: Subscription[] = [];

  submitted = false;

  fldMetadataObs: Subject<FieldMetaData[]> = new Subject();

  fieldsPageIndex = 0;

  moduleFieldsMetatdata: FieldMetaData[] = [];

  viewFieldsMetadata: FieldMetaData[] = [];

  suggestedViewFieldsMetadata: FieldMetaData[] = [];

  mergedFieldsMetadata: FieldMetaData[] = [];

  searchFieldSub: Subject<string> = new Subject();

  fieldsSearchString = '';

  constructor(
    private sharedService: SharedServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private listService: ListService,
    private coreService: CoreService
    ){}

  ngOnInit() {

    let subs = this.activatedRoute.params.subscribe(params => {
      this.moduleId = params.moduleId;
      this.getModuleFldMetadata();

      this.viewId = params.viewId !== 'new' ? params.viewId: '';
      if(this.viewId) {
        this.getTableViewDetails();
      }
    });
    this.subscriptions.push(subs);

    subs = this.fldMetadataObs.subscribe(fields => {
      this.mergeFieldsMetadata();
    });

    this.subscriptions.push(subs);

    subs = this.searchFieldSub.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    )
    .subscribe(searchString => {
      this.fieldsSearchString = searchString || '';
      this.suggestedViewFieldsMetadata = this.viewFieldsMetadata
          .filter(field => field.fieldDescri.toLowerCase().includes(this.fieldsSearchString.toLowerCase()));
      this.getModuleFldMetadata();
    });
    this.subscriptions.push(subs);

  }

  /**
   * get table view details
   */
  getTableViewDetails() {
    const sub =  this.listService.getListPageViewDetails(this.viewId, this.moduleId)
      .subscribe(response => {
          this.viewDetails = response;
          this.viewDetails.fieldsReqList = sortBy(this.viewDetails.fieldsReqList, 'fieldOrder');
          const fieldsList = this.viewDetails.fieldsReqList.map(field => field.fieldId);
          this.getViewFieldsMetadata(fieldsList);
    }, error => {
      console.error(`Error : ${error.message}`);
    });
    this.subscriptions.push(sub);
  }

  /**
   * Get module fields metadata
   */
   getModuleFldMetadata(loadMore?: boolean) {
    if (this.moduleId === undefined || this.moduleId.trim() === '') {
      throw new Error('Module id cant be null or empty');
    }

    if(loadMore) {
      this.fieldsPageIndex++;
    } else {
      this.fieldsPageIndex = 0;
    }
    const sub = this.coreService.searchFieldsMetadata(this.moduleId, this.fieldsPageIndex, this.fieldsSearchString, 20).subscribe(response => {
      if(response && response.length) {
        loadMore ? this.moduleFieldsMetatdata = this.moduleFieldsMetatdata.concat(response) : this.moduleFieldsMetatdata = response;
        this.fldMetadataObs.next([]);
      } else if (loadMore) {
        this.fieldsPageIndex--;
      }
    }, error => {
      console.error(`Error : ${error.message}`);
    });
    this.subscriptions.push(sub);
  }

  /**
   * Get view fields metadata
   */
   getViewFieldsMetadata(fieldsList: string[]) {
    if (!fieldsList || !fieldsList.length) {
      return;
    }
    const sub = this.coreService.getMetadataByFields(fieldsList).subscribe(response => {
      this.viewFieldsMetadata = fieldsList.map(field => response.find(f => f.fieldId === field));
      this.suggestedViewFieldsMetadata = this.viewFieldsMetadata;
      this.fldMetadataObs.next([]);
    }, error => {
      console.error(`Error : ${error.message}`);
    });
    this.subscriptions.push(sub);
  }

  /**
   * merge view fields and module fields
   */
   mergeFieldsMetadata() {
     const moduleFields = this.moduleFieldsMetatdata.filter(field => !this.viewFieldsMetadata.find(f => f.fieldId === field.fieldId));
     this.mergedFieldsMetadata = this.suggestedViewFieldsMetadata.concat(moduleFields);
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

    let order = 0;
    this.mergedFieldsMetadata.forEach(metafld => {
      const field = this.viewDetails.fieldsReqList.find(fld => fld.fieldId === metafld.fieldId)
      if(field) {
        field.fieldOrder = `${++order}`;
      }
    });

    this.viewDetails.fieldsReqList = sortBy(this.viewDetails.fieldsReqList, 'fieldOrder');

    const isUpdate = !!this.viewDetails.viewId;

    this.listService.upsertListPageViewDetails(this.viewDetails, this.moduleId)
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
   * While change checkbox state ..
   * @param fld changeable checkbox
   */
  selectionChange(fld: FieldMetaData) {
    const selIndex =  this.viewDetails.fieldsReqList.findIndex(f => f.fieldId === fld.fieldId);
    if(selIndex !==-1) {
      this.viewDetails.fieldsReqList.splice(selIndex, 1);
      this.viewFieldsMetadata = this.viewFieldsMetadata.filter(field => field.fieldId !== fld.fieldId);
    } else {
      const fieldView = new ListPageViewFldMap();
      fieldView.fieldId = fld.fieldId;
      fieldView.isEditable = false;
      this.viewDetails.fieldsReqList.push(fieldView);
      this.viewFieldsMetadata.push(fld);
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

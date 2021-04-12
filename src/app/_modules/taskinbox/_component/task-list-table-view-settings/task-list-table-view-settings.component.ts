import { takeUntil } from 'rxjs/operators';
import { Subject, combineLatest } from 'rxjs';
import { NODEFIELDS } from './../task-list-datatable/task-list-datatable.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { sortBy } from 'lodash';

@Component({
  selector: 'pros-task-list-table-view-settings',
  templateUrl: './task-list-table-view-settings.component.html',
  styleUrls: ['./task-list-table-view-settings.component.scss'],
})
export class TaskListTableViewSettingsComponent implements OnInit, OnDestroy {
  node: string = null;

  metadataFldLst: {
    fldId: string;
    fldDesc: string;
  }[] = [];

  viewDetails: {
    fldId: string;
    fldDesc: string;
    fldOrder: string;
  }[] = [];

  /**
   * Hold fields of all suggested fields
   */
  suggestedFlds: string[] = [];
  fldMetadataObs: Subject<
    {
      fldId: string;
      fldDesc: string;
    }[]
  > = new Subject();
  viewDetailsObs: Subject<
    {
      fldId: string;
      fldDesc: string;
      fldOrder: string;
    }[]
  > = new Subject();

  unsubscribeAll$: Subject<boolean> = new Subject<boolean>();

  constructor(private route: ActivatedRoute, private router: Router, private sharedService: SharedServiceService) {}

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.node = param.node || null;
      this.getFldMetadata();
      this.getTableViewDetails();
    });

    combineLatest([this.fldMetadataObs, this.viewDetailsObs])
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((resp) => {
        this.FldMetadataOrders();
      });
  }

  getTableViewDetails() {
    this.sharedService
      .gettaskinboxViewDetailsData()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((resp) => {
        if (resp && resp.node === this.node) {
          this.viewDetails = sortBy(resp.viewDetails, 'fieldOrder');
          this.viewDetailsObs.next(this.viewDetails);
        } else {
          this.viewDetails = this.metadataFldLst.map((d) => {
            return {
              fldId: d.fldId,
              fldDesc: d.fldDesc,
              fldOrder: '0',
            };
          });
          this.viewDetailsObs.next(this.viewDetails);
        }
      });
    // this.listService.getListPageViewDetails(this.viewId, this.moduleId).subscribe(
    //   (response) => {
    //     this.viewDetails = response;
    //     this.viewDetails.fieldsReqList = sortBy(this.viewDetails.fieldsReqList, 'fieldOrder');
    //     this.viewDetailsObs.next(this.viewDetails);
    //   },
    //   (error) => {
    //     console.error(`Error : ${error.message}`);
    //   }
    // );
  }

  getFldMetadata() {
    if (this.node === undefined || this.node.trim() === '') {
      throw new Error('node cant be null or empty');
    }

    this.metadataFldLst = NODEFIELDS[this.node] || [];
    this.fldMetadataObs.next(this.metadataFldLst);
    this.suggestedFlds = this.metadataFldLst.map((fld) => fld.fldId);
  }

  /**
   * reorder fields metatdata based on saved columns orders
   */
  FldMetadataOrders() {
    let index = -1;
    this.viewDetails.forEach((field) => {
      const fieldPosition = this.metadataFldLst.findIndex((f) => f.fldId === field.fldId);
      if (fieldPosition !== -1) {
        moveItemInArray(this.metadataFldLst, fieldPosition, ++index);
      }
    });
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
   * checked is checked
   * @param fld field for checking is selected or not
   */
  isChecked(fld: { fldId: string; fldDesc: string }): boolean {
    const selCheck = this.viewDetails.findIndex((f) => (f.fldId ? f.fldId : f) === fld.fldId);
    return selCheck !== -1 ? true : false;
  }

  /**
   * While change checkbox state ..
   * @param fld changeable checkbox
   */
  selectionChange(fld: { fldId: string; fldDesc: string }) {
    const selIndex = this.viewDetails.findIndex((f) => f.fldId === fld.fldId);
    if (selIndex !== -1) {
      this.viewDetails.splice(selIndex, 1);
    } else {
      this.viewDetails.push({ ...fld, fldOrder: '' });
    }
  }

  close() {
    this.router.navigate([{ outlets: { sb: null } }], { queryParamsHandling: 'preserve' });
  }

  /**
   * Save view details
   */
  public save() {
    if (!this.node) {
      return;
    }

    let order = 0;
    this.metadataFldLst.forEach((metafld) => {
      const field = this.viewDetails.find((fld) => fld.fldId === metafld.fldId);
      if (field) {
        field.fldOrder = `${++order}`;
      }
    });
    this.viewDetails = sortBy(this.viewDetails, 'fldOrder');
    this.sharedService.settaskinboxViewDetailsData({
      node: this.node,
      viewDetails: this.viewDetails,
    });
    this.close();
  }

  /**
   * Search field by value change
   * @param value changed input value
   */
  searchFld(value: string) {
    if (value) {
      this.suggestedFlds = this.metadataFldLst
        .filter((fill) => fill.fldDesc.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1)
        .map((fld) => fld.fldId);
    } else {
      this.suggestedFlds = this.metadataFldLst.map((fld) => fld.fldId);
    }
  }

  ngOnDestroy() {
    this.unsubscribeAll$.next(true);
    this.unsubscribeAll$.unsubscribe();
  }
}

import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { throwError, BehaviorSubject } from 'rxjs';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { MetadataModeleResponse, MetadataModel } from '@models/schema/schemadetailstable';
import { DropDownValue } from '@modules/admin/_components/module/business-rules/business-rules.modal';

export interface ReadyForApplyFilter {
  fldCtrl: MetadataModel;
  selectedValeus: DropDownValue[];
}

@Component({
  selector: 'pros-add-filter-menu',
  templateUrl: './add-filter-menu.component.html',
  styleUrls: ['./add-filter-menu.component.scss']
})
export class AddFilterMenuComponent implements OnInit, OnDestroy, OnChanges {


  @Input()
  moduleId: string;


  /**
   * Hold all metada control for header , hierarchy and grid fields ..
   */
  metadata: BehaviorSubject<MetadataModeleResponse> = new BehaviorSubject<MetadataModeleResponse>(null);

  /**
   * Metadata drop value
   */
  metadaDrop: MetadataModel[] = [];

  /**
   * Hold info about active element ..
   */
  activateElement: MetadataModel;

  /**
   * After applied filter value should emit with
   * fld contrl and selected values ..
   */
  @Output()
  evtReadyForApply: EventEmitter<ReadyForApplyFilter> = new EventEmitter<ReadyForApplyFilter>(null);

  constructor(
    private schemaDetailService: SchemaDetailsService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {

  }


  ngOnDestroy(): void {
    this.metadata.complete();
    this.metadata.unsubscribe();
  }

  ngOnInit(): void {

    this.getFldMetadata();

    this.metadata.subscribe(fld=>{
       if(fld) {
         this.tarnsformMetada();
       }
    });
  }

  /**
   * Get all fld metada based on module of schema
   */
  getFldMetadata() {
    if(this.moduleId === undefined || this.moduleId.trim() === ''){
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
  tarnsformMetada(): void {
    const allMDF = this.metadata.getValue();
    const fields = [];
    for (const headerField in allMDF.headers) {
      if(fields.indexOf(headerField)) {
        const fldCtrl = allMDF.headers[headerField] as MetadataModel;
        if(fldCtrl.picklist === '1' || fldCtrl.picklist === '30' || fldCtrl.picklist === '37') {
          fields.push(allMDF.headers[headerField]);
        }
      }
    }
    this.metadaDrop = fields;
  }

  /**
   * Get field control ..
   * @param fld get control of that field
   */
  ctrlFlds(fld: MetadataModel) {
    this.activateElement = fld;
    if(document.getElementById('fld_ctrl')) {
      const dom = document.getElementById('fld_ctrl');
      dom.style.display = 'block';
      this.metadaDrop = [];
    }
  }

  /**
   * Move to previous state
   */
  prevState() {
    document.getElementById('fld_ctrl').style.display = 'none';
    this.metadata.next(this.metadata.getValue());
  }

  /**
   * Emit selectd field and values ..
   * @param val changed value ..
   */
  emitAppliedFilter(val: DropDownValue[]) {
    this.evtReadyForApply.emit({fldCtrl: this.activateElement,selectedValeus: val});
  }
}

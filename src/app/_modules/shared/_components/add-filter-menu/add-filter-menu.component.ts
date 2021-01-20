import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { throwError, BehaviorSubject, Subscription } from 'rxjs';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { MetadataModeleResponse, MetadataModel, FilterCriteria } from '@models/schema/schemadetailstable';
import { DropDownValue } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { AddFilterOutput } from '@models/schema/schema';
import { SchemaService } from '@services/home/schema.service';

@Component({
  selector: 'pros-add-filter-menu',
  templateUrl: './add-filter-menu.component.html',
  styleUrls: ['./add-filter-menu.component.scss']
})
export class AddFilterMenuComponent implements OnInit, OnDestroy, OnChanges {


  @Input()
  moduleId: string;

  @Input()
  reInilize: boolean;

  @Input()
  fieldMetadata: any[];

  @Input()
  isSearchEnable = true;

  /**
   * To get initally selected values..
   */
  @Input()
  alreadySelectedValues: FilterCriteria[];

  selectedValues: DropDownValue[] = [];

  /**
   * To hold dropdown values of clicked field id
   */
  dropValues: DropDownValue[] = [];

  /**
   * currently selected fields
   */
  currentFields: BehaviorSubject<any[]> = new BehaviorSubject([]);
  /**
   * Hold all metada control for header , hierarchy and grid fields ..
   */
  metadata: BehaviorSubject<MetadataModeleResponse> = new BehaviorSubject<MetadataModeleResponse>(null);

  /**
   * Metadata drop value
   */
  metadaDrop: MetadataModel[] = [];

  /**
   * Metadata drop value
   */
  searchDrop: MetadataModel[] = [];

  /**
   * Hold info about active element ..
   */
  activateElement: MetadataModel = null;

  /**
   * After applied filter value should emit with
   * fld contrl and selected values ..
   */
  @Output()
  evtReadyForApply: EventEmitter<AddFilterOutput> = new EventEmitter<AddFilterOutput>(null);

  /**
   * To hold selected dropdown values code..
   */
  dropValuesCode: string[];

  /**
   * To hold all the subscriptions.
   */
  subscriptions: Subscription[] = [];

  /**
   * Constructor of class..
   */
  constructor(
    private schemaDetailService: SchemaDetailsService,
    private schemaService: SchemaService
  ) { }

  /**
   * Angular hook for detecting Input value changes
   * @param changes Input values to watch for changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.moduleId && changes.moduleId.previousValue !== changes.moduleId.currentValue) {
      this.moduleId = changes.moduleId.currentValue;
      if (this.moduleId) {
        this.getFldMetadata();
      } else {
        this.initMetadata(this.currentFields.getValue());
      }
    }

    if (changes && changes.reInilize && changes.reInilize.previousValue !== changes.reInilize.currentValue) {
      if (this.moduleId) {
        this.metadata.next(this.metadata.getValue());
      }
      this.initMetadata(this.currentFields.getValue());
    }

    if (changes && changes.fieldMetadata && changes.fieldMetadata.previousValue !== changes.fieldMetadata.currentValue) {
      if (changes.fieldMetadata.currentValue) {
        this.currentFields.next(changes.fieldMetadata.currentValue);
        this.initMetadata(changes.fieldMetadata.currentValue);
      }
    }
  }

  /**
   * Clear the active element and selected values and Initialize
   * metadata using fields from the excel row
   * @param fields Excel first row values(Array)
   */
  initMetadata(fields: any[]) {
    this.activateElement = null;
    if (!this.moduleId) {
      this.selectedValues = [];
      if (fields && fields.length > 0) {
        this.metadaDrop = fields;
        this.searchDrop = fields;
      }
    }
  }

  /**
   * Angular hook
   * It will called once before destroying component lifecycle.
   */
  ngOnDestroy(): void {
    this.metadata.complete();
    this.metadata.unsubscribe();

    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    })
  }

  /**
   * Angular hook
   */
  ngOnInit(): void {
    this.metadata.subscribe(fld => {
      if (fld) {
        this.tarnsformMetada();
      }
    });
    this.getFldMetadata();
  }

  /**
   * Get all fld metada based on module of schema
   */
  getFldMetadata() {
    if (this.moduleId === undefined || this.moduleId.trim() === '') {
      throwError('Module id cant be null or empty');
    }
    const sub = this.schemaDetailService.getMetadataFields(this.moduleId).subscribe(response => {
      this.metadata.next(response);
    }, error => {
      console.error(`Error : ${error.message}`);
    });
    this.subscriptions.push(sub);
  }

  /**
   * Calculate fields based on user view ..
   *
   */
  tarnsformMetada(): void {
    const allMDF = this.metadata.getValue();
    const fields = [];
    for (const headerField in allMDF.headers) {
      if (fields.indexOf(headerField)) {
        const fldCtrl = allMDF.headers[headerField] as MetadataModel;
        if (fldCtrl.picklist === '1' || fldCtrl.picklist === '30' || fldCtrl.picklist === '37') {
          fields.push(allMDF.headers[headerField]);
        }
      }
    }
    this.metadaDrop = fields;
    this.searchDrop = fields;
  }

  /**
   * Get field control ..
   * @param fld get control of that field
   */
  ctrlFlds(fld: MetadataModel) {
    this.dropValuesCode = [];
    this.activateElement = fld;
    this.metadaDrop = [];
    if (!this.moduleId) {
      this.schemaService.generateColumnByFieldId(this.activateElement.fieldId);
    }
    else {
      if (this.alreadySelectedValues && this.alreadySelectedValues.length > 0) {
        this.dropValuesCode = this.alreadySelectedValues.filter((selectedValue) => selectedValue.fieldId === fld.fieldId)[0].values;
      }
    }
  }

  /**
   * Move to previous state
   */
  prevState(event) {
    event.stopPropagation();
    this.activateElement = null;
    if (this.moduleId) {
      const currentMetaData = this.metadata.getValue();
      if (currentMetaData) {
        this.metadata.next(currentMetaData);
      }
    } else {
      this.metadaDrop = this.currentFields.getValue();
    }

  }

  /**
   * Emit selectd field and values ..
   * @param val changed value ..
   */
  emitAppliedFilter(val: DropDownValue[]) {
    this.selectedValues = val;
    this.evtReadyForApply.emit({ fldCtrl: this.activateElement, selectedValues: val });
    this.activateElement = null;
  }

  /**
   * To search metadat fields according to the search field
   * @param searchText string to search with
   */
  searchField(searchText: string) {
    if (searchText.trim()) {
      this.metadaDrop = this.searchDrop.filter((value) => value.fieldDescri.toLowerCase().includes(searchText.toLowerCase()));
    } else {
      this.metadaDrop = this.searchDrop;
    }
  }

  /**
   * Function to get drop-down values according to field id
   * @param materialId: fieldID/ materialID
   * @param query: query string to be searched if any.
   */
  getDropdownValues(materialId: string, query: string) {
    const sub = this.schemaService.dropDownValues(materialId, query).subscribe((data) => {
      if (data && data.length > 0) {
        this.dropValues = data;
      }
    }, (error) => {
      console.log('Something went wrong while getting dropdown values', error.message);
    });
    this.subscriptions.push(sub);
  }
}


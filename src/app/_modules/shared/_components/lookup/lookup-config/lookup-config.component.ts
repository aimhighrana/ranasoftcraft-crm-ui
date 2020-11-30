import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LookupData, LookupFields, LookupFormData, MetadataModeleResponse } from '@models/schema/schemadetailstable';
import { isEqual } from 'lodash';
import { distinctUntilChanged } from 'rxjs/operators';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';

@Component({
  selector: 'pros-lookup-config',
  templateUrl: './lookup-config.component.html'
})
export class LookupConfigComponent implements OnInit, OnChanges {

  /**
   * Lookup form
   */
  lookupForm: FormGroup;

  /**
   * headers from the selected module
   */
  moduleHeaderFields: string[] = [];

  /**
   * initial data for lookup fields
   */
  @Input()
  initialData: LookupFields;

  /**
   * list of available modules to sleect lookup table from
   */
  @Input()
  availableModules: LookupData[] = [];

  /**
   * trigger to reinitiate the form object
   */
  @Input()
  reload: boolean;

  /**
   * lookup config output property
   */
  @Output()
  saveData: EventEmitter<LookupFormData> = new EventEmitter();
  constructor(
    private schemaDetailsService: SchemaDetailsService) { }

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Initialize the lookup form object
   */
  initForm() {
    this.lookupForm = new FormGroup({
      moduleId: new FormControl('', [Validators.required]),
      lookupColumnResult: new FormControl('', [Validators.required]),
      lookupColumn: new FormControl('', [Validators.required]),
    });

    this.lookupForm.valueChanges
      .pipe(distinctUntilChanged(isEqual))
      .subscribe((data: LookupFormData) => {
        if (data && data.moduleId) {
          this.getFieldsByModuleId(data.moduleId);
        }
      });

    this.patchInitialData();
  }

  /**
   * Trigger save and emit the lookup config form data to parent
   */
  saveConfig() {
    this.saveData.emit(this.lookupForm.value);
  }

  /**
   * Get the available fields based on module Id from the api
   * @param moduleId Pass module ID
   */
  getFieldsByModuleId(moduleId: string) {
    this.schemaDetailsService.getMetadataFields(moduleId)
      .subscribe((metadataModeleResponse: MetadataModeleResponse) => {
        if (metadataModeleResponse && metadataModeleResponse.headers) {
          const keys = Object.keys(metadataModeleResponse.headers);
          if (keys && keys.length > 0) {
            keys.forEach((key) => {
              this.moduleHeaderFields.push(metadataModeleResponse.headers[key])
            });
          }
        }
      });
  }

  /**
   * Path the lookup form with existing data if exists
   */
  patchInitialData() {
    const data: LookupFormData = this.initialData && this.initialData.fieldLookupConfig ? this.initialData.fieldLookupConfig : null;
    if (data) {
      this.lookupForm.patchValue(data);
    }
  }

/**
 * Angular hook to detect changes in the input values
 * @param changes check for change using changes variable
 */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.initialData && !isEqual(changes.initialData.previousValue, changes.initialData.currentValue)) {
      this.initialData = changes.initialData.currentValue;
    }
    if (changes.reload !== undefined && changes.reload.previousValue !== changes.reload.currentValue) {
      this.reload = changes.reload.currentValue;
      this.initForm();
    }
  }
}

import { Component, OnInit, Input, EventEmitter, Output, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { MetadataModeleResponse, MetadataModel, Heirarchy, ParentField } from '@models/schema/schemadetailstable';
import { Observable, of, Subscription } from 'rxjs';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { FormControl } from '@angular/forms';
import { ReportService } from '@modules/report/_service/report.service';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

export interface Metadata {
  fieldId: string;
  fieldDescri: string;
  isGroup: boolean;
  fldCtrl?: MetadataModel;
  childs: Metadata[];
  fieldType?: ParentField;
}
@Component({
  selector: 'pros-metadatafield-control',
  templateUrl: './metadatafield-control.component.html',
  styleUrls: ['./metadatafield-control.component.scss']
})
export class MetadatafieldControlComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger })
  autoComplete: MatAutocompleteTrigger;

  @Input()
  moduleId: string;

  /**
   * Pre selected values
   */
  @Input()
  selectedFldId: string;

  /**
   * Is multiSelect dropdown
   */
  @Input()
  isMultiSelection: boolean;

  /**
   * mat-label
   */
  @Input()
  lebel: string;

  /**
   * Widget Type
   */
  @Input()
  widgetType: string;

  /**
   * Check Custom data-set is true or not
   */
  @Input()
  isCustomdataset: boolean;

  /**
   * After option selection change event should be emit
   */
  @Output()
  selectionChange: EventEmitter<Metadata> = new EventEmitter<Metadata>();

  fields: Metadata[] = [];
  fieldsObs: Observable<Metadata[]> = of([]);
  fieldFrmCtrl: FormControl = new FormControl('');
  preSelectedCtrl: Metadata | MetadataModel;

  customFields: MetadataModel[];
  customFieldsObs: Observable<MetadataModel[]> = of([]);
  /**
   * All the http or normal subscription will store in this array
   */
  subscriptions: Subscription[] = [];

  /**
   * Static system fields
   */
  systemFields: Metadata[] = [
    {
      fieldId:'STATUS',
      fieldDescri:'Status',
      childs:[],
      isGroup:false
    },
    {
      fieldId:'USERMODIFIED',
      fieldDescri:'User Modified',
      childs:[],
      isGroup:false,
      fldCtrl:{
        picklist: '1',
        dataType: 'AJAX',
        fieldId:'USERMODIFIED',
      } as MetadataModel
    },{
      fieldId:'APPDATE',
      fieldDescri:'Update Date',
      childs:[],
      isGroup:false,
      fldCtrl:{
        picklist: '0',
        dataType: 'DTMS',
        fieldId:'APPDATE',
      } as MetadataModel
    },{
      fieldId:'STAGE',
      fieldDescri:'Creation Date',
      childs:[],
      isGroup:false,
      fldCtrl:{
        picklist: '0',
        dataType: 'DTMS',
        fieldId:'STAGE',
      } as MetadataModel
    }
  ];

  timeseriesFields: Metadata[] = [
    {
      fieldId:'APPDATE',
      fieldDescri:'Update Date',
      childs:[],
      isGroup:false,
      fldCtrl:{
        picklist: '0',
        dataType: 'DTMS',
        fieldId:'APPDATE',
      } as MetadataModel
    },{
      fieldId:'STAGE',
      fieldDescri:'Creation Date',
      childs:[],
      isGroup:false,
      fldCtrl:{
        picklist: '0',
        dataType: 'DTMS',
        fieldId:'STAGE',
      } as MetadataModel
    }
  ];

  constructor(
    private schemaDetailsService: SchemaDetailsService,
    private reportService: ReportService
  ) { }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>{
      sub.unsubscribe();
    });
  }

  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    if(changes && changes.moduleId && changes.moduleId.currentValue !== changes.moduleId.previousValue) {
      this.moduleId = changes.moduleId.currentValue;
      this.getFields();
    }

    if(changes && changes.selectedFldId && changes.selectedFldId.currentValue !== changes.selectedFldId.previousValue) {
      this.preSelectedCtrl = this.returnSelectedFldCtrl(changes.selectedFldId.currentValue);
    }
  }

  ngOnInit(): void {

    this.fieldFrmCtrl.valueChanges.subscribe(val=>{
      if(this.isCustomdataset) {
        if(val && typeof val === 'string' && val.trim() !== '') {
          this.customFieldsObs = of(this.customFields.filter(fil => fil.fieldDescri.toLocaleLowerCase().indexOf(val.toLocaleLowerCase()) !==-1));
        } else {
          this.customFieldsObs = of(this.customFields);
          this.selected(null);
        }
      } else {
        if(val && typeof val === 'string' && val.trim() !== '') {
          const groups = Array.from(this.fields.filter(fil =>fil.isGroup));
          this.fieldsObs = this.filtered(groups, val);
        } else {
          this.fieldsObs = of(this.fields);
          if (typeof val === 'string' && val.trim() === '') {
            this.selected(null);
          }
        }
      }
    })
  }

  filtered(array: Metadata[], text: string): Observable<Metadata[]> {
    const getChildren = (result, object) => {
      const re = new RegExp(text, 'gi');
      if (object.fieldDescri.match(re)) {
        result.push(object);
        return result;
      }
      if (Array.isArray(object.childs)) {
        const children = object.childs.reduce(getChildren, []);
        if (children.length) result.push({ ...object, childs: children });
      }
      return result;
    };
    return of(array.reduce(getChildren, []));
  }

  /**
   * Reopen when user scroll on the outside of the autoComplete box
   */
  openPanel() {
    if (!this.autoComplete.panelOpen) {
      this.autoComplete.openPanel();
    }
  }

  /**
   * Should call http for get all fields
   */
  getFields() {
    if(this.moduleId) {
      if(this.isCustomdataset) {
        const allfldSub = this.reportService.getCustomDatasetFields(this.moduleId).subscribe(response => {
          const res = this.transformCustomFields(response);
          this.customFields = res;
          this.customFieldsObs = of(res);
          if(this.selectedFldId) {
            this.preSelectedCtrl = this.returnSelectedFldCtrl(this.selectedFldId);
          }
        }, error => {
          console.error(`Error : ${error}`);
        });
        this.subscriptions.push(allfldSub);
      } else {
        const allfldSub = this.schemaDetailsService.getMetadataFields(this.moduleId).subscribe(response => {
          const res = this.transformFieldRes(response);
          this.fields = res;
          this.fieldsObs = of(res);
          if(this.selectedFldId) {
            this.preSelectedCtrl = this.returnSelectedFldCtrl(this.selectedFldId);
          }
        }, error => {
          console.error(`Error : ${error}`);
        });
        this.subscriptions.push(allfldSub);
      }
    }
  }

  /**
   * Help to transform data from MetadataModeleResponse to Metadata[]
   * @param response metadata response from server
   */
  transformFieldRes(response: MetadataModeleResponse): Metadata[] {
    const metadata: Metadata[] = [];

    // system fields
    if(this.widgetType === 'TIMESERIES') {
      metadata.push({
        fieldId: 'system_fields',
        fieldDescri: 'System fields',
        isGroup: true,
        childs: this.timeseriesFields
      });
    } else {
      metadata.push({
        fieldId: 'system_fields',
        fieldDescri: 'System fields',
        isGroup: true,
        childs: this.systemFields
      });
    }

    // for header
    const headerChilds: Metadata[] = [];
    if(response.headers && this.widgetType === 'TIMESERIES') {
      Object.keys(response.headers).forEach(header=>{
        const res = response.headers[header];
        if(res.dataType === 'DATS' || res.dataType === 'DTMS') {
          headerChilds.push({
            fieldId: res.fieldId,
            fieldDescri: res.fieldDescri,
            isGroup: false,
            fldCtrl: res,
            childs: []
          });
        }
      });
    } else if(response.headers) {
      Object.keys(response.headers).forEach(header=>{
        const res = response.headers[header];
        headerChilds.push({
          fieldId: res.fieldId,
          fieldDescri: res.fieldDescri,
          isGroup: false,
          fldCtrl: res,
          childs: []
        });
      });
    }
    metadata.push({
      fieldId: 'header_fields',
      fieldDescri: 'Header fields',
      isGroup: true,
      childs: headerChilds
    });


    if(this.widgetType !== 'Table') {

      this.mapHierarchyFields(response, metadata);

      this.mapGridFields(response, metadata)
    }
    // for grid response transformations
    // if(response && response.grids && this.widgetType === 'TIMESERIES') {
    //   Object.keys(response.grids).forEach(grid=>{
    //     const childs : Metadata[] = [];
    //     if(response.gridFields && response.gridFields.hasOwnProperty(grid)) {
    //       Object.keys(response.gridFields[grid]).forEach(fld=>{
    //         const fldCtrl = response.gridFields[grid][fld];
    //         if(fldCtrl.dataType === 'DATS' || fldCtrl.dataType === 'DTMS') {
    //           childs.push({
    //             fieldId: fldCtrl.fieldId,
    //             fieldDescri: fldCtrl.fieldDescri,
    //             isGroup: false,
    //             fldCtrl,
    //             childs:[]
    //           });
    //         }
    //       });
    //     }
    //     metadata.push({
    //       fieldId: grid,
    //       fieldDescri: response.grids[grid].fieldDescri,
    //       isGroup: true,
    //       childs
    //     });
    //   })
    // } else if(response && response.grids) {
    //   Object.keys(response.grids).forEach(grid=>{
    //     const childs : Metadata[] = [];
    //     if(response.gridFields && response.gridFields.hasOwnProperty(grid)) {
    //       Object.keys(response.gridFields[grid]).forEach(fld=>{
    //         const fldCtrl = response.gridFields[grid][fld];
    //           childs.push({
    //             fieldId: fldCtrl.fieldId,
    //             fieldDescri: fldCtrl.fieldDescri,
    //             isGroup: false,
    //             fldCtrl,
    //             childs:[]
    //           });
    //       });
    //     }
    //     metadata.push({
    //       fieldId: grid,
    //       fieldDescri: response.grids[grid].fieldDescri,
    //       isGroup: true,
    //       childs
    //     });
    //   })
    // }

    // for hierarchy response transformations
    // if(response && response.hierarchy  && this.widgetType === 'TIMESERIES') {
    //   response.hierarchy.forEach(hierarchy => {
    //     const childs: Metadata[] = [];
    //     if(response.hierarchyFields && response.hierarchyFields.hasOwnProperty(hierarchy.heirarchyId)) {
    //       Object.keys(response.hierarchyFields[hierarchy.heirarchyId]).forEach(fld=>{
    //         const fldCtrl = response.hierarchyFields[hierarchy.heirarchyId][fld];
    //         if(fldCtrl.dataType === 'DATS' || fldCtrl.dataType === 'DTMS') {
    //           childs.push({
    //             fieldId: fldCtrl.fieldId,
    //             fieldDescri: fldCtrl.fieldDescri,
    //             isGroup: false,
    //             fldCtrl,
    //             childs:[]
    //           });
    //         }
    //       });
    //     }
    //     metadata.push({
    //       fieldId: hierarchy.heirarchyId,
    //       fieldDescri: hierarchy.heirarchyText,
    //       isGroup: true,
    //       childs
    //     });
    //   });
    // }
    // else if(response && response.hierarchy) {
    //   response.hierarchy.forEach(hierarchy => {
    //     const childs: Metadata[] = [];
    //     if(response.hierarchyFields && response.hierarchyFields.hasOwnProperty(hierarchy.heirarchyId)) {
    //       Object.keys(response.hierarchyFields[hierarchy.heirarchyId]).forEach(fld=>{
    //         const fldCtrl = response.hierarchyFields[hierarchy.heirarchyId][fld];
    //           childs.push({
    //             fieldId: fldCtrl.fieldId,
    //             fieldDescri: fldCtrl.fieldDescri,
    //             isGroup: false,
    //             fldCtrl,
    //             childs:[]
    //           });
    //       });
    //     }
    //     metadata.push({
    //       fieldId: hierarchy.heirarchyId,
    //       fieldDescri: hierarchy.heirarchyText,
    //       isGroup: true,
    //       childs
    //     });
    //   });
    // }
    return metadata;
  }

  /**
   * Should return selected field control
   * @param fieldId seldcted field id
   */
  returnSelectedFldCtrl(fieldId: string): Metadata | MetadataModel {
    let returnCtrl;
    if(this.isCustomdataset) {
      this.customFields.forEach(fld=>{
        if(fld.fieldId === fieldId) {
          returnCtrl = fld;
        }
      });
    } else {
      this.fields.forEach(fld=>{
        const match = fld.childs.filter(fil=> fil.fieldId === fieldId);
        if(match.length) {
          returnCtrl = match[0];
        }
      });
    }
    return returnCtrl;
  }

  /**
   * Should return field descriptions
   * @param obj curret render object
   */
  displayFn(obj: Metadata | MetadataModel): string {
    return obj? obj.fieldDescri: null;
  }

  /**
   * Should emit after value change
   * @param option selected option from ui
   */
  selected(option:any) {
    this.selectionChange.emit(option);
  }

  transformCustomFields(response) {
    const metaData = [];
    if (response && this.widgetType === 'TIMESERIES') {
      response.forEach(res => {
        if (res.dataType === 'DATS' || res.dataType === 'DTMS') {
          metaData.push(res);
        }
      });
    } else {
      response.forEach(res => {
        metaData.push(res);
      });
    }
    return metaData;
  }

  public mapHierarchyFields(response: MetadataModeleResponse, metadata: Metadata[]): void{

    if(response && response.hierarchy  && this.widgetType === 'TIMESERIES') {
      response.hierarchy.forEach(hierarchy => {
        const hierarchyChilds: Metadata[] = [];
        if(response.hierarchyFields && response.hierarchyFields.hasOwnProperty(hierarchy.heirarchyId)) {
          Object.keys(response.hierarchyFields[hierarchy.heirarchyId]).forEach(fld=>{
            const hierarchyDesc = response.hierarchy.find((x)=> { return x.heirarchyId === hierarchy.heirarchyId });
            const fldCtrl = response.hierarchyFields[hierarchy.heirarchyId][fld];
            if(fldCtrl.dataType === 'DATS' || fldCtrl.dataType === 'DTMS') {
              hierarchyChilds.push({
                fieldId: fldCtrl.fieldId,
                fieldDescri: fldCtrl.fieldDescri,
                isGroup: false,
                fldCtrl,
                childs:[],
                fieldType: this.getHierarchyParentField(hierarchyDesc)
              });
            }
          });
        }
      });
    }
    else if(response && response.hierarchy) {
      response.hierarchy.forEach(hierarchy => {
        const hierarchyChilds: Metadata[] = [];
        if(response.hierarchyFields && response.hierarchyFields.hasOwnProperty(hierarchy.heirarchyId)) {
          Object.keys(response.hierarchyFields[hierarchy.heirarchyId]).forEach(fld=>{
            const hierarchyDesc = response.hierarchy.find((x)=> { return x.heirarchyId === hierarchy.heirarchyId });
            const fldCtrl = response.hierarchyFields[hierarchy.heirarchyId][fld];
            hierarchyChilds.push({
                fieldId: fldCtrl.fieldId,
                fieldDescri: fldCtrl.fieldDescri,
                isGroup: false,
                fldCtrl,
                childs:[],
                fieldType: this.getHierarchyParentField(hierarchyDesc)
              });
          });
        }

        metadata.push({
          fieldId: hierarchy.heirarchyId,
          fieldDescri: hierarchy.heirarchyText,
          isGroup: true,
          childs: hierarchyChilds
        });
      });
    }
  }

  public mapGridFields(response: MetadataModeleResponse, metadata: Metadata[]): void{

    // for grid response transformations
    if(response && response.grids && this.widgetType === 'TIMESERIES') {
      Object.keys(response.grids).forEach(grid=>{
        const gridChilds: Metadata[] = [];
        if(response.gridFields && response.gridFields.hasOwnProperty(grid)) {
          Object.keys(response.gridFields[grid]).forEach(fld=>{
            const gridDesc =  this.getGridParentField(response.grids[grid]);
            const fldCtrl = response.gridFields[grid][fld];
            if(fldCtrl.dataType === 'DATS' || fldCtrl.dataType === 'DTMS') {
              gridChilds.push({
                fieldId: fldCtrl.fieldId,
                fieldDescri: fldCtrl.fieldDescri,
                isGroup: false,
                fldCtrl,
                childs:[],
                fieldType: gridDesc
              });
            }
          });
        }
      })
    } else if(response && response.grids) {
      Object.keys(response.grids).forEach(grid=>{
        const gridChilds: Metadata[] = [];
        if(response.gridFields && response.gridFields.hasOwnProperty(grid)) {
          Object.keys(response.gridFields[grid]).forEach(fld=>{
            const gridDesc = this.getGridParentField(response.grids[grid]);
            const fldCtrl = response.gridFields[grid][fld];
            gridChilds.push({
                fieldId: fldCtrl.fieldId,
                fieldDescri: fldCtrl.fieldDescri,
                isGroup: false,
                fldCtrl,
                childs:[],
                fieldType: gridDesc
              });
          });
          }
          metadata.push({
          fieldId: grid,
          fieldDescri: response.grids[grid].fieldDescri,
          isGroup: true,
          childs: gridChilds
        });
      })
    }
  }

  getHierarchyParentField(hierarchy: Heirarchy) : ParentField{
    const parentField: ParentField = {
      fieldId: hierarchy?.fieldId,
      fieldDescri: hierarchy?.heirarchyText,
    }
    return parentField;
  }

  getGridParentField(grid: MetadataModel){
    const parentField: ParentField = {
      fieldId: grid?.fieldId,
      fieldDescri: grid?.fieldDescri,
    }
    return parentField;

  }
}

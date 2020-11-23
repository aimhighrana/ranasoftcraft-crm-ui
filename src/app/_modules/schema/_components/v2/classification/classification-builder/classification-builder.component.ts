import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ClassificationNounMod, MetadataModeleResponse, SchemaTableViewFldMap } from '@models/schema/schemadetailstable';
import { SchemaListDetails, SchemaStaticThresholdRes, SchemaVariantsModel } from '@models/schema/schemalist';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { SchemaService } from '@services/home/schema.service';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { SchemaVariantService } from '@services/home/schema/schema-variant.service';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { BehaviorSubject, Subscription, throwError } from 'rxjs';

const definedColumnsMetadata = {
  OBJECTNUMBER: {
    fieldId: 'OBJECTNUMBER',
    fieldDesc: 'Catalog id',
    fieldValue: ''
  }, SHORT_DESC: {
    fieldId: 'SHORT_DESC',
    fieldDesc: 'Short description',
    fieldValue: ''
  }, LONG_DESC: {
    fieldId: 'LONG_DESC',
    fieldDesc: 'Long description',
    fieldValue: ''
  }, MANUFACTURER: {
    fieldId: 'MANUFACTURER',
    fieldDesc: 'Manufacturer',
    fieldValue: ''
  }, MGROUP: {
    fieldId: 'MGROUP',
    fieldDesc: 'Material group',
    fieldValue: ''
  }, MODE_CODE: {
    fieldId: 'MODE_CODE',
    fieldDesc: 'Modifier code',
    fieldValue: ''
  }, MOD_LONG: {
    fieldId: 'MOD_LONG',
    fieldDesc: 'Modifier description',
    fieldValue: ''
  }, MRO_STATUS: {
    fieldId: 'MRO_STATUS',
    fieldDesc: 'Status',
    fieldValue: ''
  }, NOUN_CODE: {
    fieldId: 'NOUN_CODE',
    fieldDesc: 'Noun code',
    fieldValue: ''
  }, NOUN_ID: {
    fieldId: 'NOUN_ID',
    fieldDesc: 'Noun id',
    fieldValue: ''
  }, NOUN_LONG: {
    fieldId: 'NOUN_LONG',
    fieldDesc: 'Noun long description',
    fieldValue: ''
  }, PARTNO: {
    fieldId: 'PARTNO',
    fieldDesc: 'Part number',
    fieldValue: ''
  }, UNSPSC: {
    fieldId: 'UNSPSC',
    fieldDesc: 'UNSPSC',
    fieldValue: ''
  }, UNSPSC_DESC: {
    fieldId: 'UNSPSC_DESC',
    fieldDesc: 'UNSPSC description',
    fieldValue: ''
  },
  MRO_LIBRARY: {
    fieldId: 'MRO_LIBRARY',
    fieldDesc: 'Mro library',
    fieldValue: ''
  }
}



@Component({
  selector: 'pros-classification-builder',
  templateUrl: './classification-builder.component.html',
  styleUrls: ['./classification-builder.component.scss']
})
export class ClassificationBuilderComponent implements OnInit, OnChanges {


  @Input()
  schemaId: string;

  @Input()
  moduleId: string;

  @Input()
  variantId: string;

  @Input()
  activeTab: string;

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
  rulesNounMods: ClassificationNounMod = { BR_MRO_LIBRARY: { info: [] }, gsn: { info: [] } } as ClassificationNounMod;

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
  startColumns = ['checkbox_select', 'assigned_bucket', 'action'];


  displayedColumns: BehaviorSubject<string[]> = new BehaviorSubject(this.startColumns);

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);

  constructor(
    private schemaDetailService: SchemaDetailsService,
    private schemaService: SchemaService,
    private schemaListService: SchemalistService,
    private schemavariantService: SchemaVariantService,
    private sharedServices: SharedServiceService,
    private router: Router
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.moduleId && changes.moduleId.previousValue !== changes.moduleId.currentValue) {
      this.moduleId = changes.moduleId.currentValue;
      this.getFldMetadata();
    }

    if (changes && changes.schemaId && changes.schemaId.currentValue !== changes.schemaId.previousValue) {
      this.schemaId = changes.schemaId.currentValue;
      this.getDataScope();
      this.getSchemaStatics();
      this.getSchemaDetails();
      // this.getFieldsByUserView();
    }

    if (changes && changes.variantId && changes.variantId.currentValue !== changes.variantId.previousValue) {
      this.variantId = changes.variantId.currentValue;
    }


  }

  ngOnInit(): void {

    const definedColumnOrder = Object.keys(definedColumnsMetadata);
    const previousCls = this.displayedColumns.getValue();
    definedColumnOrder.forEach(e => previousCls.push(e));
    this.displayedColumns.next(previousCls);

    /**
     * Combine obserable for metadata and selected field by user
     * And calcute display field amd order
     */
    // combineLatest([this.metadata, this.selectedFieldsOb]).subscribe(res => {
    //   if (res[0]) {
    //     const userSelectedFields = this.selectedFieldsOb.getValue();
    //     if (userSelectedFields) {
    //       const defaultCols = this.displayedColumns.getValue();
    //       const cols = []; defaultCols.forEach(f=> cols.push(f));
    //       const rr = userSelectedFields.map(map => map.fieldId); cols.push(...rr);
    //       this.displayedColumns.next(cols);
    //     } else {
    //       const definedColumnOrder = Object.keys(definedColumnsMetadata);
    //       const previousCls = this.displayedColumns.getValue();
    //       definedColumnOrder.forEach(e => previousCls.push(e));
    //       this.displayedColumns.next(previousCls);
    //     }
    //   }
    // });

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
      this.getClassificationNounMod();
    }, error => console.error(`Error : ${error.message}`));
    this.subsribers.push(sub);
  }

  /**
   * Get classification nouns and modifiers .
   */
  getClassificationNounMod() {
    const sub = this.schemaDetailService.getClassificationNounMod(this.schemaId, this.schemaInfo.runId, this.variantId).subscribe(res => {
      this.rulesNounMods = res;
      if (this.rulesNounMods.BR_MRO_LIBRARY && this.rulesNounMods.BR_MRO_LIBRARY.info) {
        const fisrtNoun = this.rulesNounMods.BR_MRO_LIBRARY.info[0];
        const modifierCode = fisrtNoun.modifier[0] ? fisrtNoun.modifier[0].modCode : '';
        if (modifierCode && fisrtNoun.nounCode) {
          this.applyFilter(fisrtNoun.nounCode, modifierCode, 'BR_MRO_LIBRARY');
        }
      }
    }, err => console.error(`Execption while fetching .. classification noun and mod. ${err.message}`));
    this.subsribers.push(sub);
  }

  /**
   * Get data scopes .. or variats ...
   */
  getDataScope() {
    const sub = this.schemavariantService.getDataScope(this.schemaId, 'RUNFOR').subscribe(res => {
      this.dataScope = res;
    }, err => console.error(`Exception : ${err.message}`));
    this.subsribers.push(sub);
  }

  applyFilter(nounCode: string, modifierCode: string, brType: string) {
    const sub = this.schemaDetailService.getClassificationData(this.schemaId, this.schemaInfo.runId, nounCode, modifierCode, brType, '').subscribe(res => {
      console.log(res);
      // TODO ..
      console.log(`---After transformation --`);
      const actualData = this.transformData(res);
      const columns = Object.keys(actualData[0]);
      const disPlayedCols = this.displayedColumns.getValue();
      columns.forEach(key => {
        if (disPlayedCols.indexOf(key) === -1) {
          disPlayedCols.push(key);
        }
        definedColumnsMetadata[key] = actualData[0][key];
      });
      this.displayedColumns.next(disPlayedCols);
      this.dataSource = new MatTableDataSource<any>(actualData);
      console.log(this.transformData(res));
    }, err => console.error(`Exception while getting data : ${err.message}`));
    this.subsribers.push(sub);
    console.log(`nounCode : ${nounCode} and modifier ${modifierCode}`)
  }


  transformData(res: any): any {
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
              const ob = definedColumnsMetadata[col];
              ob.fieldValue = columns[col] ? columns[col] : '';
              rowData.OBJECTNUMBER = ob;
              break;

            case 'LONG_DESC':
              const longDesc = definedColumnsMetadata[col];
              longDesc.fieldValue = columns[col] ? columns[col] : '';
              rowData.LONG_DESC = longDesc;
              break;

            case 'MANUFACTURER':
              const manufacturer = definedColumnsMetadata[col];
              manufacturer.fieldValue = columns[col] ? columns[col] : '';
              rowData.MANUFACTURER = manufacturer;
              break;

            case 'MGROUP':
              const mggroup = definedColumnsMetadata[col];
              mggroup.fieldValue = columns[col] ? columns[col] : '';
              rowData.MGROUP = mggroup;
              break;

            case 'MODE_CODE':
              const modeCode = definedColumnsMetadata[col];
              modeCode.fieldValue = columns[col] ? columns[col] : '';
              rowData.MODE_CODE = modeCode;
              break;

            case 'MOD_LONG':
              const modLong = definedColumnsMetadata[col];
              modLong.fieldValue = columns[col] ? columns[col] : '';
              rowData.MOD_LONG = modLong;
              break;


            case 'MRO_STATUS':
              const mroStatus = definedColumnsMetadata[col];
              mroStatus.fieldValue = columns[col] ? columns[col] : '';
              rowData.MRO_STATUS = mroStatus;
              break;


            case 'MRO_LIBRARY':
              const mroLib = definedColumnsMetadata[col];
              mroLib.fieldValue = columns[col] ? columns[col] : '';
              rowData.MRO_LIBRARY = mroLib;
              break;


            case 'NOUN_CODE':
              const nounCode = definedColumnsMetadata[col];
              nounCode.fieldValue = columns[col] ? columns[col] : '';
              rowData.NOUN_CODE = nounCode;
              break;



            case 'NOUN_ID':
              const nounId = definedColumnsMetadata[col];
              nounId.fieldValue = columns[col] ? columns[col] : '';
              rowData.NOUN_ID = nounId;
              break;



            case 'NOUN_LONG':
              const nounLong = definedColumnsMetadata[col];
              nounLong.fieldValue = columns[col] ? columns[col] : '';
              rowData.NOUN_LONG = nounLong;
              break;


            case 'PARTNO':
              const partNo = definedColumnsMetadata[col];
              partNo.fieldValue = columns[col] ? columns[col] : '';
              rowData.PARTNO = partNo;
              break;


            case 'SHORT_DESC':
              const shortDesc = definedColumnsMetadata[col];
              shortDesc.fieldValue = columns[col] ? columns[col] : '';
              rowData.SHORT_DESC = shortDesc;
              break;



            case 'UNSPSC':
              const unspsc = definedColumnsMetadata[col];
              unspsc.fieldValue = columns[col] ? columns[col] : '';
              rowData.UNSPSC = unspsc;
              break;



            case 'UNSPSC_DESC':
              const unspscDesc = definedColumnsMetadata[col];
              unspscDesc.fieldValue = columns[col] ? columns[col] : '';
              rowData.UNSPSC_DESC = unspscDesc;
              break;


            case 'ATTRIBUTES':
              const attributest = columns[col] ? columns[col] : [];
              attributest.forEach(att => {
                const attrCode = att.ATTR_CODE;
                const attrDesc = att.ATTR_DESC;
                const attrVal = att.ATTRIBUTES_VALUES ? att.ATTRIBUTES_VALUES : [];
                let attrValue = '';
                if (attrVal[0]) {
                  attrValue = attrVal[0].SHORT_VALUE;
                }

                rowData[attrCode] = { fieldId: attrCode, fieldDesc: attrDesc, fieldValue: attrValue };
              });
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
   * Oen choose column side sheet ..
   */
  openTableColumnSettings() {
    const metadadata: MetadataModeleResponse = { headers: definedColumnsMetadata } as MetadataModeleResponse;
    const fields = this.displayedColumns.getValue();
    const array: string[] = [];
    fields.forEach(f => array.push(f));
    const data = { schemaId: this.schemaId, variantId: this.variantId, fields: metadadata, selectedFields: array }
    this.sharedServices.setChooseColumnData(data);
    this.router.navigate(['', { outlets: { sb: 'sb/schema/table-column-settings' }, queryParams: { status: this.activeTab } }]);
  }


  columnName(columnId): string {
    return definedColumnsMetadata[columnId] ? definedColumnsMetadata[columnId].fieldDesc : columnId;
  }

}

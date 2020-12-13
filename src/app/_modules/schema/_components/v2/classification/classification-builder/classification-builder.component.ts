import { SelectionModel } from '@angular/cdk/collections';
import { Component, ComponentFactoryResolver, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewContainerRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ClassificationNounMod, MetadataModeleResponse, SchemaMROCorrectionReq, SchemaTableViewFldMap } from '@models/schema/schemadetailstable';
import { SchemaListDetails, SchemaStaticThresholdRes, SchemaVariantsModel } from '@models/schema/schemalist';
import { CellDataFor, ClassificationDatatableCellEditableComponent } from '@modules/shared/_components/classification-datatable-cell-editable/classification-datatable-cell-editable.component';
import { ContainerRefDirective } from '@modules/shared/_directives/container-ref.directive';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { GlobaldialogService } from '@services/globaldialog.service';
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
  },
  // LONG_DESC: {
  //   fieldId: 'LONG_DESC',
  //   fieldDesc: 'Long description',
  //   fieldValue: ''
  // },
   MANUFACTURER: {
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
    fieldValue: '',
    isEditable: true
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
    fieldValue: '',
    isEditable: true
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
export class ClassificationBuilderComponent implements OnInit, OnChanges, OnDestroy {


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
  rulesNounMods: ClassificationNounMod = { mro_local_lib: { info: [] }, mro_gsn_lib: { info: [] } } as ClassificationNounMod;

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
  startColumns = ['checkbox_select', 'assigned_bucket'];


  dataFrm: string = 'mro_local_lib' || 'mro_gsn_lib';

  /**
   * Store data of table for next suggestion
   */
  tableData: any;


  /**
   * Store info about views ..
   * if has correction loaded then value should be correction
   */
  viewOf: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  displayedColumns: BehaviorSubject<string[]> = new BehaviorSubject(this.startColumns);

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);

  constructor(
    private schemaDetailService: SchemaDetailsService,
    private schemaService: SchemaService,
    private schemaListService: SchemalistService,
    private schemavariantService: SchemaVariantService,
    private sharedServices: SharedServiceService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private snackBar: MatSnackBar,
    private globalDialogService: GlobaldialogService
  ) { }


  ngOnDestroy(): void {
    this.subsribers.forEach(sub=>{
      sub.unsubscribe();
    });
    this.displayedColumns.complete();
    this.displayedColumns.unsubscribe();
    this.viewOf.complete();
    this.viewOf.unsubscribe();
  }

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

    this.sharedServices.getDataScope().subscribe(res => {
      if (res) {
        this.getDataScope();
      }
    })

    const definedColumnOrder = Object.keys(definedColumnsMetadata);
    const previousCls = this.displayedColumns.getValue();
    definedColumnOrder.forEach(e => previousCls.push(e));
    this.displayedColumns.next(previousCls);

    this.viewOf.subscribe(res=>{
      if(res !== null) {
        this.getClassificationNounMod();
      }
    });
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
  getClassificationNounMod(searchStrng?: string) {
    const viewFor: string = this.viewOf.getValue();
    const sub = this.schemaDetailService.getClassificationNounMod(this.schemaId, this.schemaInfo.runId,viewFor, this.variantId, searchStrng).subscribe(res => {
      this.rulesNounMods = res;
      if (this.rulesNounMods.mro_local_lib && this.rulesNounMods.mro_local_lib.info) {
        const fisrtNoun = this.rulesNounMods.mro_local_lib.info[0];
        const modifierCode = fisrtNoun.modifier[0] ? fisrtNoun.modifier[0].modCode : '';
        if (modifierCode && fisrtNoun.nounCode) {
          this.dataFrm = 'mro_local_lib';
          this.applyFilter(fisrtNoun.nounCode, modifierCode, 'mro_local_lib');
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
    this.dataFrm = brType;
    const sub = this.schemaDetailService.getClassificationData(this.schemaId, this.schemaInfo.runId, nounCode, modifierCode, brType,this.viewOf.getValue(), '').subscribe(res => {
      this.tableData = res ? res : [];
      if(res) {
        this.tableData = res;
        const actualData = this.transformData(res, brType);
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
      } else {
        this.dataSource = new MatTableDataSource<any>([]);
      }
    }, err => console.error(`Exception while getting data : ${err.message}`));
    this.subsribers.push(sub);
    console.log(`nounCode : ${nounCode} and modifier ${modifierCode}`)
  }


  transformData(res: any, brType: string): any {
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
              const ob = { fieldId: col, fieldDesc: { fieldId: col, fieldDesc: definedColumnsMetadata[col].fieldDesc,fieldValue: ''}.fieldDesc,fieldValue: ''};
              ob.fieldValue = objNr ? objNr : '';
              rowData.OBJECTNUMBER = ob;
              break;

            // case 'LONG_DESC':
            //   const longDesc = { fieldId: col, fieldDesc: definedColumnsMetadata[col].fieldDesc,fieldValue: ''};
            //   longDesc.fieldValue = columns[col] ? columns[col] : '';
            //   rowData.LONG_DESC = longDesc;
            //   break;

            case 'MANUFACTURER':
              const manufacturer = { fieldId: col, fieldDesc: { fieldId: col, fieldDesc: definedColumnsMetadata[col].fieldDesc,fieldValue: ''}.fieldDesc,fieldValue: ''};
              manufacturer.fieldValue = columns[col] ? columns[col] : '';
              rowData.MANUFACTURER = manufacturer;
              break;

            case 'MGROUP':
              const mggroup = { fieldId: col, fieldDesc: definedColumnsMetadata[col].fieldDesc,fieldValue: ''};
              mggroup.fieldValue = columns[col] ? columns[col] : '';
              rowData.MGROUP = mggroup;
              break;

            case 'MODE_CODE':
              const modeCode = { fieldId: col, fieldDesc: definedColumnsMetadata[col].fieldDesc,fieldValue: '', isEditable: true};
              modeCode.fieldValue = columns[col] ? columns[col] : '';
              rowData.MODE_CODE = modeCode;
              break;

            case 'MOD_LONG':
              const modLong = { fieldId: col, fieldDesc: definedColumnsMetadata[col].fieldDesc,fieldValue: ''};
              modLong.fieldValue = columns[col] ? columns[col] : '';
              rowData.MOD_LONG = modLong;
              break;


            case 'MRO_STATUS':
              const mroStatus = { fieldId: col, fieldDesc: definedColumnsMetadata[col].fieldDesc,fieldValue: ''};
              mroStatus.fieldValue = columns[col] ? columns[col] : '';
              rowData.MRO_STATUS = mroStatus;
              break;


            case 'MRO_LIBRARY':
              const mroLib = { fieldId: col, fieldDesc: definedColumnsMetadata[col].fieldDesc,fieldValue: ''};
              mroLib.fieldValue = columns[col] ? columns[col] : '';
              rowData.MRO_LIBRARY = mroLib;
              break;


            case 'NOUN_CODE':
              const nounCode = { fieldId: col, fieldDesc: definedColumnsMetadata[col].fieldDesc,fieldValue: '', isEditable: true};
              nounCode.fieldValue = columns[col] ? columns[col] : '';
              rowData.NOUN_CODE = nounCode;
              break;



            case 'NOUN_ID':
              const nounId = { fieldId: col, fieldDesc: definedColumnsMetadata[col].fieldDesc,fieldValue: ''};
              nounId.fieldValue = columns[col] ? columns[col] : '';
              rowData.NOUN_ID = nounId;
              break;



            case 'NOUN_LONG':
              const nounLong = { fieldId: col, fieldDesc: definedColumnsMetadata[col].fieldDesc,fieldValue: ''};
              nounLong.fieldValue = columns[col] ? columns[col] : '';
              rowData.NOUN_LONG = nounLong;
              break;


            case 'PARTNO':
              const partNo = { fieldId: col, fieldDesc: definedColumnsMetadata[col].fieldDesc,fieldValue: ''};
              partNo.fieldValue = columns[col] ? columns[col] : '';
              rowData.PARTNO = partNo;
              break;


            case 'SHORT_DESC':
              const shortDesc = { fieldId: col, fieldDesc: definedColumnsMetadata[col].fieldDesc,fieldValue: ''};
              shortDesc.fieldValue = columns[col] ? columns[col] : '';
              rowData.SHORT_DESC = shortDesc;
              break;



            case 'UNSPSC':
              const unspsc = { fieldId: col, fieldDesc: definedColumnsMetadata[col].fieldDesc,fieldValue: ''};
              unspsc.fieldValue = columns[col] ? columns[col] : '';
              rowData.UNSPSC = unspsc;
              break;



            case 'UNSPSC_DESC':
              const unspscDesc = { fieldId: col, fieldDesc: definedColumnsMetadata[col].fieldDesc,fieldValue: ''};
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
                if (attrVal[0] && brType!== 'mro_local_lib') {
                  attrValue = attrVal[0].SHORT_VALUE;
                }

                rowData[attrCode] = { fieldId: attrCode, fieldDesc: attrDesc, fieldValue: attrValue, isEditable: true };
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
   *
   * @param fldid editable field id
   * @param row entire row should be here
   */
  editCurrentCell(fldid: string, row: any, rIndex: number,containerRef: ContainerRefDirective) {
    const objNr = row.OBJECTNUMBER ? row.OBJECTNUMBER.fieldValue : '';

    const selcFldCtrl = row[fldid] ? row[fldid].isEditable : null;
    if(selcFldCtrl === null || !selcFldCtrl) {
      console.log(`Can\'t edit not editable `);
      return false;
    }

    if(document.getElementById('inpctrl_'+fldid + '_' + rIndex)) {
      const inpCtrl = document.getElementById('inpctrl_'+fldid + '_'+ rIndex) as HTMLDivElement;
      const viewCtrl = document.getElementById('viewctrl_'+fldid + '_' + rIndex) as HTMLSpanElement;
      // const inpValCtrl = document.getElementById('inp_'+ fldid + '_' + rIndex) as HTMLInputElement;

      inpCtrl.style.display = 'block';
      // inpValCtrl.focus();
      viewCtrl.style.display = 'none';

      const nounCode = row.NOUN_CODE ? row.NOUN_CODE.fieldValue : '';
      const modCode = row.MODE_CODE ? row.MODE_CODE.fieldValue : '';

      // add a dynamic cell input component
      this.addDynamicInput(fldid, row, rIndex,objNr,containerRef, nounCode, modCode);

    }
  }

  /**
   * After value change on & also call service for do correction
   * @param fldid fieldid that have blur triggered
   * @param value current changed value
   * @param row row data ..
   */
  emitEditBlurChng(fldid: string, value: any, row: any, rIndex: number,celldataFor: CellDataFor, viewContainerRef? : ViewContainerRef) {

    if(document.getElementById('inpctrl_'+fldid + '_' + rIndex)) {

      // DOM control after value change ...
      const inpCtrl = document.getElementById('inpctrl_'+fldid + '_'+ rIndex) as HTMLDivElement;
      const viewCtrl = document.getElementById('viewctrl_'+fldid + '_' + rIndex) as HTMLSpanElement;

      // clear the dynamic cell input component
      viewContainerRef.clear();

      inpCtrl.style.display = 'none';
      viewCtrl.innerText = value;
      viewCtrl.style.display = 'block';

      // DO correction call for data
      const objctNumber = row.OBJECTNUMBER.fieldValue;

      const oldVal = row[fldid] ? row[fldid].fieldValue : '';
      if(objctNumber && oldVal !== value) {
        const correctionReq: SchemaMROCorrectionReq = {id: objctNumber,masterLibrary: (this.dataFrm === 'mro_local_lib' ? true : false)} as SchemaMROCorrectionReq;
        if(fldid === 'NOUN_CODE') {
          correctionReq.nounCodeoc = oldVal;
          correctionReq.nounCodevc = value;
        } else if(fldid === 'MODE_CODE') {
          correctionReq.modCodeoc = oldVal;
          correctionReq.modCodevc = value;
        }

        this.schemaDetailService.doCorrectionForClassification(this.schemaId, fldid, correctionReq).subscribe(res=>{
          row[fldid].fieldValue = value;
          if(res.acknowledge) {
            this.statics.correctedCnt = res.count? res.count : 0;
          }
        }, error=>{
          this.snackBar.open(`${error.message}`, 'Close',{duration:2000});
          console.error(`Error :: ${error.message}`);
        });
      } else {
        console.error(`Wrong with object number or can't change if old and new same  ... `);
      }
    }

  }

  addDynamicInput(fldid: string, row: any, rIndex: number,objectNumber: string, containerRef: ContainerRefDirective, nounCode?: string, modCode?: string){

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      ClassificationDatatableCellEditableComponent
    );


      let celldataFor = CellDataFor.LOCAL_NOUN;
      if(fldid === 'NOUN_CODE' && this.dataFrm === 'mro_local_lib') {
        celldataFor = CellDataFor.LOCAL_NOUN;
      } else if(fldid === 'MODE_CODE' && this.dataFrm === 'mro_local_lib') {
        celldataFor = CellDataFor.LOCAL_MODIFIER;
      } else if(fldid === 'ATTR_CODE' && this.dataFrm === 'mro_local_lib') {
        celldataFor = CellDataFor.LOCAL_ATTRIBUTE;
      } else if(fldid === 'NOUN_CODE' && this.dataFrm === 'mro_gsn_lib') {
        celldataFor = CellDataFor.GSN_NOUN;
      } else if(fldid === 'MODE_CODE' && this.dataFrm === 'mro_gsn_lib') {
        celldataFor = CellDataFor.GSN_MODIFIER;
      } else if(fldid === 'ATTR_CODE' && this.dataFrm === 'mro_gsn_lib') {
        celldataFor = CellDataFor.GSN_ATTRIBUTE;
      }



    // add the input component to the cell
    const componentRef = containerRef.viewContainerRef.createComponent(componentFactory);
    // binding dynamic component inputs/outputs
    componentRef.instance.fieldId = fldid;
    componentRef.instance.cellDataFor = celldataFor;
    componentRef.instance.schemaId = this.schemaId;
    componentRef.instance.rundId = this.schemaInfo.runId;
    componentRef.instance.objectNumber = objectNumber;
    componentRef.instance.nounCode = nounCode;
    componentRef.instance.modCode = modCode;
    componentRef.instance.brType = this.dataFrm;
    componentRef.instance.inputBlur.subscribe(value => this.emitEditBlurChng(fldid, value, row, rIndex, celldataFor, containerRef.viewContainerRef));

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

  /**
   * Function to open data scope side sheet
   */
  openDataScopeSideSheet() {
    this.router.navigate([{ outlets: { sb: `sb/schema/data-scope/${this.moduleId}/${this.schemaId}/new` } }])
  }

  /**
   * Function to open summary side sheet of schema
   */
  openSummarySideSheet() {
    this.router.navigate([{ outlets: { sb: `sb/schema/check-data/${this.moduleId}/${this.schemaId}` } }])
  }

  /**
   * open attribute mapping side sheet
   */
  openAttributeMapping(nounCode, modCode) {
    this.router.navigate(['', { outlets: { sb: `sb/schema/attribute-mapping/${this.moduleId}/${nounCode}/${modCode}` } }])
  }
}

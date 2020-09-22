import { Component, OnInit, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Widget, WidgetType, ReportDashboardReq, WidgetTableModel, ChartType, Orientation, DatalabelsPosition, LegendPosition, BlockType,TimeseriesStartDate, Criteria, OrderWith,SeriesWith } from '../../_models/widget';
import { Observable, of, BehaviorSubject, Subscription } from 'rxjs';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ReportService } from '../../_service/report.service';
import { MetadataModel, MetadataModeleResponse } from 'src/app/_models/schema/schemadetailstable';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ObjectTypeResponse, WorkflowResponse, WorkflowPath } from 'src/app/_models/schema/schema';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import * as moment from 'moment';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { DropDownValue, ConditionalOperator } from '@modules/admin/_components/module/business-rules/business-rules.modal';

@Component({
  selector: 'pros-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class ContainerComponent implements OnInit, AfterViewInit, OnDestroy {

  showProperty = false;
  screenWidth: number;
  pixcel = 200; // Initial 200
  eachBoxSize = 0;

  // for background-color or additinal dynamic css on main container
  containerCss: any = {};

  widgetList: Widget[] = [];
  selStyleWid: Widget;
  styleCtrlGrp: FormGroup;
  fields: BehaviorSubject<MetadataModeleResponse> = new BehaviorSubject<MetadataModeleResponse>(null);
  wfFields: BehaviorSubject<MetadataModel[]> = new BehaviorSubject<MetadataModel[]>(null);
  headerFields: Observable<MetadataModel[]> = of([]);
  workflowFields: Observable<MetadataModel[]> = of([]);
  reportId: string;
  reportName = '';
  chooseColumns: WidgetTableModel[] = [];
  dataSets: ObjectTypeResponse[];
  dataSetOb: Observable<ObjectTypeResponse[]> = of([]);

  dataSetsWorkFlow: WorkflowResponse[];
  dataSetWorkflow: Observable<WorkflowResponse[]> = of([]);

  chartPropCtrlGrp: FormGroup;

  defaultFilterCtrlGrp: FormGroup;

  recordsCount: number;

  collaboratorPermission = false;

  conditionalOperators: ConditionalOperator[] = this.possibleOperators;

  dropValues: DropDownValue[];
  dropValuesOb: Observable<DropDownValue[]> = of([]);

  workflowPath: WorkflowPath[];
  workflowPathOb: Observable<WorkflowPath[]> = of([])
  /**
   * All the http or normal subscription will store in this array
   */
  subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private reportService: ReportService,
    private snackbar: MatSnackBar,
    private activatedRouter: ActivatedRoute,
    private elementRef: ElementRef,
    private schemaService: SchemaService,
    private schemaDetailsService: SchemaDetailsService,
    private sharedService: SharedServiceService,
  ) { }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }
  ngAfterViewInit(): void {
    if (this.elementRef.nativeElement) {
      const screenWidth = document.body.offsetWidth;
      this.screenWidth = screenWidth;
      this.eachBoxSize = this.screenWidth / this.pixcel;
      console.log(`Screen width : ${screenWidth}`);

      this.containerCss = { 'background-size': `${this.eachBoxSize}px ${this.eachBoxSize}px` };
    }
  }

  ngOnInit(): void {
    this.getAllObjectType();

    const sub = this.activatedRouter.params.subscribe(params => {
      this.reportId = params.id ? ((params.id).toLowerCase() === 'new' ? '' : params.id) : '';
      if (this.reportId) {
        this.getReportConfig(this.reportId);
      } else {
        this.widgetList = [];
        this.reportName = '';
        this.collaboratorPermission = true;
      }
    });
    this.subscriptions.push(sub);

    this.styleCtrlGrp = this.formBuilder.group({
      widgetName: [''],
      width: [''],
      height: [''],
      field: [''],
      aggregrationOp: [''],
      filterType: [''],
      isMultiSelect: [false],
      groupById: [''],
      objectType: [''],
      imageUrl: [''],
      htmlText: [''],
      imagesno: [''],
      imageName: [''],
      dateSelectionType: [],
      startDate: [''],
      endDate: [''],
      isWorkflowdataSet: [false],
      workflowPath:['']
    });

    this.chartPropCtrlGrp = this.formBuilder.group({
      chartType: [ChartType.BAR],
      orientation: [Orientation.VERTICAL],
      isEnableDatalabels: [false],
      datalabelsPosition: [DatalabelsPosition.center],
      isEnableLegend: [false],
      legendPosition: [LegendPosition.top],
      xAxisLabel: [''],
      yAxisLabel: [''],
      orderWith: [OrderWith.DESC],
      scaleFrom: [''],
      scaleTo:[''],
      stepSize:[''],
      dataSetSize:[''],
      seriesWith:[SeriesWith.day],
      seriesFormat:[''],
      blankValueAlias:[''],
      timeseriesStartDate:[TimeseriesStartDate.D7],
    });

    this.defaultFilterCtrlGrp = this.formBuilder.group({
      filters: this.formBuilder.array([])
    });

    this.styleCtrlGrp.valueChanges.subscribe(latestVal => {
      if (this.selStyleWid) {
        const changedWidget = this.selStyleWid;
        changedWidget.height = latestVal.height;
        changedWidget.width = latestVal.width;
        changedWidget.widgetTitle = latestVal.widgetName;
        changedWidget.field =  typeof latestVal.field ==='string' ? latestVal.field : latestVal.field.fieldId;
        changedWidget.aggregrationOp = latestVal.aggregrationOp;
        changedWidget.filterType = latestVal.filterType;
        changedWidget.isMultiSelect = latestVal.isMultiSelect;
        changedWidget.groupById = latestVal.groupById;
        changedWidget.objectType = latestVal.objectType.startsWith('wf_') ? latestVal.objectType.split('wf_')[1] : latestVal.objectType;
        changedWidget.imageUrl = latestVal.imageUrl;
        changedWidget.htmlText = latestVal.htmlText;
        changedWidget.imagesno = latestVal.imagesno;
        changedWidget.imageName = latestVal.imageName;
        changedWidget.isWorkflowdataSet = latestVal.isWorkflowdataSet;
        changedWidget.workflowPath = latestVal.workflowPath;

        // hold selected field control
        if( typeof latestVal.field !== 'string'){
          changedWidget.fieldCtrl = latestVal.field;
        }

        // while changing date default filter ...
        let strtDate = latestVal.startDate;
        if(latestVal.startDate) {
          try {
            strtDate = moment(latestVal.startDate, 'MM/DD/YYYY', true).toDate().getTime();
          } catch (error) {
            console.error( `Error :`, error);
          }
        }

        let endDate = latestVal.endDate;
        if(latestVal.endDate) {
          try {
            endDate = moment(latestVal.endDate, 'MM/DD/YYYY', true).toDate().getTime();
          } catch (error) {
            console.error( `Error :`, error);
          }
        }

        changedWidget.dateFilterCtrl = {
          dateSelectedFor: latestVal.dateSelectionType,
          endDate,
          startDate: strtDate
        };

        this.preapreNewWidgetPosition(changedWidget);
      }
    });

    // detect value change on chart properties
    this.chartPropCtrlGrp.valueChanges.subscribe(latestProp => {
      if (latestProp) {
        this.selStyleWid.chartProperties = latestProp;
        this.preapreNewWidgetPosition(this.selStyleWid);
      }
    });

    // detect value change on default filters
    this.defaultFilterCtrlGrp.valueChanges.subscribe(latestProp => {
      if (latestProp && latestProp.hasOwnProperty('filters')) {
        this.selStyleWid.defaultFilters = latestProp.filters;
        this.preapreNewWidgetPosition(this.selStyleWid);
      }
    });

    const styleSub = this.styleCtrlGrp.get('objectType').valueChanges.subscribe(fillData => {
      if (fillData && typeof fillData === 'string' && fillData.startsWith('wf_')) {
        fillData = fillData.split('wf_')[1];
        if (fillData !== this.styleCtrlGrp.value.objectType) {
          this.getWorkFlowFields(fillData);
          this.getRecordCount(fillData);
          this.getWorkFlowPathDetails(fillData);
          this.styleCtrlGrp.get('isWorkflowdataSet').setValue(true);
        }
      } else {
        if (fillData.objectid  !== this.styleCtrlGrp.value.objectType) {
          this.getAllFields(fillData);
          this.getRecordCount(fillData);
          this.styleCtrlGrp.get('isWorkflowdataSet').setValue(false);
        }
      }
    });

    this.subscriptions.push(styleSub);

    const fldSub = this.fields.subscribe(flds => {
      if (flds) {
        const headerArray: MetadataModel[] = [];
        for (const obj in flds.headers) {
          if (flds.headers.hasOwnProperty(obj)) {
            headerArray.push(flds.headers[obj]);
          }
        }
        this.headerFields = of(headerArray);
      }
    });

    const wfldSub = this.wfFields.subscribe(flds => {
      if (flds) {
        const workFlowFieldsArray: MetadataModel[] = [];
        for (const obj in flds) {
          if (flds.hasOwnProperty(obj)) {
            workFlowFieldsArray.push(flds[obj]);
          }
        }
        this.workflowFields = of(workFlowFieldsArray);
      }
    })
    this.subscriptions.push(fldSub);
    this.subscriptions.push(wfldSub)
  }


  getReportConfig(reportId: string) {
    const reportConfig = this.reportService.getReportConfi(reportId).subscribe(res => {
      this.widgetList = res.widgets;
      this.reportId = res.reportId;
      this.reportName = res.reportName;
      this.collaboratorPermission = res.permission ? res.permission.isAdmin : false;
    }, error => console.error(`Error: ${error}`));
    this.subscriptions.push(reportConfig);
  }

  getdropDownValues(fieldId: string, queryString: string) {
    this.schemaService.dropDownValues(fieldId, queryString).subscribe(res => {
      this.dropValues = res;
      this.dropValuesOb = of(res);
    }, error => console.error(`Error: ${error}`))
  }

  getAllFields(objNum: string) {
    const allfldSub = this.schemaDetailsService.getMetadataFields(objNum).subscribe(response => {
      this.fields.next(response);
    }, error => {
      console.error(`Error : ${error}`);
    });
    this.subscriptions.push(allfldSub);
  }

  getWorkFlowFields(objectType: string) {
    const workflowFields = this.schemaDetailsService.getWorkflowFields(objectType).subscribe(response => {
      this.wfFields.next(response);
    }, error => {
      console.error(`Error : ${error}`);
    });
    this.subscriptions.push(workflowFields);
  }

  getAllObjectType() {
    const objSub = this.schemaService.getAllObjectType().subscribe(res => {
      this.dataSets = res;
      this.dataSetOb = of(res);
    }, error => console.error(`Error: ${error}`));
    this.subscriptions.push(objSub);

    const workflowSub = this.schemaService.getWorkflowData().subscribe(res => {
      this.dataSetsWorkFlow = res;
      this.dataSetWorkflow = of(res);
    }, error => console.error(`Error: ${error}`));
    this.subscriptions.push(workflowSub);
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
    const movedX = event.distance.x;
    const movedY = event.distance.y;
    console.log(event.item.element.nativeElement);
    console.log(`Moved x: ${movedX} , and moved y : ${movedY}`);

    // drop added widget
    let dropableWidget = new Widget();
    if (event.item.element.nativeElement.id) {
      dropableWidget = this.widgetList.filter(wid => (String(wid.widgetId) === event.item.element.nativeElement.id))[0];
    } else {
      const widgetType = event.item.element.nativeElement.getAttribute('widgetType');
      dropableWidget.x = 0;
      dropableWidget.y = 0;
      dropableWidget.height = 22;
      dropableWidget.width = 40;

      // set default height to table
      if (widgetType === 'TABLE_LIST') {
        dropableWidget.height = 585 / this.eachBoxSize;
        dropableWidget.width = 300 / this.eachBoxSize;
      }
      dropableWidget.widgetId = String(new Date().getTime());
      dropableWidget.widgetType = widgetType as WidgetType;
    }
    const boxX = Math.round(((dropableWidget.x * this.eachBoxSize) + movedX) / this.eachBoxSize);
    const boxY = Math.round(((dropableWidget.y * this.eachBoxSize) + movedY) / this.eachBoxSize);
    if ((boxX >= 0 && (boxX * this.eachBoxSize) <= this.screenWidth) && (boxY >= 0)) {
      dropableWidget.x = boxX;
      dropableWidget.y = boxY;

      // add chart properties on widget list
      if (dropableWidget.widgetType === WidgetType.BAR_CHART || dropableWidget.widgetType === WidgetType.STACKED_BAR_CHART) {
        dropableWidget.chartProperties = {
          chartType:ChartType.BAR, orientation:Orientation.VERTICAL, isEnableDatalabels:false,
          datalabelsPosition:DatalabelsPosition.center, isEnableLegend:false, legendPosition:LegendPosition.top,
          xAxisLabel:'', yAxisLabel:'', orderWith: OrderWith.DESC, scaleFrom: null, scaleTo: null, stepSize: null,
          dataSetSize: null,seriesWith:SeriesWith.day,seriesFormat:null,blankValueAlias:null,timeseriesStartDate:TimeseriesStartDate.D7
        };
      }
      this.preapreNewWidgetPosition(dropableWidget);
    }
  }

  preapreNewWidgetPosition(dropableWidget: Widget) {
    const oldWidget = this.widgetList.filter(wid => wid.widgetId === dropableWidget.widgetId)[0];
    if (oldWidget) {
      this.widgetList.splice(this.widgetList.indexOf(oldWidget), 1);
      oldWidget.x = dropableWidget.x;
      oldWidget.y = dropableWidget.y;
      this.widgetList.push(oldWidget);
    } else {
      this.widgetList.push(dropableWidget);
    }
    // update variable for dom control
    this.selStyleWid = dropableWidget;
  }

  delete(data: Widget) {
    if (data) {
      const oldWidget = this.widgetList.filter(wid => wid.widgetId === data.widgetId)[0];
      this.widgetList.splice(this.widgetList.indexOf(oldWidget), 1);
      this.selStyleWid = new Widget();
      this.showProperty = false;
      if (oldWidget.widgetTableFields === this.chooseColumns) {
        this.chooseColumns = [];
      }
    }
  }

  showStyle(data: Widget) {
    if (data) {
      this.selStyleWid = data;
      if(this.styleCtrlGrp) {
        // convert miliis to date
        let startDate;
        if(data.dateFilterCtrl && data.dateFilterCtrl.startDate) {
          try {
            startDate = moment.unix(Number(data.dateFilterCtrl.startDate)/1000).format('MM/DD/YYYY');
          } catch (error) {console.error(`Error : ${error}`); startDate = data.dateFilterCtrl.startDate}
        }
        let endDate;
        if(data.dateFilterCtrl && data.dateFilterCtrl.endDate) {
          try {
            endDate = moment.unix(Number(data.dateFilterCtrl.endDate)/1000).format('MM/DD/YYYY');
          } catch (error) {console.error(`Error : ${error}`); endDate = data.dateFilterCtrl.endDate}
        }

        this.styleCtrlGrp.setValue({
          widgetName: data.widgetTitle ? data.widgetTitle : '',
          height: data.height ? data.height : '',
          width: data.width ? data.width : '',
          field: data.field ? data.field : '',
          aggregrationOp: data.aggregrationOp ? data.aggregrationOp : '',
          filterType: data.filterType ? data.filterType : '',
          isMultiSelect: data.isMultiSelect ? data.isMultiSelect : false,
          groupById: data.groupById ? data.groupById : '',
          objectType: data.isWorkflowdataSet ? 'wf_' + data.objectType : (data.objectType ? data.objectType : ''),
          imageUrl: data.imageUrl ? data.imageUrl : '',
          htmlText: data.htmlText ? data.htmlText : '',
          imagesno: data.imagesno ? data.imagesno : '',
          imageName: data.imageName ? data.imageName : '',
          dateSelectionType: data.dateFilterCtrl ? (data.dateFilterCtrl.dateSelectedFor ? data.dateFilterCtrl.dateSelectedFor : null) : null,
          startDate: startDate ? moment(startDate) : '',
          endDate: endDate ? moment(endDate) : '',
          isWorkflowdataSet: data.isWorkflowdataSet ? data.isWorkflowdataSet : false,
          workflowPath: data.workflowPath ? data.workflowPath : []
        });

        // set value to properties frm ctrl
        if (data.chartProperties) {
          this.chartPropCtrlGrp.setValue(data.chartProperties);
        } else {
          this.chartPropCtrlGrp.setValue({ chartType:ChartType.BAR, orientation:Orientation.VERTICAL, isEnableDatalabels:false,
            datalabelsPosition:DatalabelsPosition.center, isEnableLegend:false, legendPosition:LegendPosition.top, xAxisLabel:'', yAxisLabel:'',
            orderWith: OrderWith.DESC, scaleFrom:'',scaleTo:'', stepSize:'', dataSetSize:'',seriesWith:SeriesWith.day,seriesFormat:'',blankValueAlias:'',timeseriesStartDate:TimeseriesStartDate.D7
          });
        }
        // add default filters
        if (data.defaultFilters) {
          const frmArray = this.defaultFilterCtrlGrp.controls.filters as FormArray;
          const defFill: Criteria[] = [];
          data.defaultFilters.forEach(each => defFill.push(each));
          frmArray.clear();
          defFill.forEach(dat => {
            frmArray.push(this.formBuilder.group({
              conditionFieldId: [dat.conditionFieldId],
              conditionFieldValue: [dat.conditionFieldValue],
              blockType: [BlockType.COND],
              conditionOperator: [dat.conditionOperator, Validators.required],
              udrid: [data.widgetId ? data.widgetId : ''],
              showRangeFld:false
            }));
          });
        }
      }
      this.showProperty = true;
      this.chooseColumns = data.widgetTableFields ? data.widgetTableFields : [];
    }
  }

  toggleSelection(field: MetadataModel) {
    const selectedField = this.chooseColumns.filter(fill => fill.fields === field.fieldId);
    if (selectedField && selectedField.length) {
      this.chooseColumns.splice(this.chooseColumns.indexOf(selectedField[0]), 1);
    } else {
      this.chooseColumns.push({ fieldDesc: field.fieldDescri, fieldOrder: this.chooseColumns.length, fields: field.fieldId, widgetId: this.selStyleWid.widgetId });
    }
    const dropableWidget = this.selStyleWid;
    dropableWidget.widgetTableFields = this.chooseColumns;
    this.preapreNewWidgetPosition(dropableWidget);
  }

  isSelected(field: MetadataModel): boolean {
    const selectedField = this.chooseColumns.filter(fill => fill.fields === field.fieldId);
    if (selectedField && selectedField.length) {
      return true;
    }
    return false;
  }
  optionClicked(event: any, field: MetadataModel) {
    this.toggleSelection(field);
  }

  fileChange(event: any) {
    if (event && event.target) {
      this.schemaService.uploadUpdateFileData(event.target.files[0] as File, this.styleCtrlGrp.get('imagesno').value).subscribe(res => {
        this.styleCtrlGrp.get('imageName').setValue(event.target.files[0] ? event.target.files[0].name : '');
        this.styleCtrlGrp.get('imagesno').setValue(res);
      }, error => console.error(`Error : ${error}`));
    }
  }
  uploadFileChange() {
    document.getElementById('uploadFileCtrl').click();
  }

  removeUploadedImage() {
    if (this.styleCtrlGrp) {
      this.styleCtrlGrp.get('imageName').setValue('');
      this.styleCtrlGrp.get('imagesno').setValue('');
    }
  }


  /**
   * Use to add more default filters
   * Now blockType and conditionalOperator is static
   */
  addMoreDefaultFilter() {
    const frmArray = this.defaultFilterCtrlGrp.controls.filters as FormArray;
    frmArray.push(this.formBuilder.group({
      conditionFieldId: [''],
      conditionFieldValue: [''],
      blockType: [BlockType.COND],
      conditionOperator: ['', Validators.required],
      udrid: [this.selStyleWid.widgetId ? this.selStyleWid.widgetId : ''],
      showRangeFld:false
    }));
  }

  /**
   * Remove specific filter from filters
   * @param idx index of array element that use for remove from FormArray
   */
  removeFilter(idx: number) {
    const frmArray = this.defaultFilterCtrlGrp.controls.filters as FormArray;
    frmArray.removeAt(idx);
  }

  /**
   * Update field on formGroup while selection change
   * @param fieldData option of selection change
   */
  onFieldChange(fieldData: MatAutocompleteSelectedEvent) {
    if(fieldData && fieldData.option.value) {
      this.styleCtrlGrp.get('field').setValue(fieldData.option.value.fldCtrl ? fieldData.option.value.fldCtrl : fieldData.option.value);
    } else {
      this.styleCtrlGrp.get('field').setValue('');
    }
    console.log(fieldData);
  }

  /**
   * Update field on formGroup while selection change
   * @param fieldData option of selection change
   */
  onGroupByChange(fieldData: MatAutocompleteSelectedEvent) {
    if (fieldData && fieldData.option.value) {
      this.styleCtrlGrp.get('groupById').setValue(fieldData.option.value.fieldId);
    } else {
      this.styleCtrlGrp.get('groupById').setValue('');
    }
    console.log(fieldData);
  }

  /**
   * Use for update default filter array
   * @param fieldData selected data or on change dropdown data
   * @param index row index
   */
  onDefaultFilterChange(fieldData: MatAutocompleteSelectedEvent, index: number) {
    const frmArray = this.defaultFilterCtrlGrp.controls.filters as FormArray;
    if (fieldData && fieldData.option.value) {
      frmArray.at(index).get('conditionFieldId').setValue(fieldData.option.value.fieldId);
    } else {
      frmArray.at(index).get('conditionFieldId').setValue('');
    }
  }

  /**
   * Use for update default filter array
   * @param operator selected opertaor or on change dropdown data
   * @param index row index
   */
  operatorSelectionChng(operator: string, index: number) {
    const frmArray = this.defaultFilterCtrlGrp.controls.filters as FormArray;
    if(operator) {
      frmArray.at(index).get('conditionOperator').setValue(operator);
    } else {
      frmArray.at(index).get('conditionOperator').setValue('');
    }
  }

  /**
   * Should call api and get the actual records count
   * @param objectType selected object type
   */
  getRecordCount(objectType: string) {
    const docCountSub = this.reportService.getDocCount(objectType).subscribe(res => {
      this.recordsCount = res;
    }, error => {
      this.recordsCount = null;
      console.error(`Error: ${error}`);
    });
    this.subscriptions.push(docCountSub);
  }

  /**
   * Should call api and get the actual workflow path
   * @param objectType selected object type
   */

  getWorkFlowPathDetails(objectType: string) {
    this.schemaService.getWorkFlowPath(objectType).subscribe(res => {
      this.workflowPath = res;
      this.workflowPathOb = of(res);
    }, error => console.error(`Error: ${error}`));
  }

  createUpdateReport() {
    if (this.reportName === undefined || this.reportName.trim() === '') {
      this.snackbar.open(`Report name can't empty`, 'Close', { duration: 2000 });
      return false;
    }

    if (this.widgetList.length <= 0) {
      this.snackbar.open(`Please configure at least one widget`, 'Close', { duration: 2000 });
      return false;
    }

    const request: ReportDashboardReq = new ReportDashboardReq();
    request.reportId = this.reportId;
    request.reportName = this.reportName;
    request.widgetReqList = this.widgetList;

    const createUpdateSub = this.reportService.createUpdateReport(request).subscribe(res => {
      this.reportId = res;
      this.sharedService.setReportListData();
      this.snackbar.open(`Successfully saved change(s)`, 'Close',{duration:5000});
    },errro=>{
      this.snackbar.open(`Something went wrong`, 'Close',{duration:5000});
    });
    this.subscriptions.push(createUpdateSub);
  }

  // To set the emitted value of form-input component
  setreportname(data: string): void{
    this.reportName = data;
  }

  get possibleOperators(): ConditionalOperator[] {
    // get generic operators
    const genericOp: ConditionalOperator = new ConditionalOperator();
    genericOp.desc = 'Common Operator';
    genericOp.childs = [];
    genericOp.childs.push('EQUAL');
    genericOp.childs.push('STARTS_WITH');
    genericOp.childs.push('ENDS_WITH');
    genericOp.childs.push('CONTAINS');
    genericOp.childs.push('EMPTY');
    genericOp.childs.push('NOT_EMPTY');

    // for numeric number field
    const onlyNum: ConditionalOperator = new ConditionalOperator();
    onlyNum.desc = 'Numeric Operators';
    onlyNum.childs = [];
    // onlyNum.childs.push('RANGE');
    onlyNum.childs.push('LESS_THAN');
    onlyNum.childs.push('LESS_THAN_EQUAL');
    onlyNum.childs.push('GREATER_THAN');
    onlyNum.childs.push('GREATER_THAN_EQUAL');

    // for special operators
    const specialOpe: ConditionalOperator = new ConditionalOperator();
    specialOpe.desc = 'Special Operators';
    specialOpe.childs = [];
    specialOpe.childs.push('REGEX');
    specialOpe.childs.push('FIELD2FIELD');
    specialOpe.childs.push('LOCATION');
    specialOpe.childs.push('FIELD2FIELD_EQUAL');
    specialOpe.childs.push('FIELD2FIELD_GREATETHENEQUAL');
    specialOpe.childs.push('FIELD2FIELD_GREATETHAN');
    specialOpe.childs.push('FIELD2FIELD_LESSTHEN');
    specialOpe.childs.push('FIELD2FIELD_LESSTHENEQUALTO');
    return [genericOp, onlyNum, specialOpe];
  }
}

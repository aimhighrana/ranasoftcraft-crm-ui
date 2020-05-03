import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Widget, WidgetType, ReportDashboardReq, WidgetTableModel } from '../../_models/widget';
import { Breadcrumb } from 'src/app/_models/breadcrumb';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ReportService } from '../../_service/report.service';
import { MetadataModel, MetadataModeleResponse } from 'src/app/_models/schema/schemadetailstable';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ObjectTypeResponse } from 'src/app/_models/schema/schema';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';

@Component({
  selector: 'pros-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit, AfterViewInit {

  breadcrumb: Breadcrumb = {
    heading: 'Dashboard Builder',
    links: [
      {
        link:'/home/report',
        text:'Report List'
      }
    ]
  };
  showProperty = false;
  screenWidth: number;
  pixcel = 200; // Initial 200
  eachBoxSize = 0;

  widgetList: Widget[] = [];
  selStyleWid:Widget;
  styleCtrlGrp: FormGroup;
  fields: BehaviorSubject<MetadataModeleResponse> = new BehaviorSubject<MetadataModeleResponse>(null);
  headerFields: Observable<MetadataModel[]> = of([]);
  reportId: string;
  reportName = '';
  chooseColumns: WidgetTableModel[] = [];
  dataSets: ObjectTypeResponse[];
  dataSetOb: Observable<ObjectTypeResponse[]> = of([]);

  constructor(
    private formBuilder: FormBuilder,
    private reportService: ReportService,
    private snackbar: MatSnackBar,
    private activatedRouter: ActivatedRoute,
    private elementRef: ElementRef,
    private schemaService: SchemaService,
    private schemaDetailsService: SchemaDetailsService
  ) { }


  ngAfterViewInit(): void {
    if(this.elementRef.nativeElement) {
      const screenWidth = document.body.offsetWidth;
      this.screenWidth  = screenWidth;
      this.eachBoxSize = this.screenWidth / this.pixcel;
      console.log(`Screen width : ${screenWidth}`);
    }
  }

  ngOnInit(): void {
    this.getAllObjectType();

    this.activatedRouter.params.subscribe(params=>{
      this.reportId =  params.id ?((params.id).toLowerCase() === 'new' ? '' : params.id) : '';
      if(this.reportId) {
        this.getReportConfig(this.reportId);
      }
    });

    this.styleCtrlGrp = this.formBuilder.group({
      widgetName: [''],
      width: [''],
      height: [''],
      field: [''],
      aggregrationOp: [''],
      filterType: [''],
      isMultiSelect: [false],
      groupById: [''],
      objectType:[''],
      imageUrl: [''],
      htmlText:['']
    });

    this.styleCtrlGrp.valueChanges.subscribe(latestVal=>{
      if(this.selStyleWid) {
        const changedWidget = this.selStyleWid;
        changedWidget.height = latestVal.height;
        changedWidget.width = latestVal.width;
        changedWidget.widgetTitle = latestVal.widgetName;
        changedWidget.field = latestVal.field;
        changedWidget.aggregrationOp = latestVal.aggregrationOp;
        changedWidget.filterType = latestVal.filterType;
        changedWidget.isMultiSelect = latestVal.isMultiSelect;
        changedWidget.groupById = latestVal.groupById;
        changedWidget.objectType = latestVal.objectType;
        changedWidget.imageUrl = latestVal.imageUrl;
        changedWidget.htmlText = latestVal.htmlText;
        this.preapreNewWidgetPosition(changedWidget);
      }
    });
    this.styleCtrlGrp.get('objectType').valueChanges.subscribe(fillData=>{
      if(fillData && typeof fillData === 'string') {
        if(fillData !== this.styleCtrlGrp.value.objectType) {
          this.getAllFields(fillData);
        }
      }
    });

    this.fields.subscribe(flds=>{
      if(flds) {
        const headerArray: MetadataModel[] = [];
        for(const obj in flds.headers) {
          if(flds.headers.hasOwnProperty(obj)) {
            headerArray.push(flds.headers[obj]);
          }
        }
        this.headerFields = of(headerArray);
      }
    });
  }

  getReportConfig(reportId: string) {
    this.reportService.getReportConfi(reportId).subscribe(res=>{
      this.widgetList = res.widgets;
      this.reportId = res.reportId;
      this.reportName = res.reportName;
      console.log(res);
    },error=>console.error(`Error: ${error}`));
  }

  getAllFields(objNum: string) {
    this.schemaDetailsService.getMetadataFields(objNum).subscribe(response => {
      this.fields.next(response);
    }, error => {
      console.error(`Error : ${error}`);
    });
  }

  getAllObjectType() {
    this.schemaService.getAllObjectType().subscribe(res=>{
      this.dataSets = res;
      this.dataSetOb = of(res);
    },error=>console.error(`Error: ${error}`));
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
    const movedX = event.distance.x;
    const movedY = event.distance.y;
    console.log(event.item.element.nativeElement);
    console.log(`Moved x: ${movedX} , and moved y : ${movedY}`);

    // drop added widget
    let dropableWidget = new Widget();
    if(event.item.element.nativeElement.id) {
      dropableWidget  =  this.widgetList.filter(wid => (String(wid.widgetId) === event.item.element.nativeElement.id))[0];
    } else {
      const widgetType = event.item.element.nativeElement.getAttribute('widgetType');
      dropableWidget.x = 0;
      dropableWidget.y = 0;
      dropableWidget.height = 10;
      dropableWidget.width = 20;
      dropableWidget.widgetId = String(new Date().getTime());
      dropableWidget.widgetType = widgetType as WidgetType;
    }
    const boxX = Math.round(((dropableWidget.x * this.eachBoxSize) + movedX) / this.eachBoxSize);
    const boxY = Math.round(((dropableWidget.y * this.eachBoxSize) + movedY) / this.eachBoxSize);
    if((boxX >=0 && (boxX * this.eachBoxSize) <= this.screenWidth) && (boxY >= 0)) {
      dropableWidget.x = boxX;
      dropableWidget.y = boxY;
      this.preapreNewWidgetPosition(dropableWidget);
    }
  }

  preapreNewWidgetPosition(dropableWidget: Widget) {
    const oldWidget  =  this.widgetList.filter(wid => wid.widgetId === dropableWidget.widgetId)[0];
    if(oldWidget) {
      this.widgetList.splice(this.widgetList.indexOf(oldWidget),1);
      oldWidget.x = dropableWidget.x;
      oldWidget.y = dropableWidget.y;
      this.widgetList.push(oldWidget);
    } else {
      this.widgetList.push(dropableWidget);
    }

  }

  delete(data: Widget) {
    if(data) {
      const oldWidget  =  this.widgetList.filter(wid => wid.widgetId === data.widgetId)[0];
      this.widgetList.splice(this.widgetList.indexOf(oldWidget),1);
      this.selStyleWid  = new Widget();
      this.showProperty = false;
      if(oldWidget.widgetTableFields === this.chooseColumns) {
        this.chooseColumns = [];
      }
    }
  }

  showStyle(data: Widget) {
    if(data) {
      this.selStyleWid = data;
      this.styleCtrlGrp.setValue({
        widgetName: data.widgetTitle ? data.widgetTitle : '',
        height: data.height ? data.height : '',
        width: data.width ? data.width : '',
        field:data.field ? data.field : '',
        aggregrationOp: data.aggregrationOp ? data.aggregrationOp : '',
        filterType: data.filterType ? data.filterType : '',
        isMultiSelect: data.isMultiSelect ? data.isMultiSelect : false,
        groupById: data.groupById ? data.groupById : '',
        objectType: data.objectType ? data.objectType : '',
        imageUrl: data.imageUrl ? data.imageUrl : '',
        htmlText: data.htmlText ? data.htmlText : ''
      });
      this.showProperty = true;
      this.chooseColumns = data.widgetTableFields ? data.widgetTableFields : [];
    }
  }

  toggleSelection(field: MetadataModel) {
    const selectedField = this.chooseColumns.filter(fill => fill.fields === field.fieldId);
    if(selectedField && selectedField.length) {
      this.chooseColumns.splice(this.chooseColumns.indexOf(selectedField[0]),1);
    } else {
      this.chooseColumns.push({fieldDesc: field.fieldDescri,fieldOrder:this.chooseColumns.length,fields: field.fieldId,widgetId:this.selStyleWid.widgetId});
    }
    const dropableWidget = this.selStyleWid;
    dropableWidget.widgetTableFields = this.chooseColumns;
    this.preapreNewWidgetPosition(dropableWidget);
  }

  isSelected(field: MetadataModel): boolean {
    const selectedField = this.chooseColumns.filter(fill => fill.fields === field.fieldId);
    if(selectedField && selectedField.length) {
      return true;
    }
    return false;
  }
  optionClicked(event: any, field: MetadataModel) {
    this.toggleSelection(field);
  }


  createUpdateReport() {
    if(this.reportName === undefined || this.reportName.trim() === '') {
      this.snackbar.open(`Report name can't empty`, 'Close',{duration:2000});
      return false;
    }

    if(this.widgetList.length <=0) {
      this.snackbar.open(`Please configure at least one widget`, 'Close',{duration:2000});
      return false;
    }

    const request: ReportDashboardReq = new ReportDashboardReq();
    request.reportId = this.reportId;
    request.reportName = this.reportName;
    request.widgetReqList = this.widgetList;

    this.reportService.createUpdateReport(request).subscribe(res=>{
      this.reportId = res;
      this.snackbar.open(`Successfully saved chage(s)`, 'Close',{duration:5000});
    },errro=>{
      this.snackbar.open(`Something went wrong`, 'Close',{duration:5000});
    })

  }

}

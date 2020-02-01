import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '../../endpoint.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { SendReqForSchemaDataTableColumnInfo, SendDataForSchemaTableShowMore, SchemaStatusInformation, SchemaDataTableColumnInfoResponse, SchemaDataTableResponse } from 'src/app/_models/schema/schemadetailstable';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { Any2tsService } from '../../any2ts.service';
import { SchamaListDetails } from 'src/app/_models/schema/schemalist';

@Injectable({
  providedIn: 'root'
})
export class SchemaDetailsService {

  public schemaStatusBehSub: BehaviorSubject<SchemaStatusInformation[]> = new BehaviorSubject<SchemaStatusInformation[]>([]);
  private schemaOverviewChart: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private schemaCategory: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private schemaBusinessRule: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  overViewChartData: any = { dataSet: [{ type: 'line', label: 'Error', id: 'ERROR_OVERVIEW_ID', backgroundColor: 'rgba(249, 229, 229, 1)', borderColor: 'rgba(195, 0, 0, 1)', fill: false, pointRadius: 5, pointBackgroundColor: 'rgba(195, 0, 0, 1)', data: [{ x: this.getDateString(2), y: 90820 }, { x: this.getDateString(3), y: 26593 }, { x: this.getDateString(5), y: 37414 }, { x: this.getDateString(6), y: 37414 }, { x: this.getDateString(9), y: 2759 }, { x: this.getDateString(11), y: 21445 }] }, { type: 'line', label: 'Success', id: 'SUCCESS_OVERVIEW_ID', backgroundColor: 'rgba(231, 246, 237, 1)', borderColor: 'rgba(18, 164, 74, 1)', fill: false, pointRadius: 5, pointBackgroundColor: 'rgba(18, 164, 74, 1)', data: [{ x: this.getDateString(1), y: 86789 }, { x: this.getDateString(2), y: 1929 }, { x: this.getDateString(7), y: 10 }, { x: this.getDateString(9), y: 762 }, { x: this.getDateString(10), y: 8979 }, { x: this.getDateString(18), y: 0 }] }, { type: 'line', label: 'Skipped', id: 'SKIPPED_OVERVIEW_ID', backgroundColor: 'rgba(246, 244, 249, 1)', borderColor: 'rgba(163, 145, 197, 1)', fill: false, pointRadius: 5, pointBackgroundColor: 'rgba(163, 145, 197, 1)', data: [{ x: this.getDateString(0), y: 111 }, { x: this.getDateString(1), y: 2356 }, { x: this.getDateString(4), y: 8979 }, { x: this.getDateString(8), y: 234 }, { x: this.getDateString(12), y: 678 }, { x: this.getDateString(16), y: 2356 }] }, { type: 'line', label: 'Duplicate', id: 'DUPLICATE_OVERVIEW_ID', backgroundColor: 'rgba(248, 240, 246, 1)', borderColor: 'rgba(182, 104, 170, 1)', fill: false, pointRadius: 5, pointBackgroundColor: 'rgba(182, 104, 170, 1)', data: [{ x: this.getDateString(4), y: 276 }, { x: this.getDateString(7), y: 124 }, { x: this.getDateString(9), y: 8962 }, { x: this.getDateString(10), y: 7862 }, { x: this.getDateString(14), y: 243 }, { x: this.getDateString(17), y: 7783 }] }] };
  doughnutChartData: any = { labels: ['Success', 'Error'], dataSet: { data: [20, 80] } };

  schemaCategoryData: any = { dataSet: [{ type: 'line', label: 'Validness', id: 'Validness_01', backgroundColor: 'rgba(217,83,79,0.75)', fill: false, data: [1000, 2000, 4000, 5000] }, { type: 'line', label: 'Accuracy', id: 'Accuracy_01', backgroundColor: 'rgba(92,184,92,0.75)', fill: false, data: [500, 600, 700, 800] }], labels: ['01-NOV', '02-NOV', '03-NOV', '02-NOV'] };
  schemaBusinessRuleChartData: any = {labels: ['MRP Controller', 'Reorder point', 'Rounding Value', 'Max stock level'], dataSet: [{label: 'Error', data: [100, 200, 230, 150], backgroundColor: '#c30000', hoverBackgroundColor: '#c30000'}, {label: 'Success', data: [30, 40, 200, 400], backgroundColor: '#12a44a', hoverBackgroundColor: '#12a44a'}, {label: 'Skipped', data: [50, 80, 120, 0], backgroundColor: '#a391c5', hoverBackgroundColor: '#a391c5'}, {label: 'Duplicate', data: [100, 300, 60, 20], backgroundColor: '#b668aa', hoverBackgroundColor: '#b668aa'}, {label: 'Draft', data: [10, 0, 155, 100], backgroundColor: '#66aa00', hoverBackgroundColor: '#66aa00'}, {label: 'Outdated', data: [0, 4, 5, 1], backgroundColor: '#dd4477', hoverBackgroundColor: '#dd4477'}]};
  constructor(
    private http: HttpClient,
    private endpointService: EndpointService,
    private any2tsService: Any2tsService
  ) { }

  private getDateString(days) {
    return moment().add(days, 'd').format('MM/DD/YYYY HH:mm');
  }
  getOverViewChartData(): Observable<any> {
    this.schemaOverviewChart = new BehaviorSubject<any>(this.overViewChartData);
    return this.schemaOverviewChart.asObservable();
  }

  getDoughnutChartData(): Observable<any> {
    return this.doughnutChartData;
  }

  getCategoryChartData(): Observable<any> {
    this.schemaCategory = new BehaviorSubject<any>(this.schemaCategoryData);
    return this.schemaCategory.asObservable();
  }

  public getSchemaDataTableColumnInfo(sendData: SendReqForSchemaDataTableColumnInfo): Observable<SchemaDataTableColumnInfoResponse> {
    return this.http.post<any>(this.endpointService.getSchemaDataTableColumnInfoUrl(), sendData).pipe(map(data => {
      return this.any2tsService.any2SchemaDataTableResponse(data);
    }));
  }
  public getSchemaTableData(sendData: SendReqForSchemaDataTableColumnInfo): Observable<SchemaDataTableResponse> {
    return this.http.post<any>(this.endpointService.getSchemaDataTableColumnInfoUrl(), sendData).pipe(map(data => {
      return this.any2tsService.any2SchemaTableData(data);
    }));
  }

  public getSchemaDetailsBySchemaId(schemaId: string): Observable<SchamaListDetails> {
    return this.http.post<any>(this.endpointService.getSchemaDetailsBySchemaId(schemaId), '').pipe(map(data => {
      return  null; // this.any2tsService.returnSchemaListDataForGrp(data, schemaId);
    }));
  }
  public getSchemaDataTableShowMore(scrollId: string): Observable<any> {
    const sendData: SendDataForSchemaTableShowMore = new SendDataForSchemaTableShowMore(scrollId, '');
    return this.http.post<any>(this.endpointService.getShowMoreSchemaTableDataUrl(), sendData);
  }
  public getSchemaStatusInformation(): Observable<SchemaStatusInformation[]> {
    const schemaStatusInfoList: SchemaStatusInformation[] = [];
    const successObj: SchemaStatusInformation = new SchemaStatusInformation();
    successObj.colorClassName = 'success-text';
    successObj.statusDescription = 'Success status of any record represent that all business rules executed on time of processing on Schema execution with properly and no rule break on the record.';
    successObj.status = 'Success';

    const errorObj: SchemaStatusInformation = new SchemaStatusInformation();
    errorObj.colorClassName = 'error-text';
    errorObj.statusDescription = 'Error status of any record represent that one or more business rules failed on time of processing on Schema execution. If your record contains the error status after schema execution that\'s means one of the business is failed, So you can find the reason of failure by click on the error status. it\'s shows you the reason of failure.';
    errorObj.status = 'Error';

    const skippedObj: SchemaStatusInformation = new SchemaStatusInformation();
    skippedObj.colorClassName = 'skipped-text';
    skippedObj.statusDescription = 'Skipped status of any record represent that one of business rule not executed on time of processing on Schema execution. So for skipped rule you can find the reason of skipped by click on the skipped status.';
    skippedObj.status = 'Skipped';

    const draftObj: SchemaStatusInformation = new SchemaStatusInformation();
    draftObj.colorClassName = 'draft-text';
    draftObj.statusDescription = 'Success status of any record represent that all business rules executed on time of processing on Schema execution with properly and no rule break on the record.';
    draftObj.status = 'Draft';

    const inprogressObj: SchemaStatusInformation = new SchemaStatusInformation();
    inprogressObj.colorClassName = 'inprogress-text';
    inprogressObj.statusDescription = 'Success status of any record represent that all business rules executed on time of processing on Schema execution with properly and no rule break on the record.';
    inprogressObj.status = 'Inprogress';

    const outdatedObj: SchemaStatusInformation = new SchemaStatusInformation();
    outdatedObj.colorClassName = 'outdate-text';
    outdatedObj.statusDescription = 'Success status of any record represent that all business rules executed on time of processing on Schema execution with properly and no rule break on the record.';
    outdatedObj.status = 'Outdated';

    schemaStatusInfoList.push(successObj);
    schemaStatusInfoList.push(errorObj);
    schemaStatusInfoList.push(outdatedObj);
    schemaStatusInfoList.push(inprogressObj);
    schemaStatusInfoList.push(draftObj);
    schemaStatusInfoList.push(skippedObj);
    this.schemaStatusBehSub.next(schemaStatusInfoList);
    return this.schemaStatusBehSub.asObservable();
  }

  getSchemaBusinessRuleChartData() {
    this.schemaBusinessRule = new BehaviorSubject<any>(this.schemaBusinessRuleChartData);
    return this.schemaBusinessRule.asObservable();
  }
}

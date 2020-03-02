import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '../../endpoint.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { SendReqForSchemaDataTableColumnInfo, SendDataForSchemaTableShowMore, SchemaStatusInformation, SchemaDataTableColumnInfoResponse, RequestForSchemaDetailsWithBr, DataTableSourceResponse, SchemaTableViewRequest, OverViewChartDataSet, CategoryInfo, CategoryChartDataSet } from 'src/app/_models/schema/schemadetailstable';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { Any2tsService } from '../../any2ts.service';
import { SchemaListDetails } from 'src/app/_models/schema/schemalist';

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
  schemaBusinessRuleChartData: any = {labels: ['MRP Controller', 'Reorder point', 'Rounding Value', 'Max stock level'], dataSet: [{label: 'Error', data: [100, 200, 230, 150], backgroundColor: '#c30000', hoverBackgroundColor: '#c30000'}, {label: 'Success', data: [30, 40, 200, 400], backgroundColor: '#12a44a', hoverBackgroundColor: '#12a44a'}, {label: 'Skipped', data: [50, 80, 120, 0], backgroundColor: '#a391c5', hoverBackgroundColor: '#a391c5'}, {label: 'Duplicate', data: [100, 300, 60, 20], backgroundColor: '#b668aa', hoverBackgroundColor: '#b668aa'}, {label: 'correction', data: [10, 0, 155, 100], backgroundColor: '#66aa00', hoverBackgroundColor: '#66aa00'}, {label: 'Outdated', data: [0, 4, 5, 1], backgroundColor: '#dd4477', hoverBackgroundColor: '#dd4477'}]};
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

  public getSchemaDetailsBySchemaId(schemaId: string): Observable<SchemaListDetails> {
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
    successObj.colorClassName = 'success-status';
    successObj.statusDescription = 'Success status against a record represents that records have passed all the business rules within a schema run. All the records processed successfully can be viewed under the Success status tab.';
    successObj.status = 'Success';

    const errorObj: SchemaStatusInformation = new SchemaStatusInformation();
    errorObj.colorClassName = 'error-status';
    errorObj.statusDescription = 'Error status against a record represents that one or more business rules have failed during the schema run. All the records in error status can be viewed under the Error status tab. Error(s) within each record will be highlighted in red and the user can view the error message by hovering the mouse over the highlighted area.';
    errorObj.status = 'Error';

    const skippedObj: SchemaStatusInformation = new SchemaStatusInformation();
    skippedObj.colorClassName = 'skipped-status';
    skippedObj.statusDescription = 'Skipped status against a record represents that one or more business rule(s) were skipped during the schema run. All such records can be viewed under the Skipped status tab. The reason for skipping a rule can be viewed…. UI???';
    skippedObj.status = 'Skipped';

    const correctionObj: SchemaStatusInformation = new SchemaStatusInformation();
    correctionObj.colorClassName = 'correction-status';
    correctionObj.statusDescription = 'Correction status against a record represents that the data errors identified during the schema run have been corrected in that record. All the corrected records can be viewed under the Correction status tab.';
    correctionObj.status = 'Correction';

    const duplicateObj: SchemaStatusInformation = new SchemaStatusInformation();
    duplicateObj.colorClassName = 'duplicate-status';
    duplicateObj.statusDescription = 'Duplicate status against a record represents that the record has been identified as a duplicate based upon the duplicity rules configured within a schema. All duplicate records can be viewed under the Duplicate status tab.';
    duplicateObj.status = 'Duplicate';

    const outdatedObj: SchemaStatusInformation = new SchemaStatusInformation();
    outdatedObj.colorClassName = 'outdate-status';
    outdatedObj.statusDescription = 'Outdated status against a record represents that the data within the record has been modified from its original state and the schema result is invalid. All such records can be viewed under the Outdated status tab.';
    outdatedObj.status = 'Outdated';

    schemaStatusInfoList.push(errorObj);
    schemaStatusInfoList.push(successObj);
    schemaStatusInfoList.push(correctionObj);
    schemaStatusInfoList.push(skippedObj);
    schemaStatusInfoList.push(duplicateObj);
    schemaStatusInfoList.push(outdatedObj);
    this.schemaStatusBehSub.next(schemaStatusInfoList);
    return this.schemaStatusBehSub.asObservable();
  }

  getSchemaBusinessRuleChartData() {
    this.schemaBusinessRule = new BehaviorSubject<any>(this.schemaBusinessRuleChartData);
    return this.schemaBusinessRule.asObservable();
  }

  public getSchemaTableDetailsByBrId(request: RequestForSchemaDetailsWithBr): Observable<DataTableSourceResponse> {
    return this.http.post<any>(this.endpointService.getSchemaTableDetailsUrl(), request).pipe(map(response => {
      return this.any2tsService.any2SchemaTableData(this.any2tsService.any2DataTable(response));
    }));
  }

  /**
   * updateSchemaTableView
   */
  public updateSchemaTableView(schemaTableViewReq: SchemaTableViewRequest): Observable<any> {
    return this.http.post<any>(this.endpointService.getUpdateSchemaTableViewUrl(), schemaTableViewReq);
  }

  public getOverviewChartDetails(schemaId: string, variantId: string, runId: string): Observable<OverViewChartDataSet> {
    schemaId = schemaId ? schemaId : '';
    runId = runId ? runId : '';
    return this.http.get<any>(this.endpointService.getOverviewChartDataUrl(schemaId, variantId, runId)).pipe(map(data => {
      return this.any2tsService.any2OverviewChartData(data);
    }));
  }

  public getAllCategoryInfo(): Observable<CategoryInfo[]> {
    return this.http.get<any>(this.endpointService.getCategoryInfoUrl()).pipe(map(data => {
      return this.any2tsService.any2CategoryInfo(data);
    }));
  }

  public getSchemaStatus(): Observable<string[]> {
    return this.http.get<any>(this.endpointService.getSchemaStatusUrl()).pipe(map(data => {
      return this.any2tsService.any2SchemaStatus(data);
    }));
  }

  public getCategoryChartDetails(schemaId: string, variantId: string, categoryId: string, status: string ): Observable<CategoryChartDataSet> {
    return this.http.get<any>(this.endpointService.categoryChartData(schemaId, variantId, categoryId, status)).pipe(map(response => {
      return this.any2tsService.any2CategoryChartData(response);
    }));
  }

}

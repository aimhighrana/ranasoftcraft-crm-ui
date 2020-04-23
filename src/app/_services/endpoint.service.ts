import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class EndpointService {
  constructor() { }
  apiUrl = environment.apiurl;
  public login(): string {
    throw new Error('Login not implemented');
  }

  public jwtRefresh(): string {
    return this.apiUrl + '/jwt/refresh';
  }

  public onLoadSchema(): string {
    return this.apiUrl + '/restSchemaLogs';
  }
  public getSchemaListByModuleId(): string {
    return this.apiUrl + '/moduleCount';
  }

  public getCreateSchemaGroupUrl(): string {
    return this.apiUrl + '/schema/create-schemagroup';
  }
  public getSchemaGroupMappingUrl(schemaGroupId: number): string {
    return this.apiUrl + '/schemaGroupMapping/' + schemaGroupId;
  }

  public getSchemaGroupsUrl() {
    return this.apiUrl + '/schema/get-all-groups';
  }
  public getSchemaListByGroupIdUrl(groupId: string) {
    return this.apiUrl + '/schema/schemas-details/' + groupId;
  }
  public getSchemaDescModuleIdByGroupId(groupId: string) {
    return this.apiUrl + '/getSchemaDescModuleIdByGroupId/' + groupId;
  }
  public getRestFieldListBySchemaId(): string {
    return this.apiUrl + '/getFieldListBySchema';
  }
  public schemaVarinatDetails(): string {
    return this.apiUrl + '/schema/schemaVariantList';
  }
  public deleteSchemaGroupUrl(groupId: string): string {
    return this.apiUrl + '/schema/delete-schema-group/' + groupId;
  }
  public getSchemaDataTableColumnInfoUrl(): string {
    return this.apiUrl + '/getListPageLayout';
  }
  public getSchemaDetailsBySchemaId(schemaId: string): string {
    return this.apiUrl + '/schema/schemaCount/' + schemaId;
  }
  public getShowMoreSchemaTableDataUrl(): string {
    return this.apiUrl + '/showMoreSchemaTableData';
  }
  public downloadExecutionDetailsUrl(schemaId: string, status: string): string {
    return `${this.apiUrl}/schema/download/${schemaId}/${status.toLocaleLowerCase()}`;
  }
  public getBusinessRulesBySchemaId(schemaId: string, objectId: string): string {
    return this.apiUrl + '/getBrDetailsBySchemaId/' + schemaId + '/' + objectId;
  }
  public getAssignBrToSchemaUrl(): string {
    return this.apiUrl + '/assignBrToSchema';
  }
  public getScheduleSchemaUrl(): string {
    return this.apiUrl + '/schema/schedule-schema';
  }
  public getCategoriesUrl(): string {
    return this.apiUrl + '/getCategories';
  }
  public getDependencyUrl(): string {
    return this.apiUrl + '/getDependency';
  }
  public addCustomCategoryUrl(): string {
    return this.apiUrl + '/addCategory';
  }
  public saveBusinessRuleUrl(): string {
    return this.apiUrl + '/saveBusinessRule';
  }
  public getBusinessRuleApiListUrl(): string {
    return this.apiUrl + '/getAPIList';
  }
  public getDuplicacySettingListUrl(): string {
    return this.apiUrl + '/getDuplicacySettingList';
  }
  public getMetadataFieldsUrl(): string {
    return this.apiUrl + '/getMetadataFields';
  }
  public getVariantDetailsForScheduleSchemaUrl(objectId: string): string {
    return this.apiUrl + '/get-variants-list/' + objectId;
  }
  public getVariantControlByVariantIdUrl(variantId: string): string {
    return this.apiUrl + '/get-variant-control/' + variantId;
  }
  public getSchemaGroupDetailsByGrpIdUrl(schemaGroupId: string): string {
    return this.apiUrl + '/schema/get-group-details/' + schemaGroupId;
  }
  public getUserDetailsUrl(userName: string): string {
    return this.apiUrl + '/schema/getUserDetails' + '/' + userName;
  }

  public getSchemaGroupCountUrl(groupId: number): string {
    return this.apiUrl + '/schema/get-schema-group-count' + '/' + groupId;
  }

  public getAllSchemabymoduleids(): string {
    return this.apiUrl + '/schema/get-all-schemabymoduleids';
  }
  public getAllObjecttypeUrl(): string {
    return this.apiUrl + '/schema/get-all-objecttype';
  }
  public groupDetailswithAssignedschemaUrl(groupId: string): string {
    return this.apiUrl + '/schema/group-detailswith-assignedschema/' + groupId;
  }
  public getSchemaDetailsBySchemaIdUrl(schemaId: string): string {
    return this.apiUrl + '/schema/schema-details/' + schemaId;
  }

  public getSchemaTableDetailsUrl(): string {
    return this.apiUrl + '/schema/schema-details';
  }
  public getUpdateSchemaTableViewUrl(): string {
    return this.apiUrl + '/schema/update-schema-table-view';
  }

  public getOverviewChartDataUrl(schemaId: string, variantId: string, runid: string): string {
    return this.apiUrl + '/schema/overview-chart-data/' + schemaId + '/' + variantId + '/' + runid;
  }

  public getCategoryInfoUrl(): string {
    return this.apiUrl + '/schema/category-list';
  }

  public getSchemaStatusUrl(): string {
    return this.apiUrl + '/schema/schema-status';
  }

  public categoryChartData(schemaId: string, variantId: string, categoryId: string, status: string): string {
    return this.apiUrl + '/schema/category-chart-data/' + schemaId + '/' + variantId + '/' + categoryId + '/' + status;
  }
  public scheduleSchemaCount(schemaId: string): string {
    return this.apiUrl + '/schema/record-count/' + schemaId;
  }
  public getMetadataFields(objectId: string): string {
    return this.apiUrl + '/schema/metadata-fileds/' + objectId;
  }

  public getAllSelectedFields(): string {
    return this.apiUrl + `/schema/get-unselected-fields`;
  }

  public getSchemaVariantsUrl(schemaId: string): string {
    return this.apiUrl + '/schema/schema-variants/' + schemaId;
  }

  public getSchemaBrInfoList(schemaId: string): string {
    return `${this.apiUrl}/schema/schema-br-infolist/${schemaId}`;
  }

  public doCorrectionUrl(schemaId: string): string {
    return `${this.apiUrl}/schema/do-correction/${schemaId}`;
  }

  public getCorrectedRecords(schemaId: string): string {
    return `${this.apiUrl}/schema/get-corrected-records/${schemaId}`;
  }

  public getLastBrErrorRecords(schemaId: string): string {
    return `${this.apiUrl}/schema/get-mdoerror-records/${schemaId}`;
  }

  public getSchemaExecutionLogUrl(schemaId: string): string {
    return `${this.apiUrl}/schema/get-execution-logs/${schemaId}`;
  }

  public submitReviewedRecordsUrl(schemaId: string): string {
    return `${this.apiUrl}/schema/submit-reviewed-records/${schemaId}`;
  }

  public uploadFileDataUrl(): string {
    return `${this.apiUrl}/schema/upload-file`;
  }

  public uploadDataUrl(objectType: string, fileSno: string): string {
    return `${this.apiUrl}/schema/upload-data/${objectType}/${fileSno}`;
  }

  public getBusinessRulesInfo(id) {
    return this.apiUrl + '/schema/get-business-rules/' + id
  }

  public getCategoriesInfo() {
    return this.apiUrl + '/schema/category-list';
  }

  public getFillDataInfo(id) {
    return this.apiUrl + '/schema/metadata-fileds/' + id;
  }

  public createBr() {
    return this.apiUrl + '/schema/create-update-br'
  }

  public createSchema() {
    return this.apiUrl + '/schema/create-update-schema';
  }

  public deleteBr(id) {
    return this.apiUrl + '/schema/delete-business-rule/' + id;
  }
  public getDummyJSON(): string {
    return `${this.apiUrl}/CustomerSummary.do?action=dummyJSON`;
  }
  public reportDashboardUrl(reportId: number) {
    return `${this.apiUrl}/report/report-info/${reportId}`;
  }

}



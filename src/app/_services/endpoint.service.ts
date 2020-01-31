import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class EndpointService {
  constructor( ) { }
  apiUrl = environment.apiurl;
  public login(): string {
    throw new Error('Login not implemented');
  }

  public jwtRefresh(): string {
    return '/jwt/refresh';
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
    return this.apiUrl + '/restLoadSchemByGroupId' + '?groupId=' + groupId;
  }
  public getSchemaDescModuleIdByGroupId(groupId: string) {
    return this.apiUrl + '/getSchemaDescModuleIdByGroupId/' + groupId;
  }
  public getRestFieldListBySchemaId(): string {
    return this.apiUrl + '/getFieldListBySchema';
  }
  public schemaVarinatDetails(): string {
    return this.apiUrl + '/schemaVariantList';
  }
  public deleteSchemaGroupUrl(groupId: string): string {
    return this.apiUrl + '/deleteSchemaGroup/' + groupId;
  }
  public getSchemaDataTableColumnInfoUrl(): string {
    return this.apiUrl + '/getListPageLayout';
  }
  public getSchemaDetailsBySchemaId(schemaId: string): string {
    return this.apiUrl + '/schemaCount/' + schemaId;
  }
  public getShowMoreSchemaTableDataUrl(): string {
    return this.apiUrl + '/showMoreSchemaTableData';
  }
  public getDownloadErrorsUrl(): string {
    return this.apiUrl + '/downloadExcelConnect';
  }
  public getBusinessRulesBySchemaId(schemaId: string, objectId: string): string {
    return this.apiUrl + '/getBrDetailsBySchemaId/' + schemaId + '/' + objectId;
  }
  public getAssignBrToSchemaUrl(): string {
    return this.apiUrl + '/assignBrToSchema';
  }
  public getScheduleSchemaUrl(): string {
    return this.apiUrl + '/ScheduleSchema';
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
    return this.apiUrl + '/get-group-details/' + schemaGroupId;
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
}

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EndpointsRuleService {

  readonly origin = `${environment.apiurl}/rule`;
  readonly classicOrigin = `${environment.apiurl}/MDOSF/fapi`;

  constructor() { }


  public getSchemaListByGroupIdUrl() {
    return this.classicOrigin + '/schema/schema-list';
  }

  public downloadExecutionDetailsUrl(schemaId: string, status: string): string {
    return `${this.origin}/schema/download/${schemaId}/${status.toLocaleLowerCase()}`;
  }

  public getScheduleSchemaUrl(isRunWithCheckedData: boolean): string {
    return this.origin + `/schema/schedule-schema?isRunWithCheckedData=${isRunWithCheckedData}`;
  }

  public getAllSchemabymoduleids(): string {
    return this.origin + '/schema/metadata/get-all-schemabymoduleids';
  }

  public getSchemaDetailsBySchemaIdUrl(schemaId: string): string {
    return this.origin + '/schema/metadata/schema-details/' + schemaId;
  }

  public getSchemaTableDetailsUrl(): string {
    return this.origin + '/schema/schema-details';
  }

  public getUpdateSchemaTableViewUrl(): string {
    return this.origin + '/schema/metadata/update-schema-table-view';
  }

  public getCategoryInfoUrl(): string {
    return this.origin + '/schema/metadata/category-list';
  }

  public getAllSelectedFields(): string {
    return this.origin + `/schema/metadata/get-selected-fields-view`;
  }

  public getSchemaVariantsUrl(schemaId: string): string {
    return this.classicOrigin + '/schema/variants/' + schemaId;
  }

  public getSchemaBrInfoList(schemaId: string): string {
    return `${this.origin}/schema/metadata/schema-br-infolist/${schemaId}`;
  }

  public doCorrectionUrl(schemaId: string): string {
    return `${this.origin}/schema/actions/do-correction/${schemaId}`;
  }

  public getCorrectedRecords(schemaId: string): string {
    return `${this.origin}/schema/get-corrected-records/${schemaId}`;
  }

  public getLastBrErrorRecords(schemaId: string): string {
    return `${this.origin}/schema/get-mdoerror-records/${schemaId}`;
  }

  public getSchemaExecutionLogUrl(schemaId: string): string {
    return `${this.origin}/schema/get-execution-logs/${schemaId}`;
  }

  public approveCorrectedRecords(schemaId: string): string {
    return `${this.origin}/schema/actions/approve-corrected-records/${schemaId}`;
  }

  public uploadFileDataUrl(): string {
    return `${this.classicOrigin}/schema/upload-file`;
  }

  public uploadDataUrl(objectType: string, fileSno: string): string {
    return `${this.origin}/schema/upload-data/${objectType}/${fileSno}`;
  }

  public getBusinessRulesInfoByModuleIdUrl() {
    return this.origin + `/schema/metadata/get-business-rules/`
  }

  public getBusinessRulesInfoBySchemaIdUrl(schemaId: string) {
    return this.origin + `/schema/metadata/get-business-rules/${schemaId}`;
  }

  public getCategoriesInfo() {
    return this.origin + '/schema/metadata/category-list';
  }

  public getFillDataInfo(id) {
    return this.origin + '/schema/metadata-fileds/' + id;
  }

  public createBr() {
    return this.origin + '/schema/metadata/create-update-br'
  }

  public createSchema() {
    return this.origin + '/schema/metadata/create-update-schema';
  }

  public deleteBr(id): string {
    return this.origin + '/schema/metadata/delete-business-rule/' + id;
  }


  public returnCollaboratorsPermisisonUrl(reportId: string): string {
    return `${this.origin}/admin/permission/collaborators/permission/${reportId}`;
  }

  public saveUpdateReportCollaborator(): string {
    return `${this.origin}/admin/permission/collaborators/permission/save-update`;
  }

  public deleteCollaboratorUrl(permissionId: string): string {
    return `${this.origin}/admin/permission/collaborator/delete/${permissionId}`;
  }

  public getBrConditionalOperatorUrl(): string {
    return `${this.origin}/schema/metadata/br/condition-operator`;
  }

  public dropDownValuesUrl(fieldId: string): string {
    return `${this.classicOrigin}/schema/drop-values/${fieldId}`;
  }

  public saveUpdateUdrBlockUrl(): string {
    return `${this.origin}/admin/schema/metadata/br/udr`;
  }

  public conditionListsUrl(objectType: string): string {
    return `${this.origin}/schema/metadata/br/udr/condition-list/${objectType}`;
  }

  public saveUpdateUDRUrl(): string {
    return `${this.origin}/schema/metadata/udr/save-update`;
  }

  public getBusinessRuleInfoUrl(brId: string): string {
    return `${this.origin}/schema/metadata/get-business-rule-info/${brId}`;
  }

  public getUdrBusinessRuleInfoUrl(ruleId: string): string {
    return `${this.origin}/schema/metadata/br/udr/${ruleId}`;
  }


  public deleteConditionBlock(blockId: string): string {
    return `${this.origin}/schema/metadata/br/udr/delete-conditionblock/${blockId}`;
  }

  public getSchemaThresholdStatics(schemaId: string, variantId?: string): string {
    if (variantId === undefined || variantId === null || variantId === 'null') {
      return `${this.origin}/schema/statics/${schemaId}`;
    } else {
      return `${this.origin}/schema/statics/${schemaId}/${variantId}`;
    }
  }

  public uploadCorrectionDataUrl(objectType: string, schemaId: string, runId: string, plantCode: string, fileSno: string): string {
    return `${this.origin}/es/uploadCorrection/${objectType}/${schemaId}/${runId}/${plantCode}/${fileSno}`;
  }

  public getCollaboratorDetailsUrl(schemaId: string): string {
    return `${this.origin}/schema/metadata/get-all-schemacollaborator-details/${schemaId}`;
  }

  public createUpdateUserDetailsUrl(): string {
    return `${this.origin}/schema/metadata/create-update-schemacollaborator`;
  }

  public getAllUserDetailsUrl(): string {
    return `${this.classicOrigin}/admin/permission/collaborators`;
  }

  public deleteSchemaCollaboratorDetailsUrl(): string {
    return `${this.origin}/admin/users/collaborator-records/delete`;
  }

  public deleteSchema(schemaId: string): string {
    return `${this.origin}/schema/metadata/delete/${schemaId}`;
  }

  public saveUpdateVariantUrl(): string {
    return `${this.origin}/schema/metadata/data-variants`;
  }

  public getVariantdetailsByvariantIdUrl(variantId: string): string {
    return `${this.origin}/schema/metadata/variant/${variantId}`;
  }

  public deleteVariantUrl(variantId: string): string {
    return `${this.origin}/schema/metadata/variant/delete/${variantId}`;
  }

  public saveNewSchemaUrl(objectId: string, runNow: boolean, variantId: string, fileSno: string): string {
    return `${this.classicOrigin}/schemamodule/create-schema?objectId=${objectId}&runNow=${runNow}&variantId=${variantId}&fileSno=${fileSno}`
  }

  /**
   * Get url for schema info
   * @param moduleId module id/objectId
   */
  public getSchemaInfoByModuleIdUrl(moduleId: string): string {
    return `${this.origin}/schema/metadata/schema-info/${moduleId}`;
  }


  /**
   * Get schema with variants .. use for data intilligence ...
   *
   */
  public getSchemaWithVariantsUrl(): string {
    return `${this.origin}/schema/metadata/list-variants`;
  }

  public updateBrMap(): string {
    return `${this.origin}/schema/metadata/br/update-br-map`;
  }

  public getCategoriesUrl(): string {
    return this.origin + '/getCategories';
  }

  public getDependencyUrl(): string {
    return this.origin + '/getDependency';
  }

  public addCustomCategoryUrl(): string {
    return this.origin + '/addCategory';
  }

  public saveBusinessRuleUrl(): string {
    return this.origin + '/saveBusinessRule';
  }

  public getBusinessRuleApiListUrl(): string {
    return this.origin + '/getAPIList';
  }

  public getDuplicacySettingListUrl(): string {
    return this.origin + '/getDuplicacySettingList';
  }

  public getMetadataFieldsUrl(): string {
    return this.origin + '/getMetadataFields';
  }

  public getVariantDetailsForScheduleSchemaUrl(objectId: string): string {
    return this.origin + '/get-variants-list/' + objectId;
  }

  public getVariantControlByVariantIdUrl(variantId: string): string {
    return this.origin + '/get-variant-control/' + variantId;
  }

  public getBusinessRulesBySchemaId(schemaId: string, objectId: string): string {
    return this.origin + '/getBrDetailsBySchemaId/' + schemaId + '/' + objectId;
  }

  public getAssignBrToSchemaUrl(): string {
    return this.origin + '/assignBrToSchema';
  }

  public getWorkflowDataURL(): string {
    return this.origin + '/schema/get-wf-module-data'
  }

  /**
   * function to return API URL to get workflow fields.
   * if isWorkFlowDataSet is true then it will be in use..
   */
  public getWorkFlowFieldsUrl(): string {
    return this.origin + `/schema/get-wffields`;
  }

  public getWorkFlowPathUrl(): string {
    return this.origin + `/schema/get-wfpath`;
  }


  /**
   * Endpoint url to get notifications
   * @param senderUid username of logged in user
   */
  public getNotificationsUrl(senderUid, from: string, to: string): string {
    return `${this.origin}/notification/getNotification?senderUid=${senderUid}&from=${from}&to=${to}`
  }

  /**
   * Endpoint to update/save notification
   */
  public getUpdateNotificationUrl(): string {
    return `${this.origin}/notification/saveNotification`
  }

  /**
   * Endpoint to update/save notification
   */
  public getDeleteNotificationUrl(): string {
    return `${this.origin}/notification/deleteNotification`
  }

  /**
   * Endpoint to get job queue url
   * @param userName username of logged in user
   * @param plantCode plantcode of logged in user
   */
  public getJobQueueUrl(userName: string, plantCode: string): string {
    return `${this.origin}/schema/jobs/get-all-jobs?userId=${userName}&plantCode=${plantCode}`
  }


  public getNotificationsCount(senderUid): string {
    return `${this.origin}/notification/getNotificationCount?senderUid=${senderUid}`
  }

  /**
   * endpoint for create/update schedule of schema
   * @param schemaId Id of schema
   */
  public createUpdateScheduleUrl(schemaId: string) {
    return `${this.classicOrigin}/schema/createupdate-schema-scheduler?schemaId=${schemaId}`;
  }

  /**
   * endpoint for getting schedule information of a schema
   * @param schemaId Id of schema
   */
  public getScheduleUrl(schemaId: string) {
    return `${this.classicOrigin}/schema/get-schema-scheduler/${schemaId}`;
  }

  /**
   * endpoint for saving and updating duplicate rule
   */
  public saveUpdateDuplicateRule(): string {
    return `${this.origin}/schema/actions/saveDuppsett`;
  }

  /**
   * endpoint for copy duplicate rule
   */
  public copyDuplicate(): string{
    return `${this.origin}/duplicate/copyDuplicate`;
  }

  /**
   * endpoint for save/update schema data scope
   */
  public saveUpdateDataScopeUrl(): string {
    return `${this.origin}/schema/variant/create-update-single`;
  }

  /**
   * endpoint for get schema data scope
   * @param schemaId: ID of schema
   * @param type: type of variants
   */
  public getAllDataScopeUrl(schemaId: string, type: string): string {
    return `${this.origin}/schema/variants/${schemaId}/${type}`;
  }
  /**
   * Get all noun and modifiers uri ..
   * @param schemaId append on request ..
   * @param runId append on request
   * @param variantId optional param if not there use 0 as Entire dataset ..
   */
  public getClassificationNounMod(schemaId: string, runId: string, variantId?: string) {
    return `${this.origin}/schema/getnounsAndModfiers/${schemaId}/${runId}`;
  }

  public getClassificationDataTableUrl(schemaId: string, runId: string, variantId?: string) {
    return `${this.origin}/schema/getClassificationListData/${schemaId}/${runId}`;
  }

  public getAllDataScopesUri(schemaId: string, type: string ) {
    return `${this.classicOrigin}/schema/variants/${schemaId}/${type}`;
  }

  public generateCrossEntryUri(schemaId: string, objectType: string, objectNumber: string): string {
    return `${this.origin}/schema/generateCrossmodule/${schemaId}/${objectType}/${objectNumber}`;
  }

  /**
   * endpoint for create/update check data for schema
   */
  public createUpdateCheckDataUrl() {
    return `${this.origin}/schema/checkdata/save-update`;
  }
  public duplicacyGroupsListUrl(): string {
    return `${this.origin}/schema/actions/duplicate/getgroupId`;
  }

  public catalogCheckRecordsUrl(): string {
    return `${this.origin}/schema/actions/duplicate/getContent`;
  }

  /**
   * endpoint for getting check data for schema
   * @param schemaId: schema ID
   */
  public getCheckDataUrl(schemaId: string) {
    return `${this.origin}/schema/checkdata/get-all-br-collaborator-details/${schemaId}`;
  }

  public getAllBusinessRulesUrl() {
    return this.origin + `/schema/metadata/get-all-business-rules/`
  }

  /**
   * endpoint for creating business rules at the time of check data..
   */
  public createCheckDataBusinessRuleUrl(): string {
    return `${this.origin}/schema/metadata/create-br`;
  }

  /**
   * URI for get all available nouns ..from local library
   */
  public getAvailableNounsUri(): string {
    return `${this.origin}/mro/noun`;
  }

  /**
   * URI for get all available modifiers  ..from local library
   */
  public getAvailableModifierUri(): string {
    return `${this.origin}/mro/modifier`;
  }

  /**
   * URI for get all available attributes  ..from local library
   */
  public getAvailableAttributeUri(): string {
    return `${this.origin}/mro/attribute`;
  }


  /**
   * Get uri for suggested noun ..
   * @param schemaId executed schema
   * @param runid get it from this runid
   */
  public getSuggestedNounUri(schemaId: string, runid: string): string {
    return `${this.origin}/schema/noun/${schemaId}/${runid}`;
  }

  /**
   * Get uri for suggested modifier ..
   * @param schemaId executed schema
   * @param runid get it from this runid
   */
  public getSuggestedModifierUri(schemaId: string, runid: string): string {
    return `${this.origin}/schema/modifier/${schemaId}/${runid}`;
  }


  /**
   * Get uri for suggested attribute ..
   *
   * @param schemaId executed schema
   * @param runid executed on this run
   */
  public getSuggestedAttributeUri(schemaId: string, runid: string): string {
    return `${this.origin}/schema/attribute/${schemaId}/${runid}`;
  }

  /**
   * Get doing correction uri ..
   */
  public doClassificationCorrectionUri(): string {
    return `${this.origin}/schema/actions/do-mro-correction`;
  }
  public getCreateNounModUrl() : string{
    return this.origin + '/schema/metadata/create-noun';
  }

  public getCreateAttributeUrl(nounSno: string) : string{
    return this.origin + `/schema/metadata/add-attributes/${nounSno}`;
  }

  public getSaveAttributesMappingUrl() : string{
    return this.origin + `/schema/metadata/save-mappings`;
  }

  public getFetchAttributesMappingUrl() : string{
    return this.origin + `/schema/get-mappings`;
  }

  /**
   * Get approve classification records uri ..
   */
  public approveClassificationUri(): string {
    return `${this.origin}/schema/actions/mro/approve`;
  }

  /**
   * Use this uri for reject or reset mro classification records ..
   */
  public rejectClassificationUri(): string {
    return `${this.origin}/schema/actions/mro/reset`;
  }

  /**
   * mark duplicacy record as master record
   */
  public masterRecordChangeUrl(): string {
    return `${this.origin}/duplicate/updatemasterRecord`;
  }

  /**
   * mark duplicacy record for deletion
   * @param objctNumber record object number
   * @param moduleId object type
   */
  public markForDeletionUrl(objctNumber, moduleId, schemaId, runId): string {
    return `${this.origin}/schema/update-delFlag/${objctNumber}/${moduleId}/${schemaId}/${runId}`;
  }

  /**
   * do duplicacy result field correction
   * @param schemaId  schema id
   * @param runId run id
   */
  public doDuplicacyCorrectionUrl(schemaId, runId): string {
    return `${this.origin}/schema/actions/do-correction/${schemaId}/${runId}`;
  }

  /**
   * approve corrected duplicacy records uri
   * @param schemaId schema id
   * @param runId run id
   * @param userName username
   */
  public approveDuplicacyCorrectionUrl(schemaId, runId, userName): string {
    return `${this.origin}/schema/actions/approveDuplicateRecords/${schemaId}/${runId}?userName=${userName}`;
  }

  /**
   * approve corrected duplicacy records uri
   * @param schemaId schema id
   * @param runId run id
   * @param userName user name
   */
  public rejectDuplicacyCorrectionUrl(schemaId, runId, userName): string {
    return `${this.origin}/schema/actions/rejectDuplicateRecords/${schemaId}/${runId}?userName=${userName}`;
  }


  /**
   * Uri for reset schema execution correction data ..
   * @param schemaId append as request path
   */
  public resetCorrectionRecords(schemaId: string): string {
    return `${this.origin}/schema/reset-corrected-records/${schemaId}`;
  }

  public getSchemaExecutedStatsTrendUri(schemaId: string, variantId: string): string {
    return this.origin + `/schema/execution/trends/${schemaId}/${variantId}`;
  }

  /**
   * Uri for mro execution output download ..
   * @param schemaid append on request path ..
   */
  public downloadMroExceutionUri(schemaid: string): string {
    return `${this.origin}/schema/download/mro/${schemaid}`;
  }

  /**
   * Uri for generate mro classification description ..
   */
  public generateMroClassificationDescriptionUri(): string {
    return `${this.origin}/schema/mro/generate-description`;
  }
  public getCreateUpdateSchemaActionUrl(): string {
    return this.origin + `/schema/actions/create-update`;
  }

  public getCreateUpdateSchemaActionsListUrl(): string {
    return this.origin + `/schema/actions/bulkcreate-update`;
  }

  public getFindActionsBySchemaUrl(schemaId: string): string {
    return this.classicOrigin + `/schema/actions/${schemaId}`;
  }

  public getFindActionsBySchemaAndRoleUrl(schemaId: string, role: string): string {
    return this.origin + `/schema/actions/${schemaId}/${role}`;
  }

  public getDeleteSchemaActionUrl(schemaId: string, actionCode: string): string {
    return this.origin + `/schema/actions/deleteCustomAction/${schemaId}/${actionCode}`;
  }

  public getCrossMappingUrl(plantCode: string): string {
    return this.origin + `/schema/actions/getCrossMapping?plantCode=${plantCode}`;
  }


  /**
   * URL for schema execution progress details
   * @param schemaId: schema id for which execution details needed.
   */
  public schemaExecutionProgressDetailUrl(schemaId: string) {
    return `${this.origin}/schema/getSchemaProgeress/${schemaId}`;
  }

  public downloadDuplicateExecutionDetailsUrl(schemaId: string, status: string): string {
    return `${this.origin}/duplicate/download/${schemaId}/${status.toLocaleLowerCase()}`;
  }
}

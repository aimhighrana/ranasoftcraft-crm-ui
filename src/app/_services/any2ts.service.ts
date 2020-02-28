import { Injectable } from '@angular/core';
import { Task } from '../_models/task';
import { TaskResponse } from '../_models/task-response';
import { SchemaListOnLoadResponse, SchemaGroupResponse, SchemaGroupDetailsResponse, SchemaGroupCountResponse, ObjectTypeResponse, GetAllSchemabymoduleidsRes, SchemaGroupWithAssignSchemas, SchemaGroupMapping } from '../_models/schema/schema';
import { VariantFieldList, SchemaVariantResponse, SchemaBrInfoList, CategoriesResponse, DependencyResponse, VariantDetailsScheduleSchema, VariantAssignedFieldDetails, SchemaListModuleList, SchemaModuleList, SchemaListDetails, BusinessRuleExecutionDetails } from '../_models/schema/schemalist';
import { SchemaDataTableColumnInfoResponse, ResponseFieldList, SchemaTableData, DataTableResponse, DataTableHeaderResponse, DataTableHeaderLabelLang, DataTableHeaderValueLang, DataTableSourceResponse, OverViewChartData, OverViewChartDataXY, OverViewChartDataSet, CategoryInfo, CategoryChartDataSet, CategoryChartData, CategoryChartDataXY, MetadataModel, RequestForSchemaDetailsWithBr, MetadataModeleResponse, Heirarchy } from '../_models/schema/schemadetailstable';
import { Userdetails, AssignedRoles } from '../_models/userdetails';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class Any2tsService {

  constructor() { }

  public anyToTask(contentItem: any): Task {
    const task: Task = new Task();
    // task.date = moment(contentItem.date);
    task.nextAgentType = contentItem.nextAgentType;
    task.eventId = contentItem.eventId;
    task.receiver = contentItem.receiver;
    task.claimed = contentItem.claimed;
    task.dueDate = contentItem.dueDate;
    task.stepId = contentItem.stepId;
    task.REQUESTOR_DATE = contentItem.REQUESTOR_DATE;
    task.REQUESTOR_NAME = contentItem.REQUESTOR_NAME;
    task.DATESTARTED = contentItem.DATESTARTED;
    task.entryStatus = contentItem.entryStatus;
    task.workflowpath = contentItem.workflowpath;
    task.sender = contentItem.sender;
    task.objectName = contentItem.objectName;
    task.claimable = contentItem.claimable;
    task.ROLEID = contentItem.ROLEID;
    task.objecttype = contentItem.objecttype;
    task.event = contentItem.event;
    task.wfId = contentItem.wfId;
    task.taskId = contentItem.taskId;
    task.objectId = contentItem.objectId;
    task.forwardEnabled = contentItem.forwardEnabled;
    task.status = contentItem.status;
    task.desc = contentItem.desc;
    return task;
  }

  public anyToTaskResponse(contentItem: any): TaskResponse {
    const tr: TaskResponse = new TaskResponse();
    const dataArr: Task[] = [];
    contentItem.data.forEach(taskItem => {
      dataArr.push(this.anyToTask(taskItem));
    });
    tr.data = dataArr;
    return tr;
  }

  public anyToSchemaListOnLoadResponse(data: any): SchemaListOnLoadResponse {
    const schema: SchemaListOnLoadResponse = new SchemaListOnLoadResponse();
    schema.connection = data.connection;
    schema.isDataInsight = data.isDataInsight;
    schema.moduleList = data.moduleList;
    schema.moduleOrdr = data.moduleOrdr;
    schema.plantCode = data.plantCode;
    schema.roleId = data.roleId;
    schema.userId = data.userId;
    return schema;
  }


  public any2SchemaGroupResponse(response: any): SchemaGroupResponse[] {
    const schemaGroups: SchemaGroupResponse[] = [];
    response.forEach(grp => {
      const schemaGroupResponse: SchemaGroupResponse = new SchemaGroupResponse();
      schemaGroupResponse.groupId = grp.groupId;
      schemaGroupResponse.groupName = grp.groupDescription;
      schemaGroupResponse.isEnable = grp.isEnable ? grp.isEnable : false;
      schemaGroupResponse.objectIds = grp.objectId ? grp.objectId.split(',') : '';
      schemaGroupResponse.plantCode = grp.plantCode;
      schemaGroupResponse.updateDate = grp.updateDate;

      const schemaGroupCountResponse: SchemaGroupCountResponse = new SchemaGroupCountResponse();
      schemaGroupCountResponse.total = grp.total ? grp.total : 0;
      schemaGroupCountResponse.error = grp.error ? grp.error : 0;
      schemaGroupCountResponse.duplicate = grp.duplicate ? grp.duplicate : 0;
      schemaGroupCountResponse.success = grp.success ? grp.success : 0;
      schemaGroupCountResponse.skipped = grp.skipped ? grp.skipped : 0;
      schemaGroupCountResponse.outdated = grp.outdated ? grp.outdated : 0;
      schemaGroupCountResponse.correctionValue = grp.correctionValue ? grp.correctionValue : 0;
      schemaGroupCountResponse.successTrendValue = grp.successTrendValue ? grp.successTrendValue : 0;
      schemaGroupCountResponse.errorTrendValue = grp.errorTrendValue ? grp.errorTrendValue : 0;
      schemaGroupCountResponse.errorPercentage = grp.errorPercentage ? grp.errorPercentage : 0;
      schemaGroupCountResponse.successPercentage = grp.successPercentage ? grp.successPercentage : 0;
      schemaGroupResponse.runCount = schemaGroupCountResponse;
      schemaGroups.push(schemaGroupResponse);
    });
    return schemaGroups;
  }

  public any2VariantFieldList(response: any): VariantFieldList[] {
    const returnFldList: VariantFieldList[] = [];
    response.forEach(element => {
      const variantFldLst: VariantFieldList = new VariantFieldList();
      variantFldLst.fieldId = element.fieldId;
      variantFldLst.dataType = element.dataType;
      variantFldLst.shortText = element.shortText;
      returnFldList.push(variantFldLst);
    });
    return returnFldList;
  }
  public any2SchemaVariantResponse(response: any): SchemaVariantResponse[] {
    const orderVariantList = response.orderVariantList;
    const schemaVariantRes: SchemaVariantResponse[] = [];
    orderVariantList.forEach(element => {
      schemaVariantRes.push(this.convertSchemaVariantResponseToSchemaVRes(element, response));
    });
    return schemaVariantRes;
  }
  private convertSchemaVariantResponseToSchemaVRes(dataFor: string, response: any): SchemaVariantResponse {
    const schemaVariant: SchemaVariantResponse = new SchemaVariantResponse();
    response = response.variants;
    if (response !== undefined) {
      for (const key in response) {
        if (key.startsWith(dataFor)) {
          schemaVariant.name = response[dataFor];
          schemaVariant.error = response[dataFor + '_error'];
          schemaVariant.success = response[dataFor + '_sucs'];
          schemaVariant.total = response[dataFor + '_total'];
          schemaVariant.lastExecutionDate = response[dataFor + '_exec'];
          schemaVariant.schemaVariantId = dataFor;
          if (schemaVariant.total !== undefined && schemaVariant.total > 0) {
            schemaVariant.successPercentage = (schemaVariant.success * 100) / schemaVariant.total;
            schemaVariant.errorPercentage = (schemaVariant.error * 100) / schemaVariant.total;
          } else {
            schemaVariant.successPercentage = 0;
            schemaVariant.errorPercentage = 0;
          }
        }
      }
    }
    return schemaVariant;
  }

  public any2SchemaDataTableResponse(response: any): SchemaDataTableColumnInfoResponse {
    const resData: SchemaDataTableColumnInfoResponse = new SchemaDataTableColumnInfoResponse();
    if (response !== undefined) {
      resData.categoryData = response.categoryData;
      resData.categoryDataScs = response.categoryDataScs;
      resData.categoryType = response.categoryType;
      resData.fieldOrder = response.fieldOrder;
      const fldArrayList: ResponseFieldList[] = [];
      response.fieldList.forEach(element => {
        fldArrayList.push(this.getResponseFieldList(element));
      });
      resData.fieldList = fldArrayList;
    }
    return resData;
  }
  private getResponseFieldList(data): ResponseFieldList {
    const resFldList: ResponseFieldList = new ResponseFieldList();
    resFldList.dataType = data.dataType ? data.dataType : '';
    resFldList.editable = data.editable ? data.editable : false;
    resFldList.hidden = data.hidden ? data.hidden : false;
    resFldList.index = data.index;
    resFldList.label = data.label;
    resFldList.name = data.name;
    resFldList.picklist = data.picklist ? data.picklist : '';
    resFldList.width = data.width;
    return resFldList;
  }
  public any2SchemaBrInfoList(response): SchemaBrInfoList[] {
    const schemaBrInfoLst: SchemaBrInfoList[] = [];
    const selectedBrData: any = response.selectedBrData;
    const unselectedBrData: any = response.unselectedBrData;
    if (selectedBrData) {
      selectedBrData.forEach(serverData => {
        const schmBrLst: SchemaBrInfoList = new SchemaBrInfoList();
        schmBrLst.brDescription = serverData.brDescription;
        schmBrLst.brId = serverData.brId;
        schmBrLst.brType = serverData.brType;
        schmBrLst.dynamicMessage = serverData.dynamicMessage;
        schmBrLst.fields = serverData.fields;
        schmBrLst.refId = serverData.refId;
        schmBrLst.schemaId = serverData.schemaId;
        schmBrLst.schemaOrder = serverData.schemaOrder;
        schmBrLst.isAssigned = true;
        schemaBrInfoLst.push(schmBrLst);
      });
    }
    if (unselectedBrData) {
      unselectedBrData.forEach(serverData => {
        const schmBrLst: SchemaBrInfoList = new SchemaBrInfoList();
        schmBrLst.brDescription = serverData.brDescription;
        schmBrLst.brId = serverData.brId;
        schmBrLst.brType = serverData.brType;
        schmBrLst.dynamicMessage = serverData.dynamicMessage;
        schmBrLst.fields = serverData.fields;
        schmBrLst.refId = serverData.refId;
        schmBrLst.schemaId = serverData.schemaId;
        schmBrLst.schemaOrder = serverData.schemaOrder;
        // schmBrLst.isAssigned = false;
        schemaBrInfoLst.push(schmBrLst);
      });
    }
    return schemaBrInfoLst;
  }
  public any2CategoriesResponse(response): CategoriesResponse[] {
    const returnData: CategoriesResponse[] = [];
    if (response && response.hasOwnProperty('CATEGORIES')) {
      const data = response.CATEGORIES;
      data.forEach(resData => {
        const catData: CategoriesResponse = new CategoriesResponse();
        catData.categoryDesc = resData.categoryDesc;
        catData.categoryId = resData.categoryId;
        catData.plantCode = resData.plantCode;
        returnData.push(catData);
      });
    }
    return returnData;
  }
  public any2DependencyResponse(response: any): DependencyResponse[] {
    const returnData: DependencyResponse[] = [];
    if (response && response.hasOwnProperty('referenceDrop')) {
      const data: any = response.referenceDrop;
      data.forEach(resData => {
        const depData: DependencyResponse = new DependencyResponse();
        depData.id = resData.id;
        depData.value = resData.value;
        returnData.push(depData);
      });
    }
    return returnData;
  }
  public any2VariantDetailsScheduleSchema(response: any): VariantDetailsScheduleSchema[] {
    const returnData: VariantDetailsScheduleSchema[] = [];
    if (response && response.hasOwnProperty('data')) {
      const vData: any = response.data;
      vData.forEach(data => {
        const reData: VariantDetailsScheduleSchema = new VariantDetailsScheduleSchema();
        reData.variantId = data.variantId;
        reData.variantDesc = data.variantName;
        returnData.push(reData);
      });
    }
    return returnData;
  }

  public any2VariantAssignedFieldDetails(response: any): VariantAssignedFieldDetails[] {
    const returnData: VariantAssignedFieldDetails[] = [];
    if (response && response.hasOwnProperty('data')) {
      const fldData: any = response.data;
      fldData.forEach(fData => {
        const reData: VariantAssignedFieldDetails = new VariantAssignedFieldDetails();
        reData.fieldId = fData.fieldId;
        reData.fieldDesc = fData.fieldDesc;
        reData.value = fData.value;
        returnData.push(reData);
      });
    }
    return returnData;
  }
  public any2SchemaDetails(response: any): SchemaGroupDetailsResponse {
    const schemaDetsails: SchemaGroupDetailsResponse = new SchemaGroupDetailsResponse();
    if (response) {
      schemaDetsails.createdDate = response.updatedDate;
      schemaDetsails.groupId = response.groupId;
      schemaDetsails.groupName = response.groupName;
      schemaDetsails.isEnable = response.isEnable;
      schemaDetsails.objectIds = response.objectId ? response.objectId.split(',') : [];
    }
    return schemaDetsails;
  }

  public any2UserDetails(response: any): Userdetails {
    const userDetails: Userdetails = new Userdetails();
    if (response) {
      userDetails.userName = response.userName;
      userDetails.firstName = response.firstName;
      userDetails.lastName = response.lastName;
      userDetails.email = response.email;
      userDetails.plantCode = response.plantCode;
      userDetails.currentRoleId = response.currentRoleId;
      userDetails.dateformat = response.dateformat;
      userDetails.fullName = response.fullName;
      const assignedRoles: AssignedRoles[] = [];
      response.assignedRoles.forEach(role => {
        const assignedRole: AssignedRoles = new AssignedRoles();
        assignedRole.defaultRole = role.defaultRole;
        assignedRole.roleDesc = role.roleDesc;
        assignedRole.roleId = role.roleId;
        assignedRole.sno = role.sno;
        assignedRole.userId = role.userId;
        assignedRoles.push(assignedRole);
      });
      userDetails.assignedRoles = assignedRoles;
    }
    return userDetails;
  }

  public any2SchemaGroupCountResposne(response: any): SchemaGroupCountResponse {
    const schemaGroupCountResponse: SchemaGroupCountResponse = new SchemaGroupCountResponse();
    schemaGroupCountResponse.total = response.total ? response.total : 0;
    schemaGroupCountResponse.error = response.error ? response.error : 0;
    schemaGroupCountResponse.duplicate = response.duplicate ? response.duplicate : 0;
    schemaGroupCountResponse.success = response.success ? response.success : 0;
    schemaGroupCountResponse.skipped = response.skipped ? response.skipped : 0;
    schemaGroupCountResponse.outdated = response.outdated ? response.outdated : 0;
    return schemaGroupCountResponse;
  }

  public any2ObjectType(response: any): ObjectTypeResponse[] {
    const objectTypeList: ObjectTypeResponse[] = [];
    response.forEach(objType => {
      const objecttype: ObjectTypeResponse = new ObjectTypeResponse();
      objecttype.objectdesc = objType.objectDecsription;
      objecttype.objectid = objType.objectId;
      objectTypeList.push(objecttype);
    });
    return objectTypeList;
  }

  public any2GetAllSchemabymoduleidsResponse(resposne: any): GetAllSchemabymoduleidsRes[] {
    const getAllSchemaList: GetAllSchemabymoduleidsRes[] = [];
    resposne.forEach(schema => {
      const schemaRes: GetAllSchemabymoduleidsRes = new GetAllSchemabymoduleidsRes();
      schemaRes.discription = schema.discription;
      schemaRes.moduleId = schema.moduleId;
      schemaRes.schemaId = schema.schemaId;
      getAllSchemaList.push(schemaRes);
    });
    return getAllSchemaList;
  }

  public any2SchemaGroupWithAssignSchemasResponse(response: any): SchemaGroupWithAssignSchemas {
    const schemaGrpRes: SchemaGroupWithAssignSchemas = new SchemaGroupWithAssignSchemas();
    schemaGrpRes.groupId = response.groupId;
    schemaGrpRes.groupName = response.groupName;
    schemaGrpRes.objectId = response.objectIds ? response.objectIds : [];
    schemaGrpRes.schemaGroupMappings = [];
    response.schemaGroupMappings.forEach(grpMapping => {
      const schemaGrpMapping: SchemaGroupMapping = new SchemaGroupMapping();
      schemaGrpMapping.schemaGroupId = grpMapping.schemaGroupId;
      schemaGrpMapping.schemaId = grpMapping.schemaId;
      schemaGrpMapping.updatedDate = grpMapping.updateDate;
      schemaGrpRes.schemaGroupMappings.push(schemaGrpMapping);
    });
    return schemaGrpRes;
  }

  public any2SchemaListView(response: any): SchemaListModuleList[] {
    const schemaListView: SchemaListModuleList[] = [];
    const moduleData: SchemaModuleList[] = [];
    response.forEach(schemas => {
      if (moduleData.filter(module => module.moduleId === schemas.moduleId).length <= 0) {
        const schemaModuleList: SchemaModuleList = new SchemaModuleList();
        schemaModuleList.moduleId = schemas.moduleId;
        schemaModuleList.moduleDescription = schemas.moduleDescription;
        moduleData.push(schemaModuleList);
      }
    });
    moduleData.forEach(module => {
      const schemaLstView: SchemaListModuleList = new SchemaListModuleList();
      schemaLstView.moduleId = module.moduleId;
      schemaLstView.moduleDesc = module.moduleDescription;
      const schamaListDetails: SchemaListDetails[] = [];
      const schemaData = response.filter(res => res.moduleId === module.moduleId);
      schemaData.forEach(schema => {
        const schemaDetail: SchemaListDetails = new SchemaListDetails();
        schemaDetail.createdBy = schema.createdBy;
        schemaDetail.errorCount = schema.errorValue ? schema.errorValue : 0;
        schemaDetail.errorPercentage = schema.errorPercentage ? schema.errorPercentage : 0;
        schemaDetail.schemaDescription = schema.schemaDescription;
        schemaDetail.schemaId = schema.schemaId;
        schemaDetail.successCount = schema.successValue ? schema.successValue : 0;
        schemaDetail.successPercentage = schema.successPercentage ? schema.successPercentage : 0;
        schemaDetail.totalCount = schema.totalValue ? schema.totalValue : 0;
        schemaDetail.skippedValue = schema.skippedValue ? schema.skippedValue : 0;
        schemaDetail.correctionValue = schema.correctionValue ? schema.correctionValue : 0;
        schemaDetail.duplicateValue = schema.duplicateValue ? schema.duplicateValue : 0;
        schemaDetail.totalUniqueValue = schema.totalUniqueValue ? schema.totalUniqueValue : 0;
        schemaDetail.successUniqueValue = schema.successUniqueValue ? schema.successUniqueValue : 0;
        schemaDetail.errorUniqueValue = schema.errorUniqueValue ? schema.errorUniqueValue : 0;
        schemaDetail.skippedUniqueValue = schema.skippedUniqueValue ? schema.skippedUniqueValue : 0;
        schemaDetail.successTrendValue = schema.successTrendValue ? schema.successTrendValue : 'N/A';
        schemaDetail.errorTrendValue = schema.errorTrendValue ? schema.errorTrendValue : 'N/A';
        schemaDetail.variantCount = schema.variantCount ? schema.variantCount : 0;
        schemaDetail.variantId = schema.variantId ? schema.variantId : null;
        schemaDetail.executionStartTime = schema.executionStartTime ? schema.executionStartTime : '';
        schemaDetail.executionEndTime = schema.executionEndTime ? schema.executionEndTime : '';
        schamaListDetails.push(schemaDetail);
      });
      schemaLstView.schemaLists = schamaListDetails;
      schemaListView.push(schemaLstView);
    });
    return schemaListView;
  }

  public any2SchemaDetailsWithCount(resposne: any): SchemaListDetails {
    const schemaDetail: SchemaListDetails = new SchemaListDetails();
    schemaDetail.createdBy = resposne.createdBy;
    schemaDetail.errorCount = resposne.errorValue ? resposne.errorValue : 0;
    schemaDetail.errorPercentage = resposne.errorPercentage ? resposne.errorPercentage : 0;
    schemaDetail.schemaDescription = resposne.schemaDescription;
    schemaDetail.schemaId = resposne.schemaId;
    schemaDetail.successCount = resposne.successValue ? resposne.successValue : 0;
    schemaDetail.successPercentage = resposne.successPercentage ? resposne.successPercentage : 0;
    schemaDetail.totalCount = resposne.totalValue ? resposne.totalValue : 0;
    schemaDetail.skippedValue = resposne.skippedValue ? resposne.skippedValue : 0;
    schemaDetail.correctionValue = resposne.correctionValue ? resposne.correctionValue : 0;
    schemaDetail.duplicateValue = resposne.duplicateValue ? resposne.duplicateValue : 0;
    schemaDetail.variantCount = resposne.variantCount ? resposne.variantCount : 0;
    schemaDetail.executionStartTime = resposne.executionStartTime ? resposne.executionStartTime : 0;
    schemaDetail.executionEndTime = resposne.executionEndTime ? resposne.executionEndTime : 0;
    schemaDetail.variantId = resposne.variantId ? resposne.variantId : '';
    schemaDetail.runId = resposne.runId ? resposne.runId : '';
    schemaDetail.brInformation = [];

    if (resposne.brInformation) {
      resposne.brInformation.forEach(br => {
        const brInfo: BusinessRuleExecutionDetails = new BusinessRuleExecutionDetails();
        brInfo.brId = br.brId ? br.brId : '';
        brInfo.duplicate = br.duplicate ? br.duplicate : 0;
        brInfo.error = br.error ? br.error : 0;
        brInfo.outdated = br.outdated ? br.outdated : 0;
        brInfo.skipped = br.skipped ? br.skipped : 0;
        brInfo.success = br.success ? br.success : 0;
        schemaDetail.brInformation.push(brInfo);
      });
    }
    return schemaDetail;
  }

  /**
   * Help this method for convert any to schema datatable response
   */
  public any2DataTable(response: any, request: RequestForSchemaDetailsWithBr): DataTableResponse[] {
    const dataTableReponse: DataTableResponse[] = [];
    if (response) {
      response.forEach(data => {
        const dataTable: DataTableResponse = new DataTableResponse();
        dataTable.id = data.id;
        dataTable.stat = data.stat;
        dataTable.hdvs = this.convertAny2DataTableHeaderResponse(data.hdvs);
        if (request.gridId) {
          dataTable.gvs = this.convertAny2DataTableGridResponse(data.gvs, request.gridId);
        }
        if (request.hierarchy) {
          dataTable.hyvs = this.convertAny2DataTableHeirerchyResponse(data.hyvs, request.hierarchy);
        }
        dataTableReponse.push(dataTable);
      });
    }
    return dataTableReponse;
  }

  private convertAny2DataTableHeaderResponse(response: any): DataTableHeaderResponse[] {
    const dataTableHeaderResponse: DataTableHeaderResponse[] = [];
    if (response) {
      Object.keys(response).forEach(key => {
        const dataTableHeader: DataTableHeaderResponse = new DataTableHeaderResponse();
        dataTableHeader.fId = response[key].fId;
        dataTableHeader.lls = [];
        dataTableHeader.vls = [];
        const currentObj = response[key];
        // for get label lang of fields
        if (currentObj.lls) {
          Object.keys(currentObj.lls).forEach(llsKey => {
            const dataTableHeaderLabelLang: DataTableHeaderLabelLang = new DataTableHeaderLabelLang();
            dataTableHeaderLabelLang.label = currentObj.lls[llsKey].label;
            dataTableHeaderLabelLang.lang = llsKey;
            dataTableHeader.lls.push(dataTableHeaderLabelLang);
          });
        }

        // get value of this field on lang
        if (currentObj.vls) {
          Object.keys(currentObj.vls).filter(vlskey => {
            const dataTableHeaderValueLang: DataTableHeaderValueLang = new DataTableHeaderValueLang();
            dataTableHeaderValueLang.lang = vlskey;
            dataTableHeaderValueLang.valueText =  currentObj.vls[vlskey].valueTxt;
            dataTableHeader.vls.push(dataTableHeaderValueLang);
          });
        }
        dataTableHeaderResponse.push(dataTableHeader);
      });
    }

    return dataTableHeaderResponse;
  }
  private convertAny2DataTableGridResponse(response: any, gridId: string): DataTableHeaderResponse[][] {
    const gridResponse: DataTableHeaderResponse[][] = [];
    if (response && response.hasOwnProperty(gridId)) {
      const rows = response[gridId].rows;
      rows.forEach(row => {
        const griddataRow: DataTableHeaderResponse[] = [];
        Object.keys(row).forEach(key => {
          const dataTableHeader: DataTableHeaderResponse = new DataTableHeaderResponse();
          dataTableHeader.fId = row[key].fId;
          dataTableHeader.lls = [];
          dataTableHeader.vls = [];
          const currentObj = row[key];
          // for get label lang of fields
          if (currentObj.lls) {
            Object.keys(currentObj.lls).forEach(llsKey => {
              const dataTableHeaderLabelLang: DataTableHeaderLabelLang = new DataTableHeaderLabelLang();
              dataTableHeaderLabelLang.label = currentObj.lls[llsKey].label;
              dataTableHeaderLabelLang.lang = llsKey;
              dataTableHeader.lls.push(dataTableHeaderLabelLang);
            });
          }

          // get value of this field on lang
          if (currentObj.vls) {
            Object.keys(currentObj.vls).filter(vlskey => {
              const dataTableHeaderValueLang: DataTableHeaderValueLang = new DataTableHeaderValueLang();
              dataTableHeaderValueLang.lang = vlskey;
              dataTableHeaderValueLang.valueText =  currentObj.vls[vlskey].valueTxt;
              dataTableHeader.vls.push(dataTableHeaderValueLang);
            });
          }
          griddataRow.push(dataTableHeader);
        });
        gridResponse.push(griddataRow);
      });
    }
    return gridResponse;
  }

  private convertAny2DataTableHeirerchyResponse(response: any, heirarchyId: string): DataTableHeaderResponse[][] {
    const gridResponse: DataTableHeaderResponse[][] = [];
    if (response && response.hasOwnProperty(heirarchyId)) {
      const rows = response[heirarchyId].rows;
      rows.forEach(row => {
        const griddataRow: DataTableHeaderResponse[] = [];
        Object.keys(row).forEach(key => {
          const dataTableHeader: DataTableHeaderResponse = new DataTableHeaderResponse();
          dataTableHeader.fId = row[key].fId;
          dataTableHeader.lls = [];
          dataTableHeader.vls = [];
          const currentObj = row[key];
          // for get label lang of fields
          if (currentObj.lls) {
            Object.keys(currentObj.lls).forEach(llsKey => {
              const dataTableHeaderLabelLang: DataTableHeaderLabelLang = new DataTableHeaderLabelLang();
              dataTableHeaderLabelLang.label = currentObj.lls[llsKey].label;
              dataTableHeaderLabelLang.lang = llsKey;
              dataTableHeader.lls.push(dataTableHeaderLabelLang);
            });
          }

          // get value of this field on lang
          if (currentObj.vls) {
            Object.keys(currentObj.vls).filter(vlskey => {
              const dataTableHeaderValueLang: DataTableHeaderValueLang = new DataTableHeaderValueLang();
              dataTableHeaderValueLang.lang = vlskey;
              dataTableHeaderValueLang.valueText =  currentObj.vls[vlskey].valueTxt;
              dataTableHeader.vls.push(dataTableHeaderValueLang);
            });
          }
          griddataRow.push(dataTableHeader);
        });
        gridResponse.push(griddataRow);
      });
    }
    return gridResponse;
  }

  public any2SchemaTableData(response: DataTableResponse[], request: RequestForSchemaDetailsWithBr): DataTableSourceResponse {
    const finalResposne: DataTableSourceResponse = new DataTableSourceResponse();

    if (request.gridId) {
      finalResposne.data = this.any2GridResponseData(response);
    } else if (request.hierarchy) {
      finalResposne.data = this.any2HeirerchyResponseData(response);
    } else {
      finalResposne.data = this.any2HeaderResponseData(response);
    }

    return finalResposne;
  }
  private any2HeaderResponseData(response: DataTableResponse[]): any[] {
    const anyArray: any[] = [];
    response.forEach(data => {
      // for object number column
      const returnData: any = {} as any;
      const objNumberColumn: SchemaTableData = new SchemaTableData();
      objNumberColumn.fieldId = 'OBJECTNUMBER';
      objNumberColumn.fieldData = data.id;
      objNumberColumn.fieldDesc = 'Object Number';
      returnData[objNumberColumn.fieldId] = objNumberColumn;
      // anyArray.push(objNumberColumn);

      data.hdvs.forEach(hdvs => {
        const schemaTableData: SchemaTableData = new SchemaTableData();
        schemaTableData.fieldId = hdvs.fId;
        schemaTableData.fieldDesc = hdvs.lls.filter(lls => lls.lang === 'EN')[0].label;
        schemaTableData.fieldData = hdvs.vls.filter(vls => vls.lang === 'EN')[0].valueText ? hdvs.vls.filter(vls => vls.lang === 'EN')[0].valueText : '';
        returnData[schemaTableData.fieldId] = schemaTableData;
        // anyArray.push(objNumberColumn);
      });

      // for status column
      const statusColumn: SchemaTableData = new SchemaTableData();
      statusColumn.fieldId = 'STATUS';
      statusColumn.fieldData = data.stat;
      statusColumn.fieldDesc = 'Status';
      returnData[statusColumn.fieldId] = statusColumn;
      // anyArray.push(statusColumn);

      anyArray.push(returnData);
    });
    return anyArray;
  }

  private any2GridResponseData(response: DataTableResponse[]): any[] {
    const anyArray: any[] = [];
    response.forEach(data => {
      if (data.gvs.length > 0) {
        data.gvs.forEach(gvs => {
          // for object number column
          const returnData: any = {} as any;
          const objNumberColumn: SchemaTableData = new SchemaTableData();
          objNumberColumn.fieldId = 'OBJECTNUMBER';
          objNumberColumn.fieldData = data.id;
          objNumberColumn.fieldDesc = 'Object Number';
          returnData[objNumberColumn.fieldId] = objNumberColumn;
          // anyArray.push(objNumberColumn);

          data.hdvs.forEach(hdvs => {
            const schemaTableData: SchemaTableData = new SchemaTableData();
            schemaTableData.fieldId = hdvs.fId;
            schemaTableData.fieldDesc = hdvs.lls.filter(lls => lls.lang === 'EN')[0].label;
            schemaTableData.fieldData = hdvs.vls.filter(vls => vls.lang === 'EN')[0].valueText ? hdvs.vls.filter(vls => vls.lang === 'EN')[0].valueText : '';
            returnData[schemaTableData.fieldId] = schemaTableData;
            // anyArray.push(objNumberColumn);
          });

          gvs.forEach(gv => {
            const schemaTableData: SchemaTableData = new SchemaTableData();
            schemaTableData.fieldId = gv.fId;
            schemaTableData.fieldDesc = gv.lls.filter(lls => lls.lang === 'EN')[0].label;
            schemaTableData.fieldData = gv.vls.filter(vls => vls.lang === 'EN')[0].valueText ? gv.vls.filter(vls => vls.lang === 'EN')[0].valueText : '';
            returnData[schemaTableData.fieldId] = schemaTableData;
            // anyArray.push(objNumberColumn);
          });

          // for status column
          const statusColumn: SchemaTableData = new SchemaTableData();
          statusColumn.fieldId = 'STATUS';
          statusColumn.fieldData = data.stat;
          statusColumn.fieldDesc = 'Status';
          returnData[statusColumn.fieldId] = statusColumn;
          // anyArray.push(statusColumn);

          anyArray.push(returnData);
        });
      } else {

          const returnData: any = {} as any;
          const objNumberColumn: SchemaTableData = new SchemaTableData();
          objNumberColumn.fieldId = 'OBJECTNUMBER';
          objNumberColumn.fieldData = data.id;
          objNumberColumn.fieldDesc = 'Object Number';
          returnData[objNumberColumn.fieldId] = objNumberColumn;
          // anyArray.push(objNumberColumn);

          data.hdvs.forEach(hdvs => {
            const schemaTableData: SchemaTableData = new SchemaTableData();
            schemaTableData.fieldId = hdvs.fId;
            schemaTableData.fieldDesc = hdvs.lls.filter(lls => lls.lang === 'EN')[0].label;
            schemaTableData.fieldData = hdvs.vls.filter(vls => vls.lang === 'EN')[0].valueText ? hdvs.vls.filter(vls => vls.lang === 'EN')[0].valueText : '';
            returnData[schemaTableData.fieldId] = schemaTableData;
            // anyArray.push(objNumberColumn);
          });
          // for status column
          const statusColumn: SchemaTableData = new SchemaTableData();
          statusColumn.fieldId = 'STATUS';
          statusColumn.fieldData = data.stat;
          statusColumn.fieldDesc = 'Status';
          returnData[statusColumn.fieldId] = statusColumn;
          // anyArray.push(statusColumn);

          anyArray.push(returnData);

      }

    });
    return anyArray;
  }

  private any2HeirerchyResponseData(response: DataTableResponse[]): any[] {
    const anyArray: any[] = [];
    response.forEach(data => {
      if (data.hyvs.length > 0) {
        data.hyvs.forEach(hyv => {
          // for object number column
          const returnData: any = {} as any;
          const objNumberColumn: SchemaTableData = new SchemaTableData();
          objNumberColumn.fieldId = 'OBJECTNUMBER';
          objNumberColumn.fieldData = data.id;
          objNumberColumn.fieldDesc = 'Object Number';
          returnData[objNumberColumn.fieldId] = objNumberColumn;
          // anyArray.push(objNumberColumn);

          data.hdvs.forEach(hdvs => {
            const schemaTableData: SchemaTableData = new SchemaTableData();
            schemaTableData.fieldId = hdvs.fId;
            schemaTableData.fieldDesc = hdvs.lls.filter(lls => lls.lang === 'EN')[0].label;
            schemaTableData.fieldData = hdvs.vls.filter(vls => vls.lang === 'EN')[0].valueText ? hdvs.vls.filter(vls => vls.lang === 'EN')[0].valueText : '';
            returnData[schemaTableData.fieldId] = schemaTableData;
            // anyArray.push(objNumberColumn);
          });

          hyv.forEach(gv => {
            const schemaTableData: SchemaTableData = new SchemaTableData();
            schemaTableData.fieldId = gv.fId;
            schemaTableData.fieldDesc = gv.lls.filter(lls => lls.lang === 'EN')[0].label;
            schemaTableData.fieldData = gv.vls.filter(vls => vls.lang === 'EN')[0].valueText ? gv.vls.filter(vls => vls.lang === 'EN')[0].valueText : '';
            returnData[schemaTableData.fieldId] = schemaTableData;
            // anyArray.push(objNumberColumn);
          });

          // for status column
          const statusColumn: SchemaTableData = new SchemaTableData();
          statusColumn.fieldId = 'STATUS';
          statusColumn.fieldData = data.stat;
          statusColumn.fieldDesc = 'Status';
          returnData[statusColumn.fieldId] = statusColumn;
          // anyArray.push(statusColumn);

          anyArray.push(returnData);
        });
      } else {

          const returnData: any = {} as any;
          const objNumberColumn: SchemaTableData = new SchemaTableData();
          objNumberColumn.fieldId = 'OBJECTNUMBER';
          objNumberColumn.fieldData = data.id;
          objNumberColumn.fieldDesc = 'Object Number';
          returnData[objNumberColumn.fieldId] = objNumberColumn;
          // anyArray.push(objNumberColumn);

          data.hdvs.forEach(hdvs => {
            const schemaTableData: SchemaTableData = new SchemaTableData();
            schemaTableData.fieldId = hdvs.fId;
            schemaTableData.fieldDesc = hdvs.lls.filter(lls => lls.lang === 'EN')[0].label;
            schemaTableData.fieldData = hdvs.vls.filter(vls => vls.lang === 'EN')[0].valueText ? hdvs.vls.filter(vls => vls.lang === 'EN')[0].valueText : '';
            returnData[schemaTableData.fieldId] = schemaTableData;
            // anyArray.push(objNumberColumn);
          });
          // for status column
          const statusColumn: SchemaTableData = new SchemaTableData();
          statusColumn.fieldId = 'STATUS';
          statusColumn.fieldData = data.stat;
          statusColumn.fieldDesc = 'Status';
          returnData[statusColumn.fieldId] = statusColumn;
          // anyArray.push(statusColumn);

          anyArray.push(returnData);

      }

    });
    return anyArray;
  }

  public any2OverviewChartData(response): OverViewChartDataSet {
    const overViewChartDataSet: OverViewChartDataSet = new OverViewChartDataSet();
    const overViewChartData: OverViewChartData[] = [];
    if (response) {
      // for status success
      const successOverView: OverViewChartData = new OverViewChartData();
      successOverView.id = 'ERROR_OVERVIEW_ID';
      successOverView.type = 'line';
      successOverView.label = 'Error';
      successOverView.backgroundColor = 'rgba(249, 229, 229, 1)';
      successOverView.borderColor = 'rgba(195, 0, 0, 1)';
      successOverView.fill = false;
      successOverView.pointRadius = 5;
      successOverView.pointBackgroundColor = 'rgba(195, 0, 0, 1)';
      successOverView.data = this.getOverViewDataForXYAxis(response, 'ERROR');

      // for status error
      const errorOverview: OverViewChartData = new OverViewChartData();
      errorOverview.id = 'SUCCESS_OVERVIEW_ID';
      errorOverview.type = 'line';
      errorOverview.label = 'Success';
      errorOverview.backgroundColor = 'rgba(231, 246, 237, 1)';
      errorOverview.borderColor = 'rgba(18, 164, 74, 1)';
      errorOverview.fill = false;
      errorOverview.pointRadius = 5;
      errorOverview.pointBackgroundColor = 'rgba(18, 164, 74, 1)';
      errorOverview.data = this.getOverViewDataForXYAxis(response, 'SUCCESS');

      // for status skipped
      const skippedOverview: OverViewChartData = new OverViewChartData();
      skippedOverview.id = 'SKIPPED_OVERVIEW_ID';
      skippedOverview.type = 'line';
      skippedOverview.label = 'Skipped';
      skippedOverview.backgroundColor = 'rgba(246, 244, 249, 1)';
      skippedOverview.borderColor = 'rgba(163, 145, 197, 1)';
      skippedOverview.fill = false;
      skippedOverview.pointRadius = 5;
      skippedOverview.pointBackgroundColor = 'rgba(163, 145, 197, 1)';
      skippedOverview.data = this.getOverViewDataForXYAxis(response, 'SKIPPED');

      overViewChartData.push(successOverView);
      overViewChartData.push(errorOverview);
      overViewChartData.push(skippedOverview);

    }
    overViewChartDataSet.dataSet = overViewChartData;
    return overViewChartDataSet;
  }

  private getOverViewDataForXYAxis(response, type): OverViewChartDataXY[] {
    const xyAxis: OverViewChartDataXY[] = [];
    response.forEach(data => {
      const xyData: OverViewChartDataXY = new OverViewChartDataXY();
      if (type === 'SUCCESS') {
        xyData.y = data.totalSuccess ? data.totalSuccess : 0;
      } else if (type === 'ERROR') {
        xyData.y = data.totalError ? data.totalError : 0;
      } else if (type === 'SKIPPED') {
        xyData.y = data.skipped ? data.skipped : 0;
      }
      if (data.exeEndDate) {
        xyData.x = moment(data.exeStrtDate).format('MM/DD/YYYY HH:mm');
        xyAxis.push(xyData);
      }
    });
    return xyAxis;
  }

  public any2CategoryInfo(response: any): CategoryInfo[] {
    const categoryInfoLst: CategoryInfo[] = [];
    response.forEach(data => {
      const catData: CategoryInfo = new CategoryInfo();
      catData.categoryDesc = data.categoryDesc;
      catData.categoryId = data.categoryId;
      categoryInfoLst.push(catData);
    });
    return categoryInfoLst;
  }

  public any2SchemaStatus(response: any): string[] {
    const returnData: string[] = [];
    response.forEach(ele => {
      returnData.push(ele);
    });
    return returnData;
  }

  public any2CategoryChartData(response: any): CategoryChartDataSet {
    const categoryChartDataSet: CategoryChartDataSet = new CategoryChartDataSet();
    if (response) {
      categoryChartDataSet.dataSet = this.categoryChartData(response.brExecutionDetails , response.schemaStatus);
      categoryChartDataSet.variantId = response.variantId;
      categoryChartDataSet.categoryDesc = response.categoryDesc;
      categoryChartDataSet.total = response.total ? response.total : 0;
    }
    return categoryChartDataSet;
  }

  private categoryChartData(response: any, status: string): CategoryChartData[] {
    const categoryChartDataLst: CategoryChartData[] = [];
    // find unique br ids
    const bridsArray  = [];
    response.forEach(catData => {
      const index = bridsArray.indexOf(catData.brId);
      if (index === -1) {
        bridsArray.push(catData.brId);
      }

    });
    bridsArray.forEach(br => {
      const brData = response.filter(res => res.brId === br);
      if (brData.length > 0) {
        const categoryChartData: CategoryChartData = new CategoryChartData();
        categoryChartData.id = status + '_' + br;
        categoryChartData.type = 'line';
        categoryChartData.label = br;
        categoryChartData.backgroundColor = this.generateRandomRgba();
        categoryChartData.borderColor = this.generateRandomRgba();
        categoryChartData.fill = false;
        categoryChartData.pointRadius = 5;
        categoryChartData.pointBackgroundColor = this.generateRandomRgba();
        categoryChartData.data = this.getCategoryViewForXYAxis(brData, status);
        categoryChartData.total = this.getTotalForcategory(brData, status);
        categoryChartData.brDesc = this.getBrDecs(br, brData);
        categoryChartDataLst.push(categoryChartData);
      }
    });
    return categoryChartDataLst;
  }
  private generateRandomRgba(): string {
    const o = Math.round;
    const r = Math.random;
    const s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')';
  }

  private getBrDecs(brId: string, brList: any): string {
    return brList.filter(br => br.brId === brId)[0].brDesc;
  }
  private getTotalForcategory(response, type): number {
    let total = 0;
    response.forEach(data => {
      if (type === 'SUCCESS') {
        total += data.success ? data.success : 0;
      } else if (type === 'ERROR') {
        total  += data.error ? data.error : 0;
      } else if (type === 'SKIPPED') {
        total += data.skipped ? data.skipped : 0;
      }
    });
    return total;
  }
  private getCategoryViewForXYAxis(response, type): CategoryChartDataXY[] {
    const xyAxis: CategoryChartDataXY[] = [];
    response.forEach(data => {
      const xyData: CategoryChartDataXY = new CategoryChartDataXY();
      if (type === 'SUCCESS') {
        xyData.y = data.success ? data.success : 0;
      } else if (type === 'ERROR') {
        xyData.y = data.error ? data.error : 0;
      } else if (type === 'SKIPPED') {
        xyData.y = data.skipped ? data.skipped : 0;
      }
      if (data.executionEndTimestamp) {
        xyData.x = moment(data.executionStartTimestamp).format('MM/DD/YYYY HH:mm');
        xyAxis.push(xyData);
      }
    });
    return xyAxis;
  }

  public any2MetadataResponse(resposne: any): MetadataModeleResponse {
    const fldResposne: MetadataModeleResponse = {gridFields:null, headers: null, hierarchyFields: null, hierarchy: null, grids: null};
    if (resposne) {
      // header
      fldResposne.headers = resposne.headers as Map<string,MetadataModel>;
      fldResposne.grids = resposne.grids as Map<string,MetadataModel>;
      fldResposne.hierarchy = resposne.hierarchy as Heirarchy[];
      // fldResposne.gridFields = this.any2GridFields(resposne.gridFields);
      // fldResposne.hierarchyFields = this.any2HeirerchyFields(resposne.hierarchyFields);
      fldResposne.gridFields = resposne.gridFields as Map<string, Map<string,MetadataModel>>;
      fldResposne.hierarchyFields = resposne.hierarchyFields as Map<string, Map<string,MetadataModel>>;

    }
    return resposne;
  }


  // public any2GridFields(response: any): any {
  //   const gridFields: Map<string, Map<string,MetadataModel>> = new Map;
  //   for(const key in response) {
  //     gridFields.set(key, response[key] as Map<string,MetadataModel>);
  //   }
  //   return gridFields;
  // }

  // public any2HeirerchyFields(response: any): Map<string, Map<string,MetadataModel>> {
  //   const heiFields: Map<string, Map<string,MetadataModel>> = new Map;
  //   for(const key in response) {
  //     heiFields.set(key, response[key] as Map<string,MetadataModel>);
  //   }
  //   return heiFields;
  // }
}

import { Injectable } from '@angular/core';
import { Task } from '../_models/task';
import { TaskResponse } from '../_models/task-response';
import { SchemaListOnLoadResponse, SchemaGroupResponse, SchemaGroupDetailsResponse } from '../_models/schema/schema';
import { SchamaListDetails, VariantFieldList, SchemaVariantResponse, SchemaBrInfoList, CategoriesResponse, DependencyResponse, VariantDetailsScheduleSchema, VariantAssignedFieldDetails, SchemaListModuleList } from '../_models/schema/schemalist';
import { SchemaDataTableColumnInfoResponse, ResponseFieldList, SchemaTableData, SchemaDataTableResponse } from '../_models/schema/schemadetailstable';
import { Userdetails, AssignedRoles } from '../_models/userdetails';
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

  public anyToSchemaListsViewPage(responseData: any): SchemaListModuleList[] {
    const schemaLstModule: SchemaListModuleList[] = [];
    const moduleList = responseData.moduleList;
    for (const key of Object.keys(moduleList)) {
      const schemaModule: SchemaListModuleList = new SchemaListModuleList();
      schemaModule.moduleId = key;
      schemaModule.moduleDesc = moduleList.key;
      const schemaDetails = responseData.finalSchemaData[key + '_schemaobj'];
      const schemaOrder = responseData.finalSchemaData[key + '_order'];
      schemaModule.schemaLists = this.anyToSchemaListView(schemaDetails, schemaOrder, responseData);
      schemaLstModule.push(schemaModule);
    }
    return schemaLstModule;
  }

  public anyToSchemaListView(schemaDetails: any, schemaOrder: any, response: any): SchamaListDetails[] {
    const schemaList: SchamaListDetails[] = [];
    if (response !== null) {
      schemaOrder.forEach(element => {
        schemaList.push(this.returnSchemaListData(schemaDetails, element));
      });
    }
    return schemaList;
  }
  private returnSchemaListData(schemaDetails: any, schemaDetailsFor): SchamaListDetails {
    const schamaListDetails: SchamaListDetails = new SchamaListDetails();
    const schemaObj = schemaDetails;
    for (const key in schemaObj) {
      if (key.startsWith(schemaDetailsFor)) {
        schamaListDetails.errorCount = schemaObj[schemaDetailsFor + '_error'];
        schamaListDetails.successCount = schemaObj[schemaDetailsFor + '_success'];
        schamaListDetails.totalCount = schemaObj[schemaDetailsFor + '_total'];
        schamaListDetails.per = schemaObj[schemaDetailsFor + '_per'];
        schamaListDetails.dateModified = schemaObj[schemaDetailsFor + '_dt_mod'];
        schamaListDetails.state = schemaObj[schemaDetailsFor + '_state'];
        schamaListDetails.errorLabel = schemaObj[schemaDetailsFor + '_labelErr'];
        schamaListDetails.successLabel = schemaObj[schemaDetailsFor + '_labelSucc'];
        schamaListDetails.totalLabel = schemaObj[schemaDetailsFor + '_labelTotal'];
        schamaListDetails.variantCount = schemaObj[schemaDetailsFor + '_var_count'];
        schamaListDetails.createdBy = schemaObj[schemaDetailsFor + '_cr_by'];
        schamaListDetails.schemaId = schemaDetailsFor;
        schamaListDetails.schemaDescription = schemaObj[schemaDetailsFor + '_desc'];
        schamaListDetails.struc = schemaObj[schemaDetailsFor + '_struc'];
        schamaListDetails.scat = schemaObj[schemaDetailsFor + '_scat'];
        schamaListDetails.scatDesc = schemaObj[schemaDetailsFor + '_scat_desc'];
        schamaListDetails.lr = schemaObj[schemaDetailsFor + '_lr'];
        schamaListDetails.errorPercentage = schemaObj[schemaDetailsFor + '_error_per'] !== undefined ? schemaObj[schemaDetailsFor + '_error_per'] : 0;
        schamaListDetails.successPercentage = schemaObj[schemaDetailsFor + '_success_per'] !== undefined ? schemaObj[schemaDetailsFor + '_success_per'] : 0;
        schamaListDetails.isCheckBoxEnable = false;
        return schamaListDetails;
      }
    }
  }
  public any2SchemaGroupResponse(response: any): SchemaGroupResponse[] {
    if (response === undefined) {return []; }
    const schemaGroupResponseList: SchemaGroupResponse[] = [];
    response.SCHEMA_GROUPS.forEach((grp) => {
      const groupId = grp.groupId;
      if (groupId !== null && groupId !== '') {
        const schemaGroupResponse: SchemaGroupResponse = new SchemaGroupResponse();
        schemaGroupResponse.groupId = groupId;
        schemaGroupResponse.groupName = grp.groupName;
        schemaGroupResponse.createdDate = grp.createdDate;
        schemaGroupResponse.updatedDate = grp.updatedDate;
        schemaGroupResponse.isEnable = grp.isEnable;
        schemaGroupResponseList.push(this.getlatestSchemaRunDetails(groupId, response, schemaGroupResponse));
      }
    });
    return schemaGroupResponseList;
  }
  private getlatestSchemaRunDetails(groupId: string, response: any, schemaGroupResponse: SchemaGroupResponse): SchemaGroupResponse {
    const latestRunSchemaId: number = response.LATESTRUNSCHEMAS[groupId];
    const serverResponse: any = response.GROUP_DETAILS[groupId + '_' + latestRunSchemaId];
    if (serverResponse !== null) {
      schemaGroupResponse.errorCount = serverResponse[latestRunSchemaId + '_error'];
      schemaGroupResponse.successCount = serverResponse[latestRunSchemaId + '_success'];
      schemaGroupResponse.totalCount = serverResponse[latestRunSchemaId + '_total'];
      schemaGroupResponse.per = serverResponse[latestRunSchemaId + '_per'];
      schemaGroupResponse.dateModified = serverResponse[latestRunSchemaId + '_dt_mod'];
      schemaGroupResponse.state = serverResponse[latestRunSchemaId + '_state'];
      schemaGroupResponse.errorLabel = serverResponse[latestRunSchemaId + '_labelErr'];
      schemaGroupResponse.successLabel = serverResponse[latestRunSchemaId + '_labelSucc'];
      schemaGroupResponse.totalLabel = serverResponse[latestRunSchemaId + '_labelTotal'];
      schemaGroupResponse.variantCount = serverResponse[latestRunSchemaId + '_var_count'];
      schemaGroupResponse.createdBy = serverResponse[latestRunSchemaId + '_cr_by'];
      schemaGroupResponse.schemaId = String(latestRunSchemaId);
      schemaGroupResponse.schemaDescription = serverResponse[latestRunSchemaId + '_desc'];
      schemaGroupResponse.struc = serverResponse[latestRunSchemaId + '_struc'];
      schemaGroupResponse.scat = serverResponse[latestRunSchemaId + '_scat'];
      schemaGroupResponse.scatDesc = serverResponse[latestRunSchemaId + '_scat_desc'];
      schemaGroupResponse.lr = serverResponse[latestRunSchemaId + '_lr'];
      schemaGroupResponse.errorPercentage = serverResponse[latestRunSchemaId + '_error_per'] !== undefined ? serverResponse[latestRunSchemaId + '_error_per'] : 0;
      schemaGroupResponse.successPercentage = serverResponse[latestRunSchemaId + '_success_per'] !== undefined ? serverResponse[latestRunSchemaId + '_success_per'] : 0;
    }
    return schemaGroupResponse;
  }

  public anyToSchemaListViewForGrp(response: any): SchamaListDetails[] {
    const schemaList: SchamaListDetails[] = [];
    if (response !== null) {
      const schemaOrder = response.schemaOrder;
      schemaOrder.forEach(element => {
        schemaList.push(this.returnSchemaListDataForGrp(response, element));
      });
    }
    return schemaList;
  }
  public returnSchemaListDataForGrp(response: any, schemaDetailsFor): SchamaListDetails {
    const schamaListDetails: SchamaListDetails = new SchamaListDetails();
    const schemaObj = response.schemaObj;
    for (const key in schemaObj) {
      if (key.startsWith(schemaDetailsFor)) {
        schamaListDetails.errorCount = schemaObj[schemaDetailsFor + '_error'];
        schamaListDetails.successCount = schemaObj[schemaDetailsFor + '_success'];
        schamaListDetails.totalCount = schemaObj[schemaDetailsFor + '_total'];
        schamaListDetails.per = schemaObj[schemaDetailsFor + '_per'];
        schamaListDetails.dateModified = schemaObj[schemaDetailsFor + '_dt_mod'];
        schamaListDetails.state = schemaObj[schemaDetailsFor + '_state'];
        schamaListDetails.errorLabel = schemaObj[schemaDetailsFor + '_labelErr'];
        schamaListDetails.successLabel = schemaObj[schemaDetailsFor + '_labelSucc'];
        schamaListDetails.totalLabel = schemaObj[schemaDetailsFor + '_labelTotal'];
        schamaListDetails.variantCount = schemaObj[schemaDetailsFor + '_var_count'];
        schamaListDetails.createdBy = schemaObj[schemaDetailsFor + '_cr_by'];
        schamaListDetails.schemaId = schemaDetailsFor;
        schamaListDetails.schemaDescription = schemaObj[schemaDetailsFor + '_desc'];
        schamaListDetails.struc = schemaObj[schemaDetailsFor + '_struc'];
        schamaListDetails.scat = schemaObj[schemaDetailsFor + '_scat'];
        schamaListDetails.scatDesc = schemaObj[schemaDetailsFor + '_scat_desc'];
        schamaListDetails.lr = schemaObj[schemaDetailsFor + '_lr'];
        schamaListDetails.errorPercentage = schemaObj[schemaDetailsFor + '_error_per'] !== undefined ? schemaObj[schemaDetailsFor + '_error_per'] : 0;
        schamaListDetails.successPercentage = schemaObj[schemaDetailsFor + '_success_per'] !== undefined ? schemaObj[schemaDetailsFor + '_success_per'] : 0;
        return schamaListDetails;
      }
    }
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
  public any2SchemaTableData(response: any): SchemaDataTableResponse {
    const schemaDataTableRes: SchemaDataTableResponse = new SchemaDataTableResponse();
    schemaDataTableRes.queryData = response.queryData;
    const fieldOrder = response.fieldOrder;
    let returnData: any = [];
    if (fieldOrder !== undefined) {
      fieldOrder.splice(0, 0, 'OBJECTNUMBER');
    }
    const dataArray = response.fieldData;
    if (dataArray !== undefined && dataArray.length > 0) {
      returnData = this.returnSchemaTableData(fieldOrder, dataArray);
    }
    schemaDataTableRes.data = returnData;
    schemaDataTableRes.scrollId = response.scrollId;
    return schemaDataTableRes;
  }
  private returnSchemaTableData(fieldIdArray: any, fieldDataArray: any): any {
    const finalDataOutput: any = [];
    fieldDataArray.forEach(fldData => {
      const dataJson: any = {};
      fieldIdArray.forEach(fldIds => {
        const schemaTableData: SchemaTableData = new SchemaTableData();
        if (fldData.hasOwnProperty(fldIds)) {
          schemaTableData.fieldId = fldIds;
          schemaTableData.fieldData = fldData[fldIds];
          if (fldData.hasOwnProperty(fldIds + '_msg')) {
            schemaTableData.isInError = true;
            schemaTableData.errorMsg = fldData[fldIds + '_msg'];
          }
        } else {
          schemaTableData.fieldId = fldIds;
        }
        dataJson[fldIds] = schemaTableData;
      });
      finalDataOutput.push(dataJson);
    });
    return finalDataOutput;
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
    if (response && response.STATUS === 'SUCCESS' && response.hasOwnProperty('data')) {
      response = response.data;
      schemaDetsails.createdDate = response.createdDate;
      schemaDetsails.groupId = response.groupId;
      schemaDetsails.groupName = response.groupName;
      schemaDetsails.isEnable = response.isEnable;
      schemaDetsails.updatedDate = response.updatedDate;
    }
    return schemaDetsails;
  }

  public any2UserDetails(response: any): Userdetails {
    const userDetails: Userdetails = new Userdetails();
    if (response && response.hasOwnProperty('userDetails')) {
      response = response.userDetails;
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
}

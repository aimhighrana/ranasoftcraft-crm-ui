import { SchemaDashboardPermission } from '@models/collaborator';
import { CoreSchemaBrInfo, DropDownValue } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { FilterCriteria, MetadataModel, SchemaTableViewFldMap } from './schemadetailstable';

export interface Schema {
     schemaId: string;
     title: string;
     totalValue: string;
     thisWeekProgress: string;
     enableProgressBar: boolean;
     successValue: number;
     errorValue: number;
}

export class SchemaListOnLoadResponse {
     connection: string;
     isDataInsight: boolean;
     moduleList: ModuleList[];
     moduleOrdr: [];
     plantCode: string;
     roleId: string;
     userId: string;
}
export interface ModuleList {
     moduleId: string;
     moduleName: string;
}
export class SchemaGroupRequest {
     constructor(public groupId: string, public groupName: string, public isEnable: boolean) { }
}
export class SchemaGroupResponse {
     groupId: string;
     groupName: string;
     updateDate: number;
     isEnable: boolean;
     plantCode: string;
     objectIds: string[];
     runCount: SchemaGroupCountResponse;
}
export class SchemaGroupDetailsResponse {
     groupId: string;
     groupName: string;
     createdDate: number;
     updatedDate: number;
     isEnable: boolean;
     objectIds: string[];
}
export class SchemaGroupCountResponse {
     error: number;
     total: number;
     success: number;
     skipped: number;
     outdated: number;
     duplicate: number;
     correctionValue: number;
     successTrendValue: number;
     errorTrendValue: number;
     errorPercentage: number;
     successPercentage: number;
     exeStartDate: string;
     exeEndDate: string;
}
export class CreateSchemaGroupRequest {
     schemaGroupName: string;
     moduleIds: string[];
     schemaIds: number[];
     plantCode: string;
     groupId: string;
}
export class GetAllSchemabymoduleidsReq {
     mosuleIds: string[];
     plantCode: string;
}
export class ObjectTypeResponse {
     objectid: string;
     objectdesc: string;
}

export class GetAllSchemabymoduleidsRes {
     schemaId: number;
     discription: string;
     moduleId: string;
     isSelected: boolean;
}
export class SchemaGroupWithAssignSchemas {
     groupId: number;
     groupName: string;
     updatedDate: number;
     isEnable: boolean;
     plantCode: string;
     objectId: string[];
     schemaGroupMappings: SchemaGroupMapping[];
}
export class SchemaGroupMapping {
     schemaGroupId: number;
     schemaId: number;
     updatedDate: number;
     plantCode: string;
}

export class CategoriesList {
     categoryId: string;
     categoryDesc: string;
     plantCode: string;
     businessRules: any;
}

export interface ObjectType {
     objectDecsription: string;
     objectId: string;
}

export class WorkflowResponse {
     objectid: string;
     objectdesc: string;
     isSelected?: boolean;
}

export class WorkflowPath {
     wfpath: string;
     objectType: string;
}

export interface DataSource {
     excelFld: string;
     excelFrstRow: string;
     mdoFldId: string;
     mdoFldDesc: string;
     columnIndex: number;
}

export interface ExcelValues {
     uploadedData: any[];
     headerData: DataSource[];
}

export interface ValidationError {
     status: boolean;
     message: string;
}

export interface AddFilterOutput {
     fldCtrl: MetadataModel;
     selectedValues: DropDownValue[];
     fieldId?: string;
     fieldDescription?: any;
}

export interface SubscriberFields {
     subscriberIndex: number;
     event: AddFilterOutput;
}

/**
 * schema variant request object model
 */
export interface SchemaVariantReq {
     variantId: string;
     schemaId: string;
     variantName: string;
     variantType: string;
     filterCriteria: FilterCriteria[]
}

/**
 * Request of POST check data details API..
 */
export interface CheckDataRequest {
     schemaId: number | string;
     runId: number;
     brs: CheckDataBrs[];
     collaborators: CheckDataSubscriber[];
}

/**
 * Response of GET check data details API..
 */
export interface CheckDataResponse {
     CollaboratorModel: SchemaDashboardPermission[];
     BrModel: CoreSchemaBrInfo[];
}


export interface CheckDataBrs{
     brId: number;
     brExecutionOrder: number;
}

export interface CheckDataSubscriber {
     collaboratorId: number;
}

export interface SchemaTableViewDto {
     selectedFields: SchemaTableViewFldMap[];
     unselectedFields: MetadataModel[];
}

export interface DataScopeSidesheet {
     openedFrom: string;
     editSheet: boolean;
     listSheet: boolean;
     variantId?: string;
     isSave?: boolean;
}
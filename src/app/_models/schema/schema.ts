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
     groupId: number;
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
}
export class SchemaGroupCountResponse {
     error: number;
     total: number;
     success: number;
     skipped: number;
     outdated: number;
     duplicate: number;
     errorPercentage: number;
     successPercentage: number;
}
export class CreateSchemaGroupRequest {
     schemaGroupName: string;
     moduleIds: string[];
     schemaIds: number[];
     plantCode: string;
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
     schemaGroupModel: SchemaGroupWithAssignSchemas;
}

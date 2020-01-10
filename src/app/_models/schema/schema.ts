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
     schemaId: string;
     schemaDescription: string;
     errorCount: number;
     successCount: number;
     totalCount: number;
     errorLabel: string;
     successLabel: string;
     totalLabel: string;
     dateModified: number;
     state: string;
     lr: string;
     per: string;
     scat: string;
     scatDesc: string;
     struc: string;
     variantCount: number;
     variantRunDetails: [];
     createdBy: [];
     errorPercentage: number;
     successPercentage: number;
     groupId: number;
     groupName: string;
     createdDate: string;
     updatedDate: string;
     isEnable: boolean;
}
export class SchemaGroupDetailsResponse {
     groupId: string;
     groupName: string;
     createdDate: number;
     updatedDate: number;
     isEnable: boolean;
}

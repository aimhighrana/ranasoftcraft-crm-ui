export class SchemaList {
    details: SchemaListModule[];
}
export class SchemaListModule {
    module: SchemaDetails;
}
export class SchemaDetails {
    schemaId: string;
    title: string;
    totalValue: string;
    thisWeekProgress: string;
    enableProgressBar: boolean;
    successValue: number;
    errorValue: number;
    details: Details;
    variants: Variants;
}
export interface Details {
    structure: string;
    owner: [];
    date: string;
}
export interface Variants {
    total_variants: number;
}
export interface FilterFieldModel {
    fieldId: string;
    fieldDesc: string;
    picklist: string;
    dataType: string;
}
export class SchemaModuleList {
    moduleId: string;
    moduleDescription: string;
}
export class SchemaListModuleList {
    moduleId: string;
    moduleDesc: string;
    schemaLists: SchamaListDetails[];
}
export class SchamaListDetails {
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
    isCheckBoxEnable: boolean;
}
export class SendDataForSchemaVariantFields {
    schemaId: string;
    fetchCount: number;
    fetchSize: number;
    query: string;
    queryString: string;
    frmWhr: string;
}
export class ResponseDataForSchemaVariantFields {
    dataType: string;
    fieldId: string;
    shortText: string;
}
export class VariantFieldList {
    fieldId: string;
    shortText: string;
    dataType: string;
}
export class SendSchemavariantRequest {
    schemaId: string;
    objectId: string;
    platCode: string;
}
export class SchemaVariantResponse {
    name: string;
    total: number;
    error: number;
    success: number;
    schemaVariantId: string;
    successPercentage: number;
    errorPercentage: number;
    lastExecutionDate: string;
}
export class CurrentSchemaDetails {
    schemaId: string;
    schemaDesc: string;
    totalRecord: number;
    errorRecord: number;
    successRecord: number;
    moduleId: string;
}
export class SchemaBrInfoList {
    schemaId: string;
    brType: string;
    dynamicMessage: string;
    brId: string;
    refId: string;
    fields: string;
    schemaOrder: number;
    brDescription: string;
    isAssigned: boolean;
}
export class AssignBrToSchemaRequest {
    schemaId: string;
    objectId: string;
    selectedRules: string;
    schemaDesc: string;
}
export class ScheduleSchemaRequest {
    objectId: string;
    schemaId: string;
    fieldMapping: string;
}
export class CategoriesResponse {
    categoryId: string;
    categoryDesc: string;
    plantCode: string;
}
export class DependencyRequest {
    object: string;
    queryString: string;
    fetchCount: number;
}
export class DependencyResponse {
    id: string;
    value: string;
}
export class SaveBusinessRule {
    ruleType: string;
    objectId: string;
    reference: string;
    fields: string;
    ownertype: string;
    owners: string;
    message: string;
    regexScript: string;
    schemaId: string;
    customScript: string;
    brDesc: string;
    brId: string;
    brExpose: number;
    percentage: number;
    standardFunc: string;
    categoryId: string;
    transformation: number;
    tableName: string;
    qryScript: string;
    constructor() {
        this.brDesc = '';
        this.brExpose = 0;
        this.brId = '';
        this.categoryId = '';
        this.customScript = '';
        this.fields = '';
        this.message = '';
        this.objectId = '';
        this.owners = '';
        this.ownertype = '';
        this.percentage = 0;
        this.qryScript = '';
        this.reference = '';
        this.regexScript = '';
        this.ruleType = '';
        this.schemaId = '';
        this.standardFunc = '';
        this.tableName = '';
        this.transformation = 0;
    }
}
export class SchemaGetApiRequest {
    objectId: string;
    fetchCount: number;
    queryString: string;
}
export class VariantDetailsScheduleSchema {
    variantId: string;
    variantDesc: string;
}
export class VariantAssignedFieldDetails {
    fieldId: string;
    fieldDesc: string;
    value: string;
}

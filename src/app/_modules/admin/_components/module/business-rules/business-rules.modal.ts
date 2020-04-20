export class BusinessRuleList {
    sno: number;
    brId: number;
    brType: string;
    refId: number;
    fields: string;
    regex: string;
    order: number;
    message: string;
    script: string;
    brInfo: string;
    brExpose: number;
    status: string;
    categoryId: number;
    standardFunction: string;
    brWeightage: string;
    totalWeightage: number;
    transformation: number;
    tableName: string;
    qryScript: string;
    dependantStatus: string;
    plantCode: string;
    percentage: number;
    schemaId: number
}

export const BusinessRuleType = {
    missingRuleBrType: 'BR_MANDATORY_FIELDS',
    meteDataRuleType: 'BR_METADATA_RULE'
}

export class CreateUpdateSchema {
    discription: string;
    moduleId: string;
    schemaId: number;
    schemaGroupId: number;
    brs: BusinessRuleList[];
}

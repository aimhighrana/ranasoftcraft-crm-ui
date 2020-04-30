import { MetadataModel } from 'src/app/_models/schema/schemadetailstable';
import { BlockType } from './user-defined-rule/udr-cdktree.service';

export class CoreSchemaBrInfo {
    sno: number;
    brId: string;
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
    categoryId: string;
    standardFunction: string;
    brWeightage: string;
    totalWeightage: number;
    transformation: number;
    tableName: string;
    qryScript: string;
    dependantStatus: string;
    plantCode: string;
    percentage: number;
    schemaId: string
    brIdStr: string;
}

export enum BusinessRuleType {
    BR_MANDATORY_FIELDS = 'BR_MANDATORY_FIELDS',
    BR_METADATA_RULE = 'BR_METADATA_RULE',
    BR_CUSTOM_SCRIPT = 'BR_CUSTOM_SCRIPT'
}

export class CreateUpdateSchema {
    discription: string;
    moduleId: string;
    schemaId: string;
    schemaGroupId: string;
    brs: CoreSchemaBrInfo[];
}

export class CreateCondtionParams {
    conditionName: string;
    fieldType: string;
    operatorType: string;
    comparisionType: string;
    comparisionValue: string;
}

export class ConditionalField {
    fieldId: string;
    fieldDescription: string;
    fields: MetadataModel[];
}

export interface DropDownValue {
    CODE: string;
    PLANTCODE: string;
    SNO: string;
    FIELDNAME: string;
    TEXT: string;
    LANGU: string;
}

export class UDRBlocksModel {
    id: string;
    udrid: string;
    conditionFieldId: string;
    conditionValueFieldId: string;
    conditionFieldValue: string;
    conditionFieldStartValue: string;
    conditionFieldEndValue: string;
    blockType: BlockType;
    conditionOperator: string;
    blockDesc: string;
}

export class UDRHierarchyModel {
    id: string;
    udrId: string;
    parentId: string;
    leftIndex: number;
    rightIndex: number;
    blockRefId: string;
}

export class UdrModel {
    brInfo: CoreSchemaBrInfo;
    udrHierarchies: UDRHierarchyModel[];
    blocks: UDRBlocksModel[];
}

export class Category {
    categoryDesc: string;
    categoryId: string;
    plantCode: string;
}

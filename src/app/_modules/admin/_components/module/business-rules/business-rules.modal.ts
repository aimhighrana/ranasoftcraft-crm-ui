import { MetadataModel, CategoryInfo } from 'src/app/_models/schema/schemadetailstable';
import { BlockType } from './user-defined-rule/udr-cdktree.service';


export enum TransformationRuleType {
    LOOKUP = 'LOOKUP',
    REGEX = 'REGEX'
}
export interface TransformationModel {
    brId: string;
    sourceFld: string;
    targetFld: string;
    excludeScript?: string;
    includeScript?: string;
    lookUptable?: string;
    transformationRuleType: TransformationRuleType.LOOKUP | TransformationRuleType.REGEX;
    lookUpObjectType?: string;
    udrBlockModel: UDRBlocksModel;
}
export class CoreSchemaBrInfo {
    tempId?: string;
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
    schemaId: string;
    brIdStr: string;
    categoryInfo?: CategoryInfo;
    udrDto?: UdrModel;
    duplicacyField? = [];
    duplicacyMaster? = [];
    transFormationSchema?: TransformationModel[];
    isCopied?: boolean;
    moduleId?: string;
    copiedFrom? : string;
    apiKey: string;
    dep_rules?:CoreSchemaBrInfo[];
}

export enum BusinessRuleType {
    BR_MANDATORY_FIELDS = 'BR_MANDATORY_FIELDS',
    BR_METADATA_RULE = 'BR_METADATA_RULE',
    BR_CUSTOM_SCRIPT = 'BR_CUSTOM_SCRIPT',
    BR_API_RULE = 'BR_API_RULE',
    BR_DEPENDANCY_RULE = 'BR_DEPENDANCY_RULE',
    BR_DUPLICATE_RULE = 'BR_DUPLICATE_CHECK',
    BR_EXTERNALVALIDATION_RULE = 'BR_EXTERNALVALIDATION_RULE',
    BR_REGEX_RULE = 'BR_REGEX_RULE',
    BR_TRANSFORMATION = 'BR_TRANSFORMATION',
    MRO_CLS_MASTER_CHECK = 'MRO_CLS_MASTER_CHECK',
    MRO_MANU_PRT_NUM_LOOKUP = 'MRO_MANU_PRT_NUM_LOOKUP',
    MRO_MANU_PRT_NUM_IDENTI = 'MRO_MANU_PRT_NUM_IDENTI',
    MRO_GSN_DESC_MATCH = 'MRO_GSN_DESC_MATCH',
}

export const RULE_TYPES = [
    { ruleDesc: 'API Rule', ruleId: '', ruleType: BusinessRuleType.BR_API_RULE, isImplemented: false },
    { ruleDesc: 'Basic', ruleId: '', ruleType: null, isImplemented: false },
    { ruleDesc: 'Dependency Rule', ruleId: '', ruleType: BusinessRuleType.BR_DEPENDANCY_RULE, isImplemented: false },
    { ruleDesc: 'Duplicate Rule', ruleId: '', ruleType: BusinessRuleType.BR_DUPLICATE_RULE, isImplemented: true },
    { ruleDesc: 'External Validation Rule', ruleId: '', ruleType: BusinessRuleType.BR_EXTERNALVALIDATION_RULE, isImplemented: false },
    { ruleDesc: 'Metadata Rule', ruleId: '', ruleType: BusinessRuleType.BR_METADATA_RULE, isImplemented: true },
    { ruleDesc: 'Missing Rule', ruleId: '', ruleType: BusinessRuleType.BR_MANDATORY_FIELDS, isImplemented: true },
    { ruleDesc: 'Regex Rule', ruleId: '', ruleType: BusinessRuleType.BR_REGEX_RULE, isImplemented: true },
    { ruleDesc: 'User Defined Rule', ruleId: '', ruleType: BusinessRuleType.BR_CUSTOM_SCRIPT, isImplemented: true },
    { ruleDesc: 'Transformation Rule', ruleId: '', ruleType: BusinessRuleType.BR_TRANSFORMATION, isImplemented: true },
    { ruleDesc: 'MDO Classification Master Check', ruleId: '', ruleType: BusinessRuleType.MRO_CLS_MASTER_CHECK, isImplemented: true },
    { ruleDesc: 'Manufacturer Part Number Lookup', ruleId: '', ruleType: BusinessRuleType.MRO_MANU_PRT_NUM_LOOKUP, isImplemented: true },
    { ruleDesc: 'Manufacturer Part Number Identification', ruleId: '', ruleType: BusinessRuleType.MRO_MANU_PRT_NUM_IDENTI, isImplemented: true },
    { ruleDesc: 'Material Description Match', ruleId: '', ruleType: BusinessRuleType.MRO_GSN_DESC_MATCH, isImplemented: true },
];

export const PRE_DEFINED_REGEX = [
    { FUNC_NAME: 'EMAIL', FUNC_TYPE: 'EMAIL', FUNC_CODE: '^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}' },
    { FUNC_NAME: 'PANCARD', FUNC_TYPE: 'PANCARD', FUNC_CODE: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$' },
    { FUNC_NAME: 'PHONE NUMBER(IN)', FUNC_TYPE: 'PHONE_NUMBER_IN', FUNC_CODE: '^(\\+91[\\-\\s]?)?[0]?(91)?[7896]\\d{9}$' },
    { FUNC_NAME: 'PHONE NUMBER(AUS)', FUNC_TYPE: 'PHONE_NUMBER_AUS', FUNC_CODE: '^\\({0,1}((0|\\+61)(2|4|3|7|8)){0,1}\\){0,1}(\\ |-){0,1}[0-9]{2}(\\ |-){0,1}[0-9]{2}(\\ |-){0,1}[0-9]{1}(\\ |-){0,1}[0-9]{3}$' },
    { FUNC_NAME: 'PHONE NUMBER(US)', FUNC_TYPE: 'PHONE_NUMBER_US', FUNC_CODE: '^\\(?([0-9]{3})\\)?[-.\\s]?([0-9]{3})[-.\\s]?([0-9]{4})$' },
    { FUNC_NAME: 'AADHAAR NUMBER', FUNC_TYPE: 'AADHAAR_NUMBER', FUNC_CODE: '^\\d{4}\\s\\d{4}\\s\\d{4}$' },
    { FUNC_NAME: 'ABN', FUNC_TYPE: 'ABN_NUMBER', FUNC_CODE: '^\\d{2}\\s*\\d{3}\\s*\\d{3}\\s*\\d{3}' },
    { FUNC_NAME: 'SSN(US)', FUNC_TYPE: 'SSN_US', FUNC_CODE: '^(?!000|666)[0-8][0-9]{2}-(?!00)[0-9]{2}-(?!0000)[0-9]{4}$' },
    { FUNC_NAME: 'GSTIN', FUNC_TYPE: 'GSTIN', FUNC_CODE: '^[0-9]{2}\\s*[A-Z]{5}[0-9]{4}[A-Z]{1}\\s*[1-9A-Z]{1}Z[0-9A-Z]{1}$' },
    { FUNC_NAME: 'ECN', FUNC_TYPE: 'ECN', FUNC_CODE: '^CN[0-9]{9}' }
];

export class CreateUpdateSchema {
    discription: string;
    moduleId: string;
    schemaId: string;
    schemaGroupId: string;
    schemaThreshold: string;
    schemaCategory: string;
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
    isSugested?: boolean;
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
    objectType: string;
    childs?: UDRBlocksModel[];
}

export class UDRObject {
    id: string;
    blockTypeText: string;
    fieldId: string;
    operator: string;
    comparisonValue: string;
    actionDisabled: boolean;
    rangeStartValue: string;
    rangeEndValue: string;
    children: UDRBlocksModel[]
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
    objectType: string;
}

export class Category {
    categoryDesc: string;
    categoryId: string;
    plantCode: string;
}

export class ConditionalOperator {
    desc: string;
    childs: string[];
}

export class DuplicateRuleModel {
    coreBrInfo: CoreSchemaBrInfo;
    // ruleName: string;
    addFields: any[];
    selCriteria: any[];
    mergeRules: any[];
    removeList: any[];
    // objectId: string;
}

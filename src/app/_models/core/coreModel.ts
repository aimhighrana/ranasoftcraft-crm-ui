export class ObjectType {
    objectid: string;
    objectdesc: string;
}

export class FieldMetaData {
    fieldId: string;
    fieldDescri: string;
    ajax: string;
    backEnd: number;
    criteriaDisplay: string;
    criteriaField: string;
    dataType: string;
    datemodified: number;
    defaultDate: string;
    defaultDisplay: boolean;
    defaultValue: string;
    dependency: string;
    descField: string;
    eventService: string;
    flag: string;
    gridDisplay: string;
    intUse: string;
    intUseService: string;
    isCheckList: string;
    isCompBased: string;
    isCompleteness: string;
    isShoppingCartRefField: boolean;
    keys: string;
    languageIndependent: string;
    locType: string;
    mandatory: string;
    maxChar: string;
    metaDataDependencies: FieldMetaDataDependency[];
    numberSettingCriteria: string;
    objecttype: string;
    outputLen: string;
    parentField: string;
    permission: string;
    pickService: string;
    pickTable: string;
    picklist: string;
    plantCode: string;
    refField: string;
    reference: string;
    repField: string;
    searchEngin: string;
    strucId: string;
    systemId: string;
    tableName: string;
    tableType: string;
    textAreaLength: string;
    textAreaWidth: string;
    userid: string;
    validationService: string;
    workFlowField: string;
    workflowCriteria: string;
}

export class FieldMetaDataDependency {
    depField: string;
    depFieldManat: string;
    fieldId: string;
    metaDataCreateModel: any;
    metaDataDepValModels: any;
    objNr: number;
}
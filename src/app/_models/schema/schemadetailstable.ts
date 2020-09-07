import { UDRBlocksModel } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { ReadyForApplyFilter } from '@modules/shared/_components/add-filter-menu/add-filter-menu.component';


export interface Schemadetailstable {
    matMenu: Array<string>;
    columnInfo: SchemaDetailTableHeader[];
    displayedColumns: string[];
    dataSource: SchemaDataSource[];
    columnName: any;

}

export interface SchemaDetailTableHeader {
    columnId: string;
    columnName: string;
    columnDescription: string;
}

export interface SchemaDataSource {
    materialNumber: string;
    plant: string;
    mrp_type: string;
    mrp_controller: string;
    reorder_point: string;
    max_stock_level: string;
    safety_time: string;
}
export class SendReqForSchemaDataTableColumnInfo {
    objectId: string;
    schemaId: string;
    oldScrollId: string;
    brIds: string;
    sortFields: string;
    filterFields: string;
    srchRanQry: string;
    isDataInsight: boolean;
    isJQGrid: boolean;
    selectedStatus: string;
}
export class SchemaDataTableColumnInfoResponse {
    categoryType: string;
    categoryDataScs: any;
    categoryData: any;
    fieldOrder: string[];
    fieldList: ResponseFieldList[];
}
export class ResponseFieldList {
    name: string;
    width: number;
    index: string;
    label: string;
    hidden: boolean;
    picklist: number;
    dataType: string;
    editable: boolean;
}
export class SchemaTableData {
    fieldId: string;
    fieldData: string;
    oldData: string;
    isInError: boolean;
    isCorrected: boolean;
    errorMsg: string;
    fieldDesc: string;
    isReviewed: boolean;
}
export class SendDataForSchemaTableShowMore {
    constructor(public scrollId: string, public userId: string) { }
}
export class SchemaDownloadErrorRequest {
    userId: string;
    moduleId: string;
    schemaId: string;
    queryMap: string;
    statusType: string;
    runId: string;
}
export class SchemaDataTableResponse {
    data: SchemaTableData[];
}

export  class RequestForSchemaDetailsWithBr {
    schemaId: string;
    runId: string;
    brId: string;
    plantCode: string;
    variantId: string;
    requestStatus: string;
    executionStartDate: string;
    selectedFields: string[];
    fetchSize: number;
    fetchCount: number;
    gridId: string[];
    hierarchy: string[];
    schemaThreshold: number;
    afterKey: any;
    filterCriterias: FilterCriteria[];
    sort:{};
    isLoadMore: boolean;
}

export class FilterCriteria {
    fieldId: string;
    values: string[];
    type: string;
    filterCtrl?: ReadyForApplyFilter;
}

export class DataTableSourceResponse {
    data: any[];
}
export class DataTableResponse {
    id: string;
    hdvs: DataTableHeaderResponse[];
    gvs: DataTableHeaderResponse[][];
    hyvs: DataTableHeaderResponse[][];
    stat: string[];
    _score: string;
}
export class DataTableHeaderResponse {
    fId: string;
    ls: string;
    vc: DataTableHeaderValueLang;
}
export class DataTableHeaderLabelLang {
    lang: string;
    label: string;
}
export class DataTableHeaderValueLang {
    c: string;
    t: string;
}

export class SchemaTableViewRequest {
    userId: string;
    plantCode: string;
    schemaTableViewMapping: SchemaTableViewFldMap[];
    schemaId: string;
    isDefaultView: boolean;
    variantId: string;
}
export class SchemaTableViewFldMap {
    fieldId: string;
    order: number;
}
export class SchemaExecutionDetails {
    schemaId: string;
    variantId: string;
    runId: number;
    exeStrtDate: string;
    exeEndDate: string;
    userId: string;
    plantCode: string;
    total: number;
    totalSuccess: number;
    totalError: number;
    uniqueSuccess: number;
    uniqueError: number;
    uniqueSkipped: number;
    skipped: number;
    outdated: number;
    duplicate: number;
    isInRunning: boolean;
    isInterrupted: boolean;
    interruptedMessage: string;
    successPercentage: number;
    errorPercentage: number;
    brExecutionDetails: SchemaBrExecutionDetails[];
}
export class SchemaBrExecutionDetails {
    brId: string;
    outdated: number;
    success: number;
    duplicate: number;
    error: number;
    skipped: number;
    runId: number;
    isInterrupted: boolean;
    interruptedMessage: string;
    exeStrtDate: string;
    exeEndDate: string;
}
export class OverViewChartDataSet {
    dataSet: OverViewChartData[];
}
export class OverViewChartData {
    type: string;
    label: string;
    id: string;
    backgroundColor: string;
    borderColor: string;
    fill: boolean;
    pointRadius: number;
    pointBackgroundColor: string;
    data: OverViewChartDataXY[];
}
export class OverViewChartDataXY {
    x: string;
    y: number;
}
export class CategoryInfo {
    categoryId: string;
    categoryDesc: string;
}

export class CategoryChartDataSet {
    dataSet: OverViewChartData[];
    schemaId: string;
    runId: string;
    variantId: string;
    schemaStatus: string;
    categoryId: string;
    categoryDesc: string;
    total: number;
}
export class CategoryChartData {
    type: string;
    label: string;
    id: string;
    backgroundColor: string;
    borderColor: string;
    fill: boolean;
    pointRadius: number;
    pointBackgroundColor: string;
    data: CategoryChartDataXY[];
    total: number;
    brDesc: string;
}
export class CategoryChartDataXY {
    x: string;
    y: number;
}

export interface MetadataModel {
    fieldId: string;
    fieldDescri: string;
    dataType: string;
    maxChar: string;
    mandatory: string;
    backEnd: number;
    systemId: string;
    pickTable: string;
    picklist: string;
    pickService: string;
    dependency: string;
    validationService: string;
    defaultValue: string;
    eventService: string;
    outputLen: string;
    strucId: string;
    permission: string;
    intUse: string;
    intUseService: string;
    searchEngin: string;
    ajax: string;
    keys: string;
    flag: string;
    objecttype: string;
    parentField: string;
    reference: string;
    languageIndependent: string;
    gridDisplay: string;
    defaultDate: string;
    workFlowField: string;
    repField: string;
    locType: string;
    descField: string;
    refField: string;
    workflowCriteria: string;
    numberSettingCriteria: string;
    isCheckList: string;
    isCompBased: string;
    textAreaLength: string;
    textAreaWidth: string;
    plantCode: string;
    defaultDisplay: string;
    isCompleteness: string;
    criteriaDisplay: string;
    isShoppingCartRefField: boolean;
}
export class Heirarchy {
    objnr: number;
    heirarchyId: string;
    heirarchyText: string;
    fieldId: string;
    structureId: string;
    tableName: string;
    objectType: string;
}
export class MetadataModeleResponse {
    headers: any;
    grids: any;
    hierarchy: Heirarchy[];
    gridFields: any;
    hierarchyFields: any;

}
export class HeirarchyFields {
    fieldId: string;
    fieldDesc: string;
    fields: MetadataModel[];
}

export class GridFields {
    fieldId: string;
    fieldDesc: string;
    fields: MetadataModel[];
}

export class DataTableReqType {
    static error = 'error';
    static success = 'success';
    static all = 'all';
    static duplicate = 'duplicate';
    static outDated = 'outdated';
}

export class DataTableGroupBy {
    objectNumber: string;
    isGroup: boolean;
}

export class SchemaBrInfo {
    brType: string;
    dynamicMessage: string;
    brId: string;
    schemaId: string;
    refId: string;
    fields: string;
    schemaOrder: number;
    brDescription: string;
    udrblocks: UDRBlocksModel[];
}

export class FieldExitsResponse {
    fieldId: string;
    gridId: string;
    gridObjNum: string;
    hierarchyId: string;
}

export interface SchemaCorrectionReq {
    id: string[];
    fldId: string;
    gridId: string;
    heirerchyId: string;
    vc: string;
    rowSno: string;
    isReviewed: boolean;
}

export interface SchemaExecutionLog {
    id: string;
    schemaId: string;
    variantId: string;
    runId: string;
    exeStrtDate: number;
    exeEndDate: number;
    userId: string;
    plantCode: string;
    total: number;
    totalSuccess: number;
    correctionValue: number;
    totalError: number;
    uniqueSuccess: number;
    uniqueError: number;
    uniqueSkipped: number;
    skipped: number;
    outdated: number;
    duplicate: number;
    isInRunning: boolean;
    isInterrupted: boolean;
    interruptedMessage: string;
    successPercentage: number;
    errorPercentage: number;
    reIndexTaskId: string;
}

export class SchemaExecutionSummary {
    totalErrorPer: number;
    uniqueErrorPer: number;
    totalSuccessPer: number;
    uniqueSuccessPer: number;
    total: number;
    runBy: string;
    startTime: number;
    isInRunning: boolean;
    exeEndDate: number;
    completeProgress: number;
}


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
    isInError: boolean;
    errorMsg: string;
    fieldDesc: string;
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
}

export class DataTableSourceResponse {
    data: any[];
}
export class DataTableResponse {
    id: string;
    hdvs: DataTableHeaderResponse[];
    gvs: any;
    hyvs: any;
    stat: string;
}
export class DataTableHeaderResponse {
    fId: string;
    lls: DataTableHeaderLabelLang[];
    vls: DataTableHeaderValueLang[];
}
export class DataTableHeaderLabelLang {
    lang: string;
    label: string;
}
export class DataTableHeaderValueLang {
    lang: string;
    valueText: string;
}

export class SchemaTableViewRequest {
    userId: string;
    plantCode: string;
    unassignedFields: string[];
    schemaId: string;
    isDefaultView: boolean;
    variantId: string;
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



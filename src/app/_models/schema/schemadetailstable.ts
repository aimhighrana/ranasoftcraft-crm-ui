

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
export class SchemaStatusInformation {
    status: string;
    colorClassName: string;
    statusDescription: string;
}
export class SchemaDataTableResponse {
    queryData: string;
    data: any;
    scrollId: string;
}

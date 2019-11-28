

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




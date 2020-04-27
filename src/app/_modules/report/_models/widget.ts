export class Widget {
    x: number;
    y: number;
    height: number;
    width: number;
    widgetId: string;
    widgetType: WidgetType;

    constructor(x: number, y: number, height: number, width: number, widgetId: string, widgetType: WidgetType) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.widgetId = widgetId;
        this.widgetType = widgetType;
    }
}

export enum WidgetType {
    FILTER,
    BAR_CHART,
    STOCKBAR_CHART,
    COUNT,
    TABLE_LIST
}

export interface WidgetMapInfo {
    sno: number;
    reportId: number;
    widgetId: number;
    positionX: number;
    positionY: number;
    height: number;
    width: number;
    widgetType: string;
}

export class Criteria {
    fieldId: string;
    conditionFieldId: string;
    conditionFieldValue: string;
    blockType: BlockType;
    conditionOperator: ConditionOperator;
}
export enum BlockType {
    AND = 'AND',
    OR = 'OR',
    COND = 'COND'
}
export enum ConditionOperator {
    AGG_GROUP_BY = 'AGG_GROUP_BY',
	EQUAL = 'EQUAL',
	MULTI_SELECT = 'MULTI_SELECT',
	FIELD2FIELD = 'FIELD2FIELD',
	STARTS_WITH = 'STARTS_WITH',
	ENDS_WITH = 'ENDS_WITH',
	CONTAINS = 'CONTAINS',
	REGEX = 'REGEX',
	IN = 'IN',
	NOT_IN = 'NOT_IN',
	LESS_THAN = 'LESS_THAN',
	LESS_THAN_EQUAL = 'LESS_THAN_EQUAL',
	GREATER_THAN = 'GREATER_THAN',
	GREATER_THAN_EQUAL = 'GREATER_THAN_EQUAL',
	RANGE = 'RANGE',
	COUNT_IN = 'COUNT_IN',
	COUNT_LESS_THAN = 'COUNT_LESS_THAN',
	COUNT_LESS_THAN_EQUAL ='COUNT_LESS_THAN_EQUAL',
	COUNT_GREATER_THAN ='COUNT_GREATER_THAN',
	COUNT_GREATER_THAN_EQUAL ='COUNT_GREATER_THAN_EQUAL',
	COUNT_RANGE ='COUNT_RANGE',
	EMPTY ='EMPTY',
	NOT_EMPTY ='NOT_EMPTY',
	AVG_IN ='AVG_IN',
	AVG_LESS_THAN ='AVG_LESS_THAN',
	AVG_LESS_THAN_EQUAL ='AVG_LESS_THAN_EQUAL',
	AVG_GREATER_THAN ='AVG_GREATER_THAN',
	AVG_GREATER_THAN_EQUAL ='AVG_GREATER_THAN_EQUAL',
	AVG_RANGE ='AVG_RANGE',
	MAX_IN ='MAX_IN',
	MAX_LESS_THAN = 'MAX_LESS_THAN',
	MAX_LESS_THAN_EQUAL = 'MAX_LESS_THAN_EQUAL',
	MAX_GREATER_THAN = 'MAX_GREATER_THAN',
	MAX_GREATER_THAN_EQUAL ='MAX_GREATER_THAN_EQUAL',
	MAX_RANGE = 'MAX_RANGE',
	MIN_IN = 'MIN_IN',
	MIN_LESS_THAN = 'MIN_LESS_THAN',
	MIN_LESS_THAN_EQUAL = 'MIN_LESS_THAN_EQUAL',
	MIN_GREATER_THAN = 'MIN_GREATER_THAN',
	MIN_GREATER_THAN_EQUAL = 'MIN_GREATER_THAN_EQUAL',
	MIN_RANGE = 'MIN_RANGE'
}
export class FilterWidget {
    widgetId: number;
    type: string;
    fieldId: string;
    isMultiSelect: boolean;
}

export interface DropDownValues {
    sno: number;
    FIELDNAME: string;
    TEXT: string;
    langu: string;
    CODE: string;
}

export enum AggregationOperator {
    GROUPBY ='GROUPBY',
    COUNT='COUNT',
    MIN='MIN',
    MAX='MAX'
}


export class BarChartWidget {
    widgetId: number;
    fieldId: string;
    aggregationOperator: AggregationOperator;
}

export class StackBarChartWidget{
    widgetId: number;
    groupById: string;
    fieldId : string;
    aggregationOperator:AggregationOperator;
}

export class Count{
    widgetId: number;
    fieldId: string;
    aggregationOperator: AggregationOperator;
}

export class ReportingWidget{
    widgetId: number;
    fields: string;
    fieldOrder : string;
    fieldDesc:string;
    sno:number;
}

export class WidgetHeader {
    widgetId: number;
    widgetName: string;
    widgetType: WidgetType;
    objectType: string;
    plantCode: string;
    indexName: string;
    desc: string;
}

export interface StackbarLegend{
    legendIndex : number;
    code : string;
    text : string;
}
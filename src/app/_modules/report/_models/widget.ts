import { MetadataModel } from 'src/app/_models/schema/schemadetailstable';

export class Widget {
    x: number;
    y: number;
    height: number;
    width: number;
    widgetId: string;
    widgetType: WidgetType;
    widgetTitle: string;
    field: string;
    aggregrationOp: string;
    filterType: string;
    isMultiSelect: boolean;
    groupById: string;
    widgetTableFields: WidgetTableModel[];
    htmlText: string;
    imagesno: string;
    imageName: string;
    imageUrl: string;
    objectType: string;

    chartProperties: ChartProperties;
    defaultFilters: Criteria[];

}

export enum WidgetType {
    FILTER = 'FILTER',
    BAR_CHART = 'BAR_CHART',
    STACKED_BAR_CHART = 'STACKED_BAR_CHART',
    COUNT = 'COUNT',
    TABLE_LIST = 'TABLE_LIST',
    IMAGE = 'IMAGE',
    HTML = 'HTML',
    TIMESERIES = 'TIMESERIES'
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
    conditionFieldStartValue: string;
    conditionFieldEndValue: string;
    udrid: string;
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
    metaData: MetadataModel;
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
    MAX='MAX',
    SUM = 'SUM'
}

export enum PositionType {
    LEFT = 'left',
    RIGHT = 'right',
    TOP = 'top',
    BOTTOM = 'bottom'
}

export enum AlignPosition {
    CENTER = 'center',
    END = 'end',
    START = 'start'
}

export enum AnchorAlignPosition {
    CENTER = 'center',
    END = 'end',
    START = 'start',
}

export class BarChartWidget {
    widgetId: number;
    fieldId: string;
    aggregationOperator: AggregationOperator;
    isEnableDatalabels: boolean;
    isEnableLegend: boolean;
    orientation: Orientation;
    legendPosition : PositionType;
    datalabelsPosition: AlignPosition;
    anchorPosition: AnchorAlignPosition;
    displayAxisLabel: boolean;
    xAxisLabel : string;
    yAxisLabel : string;
    bgColor : string;
    borderColor : string;
    chartType: ChartType;
    metaData: MetadataModel;
    orderWith: OrderWith;
    scaleFrom: number;
    scaleTo: number;
    stepSize: number;
    dataSetSize: number;
    blankValueAlias : string;
    widgetColorPalette: WidgetColorPalette;


}

export class StackBarChartWidget{
    widgetId: number;
    groupById: string;
    fieldId : string;
    aggregationOperator:AggregationOperator;
    isEnableDatalabels: boolean;
    isEnableLegend: boolean;
    legendPosition : PositionType;
    datalabelsPosition: AlignPosition;
    anchorPosition: AnchorAlignPosition;
    displayAxisLabel: boolean;
    xAxisLabel : string;
    yAxisLabel : string;
    orientation: Orientation;
    fieldIdMetaData: MetadataModel;
    groupByIdMetaData: MetadataModel;
    orderWith: OrderWith;
    scaleFrom: number;
    scaleTo: number;
    stepSize: number;
    dataSetSize: number;
    blankValueAlias : string;
    widgetColorPalette: WidgetColorPalette;
}

export class PieChartWidget {
    widgetId: number;
    fieldId : string;
    aggregationOperator:AggregationOperator;
    isEnableDatalabels: boolean;
    isEnableLegend: boolean;
    orientation: string;
    legendPosition : PositionType;
    datalabelsPosition: AlignPosition;
    anchorPosition: AnchorAlignPosition;
    metaData: MetadataModel;
    blankValueAlias : string;
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
    fldMetaData: MetadataModel;
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

export interface ChartLegend{
    legendIndex : number;
    code : string;
    text : string;
}

export class FilterResponse {
    min: number;
    max: number;
    fieldId: string;
}

export interface TimeSeriesWidget {
    widgetId: number;
    widgetName: string;
    widgetType: WidgetType;
    objectType: string;
    plantCode: string;
    indexName: string;
    desc: string;
    timeSeries: WidgetTimeseries;
}
export interface WidgetTimeseries {
    widgetId: number;
    fieldId: number;
    seriesWith: SeriesWith;
    seriesFormat: string;
}
enum SeriesWith {
    millisecond = 'millisecond',
	second = 'second',
	minute = 'minute',
	hour = 'hour',
	day = 'day',
	week = 'week',
	month = 'month',
	quarter = 'quarter',
	year = 'year'
}

export class ReportDashboardReq {
    reportId: string;
    reportName: string;
    widgetReqList: Widget[];

}

export interface WidgetTableModel {
    widgetId: string;
    fields: string;
    fieldOrder: number;
    fieldDesc: string;
}

export class WidgetHtmlEditor {
    widgetId: number;
    htmlText: string;
}

export class WidgetImageModel {
    widgetId: number;
    imagesno: string;
    imageUrl: string;
    imageName:string;
}

export enum ChartType {
    BAR = 'BAR',
    PIE = 'PIE'
}

export enum Orientation {
    VERTICAL = 'VERTICAL',
    HORIZONTAL = 'HORIZONTAL'
}

export enum DatalabelsPosition {
    center = 'center',
    start = 'start',
    end = 'end'
}

export enum LegendPosition {
    top = 'top',
    left = 'left',
    bottom = 'bottom',
    right = 'right'
}

export enum OrderWith {
    ASC = 'asc',
    DESC = 'desc'
}

export class ChartProperties {
    chartType: ChartType;
    orientation: Orientation;
    isEnableDatalabels: boolean;
    datalabelsPosition: DatalabelsPosition;
    isEnableLegend: boolean;
    legendPosition: LegendPosition;
    xAxisLabel: string;
    yAxisLabel: string;
    orderWith: OrderWith;
    scaleFrom: number;
    scaleTo: number;
    stepSize: number;
    dataSetSize: number;
    blankValueAlias : string;
}

export class ReportDashboardPermission {
    permissionId: number;
    reportId: number;
    userId: string;
    roleId: string;
    groupId: string;
    isEditable: boolean;
    isViewable: boolean;
    isDeleteable: boolean;
    isAdmin: boolean;
    permissionType: PermissionType;
    createdAt: number;
    updatedAt: number;
    createdBy: string;
}
export enum PermissionType {
    USER = 'USER',
    ROLE = 'ROLE',
    GROUP = 'GROUP'
}

export interface AssginedColor {
    code: string;
    text: string;
    colorCode: string;
}

export class WidgetColorPalette {
    reportId: string;
    widgetId: string;
    widgetDesc: string;
    colorPalettes: AssginedColor[];
}
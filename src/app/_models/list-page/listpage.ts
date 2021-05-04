
export interface ListFilters {
    textInput: string;
    status: Array<object>;
    superior: Array<object>;
    planner: Array<object>;
    modified_from_date: string;
    modified_to_date: string;
    creation_from_date: string;
    creation_to_date: string;
    record: string;
}

export interface ListFunctionFilters {
    dataType: string;
    fieldName: string;
    fieldid: string;
    fieldtype: string;
    picklist: string;
    criteriaDisplay: string;
    isCheckList: boolean;
    referenceField: boolean;
    descField: string;
    refField: string;
    searchengine: string;
    isProductHierarchy: boolean;
    alternateNumField: boolean;
}

export interface ListPageRow {
    MaterialID: string;
    Description: string;
    MaterialType: string;
    Modifiedby: string;
    Modifiedon: string;
    Status: string;
    Tags: Array<object>;
}

export interface ListDynamicPageRow {
    dataType: string;
    fieldName: string;
    colWidth: number;
    enableEditing: boolean;
    filterCritera: string;
    fieldText: string;
    pickList: number;
    textAlign: string;
    ischeckList: string;
    descField: string;
    criteriaDisplay: string;
}

export interface FilterListRequest {
    fieldId: string,
    objectId: string,
    plantCode: string,
    clientId: number,
    language: string,
    fetchCount: number,
    searchTerm: string,
    fetchSize: number
}

export interface TableColumndata {
    colWidth: number,
    criteriaDisplay: string,
    dataType: string,
    descField: string,
    disabled: boolean,
    enableEditing: boolean,
    fieldName: string,
    fieldText: string,
    filterCritera: string,
    ischeckList: string,
    pickList: string,
    textAlign: string,
    visible: boolean
}

export interface TableColumndatastatic {
    colWidth: number,
    criteriaDisplay: string,
    dataType: string,
    descField: string,
    disabled: boolean,
    enableEditing: boolean,
    fieldName: string,
    fieldText: string,
    filterCritera: string,
    ischeckList: string,
    pickList: string,
    textAlign: string,
    visible: boolean
}

export interface FilterListdata {
    CODE: string;
    TEXT: string;
    checked: boolean;
    fieldid: string;
}

export interface Pagination {
    length: number,
    per_page: number,
    page_number: number
}

export class Status {
    display: string;
    value: string;
    selected: boolean;
}

export class Superior {
    display: string;
    value: string;
    selected: boolean;
}

export class Planner {
    display: string;
    value: string;
    selected: boolean;
}

export class ListPageViewDetails {
    viewId: string;
    viewName: string;
    moduleId: string;
    isDefault = false;
    isSystemView = false;
    fieldsReqList: ListPageViewFldMap[] = [];
}

export class ListPageViewFldMap {
    sno: number;
    fieldId: string;
    fieldOrder: string;
    width = '100';
    isEditable: boolean;
    sortDirection = 'ASCENDING';
}

export enum SortDirection {
    asc = 'ASCENDING',
    desc = 'DESCENDING'
}

export class FilterCriteria {
    endValue: string;
    esFieldPath: string;
    fieldId: string;
    operator: string;
    startValue: string;
    unit: string;
    values: string[];
}

export class ListPageFilters {
    filterId: string;
    description: string;
    isDefault: boolean;
    moduleId: string;
    filterCriteria: FilterCriteria[] = [];
}

export class ViewsPage {
    systemViews: ViewsPageItem[] = [];
    userViews: ViewsPageItem[] = [];
}

export class ViewsPageItem {
    viewId: string;
    viewName: string;
    default: boolean;
}

export enum FieldControlType {
    TEXT = 'text',
    TEXT_AREA = 'text-area',
    EMAIL = 'email',
    PASSWORD = 'password',
    NUMBER = 'number',
    SINGLE_SELECT = 'single-select',
    MULTI_SELECT = 'multi-select',
    DATE = 'date',
    TIME = 'time'
}

export class InboxNodesCount {
  hasNewFeeds: boolean;
  id: string;
  label: string;
  new_feed_cnt: number;
  rec_cnt: number;
  childs?: InboxNodesCount[];
}

export const DATE_FILTERS_METADATA = [
    {label: 'Day', category: 'dynamic_range', options: [
        {value:'Today', startUnit:'day', startAmount:0, endUnit:'day', endAmount:0},
        {value:'Yesterday', startUnit:'day', startAmount:1, endUnit:'day', endAmount:1},
        {value:'Last 2 days', startUnit:'day', startAmount:1, endUnit:'day', endAmount:0},
        {value:'Last 3 days', startUnit:'day', startAmount:2, endUnit:'day', endAmount:0},
        {value:'Last 4 days', startUnit:'day', startAmount:3, endUnit:'day', endAmount:0},
        {value:'Last 5 days', startUnit:'day', startAmount:4, endUnit:'day', endAmount:0}
    ]},
    {label: 'Week', category:'dynamic_range', options: [
        {value:'This week', startUnit:'week', startAmount:0, endUnit:'week', endAmount:0},
        {value:'Last week', startUnit:'day', startAmount:6, endUnit:'day', endAmount:0},
        {value:'Last 2 weeks', startUnit:'day', startAmount:13, endUnit:'day', endAmount:0},
        {value:'Last 3 weeks', startUnit:'day', startAmount:20, endUnit:'day', endAmount:0}
    ]},
    {label: 'Month', category:'dynamic_range', options: [
        {value:'This month', startUnit:'month', startAmount:0, endUnit:'month', endAmount:0},
        {value:'Last month', startUnit:'day', startAmount:30, endUnit:'day', endAmount:0},
        {value:'Last 2 months', startUnit:'day', startAmount:60, endUnit:'day', endAmount:0}
    ]},
    {label: 'Quarter', category:'dynamic_range', options: [
        {value:'This quarter', startUnit:'quarter', startAmount:0, endUnit:'quarter', endAmount:0},
        {value:'Last quarter', startUnit:'day', startAmount:90, endUnit:'day', endAmount:0},
        {value:'Last 2 quarters', startUnit:'day', startAmount:180, endUnit:'day', endAmount:0}
    ]},
    {label: 'Year', category:'dynamic_range', options: [
        {value:'This year', startUnit:'year', startAmount:0, endUnit:'year', endAmount:0},
        {value:'Last year', startUnit:'day', startAmount:365, endUnit:'day', endAmount:0},
        {value:'Last 2 years', startUnit:'day', startAmount:730, endUnit:'day', endAmount:0}
    ]},
    {label: 'Specific date', category:'static_date', options: []},
    {label: 'Date range', category:'static_range', options: []}
  ];

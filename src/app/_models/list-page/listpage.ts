
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

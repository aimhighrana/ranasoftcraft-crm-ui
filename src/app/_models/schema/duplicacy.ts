import { FilterCriteria } from './schemadetailstable';

export interface GroupDetails {
    groupId: string;
    groupName: string;
    groupDesc: string;
    groupCategory: string;
    schemaId: string;
    variantId: string;
    groupDescription: string,
    sno: string,
    allowCustomScript: any,
    active: string
    groupKey: string;
}

export class RequestForGroupList {
    schemaId: string;
    variantId: string;
    plantCode: string;
    runId: string;
    from: number;
    size: number;

}

export class RequestForCatalogCheckData {
    schemaId: string;
    runId: string;
    groupId: string;
    key: string;
    from: number;
    to: number;
    plantCode: string;
    /* variantId: string;
    requestStatus: string;
    executionStartDate: string;
    pageSize: number;
    pageIndex: number; */
    filterCriterias: FilterCriteria[];
    sort: {};
}

export class TableDataSource<T> {
    isLoading : boolean;
    totalCount : number;
    data: T[] = [];
}
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
    to: number;
    responseStatus: string;

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
    requestStatus: string;
}

export class TableDataSource<T> {
    isLoading: boolean;
    totalCount: number;
    data: T[] = [];
}

export enum RECORD_STATUS {
    MASTER = 'Master record',
    DELETABLE = 'Can be deleted',
    NOT_DELETABLE = 'Cannot be deleted'
}

export const RECORD_STATUS_KEY = 'record_status';

export class MasterRecordChangeRequest {
    schemaId: string;
    runId: string;
    id: string;
    oldId: string;
}

export class DoCorrectionRequest {
    id: string;
    fldId: string;
    vc: string;
    oc: string;
    isReviewed: string;
    groupIdold: string;
    groupIdnew: string;
    groupField: string;
}
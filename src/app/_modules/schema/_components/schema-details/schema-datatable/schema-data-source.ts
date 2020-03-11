import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections/collection-viewer';
import { Observable, BehaviorSubject } from 'rxjs';
import { SchemaTableData, RequestForSchemaDetailsWithBr, DataTableGroupBy, DataTableSourceResponse } from 'src/app/_models/schema/schemadetailstable';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import { Any2tsService } from 'src/app/_services/any2ts.service';

export class SchemaDataSource implements DataSource<SchemaTableData> {

    private dataSourceSubject = new BehaviorSubject<SchemaTableData[]>([]);

    private mdoRecordResponseSub = new BehaviorSubject<any[]>([]);

    private correctedDataSubject = new BehaviorSubject<any[]>([]);

    constructor(
        private schemaDetailService: SchemaDetailsService,
        private any2TsService: Any2tsService
    ) {}

    connect(collectionViewer: CollectionViewer): Observable<SchemaTableData[]> {
        return this.dataSourceSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.dataSourceSubject.complete();
    }

    public getTableData(request: RequestForSchemaDetailsWithBr) {
        console.log(request);
        if(request.requestStatus.toLocaleLowerCase() === 'corrections') {
            this.schemaDetailService.getCorrectedRecords(request.schemaId, request.fetchSize, request.fetchCount).subscribe(data=>{
                this.correctedDataSubject.next(data);
                this.schemaDetailService.getLastBrErrorRecords(request.schemaId, this.getCorrectedRecordsObjnr()).subscribe(res =>{
                    const data1 =  this.any2TsService.any2SchemaTableData(this.any2TsService.any2DataTable(res, request), request).data;
                    this.dataSourceSubject.next(this.showCorrectionIndexData(data1));
                });

            },error=>{
                console.error(`Error:: ${error}`);
            });
        } else {
            this.schemaDetailService.getSchemaTableDetailsByBrId(request).subscribe(
                response => {
                    this.mdoRecordResponseSub.next(response);
                    const dataTableRes: DataTableSourceResponse = this.any2TsService.any2SchemaTableData(this.any2TsService.any2DataTable(response, request), request);
                    if(request.gridId.length<=0 && request.hierarchy.length<=0) {
                        this.dataSourceSubject.next(dataTableRes.data);
                    } else {
                        this.dataSourceSubject.next(this.convertDataToGroupBy(dataTableRes.data))
                    }
                }
            , error => {
                console.error(`Error while fetching data table response : ${error}`);
            });
        }
    }

    private convertDataToGroupBy(response: any[]): any[] {
        let returnData: any[] = [];
        if (response) {
            const uniqueObjectNumber = this.getUniqueObjectNumbers(response);
            uniqueObjectNumber.forEach(objNum => {
                const grpBy: DataTableGroupBy = new DataTableGroupBy();
                grpBy.objectNumber = objNum;
                grpBy.isGroup = true;
                returnData.push(grpBy);
                returnData = returnData.concat(this.getAllRowsByObjectNumber(response, objNum));
            });
        }
        return returnData;
    }

    /**
     * Will return all rows belong to particular object number
     *
     */
    private getAllRowsByObjectNumber(data: any[] , objectNumber: string): any[] {
        return data.filter(resData => resData.OBJECTNUMBER.fieldData === objectNumber);
    }

    /**
     * Get unique object number for group
     *
     */
    private getUniqueObjectNumbers(response: any[]): string[] {
        const uniqueArray  = new Array();
        response.filter(res => {
            const objNum = res.OBJECTNUMBER.fieldData;
            if (uniqueArray.indexOf(objNum) === -1) {
                uniqueArray.push(objNum);
            }
        });
        return uniqueArray;
    }

    public getCorrectedRecordsObjnr(): string[] {
        return this.correctedDataSubject.getValue().map(map => map.id);
    }

    public showCorrectionIndexData(mdoRec: any[]) : any[] {
        const correctedObjNum = this.correctedDataSubject.getValue().map(map => map.id);
        const output: any[] = [];
        correctedObjNum.forEach(corrected =>{
            const mdo = mdoRec.filter(mRec => mRec.OBJECTNUMBER.fieldData === corrected)[0];
            if(mdo) {
                const mdoNew = {} as any;
                const objNum = mdo.OBJECTNUMBER.fieldData;
                const rowObj = mdo.objnr ? mdo.objnr.fieldData : '';
                Object.keys(mdo).forEach(fieldId=>{
                        const oldData =  {} as any;
                        const correctedVal = this.any2TsService.any2LatestCorrectedData(this.correctedDataSubject.getValue(),objNum,fieldId,rowObj);
                        oldData.fieldData =  correctedVal ? correctedVal : mdo[fieldId].fieldData;
                        oldData.fieldId = fieldId;
                        oldData.fieldDesc = mdo[fieldId].fieldDesc;
                        oldData.isCorrected = correctedVal ? true : false;
                        mdoNew[fieldId] = oldData;
                });
                mdoNew.isCorrectedRow = true;
                output.push(mdoNew);
                output.push(mdo);
            }

        });
        return output;
    }


}




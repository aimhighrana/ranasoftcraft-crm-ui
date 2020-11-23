import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections/collection-viewer';
import { Observable, BehaviorSubject } from 'rxjs';
import { SchemaTableData, RequestForSchemaDetailsWithBr, SchemaBrInfo } from 'src/app/_models/schema/schemadetailstable';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import { EndpointService } from '@services/endpoint.service';

export class SchemaDataSource implements DataSource<SchemaTableData> {

    private dataSourceSubject = new BehaviorSubject<SchemaTableData[]>([]);

    private mdoRecordResponseSub = new BehaviorSubject<any[]>([]);

    private correctedDataSubject = new BehaviorSubject<any[]>([]);

    private afterKeyPage = new BehaviorSubject<any>(null);

    public brMetadata: BehaviorSubject<SchemaBrInfo[]> = new BehaviorSubject<SchemaBrInfo[]>(null);

    constructor(
        private schemaDetailService: SchemaDetailsService,
        private endpointService: EndpointService,
        private schemaId: string
    ) {
        this.schemaDetailService.getSchemaBrInfoList(this.schemaId).subscribe(res=>{
            this.brMetadata.next(res);
        }, error=>{
            console.error('Error : ', error.message);
        })
    }

    connect(collectionViewer: CollectionViewer): Observable<SchemaTableData[]> {
        return this.dataSourceSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.dataSourceSubject.complete();
    }

    /**
     * Return length of doc ..
     */
    docLength(): number {
        return this.dataSourceSubject.getValue().length;
    }

    /**
     * Return all dcument that have on this subject
     */
    docValue() {
        return this.dataSourceSubject.getValue();
    }

    /**
     * Set row data .
     * @param rows set rows..
     */
    setDocValue(rows: any) {
        this.dataSourceSubject.next(rows);
    }

    /**
     * Get datatable data ....
     * if isLoadMore then newRes should append on oldData..
     *
     * @param request Global table request for load datatable data
     */
    public getTableData(request: RequestForSchemaDetailsWithBr) {
        this.schemaDetailService.getSchemaTableData(request).subscribe(res=>{
            if(request.isLoadMore) {
                const loadedData = this.docValue();
                const newData =  this.docsTransformation(res, request.requestStatus);
                loadedData.push(...newData);
                this.dataSourceSubject.next(loadedData);
            } else {
                this.dataSourceSubject.next(this.docsTransformation(res, request.requestStatus));
            }

        }, error=>{
            this.dataSourceSubject.next([]);
            console.error(`Error : ${error.message}`);
        });

        // if(request.requestStatus.toLocaleLowerCase() === 'corrections') {
        //     this.schemaDetailService.getCorrectedRecords(request.schemaId, request.fetchSize, request.fetchCount).subscribe(data=>{
        //         this.correctedDataSubject.next(data);
        //         this.schemaDetailService.getLastBrErrorRecords(request.schemaId, this.getCorrectedRecordsObjnr()).subscribe(res =>{
        //             const data1 =  this.any2TsService.any2SchemaTableData(this.any2TsService.any2DataTable(res, request), request).data;
        //             this.dataSourceSubject.next(this.showCorrectionIndexData(data1));
        //         });

        //     },error=>{
        //         console.error(`Error:: ${error}`);
        //     });
        // } else {
        //     this.schemaDetailService.getSchemaTableDetailsByBrId(request).subscribe(
        //         response => {
        //             if(response && response.docs) {
        //                 this.afterKeyPage.next(response.afterKey);
        //                 response = response.docs;
        //                 this.mdoRecordResponseSub.next(response);
        //                 const dataTableRes: DataTableSourceResponse = this.any2TsService.any2SchemaTableData(this.any2TsService.any2DataTable(response, request), request);
        //                 if(request.gridId.length<=0 && request.hierarchy.length<=0) {
        //                     this.dataSourceSubject.next(dataTableRes.data);
        //                 } else {
        //                     this.dataSourceSubject.next(this.convertDataToGroupBy(dataTableRes.data))
        //                 }
        //             }
        //         }
        //     , error => {
        //         console.error(`Error while fetching data table response : ${error}`);
        //     });
        // }
    }

    /**
     * Transformation server index data to Datasource
     * @param res table response from server ..
     */
    public docsTransformation(res: any, reqTye: string): any[] {
        const finalResonse = [];
        if(res && res.docs) {
            const docs = res.docs;
            docs.forEach(doc => {
                const rowData : any = {};

                // object number
                const objnr: SchemaTableData = new SchemaTableData();
                objnr.fieldData = doc.id;
                objnr.fieldId = 'OBJECTNUMBER';
                objnr.fieldDesc = 'Object Number';
                objnr.isReviewed = doc.isReviewed ? doc.isReviewed : false;
                rowData.OBJECTNUMBER = objnr;

                // score column
                const score: SchemaTableData = new SchemaTableData();
                score.fieldData = String(doc._score ? (doc._score * 100) : 0);
                score.fieldId = '_score_weightage';
                score.fieldDesc = 'Score';
                rowData._score_weightage = score;


                let hdvs = doc.hdvs ? doc.hdvs : {};
                hdvs = this.checkFieldIsInError(hdvs);
                for(const hdfld in hdvs ) {
                    if(hdvs.hasOwnProperty(hdfld)) {
                        const cell: SchemaTableData = new SchemaTableData();
                        cell.fieldId = hdfld;
                        cell.fieldDesc = hdvs[hdfld].ls ? hdvs[hdfld].ls : 'Unknown';

                        // only code is visiable
                        // TODO on based on display criteria
                        const dropVal = hdvs[hdfld].vc ?  hdvs[hdfld].vc.map(map => map.c).toString() : '';
                        cell.fieldData = dropVal ? dropVal : '';

                        // check cell is in error
                        if(reqTye === 'error') {
                            // const errCell =  this.checkFieldIsInError(hdfld);
                            cell.isInError = hdvs[hdfld].isInError ? hdvs[hdfld].isInError : false;
                            cell.errorMsg = hdvs[hdfld].message ? hdvs[hdfld].message.toString() : '';
                        }

                        // check for old values
                        if(hdvs[hdfld].oc && hdvs[hdfld].oc.length>0) {
                            const oldVal = hdvs[hdfld].oc ?  hdvs[hdfld].oc.map(map => map.c).toString() : '';
                            cell.oldData = oldVal;
                            // cell.isCorrected = cell.oldData === cell.fieldData ? false : true;
                            cell.isCorrected = true;
                        }
                        rowData[hdfld] =cell;
                    }

                }
                finalResonse.push(rowData);
            });

        }
        return finalResonse;
    }

    /**
     * Transform data after error check .. and update mesage
     * @param rowData checkable fields
     */
    checkFieldIsInError(rowData: any) {

        const brMetadata = this.brMetadata.getValue();
        if(brMetadata) {
            brMetadata.forEach(br=>{
                // check with udr
                if(br.udrblocks) {
                    const fields = br.udrblocks.map(map => map.conditionFieldId);
                    fields.forEach(brFld=>{
                        if(rowData.hasOwnProperty(brFld)) {
                            rowData[brFld].isInError = true;
                            const exitingMsg =  rowData[brFld].message ? rowData[brFld].message : [];
                            exitingMsg.push(br.dynamicMessage ? br.dynamicMessage : br.brDescription);
                            rowData[brFld].message = exitingMsg;
                        } else {
                            rowData[brFld] = {fId: brFld,vc: [{c: '',t: ''}],ls: '', isInError:true,message:[br.dynamicMessage ? br.dynamicMessage : br.brDescription]};
                        }
                    });
                } else {
                    const brfldarray = br.fields.split(',');
                    brfldarray.forEach(brFld=>{
                        if(rowData.hasOwnProperty(brFld)) {
                            rowData[brFld].isInError = true;
                            const exitingMsg =  rowData[brFld].message ? rowData[brFld].message : [];
                            exitingMsg.push(br.dynamicMessage ? br.dynamicMessage : br.brDescription);
                            rowData[brFld].message = exitingMsg;
                        } else {
                            rowData[brFld] = {fId: brFld,vc: [{c: '',t: ''}],ls: '', isInError:true,message:[br.dynamicMessage ? br.dynamicMessage : br.brDescription]};
                        }
                    });
                }
            });
        }
        console.log(rowData);
        return rowData;
    }

    // private convertDataToGroupBy(response: any[]): any[] {
    //     let returnData: any[] = [];
    //     if (response) {
    //         const uniqueObjectNumber = this.getUniqueObjectNumbers(response);
    //         uniqueObjectNumber.forEach(objNum => {
    //             const grpBy: DataTableGroupBy = new DataTableGroupBy();
    //             grpBy.objectNumber = objNum;
    //             grpBy.isGroup = true;
    //             returnData.push(grpBy);
    //             returnData = returnData.concat(this.getAllRowsByObjectNumber(response, objNum));
    //         });
    //     }
    //     return returnData;
    // }

    // /**
    //  * Will return all rows belong to particular object number
    //  *
    //  */
    // private getAllRowsByObjectNumber(data: any[] , objectNumber: string): any[] {
    //     return data.filter(resData => resData.OBJECTNUMBER.fieldData === objectNumber);
    // }

    // /**
    //  * Get unique object number for group
    //  *
    //  */
    // private getUniqueObjectNumbers(response: any[]): string[] {
    //     const uniqueArray  = new Array();
    //     response.filter(res => {
    //         const objNum = res.OBJECTNUMBER.fieldData;
    //         if (uniqueArray.indexOf(objNum) === -1) {
    //             uniqueArray.push(objNum);
    //         }
    //     });
    //     return uniqueArray;
    // }

    // public getCorrectedRecordsObjnr(): string[] {
    //     return this.correctedDataSubject.getValue().map(map => map.id);
    // }

    // public showCorrectionIndexData(mdoRec: any[]) : any[] {
    //     const output: any[] = [];
    //     const correctedIndxRec = this.correctedDataSubject.getValue();
    //     correctedIndxRec.forEach(correctedRec=>{
    //         const mdo = mdoRec.filter(mRec => mRec.OBJECTNUMBER.fieldData === correctedRec.id)[0];
    //         if(mdo) {
    //             const mdoNew = {} as any;
    //             const rowObj = mdo.objnr ? mdo.objnr.fieldData : '';
    //             Object.keys(mdo).forEach(fieldId=>{
    //                     const oldData =  {} as any;
    //                     const correctedVal = this.any2TsService.any2LatestCorrectedData(correctedRec,fieldId,rowObj);
    //                     oldData.fieldData =  (correctedVal === undefined || correctedVal === null) ? mdo[fieldId].fieldData : correctedVal;
    //                     oldData.fieldId = fieldId;
    //                     oldData.fieldDesc = mdo[fieldId].fieldDesc;
    //                     oldData.isCorrected = (correctedVal === undefined || correctedVal === null) ? false : true;
    //                     mdoNew[fieldId] = oldData;
    //                     mdo[fieldId].isCorrected = (correctedVal === undefined || correctedVal === null) ? false : true;
    //             });

    //             // check currect data is avail
    //             Object.keys(correctedRec.hdvs).forEach(fld=>{
    //                 if(!mdo.hasOwnProperty(fld)) {
    //                     const oldData =  {} as any;
    //                     const newData =  {} as any;
    //                     newData.fieldData =  correctedRec.hdvs[fld] ? correctedRec.hdvs[fld] .vc : '';
    //                     newData.fieldId = fld;
    //                     newData.fieldDesc = '';
    //                     newData.isCorrected = true;

    //                     oldData.fieldData =  '';
    //                     oldData.fieldId = fld;
    //                     oldData.fieldDesc = '';
    //                     oldData.isCorrected = true;

    //                     mdoNew[fld] = newData;
    //                     mdo[fld] = oldData;
    //                 }
    //             });

    //             mdoNew.isCorrectedRow = true;
    //             mdoNew.isReviewed = correctedRec.isReviewed ? correctedRec.isReviewed : false;
    //             mdoNew.isSubmitted = correctedRec.isSubmitted ? correctedRec.isSubmitted : false;
    //             output.push(mdoNew);
    //             output.push(mdo);

    //         }

    //     });
    //     return output;
    // }


}




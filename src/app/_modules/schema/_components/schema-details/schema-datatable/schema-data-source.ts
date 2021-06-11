import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections/collection-viewer';
import { Observable, BehaviorSubject } from 'rxjs';
import { SchemaTableData, RequestForSchemaDetailsWithBr, SchemaBrInfo } from 'src/app/_models/schema/schemadetailstable';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import { EndpointsClassicService } from '@services/_endpoints/endpoints-classic.service';

export class SchemaDataSource implements DataSource<SchemaTableData> {

    private dataSourceSubject = new BehaviorSubject<SchemaTableData[]>([]);

    private mdoRecordResponseSub = new BehaviorSubject<any[]>([]);

    private correctedDataSubject = new BehaviorSubject<any[]>([]);

    private afterKeyPage = new BehaviorSubject<any>(null);

    public brMetadata: BehaviorSubject<SchemaBrInfo[]> = new BehaviorSubject<SchemaBrInfo[]>(null);

    public targetField = '';

    constructor(
        private schemaDetailService: SchemaDetailsService,
        private endpointService: EndpointsClassicService,
        private schemaId: string
    ) {
        this.schemaDetailService.getSchemaBrInfoList(this.schemaId).subscribe(res=>{
            this.brMetadata.next(res);
            // if rule type is transformation then should have tragetField
            const lookupTransformation = res.filter(r=> r.brType === 'BR_TRANSFORMATION');
            if(lookupTransformation && lookupTransformation.length>0) {
                const lastBr = lookupTransformation[lookupTransformation.length-1];
                const lookUpInfo = lastBr.transformationModel.filter(t=> t.transformationRuleType === 'LOOKUP')[0];
                this.targetField = lookUpInfo ? lookUpInfo.targetFld : '';
            }
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
                const newData =  this.docsTransformation(res, request);
                loadedData.push(...newData);
                this.dataSourceSubject.next(loadedData);
            } else {
                this.dataSourceSubject.next(this.docsTransformation(res, request));
            }

        }, error=>{
            this.dataSourceSubject.next([]);
            console.error(`Error : ${error.message}`);
        });
    }

    /**
     * Transformation server index data to Datasource
     * @param res table response from server ..
     */
     public docsTransformation(res: any, req: RequestForSchemaDetailsWithBr): any[] {
        const reqTye = req.requestStatus;
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
                score.fieldData = String(doc._score ? (doc._score * 100).toFixed(2) : 0);
                score.fieldId = '_score_weightage';
                score.fieldDesc = 'Score';
                rowData._score_weightage = score;


                const hdvs = doc.hdvs ? doc.hdvs : {};
                // hdvs = this.checkFieldIsInError(hdvs);
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
                            cell.errorMsg = hdvs[hdfld].errmsgs ? hdvs[hdfld].errmsgs.toString() : '';
                        }

                        // check for old values
                        if(hdvs[hdfld].oc && hdvs[hdfld].oc.length>0) {
                            const oldVal = hdvs[hdfld].oc.map(map => map.c).toString();
                            cell.oldData = oldVal;
                            // cell.isCorrected = cell.oldData === cell.fieldData ? false : true;
                            cell.isCorrected = true;
                        }
                        rowData[hdfld] =cell;
                    }

                }
                if(req.nodeType === 'HEIRARCHY') {
                    const hyvs = doc.hyvs ? doc.hyvs : {};
                    // hyvs = this.checkFieldIsInError(hyvs);
                    if(hyvs.hasOwnProperty(req.nodeId)) {
                        const rows = hyvs[req.nodeId].rows ? hyvs[req.nodeId].rows : [];
                        for(const r of rows) {
                            const _rrData = {...rowData};
                            for(const robj in r) {
                                if(r.hasOwnProperty(robj)) {
                                    const cell: SchemaTableData = new SchemaTableData();
                                    cell.fieldId = robj;
                                    cell.fieldDesc = r[robj].ls ? r[robj].ls : 'Unknown';
                                    // only code is visiable
                                    // TODO on based on display criteria
                                    const dropVal = r[robj].vc ?  r[robj].vc.map(map => map.c).toString() : '';
                                    cell.fieldData = dropVal ? dropVal : '';

                                    // check cell is in error
                                    if(reqTye === 'error') {
                                        // const errCell =  this.checkFieldIsInError(hdfld);
                                        cell.isInError = (r[robj] && r[robj].isInError) ? r[robj].isInError : false;
                                        cell.errorMsg = (r[robj] && r[robj].errmsgs) ? r[robj].errmsgs.toString() : '';
                                    }

                                    // check for old values
                                    if(r[robj].oc && r[robj].oc.length>0) {
                                        const oldVal = r[robj].oc.map(map => map.c).toString();
                                        cell.oldData = oldVal;
                                        // cell.isCorrected = cell.oldData === cell.fieldData ? false : true;
                                        cell.isCorrected = true;
                                    }
                                    _rrData[robj] =cell;
                                }
                            }
                            finalResonse.push(_rrData);
                        }

                    } else {
                        finalResonse.push(rowData);
                    }

                } else if (req.nodeType === 'GRID') {
                    const gvs = doc.gvs ? doc.gvs : {};
                    // gvs = this.checkFieldIsInError(gvs);
                    if(gvs.hasOwnProperty(req.nodeId)) {
                        const rows = gvs[req.nodeId].rows ? gvs[req.nodeId].rows : [];
                        for(const r of rows) {
                            const _rrData = rowData;
                            for(const robj in r) {
                                if(r.hasOwnProperty(robj)) {
                                    const cell: SchemaTableData = new SchemaTableData();
                                    cell.fieldId = robj;
                                    cell.fieldDesc = r[robj].ls ? r[robj].ls : 'Unknown';

                                    // only code is visiable
                                    // TODO on based on display criteria
                                    const dropVal = r[robj].vc ?  r[robj].vc.map(map => map.c).toString() : '';
                                    cell.fieldData = dropVal ? dropVal : '';

                                    // check cell is in error
                                    if(reqTye === 'error') {
                                        // const errCell =  this.checkFieldIsInError(hdfld);
                                        cell.isInError = (r[robj] && r[robj].isInError) ? r[robj].isInError : false;
                                        cell.errorMsg = (r[robj] && r[robj].errmsgs) ? r[robj].errmsgs.toString() : '';
                                    }

                                    // check for old values
                                    if(r[robj].oc && r[robj].oc.length>0) {
                                        const oldVal = r[robj].oc ?  r[robj].oc.map(map => map.c).toString() : '';
                                        cell.oldData = oldVal;
                                        // cell.isCorrected = cell.oldData === cell.fieldData ? false : true;
                                        cell.isCorrected = true;
                                    }
                                    _rrData[robj] =cell;
                                }
                            }
                            finalResonse.push(_rrData);
                        }

                    } else {
                        finalResonse.push(rowData);
                    }
                } else {
                    finalResonse.push(rowData);
                }

            });

        }
        return finalResonse;
    }

    /**
     * Transform data after error check .. and update mesage
     * @param rowData checkable fields
     */
    // checkFieldIsInError(rowData: any) {

    //     const brMetadata = this.brMetadata.getValue();
    //     if(brMetadata) {
    //         brMetadata.forEach(br=>{
    //             // check with udr
    //             const errorMessage = br.dynamicMessage ? br.dynamicMessage : br.brDescription;
    //             if(br.udrblocks) {
    //                 const fields = br.udrblocks.map(map => map.conditionFieldId);
    //                 fields.forEach(brFld=>{
    //                     if(rowData.hasOwnProperty(brFld)) {
    //                         rowData[brFld].isInError = true;
    //                         const exitingMsg =  rowData[brFld].message ? rowData[brFld].message : [];
    //                         if(exitingMsg.indexOf(errorMessage) === -1) {
    //                             exitingMsg.push(errorMessage);
    //                         }
    //                         rowData[brFld].message = exitingMsg;
    //                     } else {
    //                         rowData[brFld] = {fId: brFld,vc: [{c: '',t: ''}],ls: '', isInError:true,message:[br.dynamicMessage ? br.dynamicMessage : br.brDescription]};
    //                     }
    //                 });
    //             } else {
    //                 const brfldarray = br.fields.split(',');
    //                 brfldarray.forEach(brFld=>{
    //                     if(rowData.hasOwnProperty(brFld)) {
    //                         rowData[brFld].isInError = true;
    //                         const exitingMsg =  rowData[brFld].message ? rowData[brFld].message : [];
    //                         if(exitingMsg.indexOf(errorMessage) === -1) {
    //                             exitingMsg.push(errorMessage);
    //                         }
    //                         rowData[brFld].message = exitingMsg;
    //                     } else {
    //                         rowData[brFld] = {fId: brFld,vc: [{c: '',t: ''}],ls: '', isInError:true,message:[br.dynamicMessage ? br.dynamicMessage : br.brDescription]};
    //                     }
    //                 });
    //             }
    //         });
    //     }
    //     // console.log(rowData);
    //     return rowData;
    // }

}




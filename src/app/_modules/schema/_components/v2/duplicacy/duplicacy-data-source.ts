import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { CatalogCheckService } from '@services/home/schema/catalog-check.service';
import { RequestForCatalogCheckData, RECORD_STATUS, RECORD_STATUS_KEY } from '@models/schema/duplicacy';
import { SchemaTableData } from '@models/schema/schemadetailstable';
import { TransientService } from 'mdo-ui-library';


export class DuplicacyDataSource implements DataSource<SchemaTableData> {

    private dataSourceSubject = new BehaviorSubject<SchemaTableData[]>([]);

    constructor(private catalogCheckService: CatalogCheckService,
        private snackBar: TransientService) {

    }

    /**
     * Get datatable data ....
     * if isLoadMore then newRes should append on oldData..
     *
     * @param request Global table request for load datatable data
     */
    public getTableData(request: RequestForCatalogCheckData, isLoadingMore) {

        this.catalogCheckService.getCatalogCheckRecords(request).subscribe(res => {

            /* const result = this.docsTransformation(res);

            console.log(result);
            this.dataSourceSubject.next(result); */

            if (isLoadingMore) {
                const loadedData = this.docValue();
                const newData = this.docsTransformation(res);
                loadedData.push(...newData);
                this.dataSourceSubject.next(loadedData);
            } else {
                this.dataSourceSubject.next(this.docsTransformation(res));
            }

        }, error => {
            this.dataSourceSubject.next([]);
            this.snackBar.open('Something went wrong !', 'close', {duration:5000});
            console.error(`Error : ${error.message}`);
        });
    }

    /**
     * Transformation server index data to Datasource
     * @param res table response from server ..
     */
    public docsTransformation(res: any, reqTye?: string): any[] {
        const finalResonse = [];
        if (res && res.doc) {
            const docs = res.doc;
            docs.forEach(doc => {
                const rowData: any = {};

                // object number
                const objnr: SchemaTableData = new SchemaTableData();
                objnr.fieldData = doc.id;
                objnr.fieldId = 'OBJECTNUMBER';
                objnr.fieldDesc = 'Object Number';
                objnr.isReviewed = doc.isReviewed ? doc.isReviewed : false;

                // add flg for deletion as well
                objnr.delFlag = doc.delFlag ? doc.delFlag : false;

                rowData.OBJECTNUMBER = objnr;

                // record status
                const status: SchemaTableData = new SchemaTableData();
                status.fieldData = doc.masterRecord === '1' ? RECORD_STATUS.MASTER : doc.delFlag ? RECORD_STATUS.DELETABLE : RECORD_STATUS.NOT_DELETABLE;
                status.fieldId = RECORD_STATUS_KEY ;
                status.fieldDesc = 'Status';
                rowData[RECORD_STATUS_KEY] = status;

                const hdvs = doc.hdvs ? doc.hdvs : {};
                for (const hdfld in hdvs) {
                    if (hdvs.hasOwnProperty(hdfld)) {
                        const cell: SchemaTableData = new SchemaTableData();
                        cell.fieldId = hdfld;
                        cell.fieldDesc = hdvs[hdfld].ls ? hdvs[hdfld].ls : 'Unknown';

                        // only code is visiable
                        // TODO on based on display criteria
                        const dropVal = hdvs[hdfld].vc ? hdvs[hdfld].vc.map(map => map.t || map.c).toString() : '';
                        cell.fieldData = dropVal ? dropVal : '';

                        // check cell is in error
                        /* if (reqTye === 'error') {
                            const errCell =  this.checkFieldIsInError(hdfld);
                            cell.isInError = hdvs[hdfld].isInError ? hdvs[hdfld].isInError : false;
                            cell.errorMsg = hdvs[hdfld].message ? hdvs[hdfld].message.toString() : '';
                        } */

                        // check for old values
                        if (hdvs[hdfld].oc && hdvs[hdfld].oc.length > 0) {
                            const oldVal = hdvs[hdfld].oc ? hdvs[hdfld].oc : '';
                            // .map(map => map.c).toString() : '';
                            cell.oldData = oldVal;
                            // cell.isCorrected = cell.oldData === cell.fieldData ? false : true;
                            cell.isCorrected = true;
                        }
                        rowData[hdfld] = cell;
                    }

                }
                finalResonse.push(rowData);
            });

        }
        return finalResonse;
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
     * reset data source
     */
    reset() {
        this.dataSourceSubject.next([]);
    }



}
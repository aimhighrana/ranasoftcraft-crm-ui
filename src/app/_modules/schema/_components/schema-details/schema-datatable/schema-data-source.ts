import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections/collection-viewer';
import { Observable, BehaviorSubject } from 'rxjs';
import { SchemaTableData, RequestForSchemaDetailsWithBr, DataTableGroupBy } from 'src/app/_models/schema/schemadetailstable';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';

export class SchemaDataSource implements DataSource<SchemaTableData> {

    private dataSourceSubject = new BehaviorSubject<SchemaTableData[]>([]);

    constructor(private schemaDetailService: SchemaDetailsService) {

    }

    connect(collectionViewer: CollectionViewer): Observable<SchemaTableData[]> {
        return this.dataSourceSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.dataSourceSubject.complete();
    }

    public getTableData(request: RequestForSchemaDetailsWithBr) {
        this.schemaDetailService.getSchemaTableDetailsByBrId(request).subscribe(
            response => this.dataSourceSubject.next(this.convertDataToGroupBy(response.data))
        , error => {
            console.error('Error while fetching data table response');
        });
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


}




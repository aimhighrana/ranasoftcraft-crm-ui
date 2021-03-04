import { DataList } from '@modules/list/_components/list.component';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private dataOfList: DataList[] = [
      {
        objectId:'1004',objectDesc:'Functional location'
      },{
        objectId:'1005',objectDesc:'Material'
      },{
        objectId:'1007',objectDesc:'Customer'
      }
  ];
  constructor() {}
  apiUrl = environment.apiurl;
  public dataList(): Observable<DataList[]> {
    return of(this.dataOfList);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {

  private  chooseColumnSub: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() { }

  public setChooseColumnData(data: any) {
    this.chooseColumnSub.next(data);
  }

  public getChooseColumnData(): Observable<any> {
    return this.chooseColumnSub.asObservable();
  }

}

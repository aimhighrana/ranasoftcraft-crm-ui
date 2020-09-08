import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {

  private  chooseColumnSub: BehaviorSubject<any> = new BehaviorSubject(null);

  private afterBrSaveUpdate: BehaviorSubject<any> = new BehaviorSubject(null);

  private reportListData: BehaviorSubject<any> = new BehaviorSubject(null);

  private togglePrimaryEmit: BehaviorSubject<any> = new BehaviorSubject(null);


  constructor() { }

  public setChooseColumnData(data: any) {
    this.chooseColumnSub.next(data);
  }

  public getChooseColumnData(): Observable<any> {
    return this.chooseColumnSub.asObservable();
  }

  public setAfterBrSave(data: any) {
    this.afterBrSaveUpdate.next(data);
  }

  public getAfterBrSave(): Observable<any> {
    return this.afterBrSaveUpdate.asObservable();
  }

  public setReportListData() {
    this.reportListData.next(true);
  }

  public getReportListData(): Observable<any> {
    return this.reportListData.asObservable();
  }

  public setTogglePrimaryEmit() {
    this.togglePrimaryEmit.next(true);
  }

  public getTogglePrimaryEmit(): Observable<any> {
    return this.togglePrimaryEmit.asObservable();
  }
}

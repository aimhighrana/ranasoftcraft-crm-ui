import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum SecondaynavType {
  schema = 'schema',
  dataIntilligence = 'dataIntilligence',
  report = 'report'
}

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {

  private chooseColumnSub: BehaviorSubject<any> = new BehaviorSubject(null);

  private afterBrSaveUpdate: BehaviorSubject<any> = new BehaviorSubject(null);

  private reportListData: BehaviorSubject<any> = new BehaviorSubject(null);

  private togglePrimaryEmit: BehaviorSubject<any> = new BehaviorSubject(null);

  public secondaryBarData: BehaviorSubject<any> = new BehaviorSubject(null);

  private refreshSecondaryNav: BehaviorSubject<SecondaynavType> = new BehaviorSubject<SecondaynavType>(null);

  private afterSubscriberSave: BehaviorSubject<any> = new BehaviorSubject(null);
  /**
   * obervable to signal subscriber to call api for update notification
   */
  public updateNotifications: BehaviorSubject<any> = new BehaviorSubject(null);
  /**
   * behavior subject to contain settings info of the report-data-table widget
   */
  public reportDataTableSetting: BehaviorSubject<any> = new BehaviorSubject(null);

  /**
   * Identify whether loged in from msteam .. or web
   */
  private isFromMsTeamLogedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  constructor() { }

  public setChooseColumnData(data: any) {
    this.chooseColumnSub.next(data);
  }

  public getChooseColumnData(): Observable<any> {
    return this.chooseColumnSub.asObservable();
  }

  /**
   * Function to pass business rule data inside BehaviourSubject.
   */
  public setAfterBrSave(data: any) {
    this.afterBrSaveUpdate.next(data);
  }

  /**
   * Function to get business rule data of a schema.
   */
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

  public getSecondaryNavbarList() {
    this.secondaryBarData.next('')
  }
  /**
   * Use for refresh .. secondary nav bar
   * @param type set refresh type parameters ...
   */
  public setRefreshSecondaryNav(type: SecondaynavType) {
    this.refreshSecondaryNav.next(type);
  }

  /**
   * Return the latest refresh type ..
   */
  public isSecondaryNavRefresh(): Observable<SecondaynavType> {
    return this.refreshSecondaryNav.asObservable();
  }

  /**
   * Function to pass subscriber data inside BehaviourSubject.
   */
  public setAfterSubscriberSave(data: any) {
    return this.afterSubscriberSave.next(data);
  }

  /**
   * Function to get data of subscriber
   */
  public getAfterSubscriberSave(): Observable<any> {
    return this.afterSubscriberSave.asObservable();
  }
  /*
   * function to call the subscriber to get notifications
   */
  public getNotificationCount() {
    return this.updateNotifications.next(true)
  }

  /**
   * function to set data of report data-table settings
   */
  public setReportDataTableSetting(data:any){
    return this.reportDataTableSetting.next(data);
  }

  /**
   * function to get data of report data-table settings
   */
  public getReportDataTableSetting(): Observable<any>{
    return this.reportDataTableSetting.asObservable();
  }


  /**
   * Set is from msteam loged in ..
   * @param status updated status ...
   */
  public setIsFromMsTeamLogedIn(status: boolean) {
    this.isFromMsTeamLogedIn.next(status);
  }

  /**
   * Get flag for is from msteam ..
   */
  public getIsFromMsTeamLogedIn(): Observable<boolean> {
    return this.isFromMsTeamLogedIn.asObservable();
  }
}

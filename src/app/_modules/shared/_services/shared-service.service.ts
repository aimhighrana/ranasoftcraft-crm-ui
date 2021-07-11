import { Injectable } from '@angular/core';
import { CoreSchemaBrInfo } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SecondaryNavRefresh, SecondaynavType } from '@models/menu-navigation';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ListPageViewDetails } from '@models/list-page/listpage';
import { DataScopeSidesheet } from '@models/schema/schema';

@Injectable({
  providedIn: 'root',
})
export class SharedServiceService {
  private chooseColumnSub: BehaviorSubject<any> = new BehaviorSubject(null);

  private afterBrSaveUpdate: BehaviorSubject<any> = new BehaviorSubject(null);

  private afterEditDatascopeSideSheetClose: BehaviorSubject<any> = new BehaviorSubject(null);

  private editDatascopeTrigger: BehaviorSubject<any> = new BehaviorSubject(null);

  private reportListData: BehaviorSubject<any> = new BehaviorSubject(null);

  private togglePrimaryEmit: BehaviorSubject<any> = new BehaviorSubject(null);

  public secondaryBarData: BehaviorSubject<any> = new BehaviorSubject(null);

  private refreshSecondaryNav: Subject<SecondaryNavRefresh> = new Subject<SecondaryNavRefresh>();

  private afterSubscriberSave: BehaviorSubject<any> = new BehaviorSubject(null);

  /**
   * obervable to signal loading state for components
   */
  public loader: BehaviorSubject<boolean> = new BehaviorSubject(null);
  /**
   * obervable to signal subscriber to call api for update notification
   */
  public updateNotifications: BehaviorSubject<any> = new BehaviorSubject(null);
  /**
   * behavior subject to contain settings info of the report-data-table widget
   */
  public reportDataTableSetting: BehaviorSubject<any> = new BehaviorSubject(null);

  /**
   * Trigger to refresh schema list so the latest running schema appears on top
   */
  public refresSchemaListTrigger: BehaviorSubject<any> = new BehaviorSubject(null);

  /**
   * Identify whether loged in from msteam .. or web
   */
  private isFromMsTeamLogedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Behavior subject to identidy that scheduler is edit/add
   */
  private afterEditSchedule: BehaviorSubject<any> = new BehaviorSubject(null);

  /**
   * Behavior subject for duplicate rule exclusion edit
   */
  private updateRuleFieldExclusion: BehaviorSubject<any> = new BehaviorSubject(null);

  /**
   * Subject for Business rule saving
   */
  private saveBr: Subject<CoreSchemaBrInfo> = new Subject();

  /**
   * Behavior subject for data scope saving
   */
  private afterSaveDataScope: Subject<any> = new Subject();

  private viewDetailsSub: Subject<ListPageViewDetails> = new Subject();

  private taskinboxViewDetailsSub: BehaviorSubject<any> = new BehaviorSubject(null);

  private schemaRunSub: Subject<boolean> = new Subject();

  private isSecondaySideNavBarOpen: Subject<boolean> = new Subject();

  /**
   * Subject for after saved  trans and reload in br map ...
   */
  private transSavedBehaviourSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Flag after save mappings ...
   */
  private afterMappingSaved: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private datascopeSheetState: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() {}

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

  public setReportListData(isPageReload: boolean = false) {
    this.reportListData.next({ isPageReload });
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
    this.secondaryBarData.next('');
  }
  /**
   * Use for refresh .. secondary nav bar
   * @param activeMenu set refresh type parameters ...
   * @param activeMenuItemId active item inside selected menu
   */
  public setRefreshSecondaryNav(activeMenu: SecondaynavType, isPageReload, activeMenuItemId?: string) {
    this.refreshSecondaryNav.next({ activeMenu, isPageReload, activeMenuItemId });
  }

  /**
   * Return the latest refresh details ..
   */
  public isSecondaryNavRefresh(): Observable<SecondaryNavRefresh> {
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
    return this.updateNotifications.next(true);
  }

  /**
   * function to set data of report data-table settings
   */
  public setReportDataTableSetting(data: any) {
    return this.reportDataTableSetting.next(data);
  }

  /**
   * function to get data of report data-table settings
   */
  public getReportDataTableSetting(): Observable<any> {
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

  /**
   * function to set schedule info
   * @param data: data of schedule
   */
  public setScheduleInfo(data: any) {
    this.afterEditSchedule.next(data);
  }

  /**
   * function to get schedule info
   */
  public getScheduleInfo(): Observable<any> {
    return this.afterEditSchedule.asObservable();
  }

  public setExclusionData(data) {
    return this.updateRuleFieldExclusion.next(data);
  }

  public getExclusionData(): Observable<any> {
    return this.updateRuleFieldExclusion.asObservable();
  }

  public emitSaveBrEvent(brInfo: CoreSchemaBrInfo) {
    this.saveBr.next(brInfo);
  }

  public getSaveBrObs(): Observable<CoreSchemaBrInfo> {
    return this.saveBr.asObservable();
  }

  /**
   * Function to set data scope info after saving
   * @param data: dataScope object
   */
  public setDataScope(data) {
    this.afterSaveDataScope.next(data);
  }

  /**
   * Function to get data scope info after saving
   */
  public getDataScope(): Observable<any> {
    return this.afterSaveDataScope.asObservable();
  }

  public setViewDetailsData(data: any) {
    this.viewDetailsSub.next(data);
  }

  public getViewDetailsData(): Observable<any> {
    return this.viewDetailsSub.asObservable();
  }
  public settaskinboxViewDetailsData(data: any) {
    this.taskinboxViewDetailsSub.next(data);
  }
  public gettaskinboxViewDetailsData(): Observable<any> {
    return this.taskinboxViewDetailsSub.asObservable();
  }

  public setSchemaRunNotif(data: boolean) {
    this.schemaRunSub.next(data);
  }
  public getSchemaRunNotif(): Observable<any> {
    return this.schemaRunSub.asObservable();
  }
  public showLoader() {
    this.loader.next(true);
  }
  public hideLoader() {
    this.loader.next(false);
  }

  public setSecondarySideNavBarState(data: boolean) {
    this.isSecondaySideNavBarOpen.next(data);
  }

  public getSecondarySideNavBarState(): Observable<any> {
    return this.isSecondaySideNavBarOpen.asObservable();
  }

  public settransSavedBehaviourSub(flag: boolean) {
    this.transSavedBehaviourSub.next(flag);
  }

  public gettransSavedBehaviourSub(): Observable<boolean> {
    return this.transSavedBehaviourSub.asObservable();
  }

  public setAfterMappingSaved(flag: boolean) {
    this.afterMappingSaved.next(flag);
  }

  public getAfterMappingSaved(): Observable<boolean> {
    return this.afterMappingSaved.asObservable();
  }

  public setdatascopeSheetState(data: DataScopeSidesheet) {
    this.datascopeSheetState.next(data);
  }

  public getdatascopeSheetState() {
    return this.datascopeSheetState.asObservable();
  }

}

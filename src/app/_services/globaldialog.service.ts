import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobaldialogService {

  dialogToggleEmitter: Subject<{}> = new Subject()

  dialogCloseEmitter: Subject<{}> = new Subject();

  constructor() { }

  /**
   * Function to toggle the dialog
   * @param componentName name of component that needs to be opened
   * @param data Information that needs to be passed to the dialog component
   * @param state the state that needs to be acted upon
   */
  public toggleDialog(componentName, data: {}, state: string) {
    this.dialogToggleEmitter.next({
      dialogState: state,
      componentName,
      data
    });
  }

  public closeModel(data) {
    this.dialogCloseEmitter.next(data);
  }

}

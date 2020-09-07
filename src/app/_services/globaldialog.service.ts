import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobaldialogService {

  /**
   * Event Emitter to open dialog
   */
  dialogToggleEmitter: Subject<{}> = new Subject();

  /**
   * Event emitter to close dialog
   */
  dialogCloseEmitter: Subject<{}> = new Subject();

  /**
   * constuctor of class
   */
  constructor() { }

  /**
   * Function to toggle the dialog
   * @param componentName name of component that needs to be opened
   * @param data Information that needs to be passed to the dialog component
   * @param state the state that needs to be acted upon
   */
  public openDialog(componentName, data: {}) {
    if (!componentName) {
      throw new Error('component name is required"');
    }
    this.dialogToggleEmitter.next({
      componentName,
      data
    });
  }

  /**
   * Function to close modal and emit the status
   * @param data the value to send back to parent component
   */
  public closeModel(data) {
    this.dialogCloseEmitter.next(data);
  }

}

import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent, ConfirmationDialogReq } from '@modules/shared/_components/confirmation-dialog/confirmation-dialog.component';
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
  constructor(
    private matDialog: MatDialog
  ) { }

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


  /**
   * Use this function for confirmation dialog ..
   * @param data get request data for dialog uses ..
   * @param callBack callback function after dilog close ...
   */
  public confirm = (data: ConfirmationDialogReq, callBack : (resonse) => any) => {
    this.createCallBackFun(callBack);
    const dialogCloseRef = this.matDialog.open(ConfirmationDialogComponent, {
      data,
      disableClose: true,
      height:'200px',
      width:'300px'
    });
    dialogCloseRef.afterClosed().subscribe(res=>{
      console.log(res);
      this.callBack(res);
    });
  };

  /**
   * Use for bind .. callback function
   * @param callBack call back function ..
   */
  createCallBackFun = (callBack) =>{
    this.callBack = callBack.bind();
  };

  /**
   * Actual callback function for return data ...
   * @param res actual response
   */
  callBack = (res) =>{
    return res;
  };
}

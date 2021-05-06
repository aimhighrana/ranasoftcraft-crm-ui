import { TaskListService } from './../../../../_services/task-list.service';
import { CollectionViewer } from '@angular/cdk/collections';

import { BehaviorSubject, Observable } from 'rxjs';
import { TaskListData, TaskListDataResponse } from './../../../../_models/task-list/tasklistData';
import { DataSource } from '@angular/cdk/table';

export class TaskListDataSource implements DataSource<TaskListData> {
  private tasklistDataSubject = new BehaviorSubject<TaskListData[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private totalData = 0;

  constructor(private taskListService: TaskListService) {}

  connect(collectionViewer: CollectionViewer): Observable<TaskListData[]> {
    return this.tasklistDataSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.tasklistDataSubject.complete();
    this.loadingSubject.complete();
  }

  /**
   * get table data
   * @param nodeId inbox, draft, rejected etc
   * @param lang en, de, es, fr etc
   * @param size page size
   * @param searchAfter doc id -- not clear yet
   */
  public getData(nodeId, lang, size, searchAfter) {
    this.taskListService.getTaskListData(nodeId, lang, size, searchAfter).subscribe(
      (res) => {
        this.tasklistDataSubject.next(this.docsTransformation(res));
      },
      (error) => {
        console.error(`Error : ${error.message}`);
      }
    );
  }
  docsTransformation(res: TaskListDataResponse): TaskListData[] {
    this.totalData = res && res.total>=0 ? res.total : this.totalData;
    if (res && res._doc) {
      const existing = this.docValue();
      existing.push(...res._doc);
      return existing;
    } else {
      return this.docValue();
    }
  }

  /**
   * Return length of doc ..
   */
  docLength(): number {
    return this.tasklistDataSubject.getValue().length;
  }

  /**
   * Return all dcument that have on this subject
   */
  docValue() {
    return this.tasklistDataSubject.getValue();
  }

  /**
   * reset data source
   */
  reset() {
    this.tasklistDataSubject.next([]);
  }

  totalCount(): number {
    return this.totalData;
  }
}

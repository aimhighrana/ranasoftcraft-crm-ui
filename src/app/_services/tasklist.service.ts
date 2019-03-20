import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../_models/task';
import { EndpointService } from './endpoint.service';
import { Any2tsService } from './any2ts.service';
import { map } from 'rxjs/operators';
import { SpringPage } from '../_models/spring-page';
import { TaskResponse } from '../_models/task-response';

@Injectable({
  providedIn: 'root'
})
export class TasklistService {

  constructor(
    private http: HttpClient,
    private endpointService: EndpointService,
    private any2tsService: Any2tsService
  ) { }

  public getAllMyTasks(): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(this.endpointService.getTasks()).pipe(map(spage => {
      return this.any2tsService.anyToTaskResponse(spage);
    }));
  }
}

import { TestBed } from '@angular/core/testing';
import { TaskListService } from './task-list.service';
import { AppMaterialModuleForSpec } from '../app-material-for-spec.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TaskListService', () => {
  let service: TaskListService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskListService, HttpClientModule, HttpClientTestingModule],
      imports: [AppMaterialModuleForSpec, HttpClientTestingModule, HttpClientModule],
    });
  });

  it('should be created', () => {
    service = TestBed.inject(TaskListService)
    expect(service).toBeTruthy();
  });
});

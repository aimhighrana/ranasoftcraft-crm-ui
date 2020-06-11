import { TestBed } from '@angular/core/testing';

import { TaskListFiltersService } from './task-list-filters.service';
import { TaskListService } from './task-list.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppMaterialModuleForSpec } from '../app-material-for-spec.module';

describe('TaskListFiltersService', () => {
  let service: TaskListFiltersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskListService, HttpClientModule, HttpClientTestingModule],
      imports: [AppMaterialModuleForSpec, HttpClientTestingModule, HttpClientModule],
    });
    service = TestBed.inject(TaskListFiltersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

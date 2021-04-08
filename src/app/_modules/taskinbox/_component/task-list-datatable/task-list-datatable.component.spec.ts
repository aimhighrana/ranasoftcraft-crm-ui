import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@modules/shared/shared.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListDatatableComponent } from './task-list-datatable.component';

describe('TaskListDatatableComponent', () => {
  let component: TaskListDatatableComponent;
  let fixture: ComponentFixture<TaskListDatatableComponent>;
  const params = { node: 'inbox' };
  const queryParams = { s: 'test', f: 'test' };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskListDatatableComponent],
      imports: [AppMaterialModuleForSpec, RouterTestingModule, SharedModule],
      providers: [{ provide: ActivatedRoute, useValue: { params: of(params), queryParams: of(queryParams) } }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain qeury and required parameters', () => {
    expect(component.node).toEqual('inbox');
    expect(component.savedSearchParameters).toEqual('test');
    expect(component.inlineFilters).toEqual('test');
  });
});

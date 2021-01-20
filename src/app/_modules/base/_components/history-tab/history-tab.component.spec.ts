import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryTabComponent } from './history-tab.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { SharedModule } from '@modules/shared/shared.module';

describe('HistoryTabComponent', () => {
  let component: HistoryTabComponent;
  let fixture: ComponentFixture<HistoryTabComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HistoryTabComponent, TaskDetailsComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        RouterTestingModule,
        AppMaterialModuleForSpec,
        SharedModule
      ],
      providers: [
        TaskDetailsComponent,
        RouterTestingModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        TaskDetailsComponent,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryTabComponent);
    TestBed.inject(TaskDetailsComponent)
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call statusFromShortCode()', async () => {
    expect(component.statusFromShortCode('APP')).toBe('Approved')
  });

  it('should call getChangeLogDetails', () => {
    const requestObj = {
      taskId: '838851512912552577',
      userId: 'DemoInit',
    }
    const serviceSpy = spyOn(component.taskDetailsComponent, 'getChangeLogDetails').and.callFake(() => {
      return of()
    });
    component.getChangeLogs(requestObj.taskId, requestObj.userId);
    expect(serviceSpy).toHaveBeenCalledWith(requestObj.taskId, requestObj.userId)
  })
});

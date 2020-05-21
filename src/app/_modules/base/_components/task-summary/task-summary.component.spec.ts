import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskSummaryComponent } from './task-summary.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('TaskSummaryComponent', () => {
  let component: TaskSummaryComponent;
  let fixture: ComponentFixture<TaskSummaryComponent>;
  let router: Router;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppMaterialModuleForSpec, RouterTestingModule],
      declarations: [TaskSummaryComponent]
    }).compileComponents();
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskSummaryComponent);
    component = fixture.componentInstance;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('openDetails() should redirect', () => {
    component.taskId = '732864726783';
    fixture.detectChanges();
    spyOn(router, 'navigate');
    component.openDetails();
    expect(router.navigate).toHaveBeenCalledWith(['home', 'task-details', component.taskId]);
  });

  it('getTaskDetails() should get task summary', async () => {
    component.getTaskDetails();
    expect(component.taskDetails).not.toBe(null);
  })
});

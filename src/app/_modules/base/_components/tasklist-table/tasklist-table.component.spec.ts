import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TasklistTableComponent } from './tasklist-table.component';

describe('TasklistTableComponent', () => {
  let component: TasklistTableComponent;
  let fixture: ComponentFixture<TasklistTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TasklistTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasklistTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

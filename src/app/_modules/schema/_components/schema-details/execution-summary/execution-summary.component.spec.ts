import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionSummaryComponent } from './execution-summary.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ExecutionSummaryComponent', () => {
  let component: ExecutionSummaryComponent;
  let fixture: ComponentFixture<ExecutionSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutionSummaryComponent ],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

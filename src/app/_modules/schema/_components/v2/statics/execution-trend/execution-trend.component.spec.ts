import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@modules/shared/shared.module';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { ExecutionTrendComponent } from './execution-trend.component';

describe('ExecutionTrendComponent', () => {
  let component: ExecutionTrendComponent;
  let fixture: ComponentFixture<ExecutionTrendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutionTrendComponent ],
      imports: [AppMaterialModuleForSpec, SharedModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

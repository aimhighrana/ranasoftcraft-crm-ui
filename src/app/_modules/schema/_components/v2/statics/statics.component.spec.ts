import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@modules/shared/shared.module';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { ExecutionResultComponent } from './execution-result/execution-result.component';
import { ExecutionTrendComponent } from './execution-trend/execution-trend.component';

import { StaticsComponent } from './statics.component';

describe('StaticsComponent', () => {
  let component: StaticsComponent;
  let fixture: ComponentFixture<StaticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaticsComponent, ExecutionResultComponent, ExecutionTrendComponent ],
      imports: [AppMaterialModuleForSpec, SharedModule]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

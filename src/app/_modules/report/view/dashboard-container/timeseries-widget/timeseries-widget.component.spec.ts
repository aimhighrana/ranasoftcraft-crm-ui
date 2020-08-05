import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeseriesWidgetComponent } from './timeseries-widget.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

describe('TimeseriesWidgetComponent', () => {
  let component: TimeseriesWidgetComponent;
  let fixture: ComponentFixture<TimeseriesWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeseriesWidgetComponent ],
      imports:[
        HttpClientTestingModule,
        AppMaterialModuleForSpec
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeseriesWidgetComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

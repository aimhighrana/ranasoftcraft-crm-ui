import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountComponent } from './count.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WidgetService } from '@services/widgets/widget.service';
import { of } from 'rxjs';
import { WidgetHeader } from '@modules/report/_models/widget';
import { SharedModule } from '@modules/shared/shared.module';

describe('CountComponent', () => {
  let component: CountComponent;
  let fixture: ComponentFixture<CountComponent>;
  let WidgetServiceSpy: WidgetService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountComponent ],
      imports:[AppMaterialModuleForSpec,HttpClientTestingModule, SharedModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountComponent);
    component = fixture.componentInstance;
    WidgetServiceSpy = fixture.debugElement.injector.get(WidgetService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getHeaderMetaData(), return HeaderMeatadata of the widget', async(() => {
    component.widgetId = 732864726783;
    const res = {widgetName: 'CountWidget'} as WidgetHeader;
    spyOn(WidgetServiceSpy,'getHeaderMetaData').withArgs(component.widgetId).and.returnValue(of(res));
    component.getHeaderMetaData();
    expect(WidgetServiceSpy.getHeaderMetaData).toHaveBeenCalledWith(component.widgetId);
    expect(component.headerDesc).toEqual(res.widgetName);
  }));

  it('getCountMetadata(), return countMeatadata of the widget', async(() => {
    component.widgetId = 732864726783;
    const res = {widgetId: 732864726783, fieldId: '372636553', aggregationOperator: 'COUNT'};
    spyOn(WidgetServiceSpy,'getCountMetadata').withArgs(component.widgetId).and.returnValue(of(res));
    component.getCountMetadata();
    expect(WidgetServiceSpy.getCountMetadata).toHaveBeenCalledWith(component.widgetId);
  }));

  it('getCountData(), return count of the widget', async(() => {
    const widgetId = 732864726783;
    const criteria = [];
    const res = {aggregations: {'value_count#COUNT': {value: 46}}};
    spyOn(WidgetServiceSpy,'getWidgetData').withArgs(String(widgetId), criteria).and.returnValue(of(res));
    component.getCountData(widgetId,criteria);
    expect(WidgetServiceSpy.getWidgetData).toHaveBeenCalledWith(String(widgetId), criteria);
  }));

  it('getCountData(), return count of the widget', async(() => {
    const widgetId = 732864726783;
    const criteria = [];
    const res = {aggregations: {'scripted_metric#COUNT': {value: 46}}};
    spyOn(WidgetServiceSpy,'getWidgetData').withArgs(String(widgetId), criteria).and.returnValue(of(res));
    component.getCountData(widgetId,criteria);
    expect(WidgetServiceSpy.getWidgetData).toHaveBeenCalledWith(String(widgetId), criteria);
    expect(component.count).toEqual(46);
  }));
});

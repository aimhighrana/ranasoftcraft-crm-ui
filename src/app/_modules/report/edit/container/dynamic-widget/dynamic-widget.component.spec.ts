import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicWidgetComponent } from './dynamic-widget.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SvgIconComponent } from '@modules/shared/_components/svg-icon/svg-icon.component';

describe('DynamicWidgetComponent', () => {
  let component: DynamicWidgetComponent;
  let fixture: ComponentFixture<DynamicWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicWidgetComponent, SvgIconComponent ],
      imports:[
        AppMaterialModuleForSpec,
        HttpClientTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicWidgetComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoapComponent } from './soap.component';
import { BreadcrumbComponent } from 'src/app/_modules/shared/_components/breadcrumb/breadcrumb.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('SoapComponent', () => {
  let component: SoapComponent;
  let fixture: ComponentFixture<SoapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule
      ],
      declarations: [ SoapComponent, BreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

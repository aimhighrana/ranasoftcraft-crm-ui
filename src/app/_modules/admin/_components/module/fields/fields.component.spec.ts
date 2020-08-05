import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldsComponent } from './fields.component';
import { BreadcrumbComponent } from '../../../../shared/_components/breadcrumb/breadcrumb.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('FieldsComponent', () => {
  let component: FieldsComponent;
  let fixture: ComponentFixture<FieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule
      ],
      declarations: [ FieldsComponent, BreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

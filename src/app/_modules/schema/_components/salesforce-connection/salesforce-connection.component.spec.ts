import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesforceConnectionComponent } from './salesforce-connection.component';
import { BreadcrumbComponent } from 'src/app/_modules/shared/_components/breadcrumb/breadcrumb.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@modules/shared/shared.module';

describe('SalesforceConnectionComponent', () => {
  let component: SalesforceConnectionComponent;
  let fixture: ComponentFixture<SalesforceConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesforceConnectionComponent, BreadcrumbComponent ],
      imports:[AppMaterialModuleForSpec, ReactiveFormsModule, FormsModule, MatDatepickerModule, RouterTestingModule, SharedModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesforceConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

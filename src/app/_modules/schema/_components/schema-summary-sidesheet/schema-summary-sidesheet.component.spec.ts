import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { SchemaSummarySidesheetComponent } from './schema-summary-sidesheet.component';

describe('SchemaSummarySidesheetComponent', () => {
  let component: SchemaSummarySidesheetComponent;
  let fixture: ComponentFixture<SchemaSummarySidesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaSummarySidesheetComponent ],
      imports: [AppMaterialModuleForSpec, RouterTestingModule, HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaSummarySidesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

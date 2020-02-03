import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaDatatableComponent } from './schema-datatable.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

describe('SchemaDatatableComponent', () => {
  let component: SchemaDatatableComponent;
  let fixture: ComponentFixture<SchemaDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec,
        FormsModule,
        ReactiveFormsModule,
        NgxMatSelectSearchModule
      ],
      declarations: [ SchemaDatatableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

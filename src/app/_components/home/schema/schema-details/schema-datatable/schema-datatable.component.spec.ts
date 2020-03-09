import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaDatatableComponent } from './schema-datatable.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('SchemaDatatableComponent', () => {
  let component: SchemaDatatableComponent;
  let fixture: ComponentFixture<SchemaDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec,
        FormsModule,
        ReactiveFormsModule
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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { SchemaStatusinfoDialogComponent } from './schema-statusinfo-dialog.component';

describe('SchemaStatusinfoDialogComponent', () => {
  let component: SchemaStatusinfoDialogComponent;
  let fixture: ComponentFixture<SchemaStatusinfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaStatusinfoDialogComponent ],
      imports: [
        AppMaterialModuleForSpec
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaStatusinfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

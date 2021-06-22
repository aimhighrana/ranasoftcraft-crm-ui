import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MdoUiLibraryModule } from 'mdo-ui-library';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { SchemaMigrationComponent } from './schema-migration.component';

describe('SchemaMigrationComponent', () => {
  let component: SchemaMigrationComponent;
  let fixture: ComponentFixture<SchemaMigrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaMigrationComponent ],
      imports:  [ AppMaterialModuleForSpec, MdoUiLibraryModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaMigrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

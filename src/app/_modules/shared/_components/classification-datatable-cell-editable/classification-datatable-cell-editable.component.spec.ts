import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { ClassificationDatatableCellEditableComponent } from './classification-datatable-cell-editable.component';

describe('ClassificationDatatableCellEditableComponent', () => {
  let component: ClassificationDatatableCellEditableComponent;
  let fixture: ComponentFixture<ClassificationDatatableCellEditableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassificationDatatableCellEditableComponent ],
      imports:[HttpClientTestingModule, AppMaterialModuleForSpec]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassificationDatatableCellEditableComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

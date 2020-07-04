import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiwCreateSchemaComponent } from './diw-create-schema.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('DiwCreateSchemaComponent', () => {
  let component: DiwCreateSchemaComponent;
  let fixture: ComponentFixture<DiwCreateSchemaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiwCreateSchemaComponent ],
      imports: [AppMaterialModuleForSpec, ReactiveFormsModule, FormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiwCreateSchemaComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

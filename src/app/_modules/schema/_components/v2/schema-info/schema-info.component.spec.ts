import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaInfoComponent } from './schema-info.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('SchemaInfoComponent', () => {
  let component: SchemaInfoComponent;
  let fixture: ComponentFixture<SchemaInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaInfoComponent ],
      imports:[
        AppMaterialModuleForSpec, HttpClientTestingModule, RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaInfoComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

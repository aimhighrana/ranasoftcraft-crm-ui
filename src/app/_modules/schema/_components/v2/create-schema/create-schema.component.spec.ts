import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSchemaComponent } from './create-schema.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('CreateSchemaComponent', () => {
  let component: CreateSchemaComponent;
  let fixture: ComponentFixture<CreateSchemaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSchemaComponent ],
      imports:[
        AppMaterialModuleForSpec, HttpClientTestingModule, RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

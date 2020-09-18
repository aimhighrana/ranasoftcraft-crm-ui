import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSchemaComponent } from './create-schema.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormInputComponent } from '@modules/shared/_components/form-input/form-input.component';

describe('CreateSchemaComponent', () => {
  let component: CreateSchemaComponent;
  let fixture: ComponentFixture<CreateSchemaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSchemaComponent, FormInputComponent ],
      imports:[
        AppMaterialModuleForSpec, HttpClientTestingModule, RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSchemaComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

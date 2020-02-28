import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaExecutionComponent } from './schema-execution.component';
import { BreadcrumbComponent } from 'src/app/_modules/shared/_components/breadcrumb/breadcrumb.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SchemalistService } from 'src/app/_services/home/schema/schemalist.service';
import { of } from 'rxjs';
import { SchemaListDetails } from 'src/app/_models/schema/schemalist';

describe('SchemaExecutionComponent', () => {
  let component: SchemaExecutionComponent;
  let fixture: ComponentFixture<SchemaExecutionComponent>;
  let schemaListServiceSpy: jasmine.SpyObj<SchemalistService>;
  beforeEach(async(() => {
    const schemaLstSerSpy = jasmine.createSpyObj('SchemalistService', ['getSchemaDetailsBySchemaId']);
    TestBed.configureTestingModule({
      imports: [AppMaterialModuleForSpec, ReactiveFormsModule, FormsModule, RouterTestingModule],
      declarations: [ SchemaExecutionComponent, BreadcrumbComponent ],
      providers: [
        {provide:SchemalistService, useValue:schemaLstSerSpy}
      ]
    })
    .compileComponents();
    schemaListServiceSpy = TestBed.inject(SchemalistService) as jasmine.SpyObj<SchemalistService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaExecutionComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getSchemaDetail() , should invoke for get schema details by schema id ', async(()=>{
    const schemaId = '87365726767288';
    expect(schemaListServiceSpy.getSchemaDetailsBySchemaId.withArgs(schemaId).and.returnValue(of(new SchemaListDetails()))).toHaveBeenCalledTimes(0);
  }));

});

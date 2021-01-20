import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DetailView } from '@models/schema/schemadetailstable';
import { SchemaListDetails } from '@models/schema/schemalist';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { of } from 'rxjs';
import { SharedModule } from '@modules/shared/shared.module';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { DetailBuilderComponent } from './detail-builder.component';

describe('DetailBuilderComponent', () => {
  let component: DetailBuilderComponent;
  let fixture: ComponentFixture<DetailBuilderComponent>;
  let schemaService: SchemalistService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailBuilderComponent ],
      imports:[
        HttpClientTestingModule,
        RouterTestingModule,
        AppMaterialModuleForSpec,
        SharedModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailBuilderComponent);
    component = fixture.componentInstance;
    schemaService = fixture.debugElement.injector.get(SchemalistService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('ngOnInit(), test all prerequired stuff', async(()=>{
    component.ngOnInit();
    expect(component.ngOnInit).toBeTruthy();
  }));

  it(`getSchemaDetails(), get schema details for define view `, async(()=>{
    // mock data ..
    const res:SchemaListDetails = {moduleId:'1005', schemaId:'72345254872'} as SchemaListDetails;

    // spy service
    spyOn(schemaService, 'getSchemaDetailsBySchemaId').withArgs(res.schemaId).and.returnValue(of(res));

    // call actual method ..
    component.getSchemaDetails('1005','72345254872');

    expect(component.moduleId).toEqual(res.moduleId);
    expect(component.schemaId).toEqual(res.schemaId);
    expect(component.displayFormat).toEqual(DetailView.DATAQUALITY_VIEW);
  }));
});

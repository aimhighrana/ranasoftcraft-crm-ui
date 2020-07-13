import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaListComponent } from './schema-list.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { SchemaTileComponent } from '../schema-tile/schema-tile.component';
import { SchemaListModuleList, SchemaListDetails, SchemaDashboardPermission } from 'src/app/_models/schema/schemalist';
import { BreadcrumbComponent } from 'src/app/_modules/shared/_components/breadcrumb/breadcrumb.component';
import { AddTileComponent } from 'src/app/_modules/shared/_components/add-tile/add-tile.component';
import { Router } from '@angular/router';
import { SubstringPipe } from 'src/app/_modules/shared/_pipes/substringpipe.pipe';
import { SchemaService } from '@services/home/schema.service';
import { SchemaGroupDetailsResponse } from '@models/schema/schema';
import { of } from 'rxjs';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('SchemaListComponent', () => {
  let component: SchemaListComponent;
  let fixture: ComponentFixture<SchemaListComponent>;
  let router: Router;
  let SchemaServiceSpy: SchemaService;
  let schemaListServiceSpy: SchemalistService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule
      ],
      declarations: [SchemaListComponent, BreadcrumbComponent, SchemaTileComponent, AddTileComponent, SubstringPipe],
      providers:[ SchemaService, SchemalistService, MatSnackBar ]

    }).compileComponents();
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaListComponent);
    component = fixture.componentInstance;
    SchemaServiceSpy = fixture.debugElement.injector.get(SchemaService);
    schemaListServiceSpy = fixture.debugElement.injector.get(SchemalistService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('showSchemaDetails(), should navigate schema detail page', () => {
    const schemaDetails  = {schemaId: 87234687264862};
    fixture.detectChanges();
    spyOn(router, 'navigate');
    component.showSchemaDetails(schemaDetails, '1005');
    expect(router.navigate).toHaveBeenCalledWith(['/home/schema/schema-details', '1005', schemaDetails.schemaId]);
  });

  it('variants(), should navigate to schema variant  page', () => {
    const schemaId  = '87234687264862';
    fixture.detectChanges();
    spyOn(router, 'navigate');
    component.variants('1005', schemaId);
    expect(router.navigate).toHaveBeenCalledWith(['/home/schema/schema-variants', '1005', schemaId]);
  });

  it('run(), should navigate to schema execution  page', () => {
    const schemaId  = '87234687264862';
    fixture.detectChanges();
    spyOn(router, 'navigate');
    component.run(schemaId);
    expect(router.navigate).toHaveBeenCalledWith(['/home/schema/schema-execution', schemaId]);
  });

  it('edit(), should navigate to schema edit  page', () => {
    const schemaDetails : SchemaListDetails = new SchemaListDetails();
    schemaDetails.schemaId = '87234687264862';
    fixture.detectChanges();
    spyOn(router, 'navigate');
    component.edit('1005', schemaDetails);
    expect(router.navigate).toHaveBeenCalledWith(['/home/schema/create-schema', '1005', schemaDetails.schemaId]);
  });

  it('schemaDetails(), should navigate to schema detail  page', () => {
    const schemaDetails : SchemaListDetails = new SchemaListDetails();
    schemaDetails.schemaId = '87234687264862';
    schemaDetails.variantId = '0';
    const data: SchemaDashboardPermission = new SchemaDashboardPermission();
    data.isAdmin = true;
    schemaDetails.collaboratorModels = data;
    fixture.detectChanges();
    spyOn(router, 'navigate');
    component.schemaDetails('1005', schemaDetails);

    const schema : SchemaListDetails = new SchemaListDetails();
    const Data: SchemaDashboardPermission = new SchemaDashboardPermission();
    Data.isViewer = true;
    schema.collaboratorModels = Data;
    component.schemaDetails('1005', schema);

    const schema1 : SchemaListDetails = new SchemaListDetails();
    schema1.createdBy = 'guest';
    component.schemaDetails('1005', schema1);

    const schema2 : SchemaListDetails = new SchemaListDetails();
    const Data1: SchemaDashboardPermission = new SchemaDashboardPermission();
    Data1.isEditer = true;
    schema2.collaboratorModels = Data1;
    component.schemaDetails('1005', schema2);
    expect(router.navigate).toHaveBeenCalledWith(['/home/schema/schema-details', '1005', schemaDetails.schemaId, schemaDetails.variantId]);
  });

  it('groupDetails(), should get schema group detail by schema group Id', async(() => {
    component.schemaGroupId = '732864726783';
    spyOn(SchemaServiceSpy,'getSchemaGroupDetailsBySchemaGrpId').withArgs(component.schemaGroupId).and.returnValue(of({} as SchemaGroupDetailsResponse));
    component.groupDetails();
    expect(SchemaServiceSpy.getSchemaGroupDetailsBySchemaGrpId).toHaveBeenCalledWith(component.schemaGroupId);
  }));

  it('onLoadSchemaList(), should load the schema by schema group Id', async(() => {
    const response: SchemaListModuleList[] = [];
    component.schemaGroupId = '732864726783';
    spyOn(schemaListServiceSpy,'getSchemaList').and.returnValue(of(response));
    component.onLoadSchemaList();
    expect(schemaListServiceSpy.getSchemaList).toHaveBeenCalled();
  }));

  it('delete(), delete schema ', async(()=>{
    spyOn(SchemaServiceSpy, 'deleteSChema').withArgs('2342352').and.returnValue(of(true));

    spyOn(router, 'navigate');
    component.delete('2342352');
    expect(SchemaServiceSpy.deleteSChema).toHaveBeenCalledWith('2342352');
    expect(router.navigate).toHaveBeenCalledWith(['/home/schema']);
  }));

});

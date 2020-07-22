import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaVariantsComponent } from './schema-variants.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { SchemaTileComponent } from '../../../../_modules/schema/_components/schema-tile/schema-tile.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { SchemaVariantService } from 'src/app/_services/home/schema/schema-variant.service';
import { BreadcrumbComponent } from 'src/app/_modules/shared/_components/breadcrumb/breadcrumb.component';
import { VariantListDetails, VariantDetails } from 'src/app/_models/schema/schemalist';
import { AddTileComponent } from 'src/app/_modules/shared/_components/add-tile/add-tile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SubstringPipe } from 'src/app/_modules/shared/_pipes/substringpipe.pipe';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('SchemaVariantsComponent', () => {
  let component: SchemaVariantsComponent;
  let fixture: ComponentFixture<SchemaVariantsComponent>;
  let htmlNative: HTMLElement;
  let router: Router;
  let schemaVariantServiceSpy: SchemaVariantService
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppMaterialModuleForSpec, MatIconModule, RouterTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [SchemaVariantsComponent, BreadcrumbComponent, SchemaTileComponent, AddTileComponent, SubstringPipe ],
      providers: [ SchemaVariantService ]
    })
    .compileComponents();
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaVariantsComponent);
    component = fixture.componentInstance;
    htmlNative = fixture.debugElement.nativeElement;
    schemaVariantServiceSpy = fixture.debugElement.injector.get(SchemaVariantService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const mockVaraintData: VariantListDetails = new VariantListDetails();
    mockVaraintData.variantId = '0';
    mockVaraintData.title = 'Prospecta';
    mockVaraintData.totalValue = 7652365;
    mockVaraintData.errorValue = 672376;
    mockVaraintData.successValue = 8726;
    mockVaraintData.skippedValue = 5678;
    mockVaraintData.correctionValue = 8756;
    mockVaraintData.duplicateValue = 8765;
    mockVaraintData.successTrendValue = 8765;
    mockVaraintData.errorTrendValue = 987;
    mockVaraintData.totalUniqueValue = 876;
    mockVaraintData.successUniqueValue = 98765;
    mockVaraintData.errorUniqueValue = 9876;
    mockVaraintData.skippedUniqueValue = 87654;

  it('schemaVaraint: should create', () => {
    fixture.detectChanges();
    expect(htmlNative.getElementsByTagName('pros-schema-tile').length).toEqual(0);
  });

  it('percentageErrorStr(), should return percentage error str', async(() => {
    component.masterVariant = mockVaraintData;
    const num =  component.percentageErrorStr();
    expect(num).toEqual(8.79);

    component.showUnique = true;
    component.masterVariant = mockVaraintData;
    const num1 =  component.percentageErrorStr();
    expect(num1).toEqual(1127.4);
  }));

  it('percentageSuccessStr(), should return percentage success str', async(() => {
    component.masterVariant = mockVaraintData;
    const num = component.percentageSuccessStr();
    expect(num).toEqual(0.11);

    component.showUnique = true;
    component.masterVariant = mockVaraintData;
    const num1 =  component.percentageSuccessStr();
    expect(num1).toEqual(11274.54);
  }));

  it('toggleUniqueContainer()', async(() => {
    const event =   new MatSlideToggleChange(null, true);
    component.toggleUniqueContainer(event);
    expect(component.showUnique).toEqual(true);
  }));

  it('toggle()', async() => {
    component.showingErrors = true;
    component.toggle();
    expect(false).toEqual(component.showingErrors);
  });

  it('createVariant, should navigate to create variant page', (() => {
    component.objectId = '1005';
    component.schemaId = '876554';
    spyOn(router, 'navigate');
    component.createVariant();
    expect(router.navigate).toHaveBeenCalledWith(['/home/schema/schema-variants/create-variant', component.objectId, component.schemaId, 'new']);
  }));

  it('editVariant, should navigate to create variant page', (() => {
    component.objectId = '1005';
    component.schemaId = '876554';
    const variantId = '897654'
    spyOn(router, 'navigate');
    component.editVariant(variantId);
    expect(router.navigate).toHaveBeenCalledWith(['/home/schema/schema-variants/create-variant', component.objectId, component.schemaId, variantId]);
  }));

  it('deleteVariant(), should delete Variant details', async(() => {
    component.objectId = '1005';
    component.schemaId = '876554';
    spyOn(schemaVariantServiceSpy,'deleteVariant').withArgs('3555358571').and.returnValue(of(true));
    spyOn(router, 'navigate');
    component.deleteVariant('3555358571');
    expect(schemaVariantServiceSpy.deleteVariant).toHaveBeenCalledWith('3555358571');
    expect(router.navigate).toHaveBeenCalledWith(['/home/schema/schema-variants', component.objectId, component.schemaId]);
  }));

  it('onLoadVariantList(), should return schema variant list', async(() => {
    component.schemaId = '876554';
    const variantDetails: VariantDetails[] = [];
    spyOn(schemaVariantServiceSpy,'getSchemaVariantDetails').withArgs(component.schemaId).and.returnValue(of(variantDetails));
    component.onLoadVariantList();
    expect(schemaVariantServiceSpy.getSchemaVariantDetails).toHaveBeenCalledWith(component.schemaId);
  }));

});
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaVariantsComponent } from './schema-variants.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { SchemaTileComponent } from '../../../../_modules/schema/_components/schema-tile/schema-tile.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { SchemaVariantService } from 'src/app/_services/home/schema/schema-variant.service';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import { BreadcrumbComponent } from 'src/app/_modules/shared/_components/breadcrumb/breadcrumb.component';
import { VariantListDetails } from 'src/app/_models/schema/schemalist';
import { AddTileComponent } from 'src/app/_modules/shared/_components/add-tile/add-tile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SubstringPipe } from 'src/app/_modules/shared/_pipes/substringpipe.pipe';

describe('SchemaVariantsComponent', () => {
  let component: SchemaVariantsComponent;
  let fixture: ComponentFixture<SchemaVariantsComponent>;
  let htmlNative: HTMLElement;
  beforeEach(async(() => {
    const schemaVarServiceSpy = jasmine.createSpyObj('SchemaVariantService', ['getSchemaVariantDetails']);
    const schemaSerSpy = jasmine.createSpyObj('SchemaService', ['getSchemaGroupDetailsBySchemaGrpId']);
    const schemaDeSerSpy = jasmine.createSpyObj('SchemaDetailsService', ['getSchemaDetailsBySchemaId']);
    TestBed.configureTestingModule({
      imports: [AppMaterialModuleForSpec, MatIconModule, RouterTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [SchemaVariantsComponent, BreadcrumbComponent, SchemaTileComponent, AddTileComponent, SubstringPipe ],
      providers: [
        { provide: SchemaVariantService, useValue: schemaVarServiceSpy },
        { provide: SchemaService, useValue: schemaSerSpy },
        { provide: SchemaDetailsService, useValue: schemaDeSerSpy }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaVariantsComponent);
    component = fixture.componentInstance;
    htmlNative = fixture.debugElement.nativeElement;
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
    component.variarantDetailsOb = of([mockVaraintData]);
    fixture.detectChanges();
    console.log(htmlNative.getElementsByTagName('pros-schema-tile').length);
    expect(htmlNative.getElementsByTagName('pros-schema-tile').length).toEqual(1);
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
});

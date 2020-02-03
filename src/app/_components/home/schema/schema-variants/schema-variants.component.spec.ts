import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaVariantsComponent } from './schema-variants.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { SchemaTileComponent } from '../schema-tile/schema-tile.component';
import { SchemabadgeTileComponent } from '../schemabadge-tile/schemabadge-tile.component';
import { MatIconModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { SubstringPipe } from 'src/app/_pipes/substringpipe.pipe';
import { SchemaProgressbarComponent } from '../../schema-progressbar/schema-progressbar.component';
import { SchemaVariantService } from 'src/app/_services/home/schema/schema-variant.service';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import { BreadcrumbComponent } from 'src/app/_modules/shared/_components/breadcrumb/breadcrumb.component';
import { SchemaListDetails } from 'src/app/_models/schema/schemalist';

describe('SchemaVariantsComponent', () => {
  let component: SchemaVariantsComponent;
  let fixture: ComponentFixture<SchemaVariantsComponent>;
  let htmlNative: HTMLElement;
  beforeEach(async(() => {
    const schemaVarServiceSpy = jasmine.createSpyObj('SchemaVariantService', ['schemavariantDetailsBySchemaId']);
    const schemaSerSpy = jasmine.createSpyObj('SchemaService', ['getSchemaGroupDetailsBySchemaGrpId']);
    const schemaDeSerSpy = jasmine.createSpyObj('SchemaDetailsService', ['getSchemaDetailsBySchemaId']);
    TestBed.configureTestingModule({
      imports: [AppMaterialModuleForSpec, MatIconModule, RouterTestingModule],
      declarations: [SchemaVariantsComponent, BreadcrumbComponent, SchemaTileComponent, SchemabadgeTileComponent, SubstringPipe, SchemaProgressbarComponent],
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

  it('schemaDetails: should create', () => {
    // mock data
    const mockSchemaData: SchemaListDetails = new SchemaListDetails();
    mockSchemaData.schemaDescription = 'Function Location';
    mockSchemaData.errorCount = 100;
    mockSchemaData.successCount = 700;
    mockSchemaData.totalCount = 800;
    component.schemaListDetails = mockSchemaData;
    fixture.detectChanges();
    expect(htmlNative.getElementsByTagName('mat-list-item').length).toEqual(4, 'mat-list-item length should equal to 4');

    expect(Number(htmlNative.getElementsByTagName('mat-list-item').item(0).getElementsByTagName('h4').item(0).textContent)).toEqual(mockSchemaData.totalCount, 'check the total record count');
    expect(htmlNative.getElementsByTagName('mat-list-item').item(0).getElementsByTagName('p').item(0).textContent.trim()).toEqual('Total', 'check the total record count text');

    expect(Number(htmlNative.getElementsByTagName('mat-list-item').item(1).getElementsByTagName('h4').item(0).textContent)).toEqual(mockSchemaData.errorCount, 'check the error record count');
    expect(htmlNative.getElementsByTagName('mat-list-item').item(1).getElementsByTagName('p').item(0).textContent.trim()).toEqual('Error', 'check the total error count text');

    expect(Number(htmlNative.getElementsByTagName('mat-list-item').item(2).getElementsByTagName('h4').item(0).textContent)).toEqual(mockSchemaData.successCount, 'check the success record count');
    expect(htmlNative.getElementsByTagName('mat-list-item').item(2).getElementsByTagName('p').item(0).textContent.trim()).toEqual('Success', 'check the success record count text');

  });

});

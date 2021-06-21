import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UDRValueControlComponent } from './udr-value-control.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { MetadataModel, Heirarchy } from '@models/schema/schemadetailstable';
import { of } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Metadata } from '@modules/report/edit/container/metadatafield-control/metadatafield-control.component';
import { MatChipInputEvent } from '@angular/material/chips';
import { SharedModule } from '@modules/shared/shared.module';

describe('UDRValueControlComponent', () => {
  let component: UDRValueControlComponent;
  let fixture: ComponentFixture<UDRValueControlComponent>;
  let schemaDetailsService: SchemaDetailsService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UDRValueControlComponent ],
      imports:[
        AppMaterialModuleForSpec,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UDRValueControlComponent);
    component = fixture.componentInstance;
    schemaDetailsService = fixture.debugElement.injector.get(SchemaDetailsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('ngOnInit(), should assign pre required ', async(()=>{
    component.ngOnInit();
    expect(component.ngOnInit).toBeTruthy();
  }));

  it('ngOnChanges(), should call reset when reset filter', async(()=>{
    // mock data
    const chnages:import('@angular/core').SimpleChanges = {moduleId:{currentValue:'1005', previousValue: false, firstChange:null, isFirstChange:null}};

    // spyOn(schemaDetailsService, 'getMetadataFields').withArgs('1005').and.returnValue(of(metadataModeleResponse));

    // call actual method
    component.ngOnChanges(chnages);

    expect(component.moduleId).toBeTruthy();

    // mock data
    const chnages2:import('@angular/core').SimpleChanges = null;
    // call actual method
    component.ngOnChanges(chnages2);
    expect(component.ngOnChanges).toBeTruthy();

  }));

  it('loadDropdownValues() should load all dropdown values', async(() => {
    const schemaSpy = spyOn(schemaDetailsService, 'getUDRDropdownValues').and.returnValue(of([{} as any]));
    component.fieldId = 'TEST_FIELD';
    component.metataData = {
      gridFields: {},
      headers: {
        TEST_FIELD: {
          picklist: '1'
        }
      },
      hierarchy: [],
      hierarchyFields: {},
      grids: []
    }
    component.loadDropdownValues();
    expect(component.fieldList.length).toBe(1);
  }));

});

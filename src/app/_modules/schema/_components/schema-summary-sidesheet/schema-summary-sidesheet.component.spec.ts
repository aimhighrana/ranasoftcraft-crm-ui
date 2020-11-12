import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AddFilterOutput } from '@models/schema/schema';
import { FilterCriteria } from '@models/schema/schemadetailstable';
import { VariantDetails } from '@models/schema/schemalist';
import { CoreSchemaBrInfo, DropDownValue } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SchemaService } from '@services/home/schema.service';
import { SchemaVariantService } from '@services/home/schema/schema-variant.service';
import { of } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { SchemaSummarySidesheetComponent } from './schema-summary-sidesheet.component';

describe('SchemaSummarySidesheetComponent', () => {
  let component: SchemaSummarySidesheetComponent;
  let fixture: ComponentFixture<SchemaSummarySidesheetComponent>;
  let schemaVariantService: SchemaVariantService;
  let schemaService: SchemaService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaSummarySidesheetComponent ],
      imports: [AppMaterialModuleForSpec, RouterTestingModule, HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaSummarySidesheetComponent);
    component = fixture.componentInstance;
    schemaVariantService = fixture.debugElement.injector.get(SchemaVariantService);
    schemaService = fixture.debugElement.injector.get(SchemaService);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getSchemaVariants(), should return all variants of a schema', async () => {
    component.schemaId = '1005'
    spyOn(schemaVariantService, 'getSchemaVariantDetails').withArgs(component.schemaId).and.returnValue(of({} as VariantDetails[]))
    component.getSchemaVariants(component.schemaId);
    expect(schemaVariantService.getSchemaVariantDetails).toHaveBeenCalledWith(component.schemaId);
  })

  it('getBusinessRuleList(), should get business rule list of schema', async () => {
    spyOn(schemaService, 'getAllBusinessRules').withArgs(component.schemaId).and.returnValue(of({} as CoreSchemaBrInfo[]));
    component.getBusinessRuleList(component.schemaId);
    expect(schemaService.getAllBusinessRules).toHaveBeenCalledWith(component.schemaId);
  })

  it('shortName(), should return initials of subscriber', () => {
    let fName = 'Ashish';
    let lName = 'Goyal';
    let result = component.shortName(fName, lName);
    expect(result).toEqual('AG');

    fName = 'Ashish';
    lName = '';
    result = component.shortName(fName, lName);
    expect(result).toEqual('')
  })

  it('prepateTextToShow(), should prepare text to show over mat-chips', async () => {
    const ctrl: FilterCriteria = {
      fieldId: 'MaterialType',
      values: ['123', '456'],
      type: 'DROPDOWN',
      filterCtrl: {
        selectedValues: [
          {
            CODE: 'ABC',
            FIELDNAME: 'MaterialType'
          } as DropDownValue
        ]
      } as AddFilterOutput
    }
    const result = component.prepareTextToShow(ctrl);
    expect(result).toEqual('ABC');
  })

  it('loadDropValues(), should load dropdown values of selected filters', async() => {
    const fldc: FilterCriteria = {
      fieldId: 'MaterialType',
      values: ['123', '456'],
      type: 'DROPDOWN',
      filterCtrl: {
        selectedValues: [
          {
            CODE: 'ABC',
            FIELDNAME: 'MaterialType'
          } as DropDownValue
        ]
      } as AddFilterOutput
    }
    component.loadDropValues(fldc);
    expect(component.loadDopValuesFor.checkedValue.length).toEqual(2);
  })
});

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SchemaVariantReq } from '@models/schema/schema';
import { FilterCriteria } from '@models/schema/schemadetailstable';
import { SchemaVariantsModel } from '@models/schema/schemalist';
import { AddFilterMenuComponent } from '@modules/shared/_components/add-filter-menu/add-filter-menu.component';
import { FilterValuesComponent } from '@modules/shared/_components/filter-values/filter-values.component';
import { FormInputComponent } from '@modules/shared/_components/form-input/form-input.component';
import { SchemaVariantService } from '@services/home/schema/schema-variant.service';
import { of } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { DatascopeSidesheetComponent } from './datascope-sidesheet.component';

describe('DatascopeSidesheetComponent', () => {
  let component: DatascopeSidesheetComponent;
  let fixture: ComponentFixture<DatascopeSidesheetComponent>;
  let schemaVariantService: SchemaVariantService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatascopeSidesheetComponent, FormInputComponent, AddFilterMenuComponent, FilterValuesComponent ],
      imports: [RouterTestingModule, AppMaterialModuleForSpec, HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatascopeSidesheetComponent);
    component = fixture.componentInstance;
    schemaVariantService = fixture.debugElement.injector.get(SchemaVariantService);
    router = TestBed.inject(Router);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getDataScopeDetails(), should get data scope details by ID', async() => {
    const variantId = '24345';
    spyOn(schemaVariantService,'getVariantdetailsByvariantId').withArgs(variantId).and.returnValue(of({} as SchemaVariantsModel));
    component.getDataScopeDetails(variantId);
    expect(schemaVariantService.getVariantdetailsByvariantId).toHaveBeenCalledWith(variantId)
  })

  it('close(), should close side sheet', async() => {
    spyOn(router, 'navigate');
    component.close();
    expect(router.navigate).toHaveBeenCalledWith([{outlets: {sb:null}}]);
  })

  it('getValue(), should get value from form-input', async() => {
    const dataScopeName = 'USA Region';
    component.getValue(dataScopeName);
    expect(component.variantInfo.variantName).toEqual('USA Region');
  })

  it('prepareTextToShow(), should return text/number to chip value', async() => {
    let ctrl = {
      fieldId: 'MATL_TYPE',
      values: ['USA Region', 'Asia Region']
    } as FilterCriteria;
    let result =  component.prepareTextToShow(ctrl);
    expect(result).toEqual(2);

    ctrl = {
      fieldId: 'MATL_TYPE',
      values: ['USA Region']
    } as FilterCriteria;
    result = component.prepareTextToShow(ctrl);
    expect(result).toEqual('USA Region');
  })

  it('loadDropValues(), should load all selected values', async() => {
    const fldc = {
      fieldId: 'MATL_TYPE',
      values: ['USA', 'INDIA', 'ASIA']
    } as FilterCriteria;
    component.loadDropValues(fldc);

    expect(component.loadDropValuesFor.fieldId).toEqual('MATL_TYPE');
    expect(component.loadDropValuesFor.checkedValue.length).toEqual(3);
  })

  it('removeFilter(), should remove filter when click on cross icon', async() => {
    const ctrl = {
      fieldId: 'MATL_TYPE'
    } as FilterCriteria;

    component.variantInfo = {
      filterCriteria: [
        {
          fieldId: 'MATL_GRP'
        },
        {
          fieldId: 'MATL_TYPE'
        }
      ]
    } as SchemaVariantReq;

    component.removeFilter(ctrl);
    expect(component.variantInfo.filterCriteria.length).toEqual(1);
  })

  it('updateChipFilter(), should update selected values of chip filter', async() => {
    const fieldId = 'MATL_GRPA';
    const selectedValues = [
      {
        CODE: 'USA',
        fieldId
      },
      {
        CODE: 'INDIA',
        fieldId
      }
    ];
    component.variantInfo = {
      filterCriteria: [
        {
          fieldId,
          values: ['USA']
        }
      ]
    } as SchemaVariantReq
    component.updateChipFilter(selectedValues, fieldId);
    expect(component.variantInfo.filterCriteria[0].values.length).toEqual(2);
  })
});

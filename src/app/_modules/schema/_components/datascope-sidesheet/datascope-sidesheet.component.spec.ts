import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AddFilterOutput, SchemaVariantReq } from '@models/schema/schema';
import { FilterCriteria } from '@models/schema/schemadetailstable';
import { LoadDropValueReq, SchemaVariantsModel } from '@models/schema/schemalist';
import { Userdetails } from '@models/userdetails';
import { SharedModule } from '@modules/shared/shared.module';
import { AddFilterMenuComponent } from '@modules/shared/_components/add-filter-menu/add-filter-menu.component';
import { FilterValuesComponent } from '@modules/shared/_components/filter-values/filter-values.component';
import { FormInputComponent } from '@modules/shared/_components/form-input/form-input.component';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';
import { SchemaService } from '@services/home/schema.service';
import { SchemaVariantService } from '@services/home/schema/schema-variant.service';
import { UserService } from '@services/user/userservice.service';
import { of, throwError } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { DatascopeSidesheetComponent } from './datascope-sidesheet.component';

describe('DatascopeSidesheetComponent', () => {
  let component: DatascopeSidesheetComponent;
  let fixture: ComponentFixture<DatascopeSidesheetComponent>;
  let schemaVariantService: SchemaVariantService;
  let schemaService: SchemaService;
  let userService: UserService;
  let router: Router;
  const routerMockParams = {
    schemaId: '12563',
    moduleId: '10002',
    variantId: '25623',
    outlet:  'sb'
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatascopeSidesheetComponent, FormInputComponent, AddFilterMenuComponent, FilterValuesComponent, SearchInputComponent ],
      imports: [RouterTestingModule, AppMaterialModuleForSpec, HttpClientTestingModule, SharedModule],
      providers: [
        { provide: ActivatedRoute, useValue: {
          params: of(routerMockParams)
        }}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatascopeSidesheetComponent);
    component = fixture.componentInstance;
    schemaVariantService = fixture.debugElement.injector.get(SchemaVariantService);
    schemaService = fixture.debugElement.injector.get(SchemaService);
    userService = fixture.debugElement.injector.get(UserService);
    router = TestBed.inject(Router);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit(), should called ngoninit', async() => {
    component.ngOnInit();
    expect(component.schemaId).toEqual(routerMockParams.schemaId);
  })

  it('getDataScopeDetails(), should get data scope details by ID', async() => {
    const userDetails = {
      userName: 'harshit',
      plantCode: '0',
      currentRoleId: 'AD'
    } as Userdetails
    const variantId = '24345';

    const variantDetails = {
      variantName: 'Variant_1',
      filterCriteria: [],
      variantId: 'V1'
    } as SchemaVariantsModel

    spyOn(userService, 'getUserDetails').and.returnValue(of(userDetails));
    spyOn(schemaVariantService,'getVariantdetailsByvariantId').withArgs(variantId, userDetails.currentRoleId, userDetails.plantCode, userDetails.userName).and.returnValues(of(variantDetails), throwError('Something went wrong while getting variant details.'));
    component.getDataScopeDetails(variantId);

    expect(schemaVariantService.getVariantdetailsByvariantId).toHaveBeenCalledTimes(1);
    expect(component.variantInfo).toEqual(variantDetails);
  })

  it('close(), should close side sheet', async() => {
    component.outlet = 'sb';
    spyOn(router, 'navigate');
    component.close();
    expect(router.navigate).toHaveBeenCalledWith([{outlets: {[component.outlet]:null}}], {queryParamsHandling: 'preserve'});
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
      values: ['USA_Region'],
      textValues: ['USA data scope'],
      selectedValues: [{
        CODE: 'xyz',
        TEXT: 'Data scope from API',
        LANGU: 'English'
      }]
    } as FilterCriteria;
    result = component.prepareTextToShow(ctrl);
    expect(result).toEqual('USA data scope');

    ctrl = {
      fieldId: 'MATL_TYPE',
      values: ['USA_Region'],
      selectedValues: [{
        CODE: 'USA_Region',
        TEXT: 'Data scope from API',
        LANGU: 'English'
      }]
    } as FilterCriteria;
    result = component.prepareTextToShow(ctrl);
    expect(result).toEqual('Data scope from API');
  })

  it('loadDropValues(), should load all selected values', async() => {
    let fldc = {
      fieldId: 'MATL_TYPE',
      values: ['USA', 'INDIA', 'ASIA']
    } as FilterCriteria;
    component.loadDropValues(fldc);

    expect(component.loadDropValuesFor.fieldId).toEqual('MATL_TYPE');
    expect(component.loadDropValuesFor.checkedValue.length).toEqual(3);

    fldc = {

    } as FilterCriteria;
    component.loadDropValuesFor = {
      checkedValue: []
    } as LoadDropValueReq;
    component.loadDropValues(fldc);
    expect(component.loadDropValuesFor.checkedValue.length).toEqual(0);
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

    component.variantInfo = {
      filterCriteria: [
        {
          fieldId: 'APPROVER_NAME',
          values: ['ASHISH_GOYAL']
        }
      ]
    } as SchemaVariantReq
    component.updateChipFilter(selectedValues, fieldId);
    expect(component.variantInfo.filterCriteria[0].values.length).toEqual(1);
  });

  it('makeFilterCtrl(), should return filter', async() => {
    const event = {
      fldCtrl: {
        fieldId: 'APPROVER_NAME',
        fieldDescri: 'Approver Name'
      },
      selectedValues: [
        {
          CODE: 'ashishkr',
          TEXT: 'ashish goyal',
          FIELDNAME: 'APPROVER_NAME'
        },
        {
          CODE:  'harshitjain',
          TEXT: 'harshit jain',
          FIELDNAME: 'APPROVER_NAME'
        }
      ]
    } as AddFilterOutput

    component.variantInfo = {
      variantId:  '10002',
      schemaId: '1002152',
      variantName: 'Test DS',
      variantType: 'RUNFOR',
      filterCriteria: null
    }

    component.makeFilterCtrl(event);
    expect(component.variantInfo.filterCriteria.length).toEqual(1);

    component.variantInfo = {
      variantId:  '10002',
      schemaId: '1002152',
      variantName: 'Test DS',
      variantType: 'RUNFOR',
      filterCriteria: [
        {
          fldCtrl: {
            fieldId: 'APPROVER_NAME',
            fieldDescri: 'Approver Name'
          },
          selectedValues: [
            {
              CODE: 'ashishkrgoyal',
              TEXT: 'Ashish kumar goyal',
              FIELDNAME: 'APPROVER_NAME'
            },
            {
              CODE:  'sandeeprana',
              TEXT: 'Sandeep kumar rana',
              FIELDNAME: 'APPROVER_NAME'
            }
          ],
          values:  [
            'ashishkrgoyal',
            'sandeeprana'
          ]
        }
      ] as FilterCriteria[]
    }

    component.makeFilterCtrl(event);
    expect(component.variantInfo.filterCriteria[0].values.length).toEqual(2);
  });

  it('saveVarient(), should save data scope on click save button', async() => {
    component.variantName = new FormControl('USA DS');
    component.schemaId = '123458';

    component.variantInfo.variantId = 'new';

    spyOn(schemaService, 'saveUpdateDataScope').withArgs(component.variantInfo).and.returnValue(of({}));
    component.saveVarient();
    expect(schemaService.saveUpdateDataScope).toHaveBeenCalledWith(component.variantInfo);

    component.variantInfo.variantId = '22568584';
    component.saveVarient();
    expect(schemaService.saveUpdateDataScope).toHaveBeenCalledWith(component.variantInfo);
  })
});

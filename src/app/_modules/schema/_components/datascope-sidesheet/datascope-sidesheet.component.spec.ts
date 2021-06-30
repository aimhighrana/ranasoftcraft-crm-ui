import { MdoUiLibraryModule } from 'mdo-ui-library';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AddFilterOutput, SchemaVariantReq } from '@models/schema/schema';
import { FilterCriteria, MetadataModeleResponse } from '@models/schema/schemadetailstable';
import { LoadDropValueReq, ModuleInfo, SchemaVariantsModel } from '@models/schema/schemalist';
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
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { DropDownValue } from '@modules/admin/_components/module/business-rules/business-rules.modal';

describe('DatascopeSidesheetComponent', () => {
  let component: DatascopeSidesheetComponent;
  let fixture: ComponentFixture<DatascopeSidesheetComponent>;
  let schemaVariantService: SchemaVariantService;
  let schemaService: SchemaService;
  let schemaDetailsService: SchemaDetailsService;
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
      imports: [ MdoUiLibraryModule, RouterTestingModule, AppMaterialModuleForSpec, HttpClientTestingModule, SharedModule],
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
    schemaDetailsService = fixture.debugElement.injector.get(SchemaDetailsService);
    router = TestBed.inject(Router);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit(), should called ngoninit', async() => {
    component.ngOnInit();
    expect(component.schemaId).toEqual(routerMockParams.schemaId);

    routerMockParams.variantId = 'new';
    component.ngOnInit();
    expect(component.schemaId).toEqual(routerMockParams.schemaId);
  })

  it('getModuleInfo()', async(() => {
    const val: ModuleInfo[] = [
      {
        moduleId: '0',
        moduleDesc: 'test',
        datasetCount: 0
      }
    ];
    spyOn(schemaService, 'getModuleInfoByModuleId').and.returnValues(of(val), throwError('error'));

    component.getModuleInfo();
    expect(component.entireDatasetCnt).toEqual(0);
    expect(schemaService.getModuleInfoByModuleId).toHaveBeenCalled();
  }));

  it('getModuleInfo()', async(() => {
    const val: ModuleInfo[] = [
      {
        moduleId: '0',
        moduleDesc: 'test',
        datasetCount: 0
      }
    ];
    spyOn(schemaService, 'getModuleInfoByModuleId').and.returnValues(of(val), throwError('error'));

    component.variantId = 'new';
    component.getModuleInfo();
    expect(component.scopeCnt).toEqual(0);
    expect(schemaService.getModuleInfoByModuleId).toHaveBeenCalled();
  }));

  it('getModuleInfo()', async(() => {
    const val: ModuleInfo[] = [];
    spyOn(schemaService, 'getModuleInfoByModuleId').and.returnValues(of(val), throwError('error'));

    component.getModuleInfo();
    expect(component.entireDatasetCnt).toEqual(0);
    expect(schemaService.getModuleInfoByModuleId).toHaveBeenCalled();
  }));

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

  it('getDataScopeDetails(), should get data scope details by ID', async() => {
    const userDetails = {
      userName: 'harshit',
      plantCode: '0',
      currentRoleId: 'AD'
    } as Userdetails
    const variantId = '24345';

    spyOn(userService, 'getUserDetails').and.returnValue(of(userDetails));
    spyOn(schemaVariantService,'getVariantdetailsByvariantId').withArgs(variantId, userDetails.currentRoleId, userDetails.plantCode, userDetails.userName).and.returnValues(of(null), throwError('Something went wrong while getting variant details.'));
    component.getDataScopeDetails(variantId);

    expect(schemaVariantService.getVariantdetailsByvariantId).toHaveBeenCalledTimes(1);
  })

  it('updateDataScopeCount()', async(() => {
    component.selectedFilterCriteria = ['test', 'test1'];
    spyOn(schemaService, 'getDataScopeCount').and.returnValue(of(1));
    component.updateDataScopeCount();

    expect(component.scopeCnt).toEqual(1);
    expect(schemaService.getDataScopeCount).toHaveBeenCalled();
  }));

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

  it('getAllFilters()', async(() => {
    component.allFilters = ['test'];
    component.getAllFilters();
    expect(component.allFilters.length).toEqual(1);

    const val: MetadataModeleResponse = {
      headers: {
        HEADER: {
          fieldId: 'HEADER'
        }
      },
      grids: {
        GRID: {
          fieldId: 'GRID'
        }
      },
      gridFields: {
        GRID: {
          GRID_CHILD: {
            fieldId: 'GRID_CHILD'
          }
        }
      },
      hierarchy: [
        {
          objnr: 0,
          heirarchyId: 'HIERARCHY',
          heirarchyText: 'Hierarchy Text',
          fieldId: 'HIERARCHY',
          structureId: '',
          tableName: '',
          objectType: ''
        }
      ],
      hierarchyFields: {
        HIERARCHY: {
          HIERARCHY_CHILD: {
            fieldId: 'HIERARCHY_CHILD'
          }
        }
      }
    }

    component.allFilters = [];
    spyOn(schemaDetailsService, 'getMetadataFields').and.returnValue(of(val));
    component.getAllFilters();
    expect(component.allFilters.length).toEqual(3);
  }));

  it('searchFilters()', async(() => {
    const list = [
      {
        type: 'grid',
        fieldDescri: 'test',
        child: [
          {
            fieldDescri: 'test'
          }
        ]
      }
    ];
    component.searchFilters(list, 'allList', 'tes');
    expect(component.filtersDisplayList.length).toEqual(1);

    component.filtersDisplayList = [];
    component.searchFilters([], '', 'tes');
    expect(component.filtersDisplayList.length).toEqual(0);

    list[0].type = 'header';
    component.searchFilters(list, 'allList', 'tes');
    expect(component.filtersDisplayList.length).toEqual(1);

    component.filtersDisplayList = [];
    const list1 = [
      {
        type: 'grid',
        fieldDescri: 'grid desc'
      }
    ];
    component.searchFilters(list1, '', 'tes');
    expect(component.filtersDisplayList.length).toEqual(0);

    list[0].type = 'grid';
    list[0].child[0].fieldDescri = 'grid Desc';
    component.searchFilters(list, '', 'tes');
    expect(component.filtersDisplayList.length).toEqual(0);
  }));

  it('triggerFilterSearch()', async(() => {
    component.ngOnInit();
    component.filterTrackBy(0, 1);
    component.triggerFilterSearch('test');

    expect(component.searchString).toEqual('test');
  }));

  it('selectFilter()', async(() => {
    const field: any = {
      type: 'grid'
    };
    component.selectFilter(field, false);

    field.type = 'header';
    field.fieldId = 'test';
    field.show = true;
    component.filtersDisplayList = [
      {
        fieldId: 'test'
      }
    ];
    component.selectFilter(field, false);
    expect(component.selectedFilters.length).toEqual(1);

    field.type = 'grid';
    field.parentFieldId = 'test';
    component.filtersDisplayList[0].child = [
      {
        fieldId: 'test',
        show: true
      }
    ];
    component.selectedFilters = [
      {
        fieldId: 'test',
        child: [],
        type: 'header',
        fieldDescri: 'test'
      }
    ];
    component.searchString = 'test';
    expect(component.selectFilter(field, true, false)).toBeUndefined();
  }));

  it('removeField()', async(() => {
    component.filtersDisplayList = [
      {
        fieldId: 'test'
      }
    ];
    component.selectedFilters = [
      {
        fieldId: 'test'
      }
    ];

    const filter = {
      fieldId: 'test'
    };
    component.removeField(filter, false);
    expect(component.selectedFiltersDisplayList.length).toEqual(0);
  }));

  it('getFilterValues()', async(() => {
    const val: DropDownValue[] = [
      {
        CODE: 'TEST',
        TEXT: 'text',
        PLANTCODE: '',
        SNO: '',
        FIELDNAME: '',
        LANGU: ''
      }
    ];
    spyOn(schemaService, 'dropDownValues').and.returnValue(of(val));

    component.getFilterValues('test', true);
    expect(component.dropdownValues.length).toEqual(1);
  }));

  it('setFilterExistingValues()', async(() => {
    component.currentFilter = {
      fieldId: 'test'
    };
    component.selectedFilterCriteria = [
      {
        fieldId: 'test',
        values: ['0'],
        startValue: '1625065825644',
        endValue: '1625065825644'
      }
    ];

    component.filterData.inputTextVal = '';
    component.setFilterExistingValues();
    expect(component.filterData.inputTextVal).toEqual('');

    component.filterControlType = 'input_text';
    component.setFilterExistingValues();
    expect(component.filterData.inputTextVal).toEqual('0');

    component.filterControlType = 'input_desc';
    component.setFilterExistingValues();
    expect(component.filterData.inputTextVal).toEqual('0');

    component.filterControlType = 'input_numeric';
    component.setFilterExistingValues();
    expect(component.filterData.inputNumericVal).toEqual(0);

    component.filterControlType = 'textarea';
    component.setFilterExistingValues();
    expect(component.filterData.textareaVal).toEqual('0');

    component.filterControlType = 'radio';
    component.setFilterExistingValues();
    expect(component.filterData.selectedValue).toEqual('0');

    component.dropdownValues = [
      {
        CODE: '0',
        TEXT: 'test',
        checked: false,
        key: '0',
        value: 'test'
      }
    ];
    component.filterControlType = 'checkbox';
    component.setFilterExistingValues();
    expect(component.dropdownValues[0].checked).toEqual(true);

    component.filterControlType = 'dropdown_single';
    component.setFilterExistingValues();
    expect(component.dropdownSearchCtrl.value).toEqual('test');

    component.filterControlType = 'dropdown_multi';
    component.setFilterExistingValues();
    expect(component.dropdownSelectedChips.length).toEqual(1);

    component.filterControlType = 'picker_date';
    expect(component.setFilterExistingValues()).toBeUndefined();

    component.filterControlType = 'picker_time';
    expect(component.setFilterExistingValues()).toBeUndefined();
  }));

  it('updateFilterValue()', async(() => {
    component.currentFilter = { fieldId: 'test' };
    component.selectedFilterCriteria = [ { fieldId: 'test', values: [] } ];

    component.filterControlType = 'input_text';
    const ev = 'test';
    component.filterData.inputTextVal = 'test';
    component.updateFilterValue(ev);
    expect(component.selectedFilterCriteria[0].values[0]).toEqual('test');

    component.filterControlType = 'input_desc';
    component.updateFilterValue(ev);
    expect(component.selectedFilterCriteria[0].values[0]).toEqual('test');

    component.filterData.inputNumericVal = 0;
    component.filterControlType = 'input_numeric';
    component.updateFilterValue(ev);
    expect(component.selectedFilterCriteria[0].values[0]).toEqual('0');

    component.filterData.textareaVal = 'test';
    component.filterControlType = 'textarea';
    component.updateFilterValue(ev);
    expect(component.selectedFilterCriteria[0].values[0]).toEqual('test');

    component.dropdownValues = [ { value: 'test', key: 'test' } ];
    component.filterControlType = 'radio';
    component.updateFilterValue(ev);
    expect(component.selectedFilterCriteria[0].values[0]).toEqual('test');
  }));

  it('checkboxChanged()', async(() => {
    component.dropdownValues = [ { value: 'test', key: 'test', checked: true } ];
    component.currentFilter = { fieldId: 'test' };
    component.selectedFilterCriteria = [ { fieldId: 'test', values: [] } ];

    component.checkboxChanged(true, 'test', 0);
    expect(component.selectedFilterCriteria[0].values[0]).toEqual('test');

    component.checkboxChanged(false, 'test', 0);
    expect(component.selectedFilterCriteria[0].values.length).toEqual(0);
  }));

  it('timeRangeChanged()', async(() => {
    component.currentFilter = { fieldId: 'test' };
    component.selectedFilterCriteria = [
      {
        fieldId: 'test',
        values: ['0'],
        startValue: '1625065825644',
        endValue: '1625065825644'
      }
    ];
    const event = {
      start: {
        hours: 0,
        minutes: 0
      },
      end: {
        hours: 0,
        minutes: 0
      }
    };

    component.timeRangeChanged(event);
    expect(component.selectedFilterCriteria[0].startValue).toEqual('1625065825644');

    event.start.hours = 2;
    event.end.hours = 4;

    const today = new Date();
    today.setHours(event.start.hours);
    today.setMinutes(event.start.minutes);

    component.timeRangeChanged(event);
    expect(component.selectedFilterCriteria[0].startValue).toEqual(String(today.getTime()));
  }));

  it('dateChanged()', async(() => {
    component.currentFilter = { fieldId: 'test' };
    component.selectedFilterCriteria = [
      {
        fieldId: 'test',
        startValue: '1625065825644',
        endValue: '1625065825644'
      }
    ];
    const event = {
      start: new Date().getTime(),
      end: new Date().getTime()
    };

    expect(component.dateChanged(event)).toBeUndefined();
  }));

  it('selectSingle()', async(() => {
    const ev = {
      option: { value: '0' }
    };
    component.dropdownValues = [ { value: '0', key: 'test' } ];
    component.currentFilter = { fieldId: 'test' };
    component.selectedFilterCriteria = [
      {
        fieldId: 'test',
        values: []
      }
    ];
    component.selectSingle(ev);

    expect(component.selectedFilterCriteria[0].values.length).toEqual(1);
  }));

  it('selectMulti()', async(() => {
    const ev = {
      option: { value: '0' }
    };
    component.dropdownValues = [ { TEXT: '0', CODE: 'test', checked: false } ];
    component.currentFilter = { fieldId: 'test' };
    component.selectedFilterCriteria = [
      {
        fieldId: 'test',
        values: []
      }
    ];

    component.selectMulti(ev, 'add');
    expect(component.selectedFilterCriteria[0].values.length).toEqual(1);

    component.selectMulti('0', 'remove');
    expect(component.selectedFilterCriteria[0].values.length).toEqual(0);
  }));

  it('selectDynamicFilter()', async(() => {
    const filter: any = {
      type: 'grid',
      isChild: false,
    };
    component.selectDynamicFilter(filter, true);

    filter.type = 'header';
    filter.picklist = '1';
    filter.dataType = 'text';
    filter.isCheckList = 'true';

    spyOn(component, 'getFilterValues');
    component.selectDynamicFilter(filter, true);
    expect(component.filterControlType).toEqual('dropdown_multi');
    expect(component.getFilterValues).toHaveBeenCalled();
  }));
});

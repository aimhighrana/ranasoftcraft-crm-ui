import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { FiltersDropdownComponent } from './filters-dropdown.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { By } from '@angular/platform-browser';
import { Filter } from '@models/task-list/filter';

describe('FiltersDropdownComponent', () => {
  let fixture: ComponentFixture<FiltersDropdownComponent>;
  let component: FiltersDropdownComponent;
  const sampleFilters: Filter = {
    tags: [],
    staticFilters: {
      status: '',
      priority: '',
      region: '',
      recieved_date: new Date().toString(),
      due_date: new Date().toString(),
      requested_date: new Date().toString(),
      requested_by: ''
    },
    dynamicFilters: [
      {
        objectType: '100',
        objectDesc: 'BR Demo module',
        filterFields: [
          {
            CODE: 'bara',
            TEXT: 'bara',
            checked: false,
            fieldDesc: 'City',
            fieldId: 'BR103',
            objectDesc: 'BR Demo module',
            objectId: '100'
          }
        ],
        colorActive: false,
      }
    ],
    apiRequestStructure: []
  }
  const sampleTags = {
    CODE: 'bara',
    TEXT: 'bara',
    checked: true,
    fieldDesc: 'City',
    fieldId: 'BR103',
    objectDesc: 'BR Demo module',
    objectId: '100',
    checkBoxlist: [],
    fetchCount: 0,
    checkBoxCode: 'bara',
    checkBoxText: 'bara',
    text: ''
  }

  beforeEach(async(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
      platformBrowserDynamicTesting());
    TestBed.configureTestingModule({
      imports: [AppMaterialModuleForSpec, RouterTestingModule, HttpClientTestingModule],
      providers: [HttpClientTestingModule],
      declarations: [FiltersDropdownComponent]
    }).compileComponents();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersDropdownComponent);
    component = fixture.componentInstance;
    component.selectedFields.priority = 'P4';
    component.selectedFields.status = 'claimed';
    component.initializeForm();
    component.setFilters(sampleFilters);
  });

  it('toggleAdvancedFilters() should work', () => {
    component.showAdvancedFilters = true;
    component.toggleAdvancedFilters();
    expect(component.showAdvancedFilters).toEqual(false);
  });

  it('should call onInit()', fakeAsync(() => {
    component.ngOnInit();
    expect(component.userDetails).not.toBe(null);
    expect(component.filterForm).not.toBe(null);
    expect(component.globalStateStructure[sampleFilters.dynamicFilters[0].filterFields[0].objectId]).not.toBe(null);
    component.globalStateStructure[sampleFilters.dynamicFilters[0].filterFields[0].objectId] = {}
    component.globalStateStructure[sampleFilters.dynamicFilters[0].filterFields[0].objectId][sampleFilters.dynamicFilters[0].filterFields[0].fieldId] = {}
    expect(component.globalStateStructure[sampleFilters.dynamicFilters[0].filterFields[0].objectId][sampleFilters.dynamicFilters[0].filterFields[0].fieldId]).not.toBe(null);
  }));

  it('should call getDynamicList()', () => {
    component.ngOnInit();
    component.makeGlobalStructure();
    component.globalStateStructure[sampleFilters.dynamicFilters[0].filterFields[0].objectId] = {}
    component.globalStateStructure[sampleFilters.dynamicFilters[0].filterFields[0].objectId][sampleFilters.dynamicFilters[0].filterFields[0].fieldId] = {};
    component.globalStateStructure[sampleFilters.dynamicFilters[0].filterFields[0].objectId][sampleFilters.dynamicFilters[0].filterFields[0].fieldId].list = [sampleTags]
    component.getDynamicList(sampleFilters.dynamicFilters[0].filterFields[0]);
    component.setAutoSelectedFromTaglist();

    expect(Object.keys(component.globalStateStructure).length).toEqual(1);
  });

  it('should updateFilters()', () => {
    component = fixture.componentInstance;
    component.filterForm.controls.priority.setValue('1');
    component.filterForm.controls.status.setValue('active');
    component.filterForm.controls.requested_by.setValue('apoorv');
    component.filterForm.controls.region.setValue('north india')
    component.tagsList.push(sampleTags)
    component.updateFilter();
    expect(component.filters.staticFilters.priority).toEqual('1');
    expect(component.filters.staticFilters.status).toEqual('active');
    expect(component.filters.staticFilters.requested_by).toEqual('apoorv');
    expect(component.filters.staticFilters.region).toEqual('north india');
  })

  /*
  it('should scroll scrollIntoView()', () => {
    component.scrollIntoView(sampleFilters.dynamicFilters[0]);
    expect(sampleFilters.dynamicFilters[0].colorActive).toBe(false);
  });
  */

  it('should call callFilterFieldsAPI()', () => {
    component.ngOnInit();
    component.makeGlobalStructure();
    component.globalStateStructure[sampleFilters.dynamicFilters[0].filterFields[0].objectId] = {}
    component.globalStateStructure[sampleFilters.dynamicFilters[0].filterFields[0].objectId][sampleFilters.dynamicFilters[0].filterFields[0].fieldId] = {};
    component.globalStateStructure[sampleFilters.dynamicFilters[0].filterFields[0].objectId][sampleFilters.dynamicFilters[0].filterFields[0].fieldId].list = [sampleTags]
    component.getDynamicList(sampleFilters.dynamicFilters[0].filterFields[0]);
    component.getUserDetails();
    component.filterRequestObject.fieldId = sampleTags.fieldId;
    component.filterRequestObject.objectId = sampleTags.objectId;
    component.filterRequestObject.objectDesc = sampleTags.objectDesc;
    component.filterRequestObject.fieldDesc = sampleTags.fieldDesc;
    component.filterRequestObject.plantCode = component.userDetails.plantCode;
    component.callFilterFieldsAPI(sampleTags)
    expect(component.globalStateStructure[sampleTags.objectId][sampleTags.fieldId].list.length).toBeGreaterThan(0)
  });

  // it('should call resetFilters()', () => {
  //   component.ngOnInit();
  //   component.makeGlobalStructure();
  //   component.makeGlobalStructureForApiCall();
  //   component.globalStateStructure[sampleFilters.dynamicFilters[0].filterFields[0].objectId] = {}
  //   component.globalStateStructure[sampleFilters.dynamicFilters[0].filterFields[0].objectId][sampleFilters.dynamicFilters[0].filterFields[0].fieldId] = {};
  //   component.globalStateStructure[sampleFilters.dynamicFilters[0].filterFields[0].objectId][sampleFilters.dynamicFilters[0].filterFields[0].fieldId].list = [sampleTags]
  //   component.getDynamicList(sampleFilters.dynamicFilters[0].filterFields[0]);
  //   component.setTags(sampleTags, 0)
  //   component.resetFilters()
  //   expect(component.tagsList.length).toEqual(0)
  // });

  it('should search and callAPI in searchAndFilter()', fakeAsync(() => {
    component.ngOnInit();
    component.makeGlobalStructure();
    component.getUserDetails();
    component.globalStateStructure[sampleFilters.dynamicFilters[0].filterFields[0].objectId] = {}
    component.globalStateStructure[sampleFilters.dynamicFilters[0].filterFields[0].objectId][sampleFilters.dynamicFilters[0].filterFields[0].fieldId] = {};
    component.globalStateStructure[sampleFilters.dynamicFilters[0].filterFields[0].objectId][sampleFilters.dynamicFilters[0].filterFields[0].fieldId].list = [sampleTags]
    component.getDynamicList(sampleFilters.dynamicFilters[0].filterFields[0]);
    component.filterRequestObject.fieldDesc = sampleTags.fieldDesc;
    component.filterRequestObject.fieldId = sampleTags.fieldId;
    component.filterRequestObject.objectDesc = sampleTags.objectDesc;
    component.filterRequestObject.objectId = sampleTags.objectId;
    component.filterRequestObject.plantCode = 'MDO1003';
    component.showAdvancedFilters = true;
    fixture.detectChanges();
    const debugElement = fixture.debugElement.query(By.css('.search-field'));
    debugElement.nativeElement.value = 'a';
    debugElement.triggerEventHandler('keyup', { target: { value: 'a' } });
    fixture.detectChanges();
    expect(component.filterRequestObject.searchTerm).toBe('a');
    expect(component.globalStateStructure[component.activeObjects.objectId][component.activeObjects.fieldId].list.length).toBeGreaterThan(0)
  }));

  it('should call paginateDynamicList()', () => {
    component.ngOnInit();
    component.makeGlobalStructure();
    component.getUserDetails();
    component.globalStateStructure[sampleFilters.dynamicFilters[0].filterFields[0].objectId] = {}
    component.globalStateStructure[sampleFilters.dynamicFilters[0].filterFields[0].objectId][sampleFilters.dynamicFilters[0].filterFields[0].fieldId] = {};
    component.globalStateStructure[sampleFilters.dynamicFilters[0].filterFields[0].objectId][sampleFilters.dynamicFilters[0].filterFields[0].fieldId].list = [sampleTags]
    component.getDynamicList(sampleFilters.dynamicFilters[0].filterFields[0]);
    fixture.detectChanges();
    component.paginateDynamicList();
    expect(component.globalStateStructure[component.activeObjects.objectId][component.activeObjects.fieldId].list.length).toBeGreaterThan(0)
  });

  it('should call setTags()', () => {
    component.ngOnInit();
    component.makeGlobalStructure();
    fixture.detectChanges();
    component.globalStateStructure[sampleFilters.dynamicFilters[0].filterFields[0].objectId] = {}
    component.globalStateStructure[sampleFilters.dynamicFilters[0].filterFields[0].objectId][sampleFilters.dynamicFilters[0].filterFields[0].fieldId] = {};
    component.globalStateStructure[sampleFilters.dynamicFilters[0].filterFields[0].objectId][sampleFilters.dynamicFilters[0].filterFields[0].fieldId].list = [sampleTags];
    component.apiRequestStructure.push({
      objectId: sampleFilters.dynamicFilters[0].filterFields[0].objectId,
      fieldData: {
        fieldId: sampleFilters.dynamicFilters[0].filterFields[0].fieldId,
        filterList: []
      }
    })
    component.getDynamicList(sampleFilters.dynamicFilters[0].filterFields[0]);
    component.setTags(sampleTags, 0);
    expect((component.globalStateStructure[sampleFilters.dynamicFilters[0].filterFields[0].objectId][sampleFilters.dynamicFilters[0].filterFields[0].fieldId].list).length).toEqual(1);
  })


  it('should call removeTag()', () => {
    component.ngOnInit();
    component.makeGlobalStructure();
    component.globalStateStructure[sampleFilters.dynamicFilters[0].filterFields[0].objectId] = {}
    component.globalStateStructure[sampleFilters.dynamicFilters[0].filterFields[0].objectId][sampleFilters.dynamicFilters[0].filterFields[0].fieldId] = {};
    component.globalStateStructure[sampleFilters.dynamicFilters[0].filterFields[0].objectId][sampleFilters.dynamicFilters[0].filterFields[0].fieldId].list = [sampleTags];
    component.apiRequestStructure.push({
      objectId: sampleFilters.dynamicFilters[0].filterFields[0].objectId,
      fieldData: {
        fieldId: sampleFilters.dynamicFilters[0].filterFields[0].fieldId,
        filterList: []
      }
    })
    component.getDynamicList(sampleFilters.dynamicFilters[0].filterFields[0]);
    component.setTags(sampleTags, 0);
    const currentTagsLength = component.tagsList.length;
    component.removeTag(sampleTags);
    const newTagsLength = component.tagsList.length;
    expect(newTagsLength).toBeLessThanOrEqual(currentTagsLength);
  })

});

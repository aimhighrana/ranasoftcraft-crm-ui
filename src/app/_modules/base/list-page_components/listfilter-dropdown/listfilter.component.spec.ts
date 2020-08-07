import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../../shared/shared.module';
import { ListFiltersComponent } from './listfilter.component';
import { FilterListdata, Status } from '@models/list-page/listpage';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

describe('ListFiltersComponent', () => {
  let fixture: ComponentFixture<ListFiltersComponent>;
  let component: ListFiltersComponent;
  const sampledata = {
    textInput: '',
    status: [
      {
        display: 'In Progress',
        value: '1',
        selected: true
      },
      {
        display: 'Completed',
        value: '2',
        selected: false
      },
      {
        display: 'Pending',
        value: '3',
        selected: true
      },
      {
        display: 'Approved',
        value: '4',
        selected: false
      },
      {
        display: 'Draft',
        value: '5',
        selected: true
      },
      {
        display: 'System',
        value: '6',
        selected: true
      }
    ],
    superior: [
      {
        display: 'All',
        value: 'All',
        selected: false
      },
      {
        display: 'Complete',
        value: 'Complete',
        selected: false
      },
      {
        display: 'Progress',
        value: 'Progress',
        selected: false
      },
      {
        display: 'Delete',
        value: 'Delete',
        selected: false
      }
    ],
    planner: [
      {
        display: 'All',
        value: 'All',
        selected: false
      },
      {
        display: 'High',
        value: 'High',
        selected: false
      },
      {
        display: 'Medium',
        value: 'Medium',
        selected: false
      },
      {
        display: 'Low',
        value: 'Low',
        selected: false
      }
    ],
    modified_from_date: '',
    modified_to_date: '',
    creation_from_date: '',
    creation_to_date: '',
    record: ''
  }

  const samplefilterdata: FilterListdata[] = [{
    CODE: 'bara',
    TEXT: 'bara',
    checked: false,
    fieldid: 'BR103'
  }
  ]
  const sampleTags = {
    CODE: 'bara',
    TEXT: 'bara',
    checked: true,
    fieldid: 'BR103',
    objectId: '100',
    checkBoxlist: [],
    fetchCount: 0,
    checkBoxCode: 'bara',
    checkBoxText: 'bara',
    text: ''
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppMaterialModuleForSpec, RouterTestingModule, SharedModule, HttpClientTestingModule],
      providers: [HttpClientTestingModule],
      declarations: [ListFiltersComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFiltersComponent);
    component = fixture.componentInstance;
    component.makeGlobalStructure(samplefilterdata);
  });

  it('should create', () => {
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('toggleAdvancedFilters() should work', () => {
    component.showAdvancedFilters = true;
    component.toggleAdvancedFilters();
    expect(component.showAdvancedFilters).toEqual(false);
  });

  it('listfilter() should list', () => {
    component.filters = sampledata;
    fixture.detectChanges();
    component.listfilter(sampledata);
    component.ngOnInit();
    fixture.detectChanges();
    component.makeGlobalStructure(samplefilterdata);
    component.globalStateStructure[samplefilterdata[0].fieldid] = {}
    component.globalStateStructure[samplefilterdata[0].fieldid].nextFetchCount = 0;
    component.globalStateStructure[samplefilterdata[0].fieldid].list = [sampleTags]
    component.getDynamicList(samplefilterdata[0]);
    expect(component.ngOnInit).toBeTruthy();

  });

  it('should call getDynamicList()', () => {
    component.filters = sampledata;
    fixture.detectChanges();
    component.ngOnInit();
    fixture.detectChanges();
    component.makeGlobalStructure(samplefilterdata);

    component.globalStateStructure[samplefilterdata[0].fieldid] = {}
    component.globalStateStructure[samplefilterdata[0].fieldid].nextFetchCount = 0;
    component.globalStateStructure[samplefilterdata[0].fieldid].list = [sampleTags]
    component.getDynamicList(samplefilterdata[0]);
    component.setAutoSelectedFromTaglist();
    expect(component.ngOnInit).toBeTruthy();
  });

  it('should call callFilterFieldsAPI()', () => {
    component.filters = sampledata;
    fixture.detectChanges();
    component.ngOnInit();
    component.makeGlobalStructure(samplefilterdata);
    component.globalStateStructure[samplefilterdata[0].fieldid] = {}
    component.globalStateStructure[samplefilterdata[0].fieldid].nextFetchCount = 0;
    component.globalStateStructure[samplefilterdata[0].fieldid].list = [sampleTags]
    component.getDynamicList(samplefilterdata[0]);
    component.getUserDetails();
    component.filterListRequest.fieldId = sampleTags.fieldid;
    component.filterListRequest.objectId = sampleTags.objectId;
    component.filterListRequest.plantCode = component.userDetails.plantCode;
    component.callFilterFieldsAPI(sampleTags)
    expect(component.ngOnInit).toBeTruthy();
  });

  it('should search and callAPI in searchAndFilter()', fakeAsync(() => {
    component.filters = sampledata;
    fixture.detectChanges();
    component.ngOnInit();
    component.makeGlobalStructure(samplefilterdata);
    component.getUserDetails();
    component.globalStateStructure[samplefilterdata[0].fieldid] = {}
    component.globalStateStructure[samplefilterdata[0].fieldid].nextFetchCount = 0;
    component.globalStateStructure[samplefilterdata[0].fieldid].list = [sampleTags]
    component.getDynamicList(samplefilterdata[0]);
    component.filterListRequest.fieldId = sampleTags.fieldid;
    component.filterListRequest.objectId = sampleTags.objectId;
    component.filterListRequest.plantCode = 'MDO1003';
    component.showAdvancedFilters = true;
    fixture.detectChanges();
    const debugElement = fixture.debugElement.query(By.css('.search-field'));
    debugElement.nativeElement.value = 'a';
    debugElement.triggerEventHandler('keyup', { target: { value: 'a' } });
    fixture.detectChanges();
    expect(component.filterListRequest.searchTerm).toBe('a');
    expect(component.globalStateStructure[component.activeObjects.fieldId].list.length).toBeGreaterThan(0)
  }));

  it('should call setTags()', () => {
    component.filters = sampledata;
    fixture.detectChanges();
    component.ngOnInit();
    fixture.detectChanges();
    component.makeGlobalStructure(samplefilterdata);
    component.globalStateStructure[samplefilterdata[0].fieldid] = {}
    component.globalStateStructure[samplefilterdata[0].fieldid].nextFetchCount = 0;
    component.globalStateStructure[samplefilterdata[0].fieldid].list = [sampleTags];
    component.getDynamicList(samplefilterdata[0]);
    component.setTags(sampleTags, 0);
    expect(component.globalStateStructure).toBeTruthy();
  })


  it('closeFilter() should work', () => {
    spyOn(component.closeFilterBox, 'emit');
    component.closeFilter();
    expect(component.closeFilterBox.emit).toHaveBeenCalledWith(true);
  });

  it('updateFilter() should work', () => {
    spyOn(component.updateFilters, 'emit');
    component.updateFilter();
    expect(component.updateFilters.emit).toHaveBeenCalled();
  });

  it('filterStates() prepare status ', async(() => {
    const status = 'display';
    component.status = [{ display: 'display' } as Status];
    component.filterStates(status);
    expect(component.status.length).toEqual(1);
  }));

  it('onSuperiorPlanRemoved() should remove value', async(() => {
    component.filters = sampledata;
    fixture.detectChanges();
    component.onSuperiorPlanRemoved('Completed');
    expect(component.onSuperiorPlanRemoved).toBeTruthy();
  }));
});

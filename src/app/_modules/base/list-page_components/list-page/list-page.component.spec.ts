import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ListPageComponent } from './list-page.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { FormatTableHeadersPipe } from '@shared/_pipes/format-table-headers.pipe';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Userdetails } from '@models/userdetails';
import { ListPageService } from '@services/list-page.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ListPageComponent', () => {
  let fixture: ComponentFixture<ListPageComponent>;
  let component: ListPageComponent;
  let listPageService: ListPageService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppMaterialModuleForSpec, RouterTestingModule, HttpClientTestingModule],
      declarations: [ListPageComponent, FormatTableHeadersPipe],
      providers: [
        HttpClientTestingModule,
        ListPageService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ summaryId: '124' })
          },
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPageComponent);
    component = fixture.componentInstance;
    listPageService = fixture.debugElement.injector.get(ListPageService);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    fixture.detectChanges();
  });

  it('should create', () => {
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('getUserDetail() should get columns', async(() => {
    component.getUserDetail();
    expect(component.getUserDetail).not.toBe(null)
  }))

  it('getFilters() should get columns', async(() => {
    spyOn(listPageService,'getFilters').and.returnValue(of());
    component.getFilters();
    expect(listPageService.getFilters).toHaveBeenCalledTimes(1);
  }))

  it('getSavedSearches() should get columns', async(() => {
    component.getSavedSearches();
    expect(component.getSavedSearches).not.toBe(null)
  }))

  it('toggleDynamicFilters() should toggle filters component', () => {
    component.dynamicFiltersVisible = false;
    component.toggleDynamicFilters();
    expect(component.dynamicFiltersVisible).toBe(true);
  });

  it('getmetacolumnlist(), get report config', async(()=>{
    const userDetail: Userdetails = new Userdetails();
    spyOn(listPageService,'getDynamiclistcolumn').withArgs('72523857').and.returnValue(of(userDetail));
    component.getmetacolumnlist('72523857');
    expect(listPageService.getDynamiclistcolumn).toHaveBeenCalledWith('72523857');
  }));

  it('getDynamicFiltermeta(), get report config', async(()=>{
    const userDetail: Userdetails = new Userdetails();
    spyOn(listPageService,'getDynamicFiltermeta').withArgs('72523857').and.returnValue(of(userDetail));
    component.getDynamicFiltermeta('72523857');
    expect(listPageService.getDynamicFiltermeta).toHaveBeenCalledWith('72523857');
  }));

  it('isSelected(), check the field is selcted or not', async(()=>{
    component.selection.selected.length = 1;
    component.isAllSelected();
    expect(component.selection.selected.length).toBeGreaterThanOrEqual(1,'If the fld is exit on choose column then return true');
  }));

  it('masterToggle(), check the field is selcted or not', async(()=>{
    component.masterToggle();
    expect(component.isAllSelected()).toBe(true,'If the fld is exit on choose column then return true');
  }));

  it('closeFilterBox() should set value of dynamicFiltersVisible', () => {
    component.closeFilterBox();
    expect(component.dynamicFiltersVisible).toBe(true);
  });

  it('toggleColumnSettingPopUp() should reset the value for showColumnSettingPopUp', () => {
    component.showColumnSettingPopUp = false;
    component.toggleColumnSettingPopUp();
    expect(component.showColumnSettingPopUp).toBe(true);
  });

  it('updateColumns() should changw columns', () => {
    const tableColumns = [{visible:false}];
    component.updateColumns(tableColumns);
    expect(component.tableColumns.length).toEqual(1);
  });

  it('updateFilters() should return', () => {
    expect(component.updateFilters(true)).toBe(true);
  });
})

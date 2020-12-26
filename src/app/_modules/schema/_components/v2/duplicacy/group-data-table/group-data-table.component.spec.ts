import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RequestForGroupList } from '@models/schema/duplicacy';
import { CatalogCheckService } from '@services/home/schema/catalog-check.service';
import { of } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { GroupDataTableComponent } from './group-data-table.component';

describe('GroupDataTableComponent', () => {
  let component: GroupDataTableComponent;
  let fixture: ComponentFixture<GroupDataTableComponent>;
  let catalogService : CatalogCheckService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupDataTableComponent ],
      imports: [AppMaterialModuleForSpec, HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupDataTableComponent);
    component = fixture.componentInstance;

    catalogService = fixture.debugElement.injector.get(CatalogCheckService);
    component.moduleId = '1';
    component.schemaId = '1';
    component.variantId = '0';
    component.runId = '123';

    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit row clicked event', () => {

    spyOn(component.groupChange, 'emit');
    component.rowGroupClicked('1');

    expect(component.groupChange.emit).toHaveBeenCalled();

  });

  it('should get group list data', async(() => {

    const request = new RequestForGroupList();
    request.schemaId = component.schemaId;
    request.plantCode = '0';
    request.runId = component.runId;
    request.page = 0;
    request.size = 20;
    request.responseStatus = component.activeTab;


    spyOn(catalogService, 'getAllGroupIds').withArgs(request)
      .and.returnValue(of([]));

    component.getDuplicacyGroupsList();

    expect(catalogService.getAllGroupIds).toHaveBeenCalledWith(request);
    // expect(component.dataSource.data).toEqual(groups);

  }));

  it('should return all rows selected', () => {
    expect(component.isAllSelected()).toEqual(true);
  });

  it('should return all rows selected', () => {
    expect(component.isAllSelected()).toEqual(true);
  });

  it('should clear selection', () => {
    spyOn(component.selection, 'clear');
    component.masterToggle();
    expect(component.selection.clear).toHaveBeenCalled();
  });

  it('should update groups list on change', () => {

    spyOn(component, 'getDuplicacyGroupsList');

    const changes: SimpleChanges = {schemaId:{currentValue:'schema1', previousValue: '', firstChange:null, isFirstChange:null}};
    component.ngOnChanges(changes)
    expect(component.getDuplicacyGroupsList).toHaveBeenCalled();

  });

});

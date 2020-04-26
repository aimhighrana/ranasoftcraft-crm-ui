import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterComponent } from './filter.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Criteria, DropDownValues, FilterWidget } from '../../../_models/widget';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterComponent ],
      imports:[AppMaterialModuleForSpec,HttpClientTestingModule]
    })
    .compileComponents();
  }));

  it('getFilterMetadata(), get Metadata ', async(()=>{
        component.getFilterMetadata();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('isSelected(), should check option is selected or not',async(() => {
    const filter: Criteria = new Criteria();
    const option: DropDownValues = {CODE: 'ZMRO',FIELDNAME: 'MATL_TYPE'} as DropDownValues;
    component.filterCriteria = [];
    expect(component.isSelected(option)).toEqual(false);
    filter.conditionFieldId = 'MATL_TYPE';
    filter.conditionFieldValue = 'ZMRO';
    component.filterCriteria = [filter];
    expect(component.isSelected(option)).toEqual(true);
  }));

  it('removeOldFilterCriteria(), remove olf filter criteria ', async(()=>{
    const filter: Criteria = new Criteria();
    filter.conditionFieldId = 'MATL_TYPE';
    filter.conditionFieldValue = 'ZMRO';
    component.filterCriteria = [filter];
    component.removeOldFilterCriteria([filter]);
    expect(component.filterCriteria.length).toEqual(0);
  }));

  it('optionClicked(), click on options ', async(()=>{
    component.optionClicked(null, {} as DropDownValues);
  }));

  it('toggleSelection(), toggle selection ', async(()=>{
    component.filterCriteria = [];
    component.filterWidget.next(new FilterWidget());
    component.toggleSelection(null);
  }));

  it('fieldDisplayFn(), should return field desc', async(()=>{
    expect(component.fieldDisplayFn({TEXT:'Matl Desc'})).toEqual('Matl Desc');
  }));
});

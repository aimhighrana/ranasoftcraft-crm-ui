import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UdrConditionOperatorsComponent } from './udr-condition-operators.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SimpleChanges } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

describe('UdrConditionOperatorsComponent', () => {
  let component: UdrConditionOperatorsComponent;
  let fixture: ComponentFixture<UdrConditionOperatorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UdrConditionOperatorsComponent ],
      imports:[
        AppMaterialModuleForSpec,
        HttpClientTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UdrConditionOperatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`ngOnChanges(), while conditional change `, async(()=>{
    const changes: SimpleChanges = {conditionalOperators:{currentValue:['EQUAL','NOT_EQUAL'],firstChange:true,isFirstChange:null,previousValue:undefined}};
    component.ngOnChanges(changes);
    let data ;
    component.conditionalOperatorsOb.subscribe(res=>  data = res);
    expect(data.length).toEqual(2);

  }));

  it('ngOnInit(), test prerequired things', async(()=>{
    component.ngOnInit();
    expect(component.ngOnInit).toBeTruthy();
  }));

  it('operatorSelectionChng(), test operator selection change', async(()=>{
    const option: MatAutocompleteSelectedEvent = {option:{value:'EQUAL'}} as MatAutocompleteSelectedEvent;
    spyOn(component.afterSelect,'emit').withArgs(option.option.value).and.returnValue(null);
    component.operatorSelectionChng(option);

    expect(component.afterSelect.emit).toHaveBeenCalledWith(option.option.value);

  }));

});

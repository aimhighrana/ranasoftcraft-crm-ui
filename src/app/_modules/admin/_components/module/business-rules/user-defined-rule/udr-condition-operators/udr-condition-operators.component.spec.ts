import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UdrConditionOperatorsComponent } from './udr-condition-operators.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SimpleChanges } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { SharedModule } from '@modules/shared/shared.module';

describe('UdrConditionOperatorsComponent', () => {
  let component: UdrConditionOperatorsComponent;
  let fixture: ComponentFixture<UdrConditionOperatorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UdrConditionOperatorsComponent ],
      imports:[
        AppMaterialModuleForSpec,
        HttpClientTestingModule,
        SharedModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UdrConditionOperatorsComponent);
    component = fixture.componentInstance;
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

    const changes1: SimpleChanges = {conditionalOperators:{currentValue:'NOT_EQUAL',firstChange:true,isFirstChange:null,previousValue:'NOT_EQUAL'}};
    component.ngOnChanges(changes1);
    expect(changes1.conditionalOperators.currentValue.length).toEqual(9);
  }));

  it('ngOnInit(), test prerequired things', async(()=>{
    component.selecetedOperator ='RANGE';
    component.conditionalOperators = [{desc:'Common Operator', childs:['RANGE']}];
    component.ngOnInit();
    expect(component.operator.value).toEqual('RANGE');

    component.conditionalOperators = [{desc:'Common Operator', childs:['EQUAL']}];
    component.ngOnInit();
    expect(component.operator.value).toEqual('RANGE');

    component.selecetedOperator = '';
    component.ngOnInit();
    expect(component.operator.value).toEqual('RANGE');
  }));

  it('operatorSelectionChng(), test operator selection change', async(()=>{
    const option: MatAutocompleteSelectedEvent = {option:{value:'EQUAL'}} as MatAutocompleteSelectedEvent;
    spyOn(component.afterSelect,'emit').withArgs(option.option.value).and.returnValue(null);
    component.operatorSelectionChng(option);

    expect(component.afterSelect.emit).toHaveBeenCalledWith(option.option.value);

    const option1 = null;
    component.operatorSelectionChng(option1);
    expect(component.operatorSelectionChng(option1)).toBeUndefined();
  }));

});

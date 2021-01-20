import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@modules/shared/shared.module';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { ExclusionsSidesheetComponent } from './exclusions-sidesheet.component';

describe('ExclusionsSidesheetComponent', () => {
  let component: ExclusionsSidesheetComponent;
  let fixture: ComponentFixture<ExclusionsSidesheetComponent>;
  let formBuilder : FormBuilder;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExclusionsSidesheetComponent ],
      imports: [ RouterTestingModule, AppMaterialModuleForSpec, SharedModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExclusionsSidesheetComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();

    formBuilder = fixture.debugElement.injector.get(FormBuilder);

    component.synonymsForm = formBuilder.group({
      synonymsArray: formBuilder.array([])
    });

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init component forms', () => {

    const data = {fId:'1',ival:'w1,w2', sval:'customer:client'}

    component.initExclusionData(data);

    expect(component.fId).toEqual('1');
    expect(component.exclusionControl.value).toEqual('w1\nw2');
    expect(component.synonymsArray.length).toEqual(1);
    expect(component.synonymsArray.value[0].text).toEqual('customer client');

    // No exclusion
    data.ival = '';
    component.initExclusionData(data);
    expect(component.exclusionControl.value).toEqual('');

    // No synonyms
    component.synonymsForm = formBuilder.group({
      synonymsArray: formBuilder.array([])
    });
    data.sval = '';
    component.initExclusionData(data);
    expect(component.synonymsArray.length).toEqual(0);


  });

  it('should add synonym group', () => {

    component.editText = 'customer\nsupplier'

    component.addSynonymGroup();
    expect(component.synonymsArray.length).toEqual(1);
    expect(component.synonymsArray.value[0].text).toEqual('customer supplier');
    expect(component.synonymsArray.value[0].editActive).toEqual(false);

    /* component.removeSynonymGroup(0);
    expect(component.synonymsArray.length).toEqual(0); */
  });

  it('should enable edition for a synonym group', () => {

    const data = {fId:'1',ival:'w1,w2', sval:'customer:client'} ;
    component.initExclusionData(data);

    component.editSynonymGroup(0);
    expect(component.synonymsArray.value[0].editActive).toEqual(true);
    // expect(component.synonymsArray.value[0].text).toEqual('customer\nclient');

    component.saveSynonymGroup(0, 'customer\nclient');
    expect(component.synonymsArray.value[0].editActive).toEqual(false);
    expect(component.synonymsArray.value[0].text).toEqual('customer client');


  });

  it('should concat exclusion lines', () => {
    expect(component.concatStringLines('w1\nw2')).toEqual('w1 w2');
  })

  it('should split exclusion lines', () => {
    expect(component.splitStringLines('w1 w2')).toEqual('w1\nw2');
  })

  it('should search inside synonym groups', () => {

    const data = {fId:'1',ival:'w1,w2', sval:'customer:client'} ;
    component.initExclusionData(data);

    component.searchWords('customer');
    expect(component.synonymsArray.value[0].visible).toEqual(true);

    component.searchWords('supplier');
    expect(component.synonymsArray.value[0].visible).toEqual(false);

    component.searchWords('');
    expect(component.synonymsArray.value[0].visible).toEqual(true);


  });

  it('should update hover state for a synonym group', () => {

    const data = {fId:'1',ival:'w1,w2', sval:'customer:client'} ;
    component.initExclusionData(data);

    component.groupHover(0);
    expect(component.synonymsArray.value[0].hover).toEqual(true);

    component.groupLeave(0);
    expect(component.synonymsArray.value[0].hover).toEqual(false);


  });

  it('should enable group creation', () => {

    component.enableGroupCreation();
    expect(component.newGroupActive).toEqual(true);


  });

});

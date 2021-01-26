import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { NounModifier } from '@models/schema/noun-modifier';
import { Userdetails } from '@models/userdetails';
import { NounModifierService } from '@services/home/schema/noun-modifier.service';
import { UserService } from '@services/user/userservice.service';
import { of } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { ClassificationDatatableCellEditableComponent } from './classification-datatable-cell-editable.component';

describe('ClassificationDatatableCellEditableComponent', () => {
  let component: ClassificationDatatableCellEditableComponent;
  let fixture: ComponentFixture<ClassificationDatatableCellEditableComponent>;
  let nounModifierService: NounModifierService;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassificationDatatableCellEditableComponent ],
      imports:[HttpClientTestingModule, AppMaterialModuleForSpec]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassificationDatatableCellEditableComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();

    nounModifierService = fixture.debugElement.injector.get(NounModifierService);
    userService = fixture.debugElement.injector.get(UserService);
    spyOn(userService, 'getUserDetails').and.returnValue(of({plantCode: '1005'} as Userdetails));

    component.schemaId = 'schema1';
    component.rundId = 'run1';
    component.objectNumber = '1701';
    component.brType = 'unmatched'
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should get suggested nouns', async(() => {

    component.fieldId = 'NOUN_CODE';

    const apiResponse = [
      {NOUN_CODE: 'Bearing', NOUN_LONG: 'Bearing'}
    ] as NounModifier[];

    spyOn(nounModifierService, 'getSuggestedNouns').withArgs(component.schemaId, component.rundId, component.objectNumber, component.brType, '')
      .and.returnValue(of(apiResponse));

    component.getSuggestedNouns('');

    expect(component.selectFieldOptions.length).toEqual(1);
    expect(component.selectFieldOptions[0].CODE).toEqual('Bearing');


  }));


  it('should get suggested modifiers', async(() => {

    component.fieldId = 'MODE_CODE';
    component.nounCode = 'Bearing';

    const apiResponse = [
      {MODE_CODE: 'Ball', MOD_LONG: 'Ball'}
    ] as NounModifier[];

    spyOn(nounModifierService, 'getSuggestedModifiers').withArgs(component.schemaId, component.rundId, component.objectNumber, component.brType, component.nounCode, '')
      .and.returnValue(of(apiResponse));

    component.getSuggestedModifiers('');

    expect(component.selectFieldOptions.length).toEqual(1);
    expect(component.selectFieldOptions[0].CODE).toEqual('Ball');

  }));

  it('should get local nouns', fakeAsync(() => {

    component.fieldId = 'NOUN_CODE';

    const apiResponse = [
      {NOUN_CODE: 'Bearing', NOUN_LONG: 'Bearing'}
    ] as NounModifier[];

    spyOn(nounModifierService, 'getLocalNouns').withArgs('1005', '', '', '')
      .and.returnValue(of(apiResponse));

    component.getLocalNouns('');

    tick(100);

    expect(component.selectFieldOptions.length).toEqual(1);
    expect(component.selectFieldOptions[0].CODE).toEqual('Bearing');

  }));

  it('should get local modifiers', fakeAsync(() => {

    component.fieldId = 'MODE_CODE';
    component.nounCode = 'Bearing';

    const apiResponse = [
      {MODE_CODE: 'Ball', MOD_LONG: 'Ball'}
    ] as NounModifier[];

    spyOn(nounModifierService, 'getLocalModifier').withArgs('1005', component.nounCode, '')
      .and.returnValue(of(apiResponse));

    component.getLocalModifiers('');
    tick(100);

    expect(component.selectFieldOptions.length).toEqual(1);
    expect(component.selectFieldOptions[0].CODE).toEqual('Ball');

  }));

  it('should emit value change event', () => {

    const event = {
      option: {
        value: 'India'
      }
    } as MatAutocompleteSelectedEvent;

    spyOn(component.inputBlur, 'emit');
    component.emitChngSelectValue(event);
    expect(component.inputBlur.emit).toHaveBeenCalledWith('India');
  });

  it('should emit input blur event', () => {
    spyOn(component.inputBlur, 'emit');
    component.emitInputBlur('India');
    expect(component.inputBlur.emit).toHaveBeenCalledWith('India');
  });

});

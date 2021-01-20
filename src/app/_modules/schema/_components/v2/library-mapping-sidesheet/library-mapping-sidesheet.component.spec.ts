import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AttributesDoc, NounModifier } from '@models/schema/noun-modifier';
import { SharedModule } from '@modules/shared/shared.module';
import { NounModifierService } from '@services/home/schema/noun-modifier.service';
import { of } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { LibraryMappingSidesheetComponent } from './library-mapping-sidesheet.component';
import { NounModifierAutocompleteComponent } from './noun-modifier-autocomplete/noun-modifier-autocomplete.component';

describe('LibraryMappingSidesheetComponent', () => {
  let component: LibraryMappingSidesheetComponent;
  let fixture: ComponentFixture<LibraryMappingSidesheetComponent>;
  let nounModifierService: NounModifierService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibraryMappingSidesheetComponent, NounModifierAutocompleteComponent ],
      imports: [ AppMaterialModuleForSpec, RouterTestingModule, HttpClientTestingModule, SharedModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryMappingSidesheetComponent);
    component = fixture.componentInstance;

    nounModifierService = fixture.debugElement.injector.get(NounModifierService);

    component.moduleId = 'module';

    component.libraryNounCode = 'Bearing';
    component.libraryModifierCode = 'Ball';

    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build mapping form', () => {

    component.buildMappingForm();
    expect(component.mappingForm.value.libraryNounCode).toEqual(component.libraryNounCode);
    expect(component.mappingForm.value.libraryModCode).toEqual(component.libraryModifierCode);

  });

  it('should get local nouns list', () => {

    const result = [
      {NOUN_LONG: 'Bearing', NOUN_CODE: 'Bearing',  NOUN_ID: '17021', MODE_CODE: 'Ball'} as NounModifier
    ]

    spyOn(nounModifierService, 'getLocalNouns').withArgs('0').and.returnValue(of(result));

    component.getLocalNouns();

    expect(nounModifierService.getLocalNouns).toHaveBeenCalledWith('0');
    expect(component.localNounsList).toEqual(result);
  });


  it('should get local modifiers list', () => {

    const result = [
      {MODE_CODE: 'Ball', MOD_LONG: 'Ball'} as NounModifier
    ]

    spyOn(nounModifierService, 'getLocalModifier').withArgs('0', 'Bearing').and.returnValue(of(result));

    component.getLocalModifiers('Bearing');

    expect(nounModifierService.getLocalModifier).toHaveBeenCalledWith('0', 'Bearing');
    expect(component.LocalModifiersList).toEqual(result);
  });

  it('should get local attributes list', () => {

    const result = [
      {ATTR_DESC: 'length',  ATTR_CODE: 'length'} as AttributesDoc
    ]

    spyOn(nounModifierService, 'getLocalAttribute').withArgs('Bearing', 'Ball','0').and.returnValue(of(result));

    component.getLocalAttributes('Bearing', 'Ball');

    expect(nounModifierService.getLocalAttribute).toHaveBeenCalledWith('Bearing', 'Ball', '0');
    expect(component.LocalAttributesList).toEqual(result);
  });

  it('should get already saved mapping', () => {

    const result = {
      libraryNounCode: 'Bearing',
      localNounCode: 'Bearing',
      libraryModCode: 'Ball',
      localModCode: 'Ball',
      attributeMapData: [{libraryAttributeCode: 'Length', localAttributeCode: 'Length'}]
    }

    component.buildMappingForm();

    spyOn(nounModifierService, 'getAttributesMapping').withArgs('Bearing', 'Ball').and.returnValue(of(result));

    component.getAttributesMapping();

    expect(nounModifierService.getAttributesMapping).toHaveBeenCalledWith('Bearing', 'Ball');
    expect(component.mappingForm.value.localNounCode).toEqual(result.localNounCode);
    expect(component.mappingForm.value.localModCode).toEqual(result.localModCode);
    // expect(component.LocalAttributesList).toEqual(result);
  });

  it('should openNounSidesheet', () => {
    spyOn(router, 'navigate');
    component.openNounSidesheet();
    expect(router.navigate).toHaveBeenCalledWith(['', { outlets: { outer: `outer/schema/noun/module/${component.mgroup}` } }])
  });


  it('close sidesheet', () => {
    spyOn(router, 'navigate');
    component.close();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: null } }])
  });

});

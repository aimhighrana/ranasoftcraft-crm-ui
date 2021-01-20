import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@modules/shared/shared.module';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { NounModifierAutocompleteComponent } from './noun-modifier-autocomplete.component';

describe('NounModifierAutocompleteComponent', () => {
  let component: NounModifierAutocompleteComponent;
  let fixture: ComponentFixture<NounModifierAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NounModifierAutocompleteComponent ],
      imports:[
        AppMaterialModuleForSpec,
        HttpClientTestingModule,
        SharedModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NounModifierAutocompleteComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

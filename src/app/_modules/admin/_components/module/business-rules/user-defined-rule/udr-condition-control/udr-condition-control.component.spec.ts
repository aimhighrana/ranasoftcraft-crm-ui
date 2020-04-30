import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UdrConditionControlComponent } from './udr-condition-control.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { UDRBlocksModel } from '../../business-rules.modal';

describe('UdrConditionControlComponent', () => {
  let component: UdrConditionControlComponent;
  let fixture: ComponentFixture<UdrConditionControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UdrConditionControlComponent ],
      imports:[
        AppMaterialModuleForSpec, HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule, FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UdrConditionControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit(), test prerequid ', async(()=>{
      component.ngOnInit();
  }));

  it('optionSelected(), after option selection', async(()=>{
    // mock data
    const event = {option:{value:new UDRBlocksModel()}} as MatAutocompleteSelectedEvent;

    component.optionSelected(event);

    expect(component.selectedBlocks.length).toEqual(1);
  }));

  it('remove(), shuld remove ', async(()=>{
      const bock: UDRBlocksModel = new UDRBlocksModel();
      bock.id = '386472357';

      component.selectedBlocks = [bock];

      component.remove(bock);

      expect(component.selectedBlocks.length).toEqual(0);

  }));

  it('ngOnChanges(), should check on change', async(()=>{
    const changes: import('@angular/core').SimpleChanges = {selectedBlocks:{currentValue: new UDRBlocksModel(),firstChange:null,isFirstChange:null,previousValue: new UDRBlocksModel()}};

    component.ngOnChanges(changes);
    expect(component.selectedBlocks.length).toEqual(undefined);
  }));
});

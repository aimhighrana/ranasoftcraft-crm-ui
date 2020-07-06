import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapMdoFieldComponent } from './map-mdo-field.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { MetadataModel } from '@models/schema/schemadetailstable';

describe('MapMdoFieldComponent', () => {
  let component: MapMdoFieldComponent;
  let fixture: ComponentFixture<MapMdoFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapMdoFieldComponent ],
      imports:[ AppMaterialModuleForSpec]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapMdoFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit(),', async(() => {
      component.preSelectedFld = 'MATL_GROUP';
      component.mdoFields = [{fieldId:'MATL_GROUP', fieldDescri:'Material Group'} as MetadataModel,{fieldId:'object', fieldDescri:'Module Object Number'} as MetadataModel ];
      component.ngOnInit();
      expect(component.ngOnInit).toBeTruthy();
      component.preSelectedFld = '';
      component.mdoFields = [{fieldId:'MATL_GROUP', fieldDescri:'Material Group'} as MetadataModel,{fieldId:'object', fieldDescri:'Module Object Number'} as MetadataModel ];
      component.ngOnInit();
      expect(component.ngOnInit).toBeTruthy();
  }));

  it('suggestedMdoFldTrkBy(), trackby for suggested field', async(() => {
    expect(component.suggestedMdoFldTrkBy({fieldId:'test'})).toEqual('test');
    expect(component.suggestedMdoFldTrkBy(null)).toEqual(null);
  }));

  it('mdoFieldDisplayWith(), display with for module ', async(() => {
    expect(component.mdoFieldDisplayWith({fieldDescri:'Material'})).toEqual('Material');
    expect(component.mdoFieldDisplayWith(null)).toEqual('');
  }));

  it('emitOptionSelected(), emit the selected fld value', async(() => {
    component.emitOptionSelected({option:null});
    const sel = {option:{value:{fieldId:'MATL_GROUP'}}}
    component.emitOptionSelected(sel);
    expect(component.emitOptionSelected).toBeTruthy();
  }));
});

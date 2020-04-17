import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapMdoFieldComponent } from './map-mdo-field.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

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
      component.ngOnInit();
  }));

  it('suggestedMdoFldTrkBy(), trackby for suggested field', async(() => {
    expect(component.suggestedMdoFldTrkBy({fieldId:'test'})).toEqual('test');
  }));

  it('mdoFieldDisplayWith(), display with for module ', async(() => {
    expect(component.mdoFieldDisplayWith({fieldDescri:'Material'})).toEqual('Material');
  }));

  it('emitOptionSelected(), emit the selected fld value', async(() => {
    component.emitOptionSelected({option:null});
  }));


});

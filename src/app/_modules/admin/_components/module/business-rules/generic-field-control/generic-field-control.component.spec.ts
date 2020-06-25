import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericFieldControlComponent } from './generic-field-control.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { MetadataModel, Heirarchy } from '@models/schema/schemadetailstable';
import { of } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Metadata } from '@modules/report/edit/container/metadatafield-control/metadatafield-control.component';

describe('GenericFieldControlComponent', () => {
  let component: GenericFieldControlComponent;
  let fixture: ComponentFixture<GenericFieldControlComponent>;
  let schemaDetailsService: SchemaDetailsService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericFieldControlComponent ],
      imports:[
        AppMaterialModuleForSpec,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericFieldControlComponent);
    component = fixture.componentInstance;
    schemaDetailsService = fixture.debugElement.injector.get(SchemaDetailsService);
    fixture.detectChanges();

  });

  // mock data
  const header = {
    MATL_GROUP:{fieldId:'MATL_GROUP', fieldDescri:'Material Group'} as MetadataModel,
    MATL_TYPE:{fieldId:'MATL_TYPE', fieldDescri:'Material Type'} as MetadataModel
  }
  const grid = {
    LANGUAGE_GRID:{fieldId:'LANGUAGE_GRID', fieldDescri:'Language Grid'} as MetadataModel,
  }

  const gridFields = {
    LANGUAGE_GRID:{
      LANGUAGE:{fieldId:'LANGUAGE', fieldDescri:'Language Code'} as MetadataModel,
      DESC:{fieldId:'DESC', fieldDescri:'Description'} as MetadataModel
    }
  }
  const hierarchy = [];
  const h1 = new Heirarchy();
  h1.heirarchyId = '1';
  h1.heirarchyText = 'Plant';

  const h2 = new Heirarchy();
  h2.heirarchyId = '4';
  h2.heirarchyText = 'Valuation';
  hierarchy.push(h1); hierarchy.push(h2);

  const hierarchyFields = {
    1:{
      PLANT:{fieldId:'PLANT', fieldDescri:'Plant'} as MetadataModel
    },
    4:{
      VALUATION_TYPE:{fieldId:'VALUATION_TYPE', fieldDescri:'Valuation type'} as MetadataModel
    }
  }

  const metadataModeleResponse = {headers: header, grids: grid, gridFields, hierarchy, hierarchyFields};

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit(), should assign pre required ', async(()=>{


    component.ngOnInit();
  }));

  it('getFields(), should get all fields by module id', async(()=>{
    // mock data
    component.moduleId = '1005';

    spyOn(schemaDetailsService, 'getMetadataFields').withArgs(component.moduleId).and.returnValue(of(metadataModeleResponse));
    component.selectedFldId = ['MATL_TYPE'];
    component.getFields();

    expect(schemaDetailsService.getMetadataFields).toHaveBeenCalledWith(component.moduleId);

  }));

  it('selected(), while select dropdown data ', async(()=>{
    const option: Metadata[] = [
      {
        childs:[],
        fieldId:'MATL_TYPE',
        fieldDescri:'Material Type',
        isGroup:false
      }
    ];

    const selected:MatAutocompleteSelectedEvent = {option:{value:option[0]}} as MatAutocompleteSelectedEvent;

    component.selected(selected);

    expect(component.preSelectedCtrl.length).toEqual(1);
    expect(component.preSelectedCtrl[0]).toEqual(option[0]);

    component.isMultiSelection  = true;
    component.preSelectedCtrl = option;

    component.selected(selected);

    expect(component.preSelectedCtrl.length).toEqual(0);

  }));

  it('remove(), should remove particular selected item', async(()=>{
    const option =
      {
        childs:[],
        fieldId:'MATL_TYPE',
        fieldDescri:'Material Type',
        isGroup:false
      };

      component.preSelectedCtrl = [option];

      component.remove(option);

      expect(component.preSelectedCtrl.length).toEqual(0);

  }));

});

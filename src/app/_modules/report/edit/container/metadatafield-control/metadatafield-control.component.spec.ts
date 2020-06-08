import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadatafieldControlComponent, Metadata } from './metadatafield-control.component';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { MetadataModel, Heirarchy } from '@models/schema/schemadetailstable';
import { of } from 'rxjs';

describe('MetadatafieldControlComponent', () => {
  let component: MetadatafieldControlComponent;
  let fixture: ComponentFixture<MetadatafieldControlComponent>;
  let schemaDetailsService: jasmine.SpyObj<SchemaDetailsService>;
  beforeEach(async(() => {
    const schemaDetailsServiceSp = jasmine.createSpyObj(SchemaDetailsService,['getMetadataFields']);
    TestBed.configureTestingModule({
      declarations: [ MetadatafieldControlComponent ],
      imports:[AppMaterialModuleForSpec],
      providers:[
        {provide: SchemaDetailsService, userValue: schemaDetailsServiceSp}
      ]
    })
    .compileComponents();
    schemaDetailsService = TestBed.inject(SchemaDetailsService) as jasmine.SpyObj<SchemaDetailsService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadatafieldControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  it(`getFields(), should return all field belong to object / module`, async(()=>{
    // mock data
    component.moduleId = '1005';

    // call actual component method
    spyOn(schemaDetailsService,'getMetadataFields').withArgs(component.moduleId).and.returnValue(of(metadataModeleResponse));
    component.getFields();

    // veriry & asserts
    expect(schemaDetailsService.getMetadataFields).toHaveBeenCalledWith(component.moduleId);
  }));

  it(`transformFieldRes(), help to transform metadata field with groups & autocomplete search`, async(()=>{
    // call actual method
    const actualResonse =  component.transformFieldRes(metadataModeleResponse);

    // asserts
    expect(actualResonse.length).toEqual(5, 'length should be equlas to 5 including groups');
    expect(actualResonse[0].childs.length).toEqual(4, '4 static system fields');

    const grd = actualResonse.filter(fil=> fil.fieldId === 'LANGUAGE_GRID');
    expect(grd.length).toEqual(1, 'Grid shoud have on dropdown part');
    expect(grd[0].childs.length).toEqual(2, '2 fields assigned on grid LANGUAGE_GRID');

    const hie = actualResonse.filter(fil=> fil.fieldId === '1');
    expect(hie.length).toEqual(1, 'Plant group shoud have on dropdown part');
    expect(hie[0].childs.length).toEqual(1, '1 fields assigned on plant 1');

  }));

  it(`returnSelectedFldCtrl(), should return selected field control`, async(()=>{
    // mock data
    const fieldId  ='MATL_TYPE';
    const fields = component.transformFieldRes(metadataModeleResponse);
    component.fields = fields;

    // call actual componenet function
    let actualRes =  component.returnSelectedFldCtrl(fieldId);
    expect(actualRes.fieldId).toEqual(fieldId,`When return data then field id should equals ${fieldId}`);

    // call with unknown fields
    actualRes =  component.returnSelectedFldCtrl('TEST0001');
    expect(actualRes).toBe(undefined,`When call with uknown field  should equals undefined !`);


  }));

  it('ngOnInit(), load prereuired ', async(()=>{
    component.ngOnInit();

  }));

  it('displayFn(), help for display fieldDescription on dropdown ', async(()=>{
    // mock data
    const obj = {} as Metadata;
    obj.fieldId = 'MATL_TYPE';
    obj.fieldDescri = 'Material Type';

    // call actual function
    const actualRes = component.displayFn(obj);

    expect(actualRes).toEqual(obj.fieldDescri);
  }));

});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddFilterMenuComponent } from './add-filter-menu.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { FilterValuesComponent } from '../filter-values/filter-values.component';
import { SearchInputComponent } from '../search-input/search-input.component';
import { of } from 'rxjs';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { FilterCriteria, MetadataModel } from '@models/schema/schemadetailstable';
import { SchemaService } from '@services/home/schema.service';
import { DropDownValue } from '@modules/admin/_components/module/business-rules/business-rules.modal';

describe('AddFilterMenuComponent', () => {
  let component: AddFilterMenuComponent;
  let fixture: ComponentFixture<AddFilterMenuComponent>;
  let schemaDetailService: jasmine.SpyObj<SchemaDetailsService>;
  let schemaService: jasmine.SpyObj<SchemaService>;

  beforeEach(async(() => {
    const spyObj = jasmine.createSpyObj('SchemaService', ['dropDownValues', 'generateColumnByFieldId']);
    TestBed.configureTestingModule({
      declarations: [ AddFilterMenuComponent, FilterValuesComponent, SearchInputComponent ],
      imports: [AppMaterialModuleForSpec],
      providers: [SchemaDetailsService,
        { provide: SchemaService, useValue: spyObj }]
    })
    .compileComponents();
    schemaDetailService = TestBed.inject(SchemaDetailsService) as jasmine.SpyObj<SchemaDetailsService>;
    schemaService = TestBed.inject(SchemaService) as jasmine.SpyObj<SchemaService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFilterMenuComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`initMetadata(), should add field values to metadata dropdown`, async(() => {
    const data = ['testData1', 'testData2', 'testData3'];
    component.initMetadata(data);
    expect(component.metadaDrop.length).toEqual(3);
    expect(component.selectedValues.length).toEqual(0);
    expect(component.activateElement).toEqual(null);
    expect(component.searchDrop.length).toEqual(3);
  }));

  it(`getFldMetadata(), `, async(() => {
    const response = {
      headers: '',
      grids: '',
      hierarchy: [],
      gridFields: '',
      hierarchyFields: []
  };
  spyOn(schemaDetailService, 'getMetadataFields').and.returnValue(of(response));
  component.getFldMetadata();
  expect(schemaDetailService.getMetadataFields).toHaveBeenCalled();
  }));

  it(`searchField(), search metadat fields according to the search field`, async(() => {
    component.searchDrop = [
      {fieldDescri:'Function Location 1', fieldId:'EQEX_FL1'} as MetadataModel,
      {fieldDescri:'Function Location 2', fieldId:'EQEX_FL2'} as MetadataModel,
      {fieldId: 'EQEX_SEQ2', fieldDescri: 'Equipment 2'} as MetadataModel
    ]
    const searchvalue = 'fun'
    component.searchField(searchvalue);
    expect(component.metadaDrop.length).toEqual(2);

    const searchvalue1 = ''
    component.searchField(searchvalue1);
    expect(component.metadaDrop.length).toEqual(3);

    const searchvalue2 = 'val'
    component.searchField(searchvalue2);
    expect(component.metadaDrop.length).toEqual(0);
  }));

  it(`dropDownValues(), get business rules service`, async(() => {
    const returnData: DropDownValue[] = [];
    schemaService.dropDownValues.and.returnValue(of(returnData));
    component.getDropdownValues('testId', '');
    expect(schemaService.dropDownValues).toHaveBeenCalled();
  }));

  it('ctrlFlds(), should get fields according to field id', async() => {
    const fld = {
      fieldId: 'APPROVAR_ID'
    } as MetadataModel

    component.moduleId = '10054';
    component.alreadySelectedValues = [
      {
        fieldId: 'APPROVAR_ID',
        values: ['AshishKr', 'SRana']
      },
      {
        fieldId: 'MATL_TYPE',
        values: ['SIL', 'GOL']
      }
    ] as FilterCriteria[]

    component.ctrlFlds(fld);
    expect(component.dropValuesCode.length).toEqual(2);

    component.moduleId = '';
    component.ctrlFlds(fld);
    expect(schemaService.generateColumnByFieldId).toHaveBeenCalled();

  })

});

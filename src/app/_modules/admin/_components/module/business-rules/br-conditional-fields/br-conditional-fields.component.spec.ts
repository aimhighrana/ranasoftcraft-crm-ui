import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrConditionalFieldsComponent } from './br-conditional-fields.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { MetadataModeleResponse, Heirarchy } from '@models/schema/schemadetailstable';
import { of } from 'rxjs';

describe('BrConditionalFieldsComponent', () => {
  let component: BrConditionalFieldsComponent;
  let fixture: ComponentFixture<BrConditionalFieldsComponent>;
  let schemaDetailsService: SchemaDetailsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrConditionalFieldsComponent ],
      imports:[
        HttpClientTestingModule, AppMaterialModuleForSpec, ReactiveFormsModule, FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrConditionalFieldsComponent);
    component = fixture.componentInstance;
    schemaDetailsService = fixture.debugElement.injector.get(SchemaDetailsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getAllFields()(), get all field of module', async(()=>{
    component.moduleId = '1005';

    spyOn(schemaDetailsService, 'getMetadataFields').withArgs(component.moduleId).and.returnValue(of({} as MetadataModeleResponse));

    component.getAllFields();

    expect(schemaDetailsService.getMetadataFields).toHaveBeenCalledWith(component.moduleId);
  }));

  it('makeConditionalFields(), make field selectable', async(()=>{
    const response: MetadataModeleResponse = {
      headers:{
        MATL_TYPE:{
          fieldId:'MATL_TYPE'
        }
      },
      grids:{
        LANGUAGE_GRID:{
          fieldId:'LANGUAGE_GRID'
        }
      },
      gridFields:{
        LANGUAGE_GRID:{
          LANGUAGE:{
            fieldId:'LANGUAGE'
          }
        }
      },
      hierarchy:[
        {heirarchyId:'1', heirarchyText:'Plant'} as Heirarchy
      ],
      hierarchyFields:{
        1:{
          PLANT:{
            fieldId:'PLANT'
          }
        }
      }
    };

    // call actual method
    component.makeConditionalFields(response);
    expect(component.fields.length).toEqual(3);
    expect(component.fields[0].fields.length).toEqual(1);
    expect(component.fields[1].fields.length).toEqual(1);
    expect(component.fields[2].fields.length).toEqual(1);

  }));

  it('autoCompleteSearch(), make searchable field', async(()=>{

    // mock data
    component.fields = [
      {fieldId:'header', fieldDescription:'Header Fields',fields:[]}
    ];
    component.autoCompleteSearch('header');

  }));
});
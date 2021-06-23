import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UDRValueControlComponent } from './udr-value-control.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { of, throwError } from 'rxjs';
import { SharedModule } from '@modules/shared/shared.module';

describe('UDRValueControlComponent', () => {
  let component: UDRValueControlComponent;
  let fixture: ComponentFixture<UDRValueControlComponent>;
  let schemaDetailsService: SchemaDetailsService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UDRValueControlComponent],
      imports: [
        AppMaterialModuleForSpec,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UDRValueControlComponent);
    component = fixture.componentInstance;
    schemaDetailsService = fixture.debugElement.injector.get(SchemaDetailsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('ngOnInit(), should assign pre required ', async(() => {
    component.ngOnInit();
    expect(component.ngOnInit).toBeTruthy();
  }));
  it('ngOnDestroy(), should destroy the component ', async(() => {
    component.ngOnDestroy();
    expect(component.ngOnDestroy).toBeTruthy();
  }));

  it('ngOnChanges(), should call reset when reset filter', async(() => {
    // mock data
    component.value = '';
    const chnages1: import('@angular/core').SimpleChanges = { fieldId: { currentValue: '1005', previousValue: false, firstChange: true, isFirstChange: null }, value: { currentValue: '1005', previousValue: false, firstChange: true, isFirstChange: null } };
    const chnages2: import('@angular/core').SimpleChanges = { metataData: { currentValue: {}, previousValue: false, firstChange: true, isFirstChange: null } };
    const chnages3: import('@angular/core').SimpleChanges = { value: { currentValue: null, previousValue: false, firstChange: true, isFirstChange: null } };
    component.ngOnChanges(chnages1);
    component.ngOnChanges(chnages2);
    component.ngOnChanges(chnages3);
    expect(component.ngOnChanges).toBeTruthy();
  }));

  it('loadDropdownValues() should load all dropdown values', async(() => {
    const schemaSpy = spyOn(schemaDetailsService, 'getUDRDropdownValues').and.returnValue(of([{} as any]));
    component.fieldId = 'TEST_FIELD';
    component.metataData = {
      gridFields: {},
      headers: {
        TEST_FIELD: {
          picklist: '1'
        }
      },
      hierarchy: [],
      hierarchyFields: {},
      grids: []
    }

    component.loadUDRValueControl();
    expect(component.fieldList.length).toBe(1);
    schemaSpy.and.returnValue(throwError({ message: 'error' }));
    component.loadUDRValueControl();
    expect(component.fieldList.length).toBe(0);
  }));

  it('parseMetadata() should parse correct meta data', async(() => {
    component.metataData = {
      gridFields: {},
      headers: {
        TEST_FIELD: {
          picklist: '1',
          ANOTHER_FIELD: {
            picklist: '2'
          }
        }
      },
      hierarchy: [],
      hierarchyFields: {},
      grids: []
    };
    expect(component.parseMetadata('TEST_FIELD')).toBeTruthy();
    expect(component.parseMetadata('ANOTHER_FIELD')).toBeTruthy();
    expect(component.parseMetadata('NEW_FIELD')).toBeNull();
  }));

  it('selected() should update selected value', async(() => {
    const event = {
      option: {
        viewValue: 'test'
      }
    }
    component.selected(event);
    expect(component.searchStr).toEqual('test');
  }));

  it('displayControl() should have updated value', async(() => {
    component.selectedMetaData = {
      picklist: '0',
      dataType: 'CHAR'
    };
    expect(component.displayControl).toEqual('text');
    component.selectedMetaData = {
      picklist: '22',
      dataType: 'CHAR'
    };
    expect(component.displayControl).toEqual('text');
    component.selectedMetaData = {
      picklist: '0',
      dataType: 'NUMC'
    };
    expect(component.displayControl).toEqual('number');
    component.selectedMetaData = {
      picklist: '2',
      dataType: 'CHAR'
    };
    expect(component.displayControl).toEqual('checkbox');
    component.selectedMetaData = {
      picklist: '4',
      dataType: 'CHAR'
    };
    expect(component.displayControl).toEqual('radio');
    component.selectedMetaData = {
      picklist: '35',
      dataType: ''
    };
    expect(component.displayControl).toEqual('radio');
  }));

  it('dateValue() should have updated date value', async(() => {
    component.value = undefined;
    expect(component.dateValue).toBeNull();
    component.value = '2021-01-01';
    expect(component.dateValue).toBeTruthy()
  }));

  it('dateChanged() should update selected value', async(() => {
    const event = new Date('2021-01-01');
    component.dateChanged(event);
    expect(component.searchStr).toEqual(event.toString());
  }));
  it('checkboxChanged() should update selected value', async(() => {
    const event = true;
    component.checkboxChanged(event);
    expect(component.checkboxChanged).toBeTruthy();
  }));
});

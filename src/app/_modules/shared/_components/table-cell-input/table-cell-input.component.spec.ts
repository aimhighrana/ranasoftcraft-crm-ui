import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DropDownValue } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SchemaService } from '@services/home/schema.service';
import { of } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { TableCellInputComponent } from './table-cell-input.component';

describe('TableCellInputComponent', () => {
  let component: TableCellInputComponent;
  let fixture: ComponentFixture<TableCellInputComponent>;
  let schemaService: SchemaService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TableCellInputComponent],
      imports: [HttpClientTestingModule, AppMaterialModuleForSpec ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableCellInputComponent);
    component = fixture.componentInstance;

    schemaService = fixture.debugElement.injector.get(SchemaService);
    component.fieldId = 'region';
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit input blur event', () => {

    spyOn(component.inputBlur, 'emit');
    component.emitInputBlur('value');
    expect(component.inputBlur.emit).toHaveBeenCalled();

  });

  it('should dropdown values', async(() => {

    const values = [
      { CODE: '1', TEXT: 'Tunisia' } as DropDownValue,
      { CODE: '2', TEXT: 'India' } as DropDownValue
    ];

    spyOn(schemaService, 'dropDownValues').withArgs(component.fieldId, '')
      .and.returnValue(of(values));

    component.prepareDropdownOptions();

    expect(schemaService.dropDownValues).toHaveBeenCalledWith(component.fieldId, '');
    expect(component.selectFieldOptions).toEqual(values);

  }));

  it('should filter dropdown options', () => {

    component.selectFieldOptions = [
      { CODE: '1', TEXT: 'Tunisia' } as DropDownValue,
      { CODE: '2', TEXT: 'India' } as DropDownValue
    ];

    const result  = component.filterSelectFieldOptions('Tu');
    expect(result.length).toEqual(1);
  })
});

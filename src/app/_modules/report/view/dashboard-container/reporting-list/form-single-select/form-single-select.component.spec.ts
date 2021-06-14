import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSingleSelectComponent } from './form-single-select.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { SimpleChanges } from '@angular/core';
import { ReportService } from '@modules/report/_service/report.service';
import { DropDownValues } from '@modules/report/_models/widget';
import { of } from 'rxjs';

describe('FormSingleSelectComponent', () => {
  let component: FormSingleSelectComponent;
  let fixture: ComponentFixture<FormSingleSelectComponent>;
  let reportService: jasmine.SpyObj<ReportService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormSingleSelectComponent],
      imports: [AppMaterialModuleForSpec]
    })
      .compileComponents();
    reportService = TestBed.inject(ReportService) as jasmine.SpyObj<ReportService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSingleSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it("getDisplayText(),should return display text, ", async(() => {
    let opt = {
      CODE: 'first',
      TEXT: 'first',
      FIELDNAME: "column",
      langu: "EN",
      sno: 1,
      display: ''
    } as DropDownValues

    component.displayCriteria = 'CODE_TEXT';
    let result = component.getDisplayText(opt);
    expect(result).toBe(opt.CODE + '-' + opt.TEXT);

    component.displayCriteria = 'CODE';
    let result1 = component.getDisplayText(opt);
    expect(result1).toBe(opt.CODE);

    component.displayCriteria = 'TEXT';
    let result2 = component.getDisplayText(opt);
    expect(result2).toBe(opt.TEXT);

  }));

  it("getDisplayText(), ", async(() => {
    let opt = null;
    expect(component.getDisplayText(opt)).toBe('');
  }));


  it('selectSingleDropDownValue(), select values from single drop down', async(() => {
    const res = {
      formFieldId: 'column',
      value: 'first'
    }

    const emitEventSpy = spyOn(component.valueChange, 'emit');
    component.selectSingleDropDownValue();
    expect(emitEventSpy).toHaveBeenCalled();
  }));


  it('getDropDownValue(), should return dropdown values', async(() => {
    const returnData: DropDownValues[] = [{
      sno: 1,
      CODE: 'first',
      TEXT: 'test',
      langu: '',
      display: '',
      FIELDNAME: ''
    }];
    component.formFieldId = 'MATL_GROUP';
    component.optionList = [];

    spyOn(reportService, 'getDropDownValues')
      .withArgs(component.formFieldId, 'first').and.returnValue(of(returnData))
    component.getDropDownValue('first');

    expect(component.optionList.length).toEqual(1);
    expect(reportService.getDropDownValues).toHaveBeenCalledWith(component.formFieldId, 'first');
  }));


  it('ngOnChanges(), should detect changes and update', async(() => {
    const change: SimpleChanges = {
      value: {
        previousValue: 'first',
        currentValue: 'test',
        firstChange: false,
        isFirstChange() { return true }
      },
      displayCriteria: {
        previousValue: 'TEXT',
        currentValue: 'CODE',
        firstChange: false,
        isFirstChange() { return true }
      },
      formFieldId: {
        previousValue: 'col',
        currentValue: 'MATL_GROUP',
        firstChange: false,
        isFirstChange() { return false }
      }
    };
    component.optionList = [{ CODE: 'test', TEXT: "TEST1" } as DropDownValues];
    component.ngOnChanges(change);
    expect(component.ngOnChanges).toBeTruthy();
  }));

  it('ngOnIt()', async(() => {
    component.ngOnInit();
    expect(component.ngOnInit).toBeTruthy();
  }));
});

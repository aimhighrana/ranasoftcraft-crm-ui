import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRadioButtonGroupComponent } from './form-radio-button-group.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ReportService } from '@modules/report/_service/report.service';
import { DropDownValues } from '@modules/report/_models/widget';
import { of } from 'rxjs';

describe('FormRadioButtonGroupComponent', () => {
  let component: FormRadioButtonGroupComponent;
  let fixture: ComponentFixture<FormRadioButtonGroupComponent>;
  let reportService: jasmine.SpyObj<ReportService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormRadioButtonGroupComponent],
      imports: [AppMaterialModuleForSpec, ReactiveFormsModule],
      providers: [ReportService]
    })
      .compileComponents();
    reportService = TestBed.inject(ReportService) as jasmine.SpyObj<ReportService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRadioButtonGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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
      .withArgs(component.formFieldId, 'first').and.returnValue(of(returnData));

    component.displayCriteria = 'CODE';
    component.getDropDownValue('first');

    component.displayCriteria = 'CODE_TEXT';
    component.getDropDownValue('first');

    component.displayCriteria = 'TEXT';
    component.getDropDownValue('first');

    expect(component.optionList.length).toEqual(1);
  }));


  it('ngOnIt()', async(() => {
    component.ngOnInit();
    expect(component.ngOnInit).toBeTruthy();
  }));
});

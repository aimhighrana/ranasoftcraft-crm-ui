import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrruleSideSheetComponent } from './brrule-side-sheet.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { FormInputComponent } from '@modules/shared/_components/form-input/form-input.component';
import { SetupDuplicateRuleComponent } from './duplicate-rule-config/setup-duplicate-rule/setup-duplicate-rule.component';

describe('BrruleSideSheetComponent', () => {
  let component: BrruleSideSheetComponent;
  let fixture: ComponentFixture<BrruleSideSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BrruleSideSheetComponent, FormInputComponent, SetupDuplicateRuleComponent],
      imports: [
        HttpClientTestingModule, AppMaterialModuleForSpec, RouterTestingModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrruleSideSheetComponent);
    component = fixture.componentInstance;
    component.fieldsList = [
      { fieldId: '1', fieldDescri: 'first name' }
    ];
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init common data form', () => {

    component.buildCommonDataForm();
    expect(component.form).toBeDefined();

  });

  it('should get conditions', () => {

    expect(component.getConditions()[0]).toEqual('And');
    expect(component.getConditions().length).toEqual(2);

  });



});
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiwCreateBusinessruleComponent } from './diw-create-businessrule.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BusinessRuleType } from '../../business-rules/business-rules.modal';

describe('DiwCreateBusinessruleComponent', () => {
  let component: DiwCreateBusinessruleComponent;
  let fixture: ComponentFixture<DiwCreateBusinessruleComponent>;
  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiwCreateBusinessruleComponent ],
      imports: [AppMaterialModuleForSpec, ReactiveFormsModule, FormsModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        }, { provide: MAT_DIALOG_DATA, useValue: {}
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiwCreateBusinessruleComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit(), test prerequired ', async(()=>{
      const dialogData = {
        moduleId : '1004',
        schemaId: '35343',
        brId: '32535',
        brType: 'BR_REGEX_RULE'
      };

      component.dialogData = dialogData;

      component.ngOnInit();

      expect(component.moduleId).toEqual(dialogData.moduleId);
      expect(component.schemaId).toEqual(dialogData.schemaId);
      expect(component.brId).toEqual(dialogData.brId);
      expect(component.selectedBrType).toEqual(dialogData.brType);

      expect(component.possibleBrs.length).toEqual(9,'Total brs is 9');
  }));

  it('businessRuleTypeDef(), get busines rule definations', async(()=>{
    component.stepOneCtrl = new FormGroup({
      brType: new FormControl(BusinessRuleType.BR_MANDATORY_FIELDS)
    });

    const data =  component.businessRuleTypeDef;
    expect(data).toEqual('Missing Rule');
  }))
});

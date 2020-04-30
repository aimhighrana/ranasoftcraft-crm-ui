import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddbusinessruleComponent } from './addbusinessrule.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { BreadcrumbComponent } from 'src/app/_modules/shared/_components/breadcrumb/breadcrumb.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SvgIconComponent } from '@modules/shared/_components/svg-icon/svg-icon.component';
import { BusinessRuleType } from '../business-rules.modal';

describe('AddbusinessruleComponent', () => {
  let component: AddbusinessruleComponent;
  let fixture: ComponentFixture<AddbusinessruleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddbusinessruleComponent, BreadcrumbComponent, SvgIconComponent ],
      imports: [AppMaterialModuleForSpec, HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddbusinessruleComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit(), load pre required ', async(()=>{
    component.moduleId = '1005';
    component.schemaGroupId = '237547254672';
    component.schemaId = '327473254';
    component.ngOnInit();
    expect(component.breadcrumb.links[1].link).toEqual(`/home/schema/create-schema/${component.moduleId}/${component.schemaGroupId}/${component.schemaId}`);
  }));

  it('ngOnChanges(), while change rule type', async(()=>{
    // mock data
    const changes: import('@angular/core').SimpleChanges = {fragment:{currentValue:'missing', previousValue:'metadata',firstChange:null,isFirstChange:null}};

    component.ngOnChanges(changes);
    expect(component.brType).toEqual(BusinessRuleType.BR_MANDATORY_FIELDS);
  }));

  it('updateBrTypeBasedOnFragement(), update brtype based on fragement', async(()=>{

    // case 1
    component.updateBrTypeBasedOnFragement('missing');
    expect(component.brType).toEqual(BusinessRuleType.BR_MANDATORY_FIELDS);

    // case 2
    component.updateBrTypeBasedOnFragement('metadata');
    expect(component.brType).toEqual(BusinessRuleType.BR_METADATA_RULE);

    // case 3
    component.updateBrTypeBasedOnFragement('userdefined');
    expect(component.brType).toEqual(BusinessRuleType.BR_CUSTOM_SCRIPT);
  }));

});

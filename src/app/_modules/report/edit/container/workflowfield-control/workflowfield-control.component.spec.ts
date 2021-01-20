import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowfieldControlComponent } from './workflowfield-control.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MetadataModel } from '@models/schema/schemadetailstable';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { SharedModule } from '@modules/shared/shared.module';

describe('WorkflowfieldControlComponent', () => {
  let component: WorkflowfieldControlComponent;
  let fixture: ComponentFixture<WorkflowfieldControlComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowfieldControlComponent ],
      imports:[HttpClientTestingModule, AppMaterialModuleForSpec, SharedModule],
      providers:[
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowfieldControlComponent);
    component = fixture.componentInstance;
  });
// mock data
const statics1 = [
  {fieldId:'MATL_GROUP', fieldDescri:'Material Group'}as MetadataModel,
  {fieldId:'MATL_TYPE', fieldDescri:'Material Type'} as MetadataModel
]
const statics2 = [
  {fieldId:'MATL_GROUP', fieldDescri:'Material Group'}as MetadataModel,
  {fieldId:'WFID', fieldDescri:'Material Type'} as MetadataModel
]



const workFlowModeleResponse = {static: statics1};
const workFlowModeleResponse2 = {static: statics2};

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`transformFieldRes(), in TIMESERIES widget`, async(()=>{
    // call actual method
    component.widgetType='TIMESERIES';
    component.controlFor='Field';
    const actualResonse =  component.transformFieldRes(workFlowModeleResponse);

    // asserts
    expect(actualResonse.length).toEqual(1, 'length should be equlas to 1 ');
  }));

  it(`transformFieldRes(), in BAR Chart widget`, async(()=>{
    // call actual method
    component.widgetType='BAR_CHART';
    const actualResonse =  component.transformFieldRes(workFlowModeleResponse2);

    // asserts
    expect(actualResonse.length).toEqual(1, 'length should be equlas to 1 ');
  }));

  it(`transformFieldRes(), in STACKED_BAR_CHART widget`, async(()=>{
    // call actual method
    component.widgetType='STACKED_BAR_CHART';
    const actualResonse =  component.transformFieldRes(workFlowModeleResponse2);

    // asserts
    expect(actualResonse.length).toEqual(1, 'length should be equlas to 1 ');
  }));

  it(`transformFieldRes(), in STACKED_BAR_CHART widget`, async(()=>{
    // call actual method
    component.widgetType='STACKED_BAR_CHART';
    const actualResonse =  component.transformFieldRes(workFlowModeleResponse2);

    // asserts
    expect(actualResonse.length).toEqual(1, 'length should be equlas to 1 ');
  }));



});

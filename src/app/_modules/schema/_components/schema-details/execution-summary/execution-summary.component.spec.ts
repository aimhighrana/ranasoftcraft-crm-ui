import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionSummaryComponent } from './execution-summary.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SchemaStaticThresholdRes, SchemaListDetails } from '@models/schema/schemalist';
import { SchemaService } from '@services/home/schema.service';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { of } from 'rxjs';

describe('ExecutionSummaryComponent', () => {
  let component: ExecutionSummaryComponent;
  let fixture: ComponentFixture<ExecutionSummaryComponent>;
  let schemaService: SchemaService;
  let schemaListService: SchemalistService;
  let schemalistSer: SchemalistService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutionSummaryComponent ],
      imports: [HttpClientTestingModule],
      providers:[ SchemalistService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionSummaryComponent);
    component = fixture.componentInstance;
    schemaService = fixture.debugElement.injector.get(SchemaService);
    schemaListService = fixture.debugElement.injector.get(SchemalistService);
    fixture.detectChanges();
    schemalistSer = fixture.debugElement.injector.get(SchemalistService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getSchemaThresholdStatics(), get schema threshold static', async(()=>{
    // mock data
    const res: SchemaStaticThresholdRes = new SchemaStaticThresholdRes();
    res.successCnt = 10;
    res.schemaId = '35235235334634';
    res.thresHoldStatus = 'GOOD';
    res.threshold = 23.3534543523;

    component.schemaId = '62546256563';
    component.variantId = '2736472637';


    spyOn(schemaService,'getSchemaThresholdStatics').withArgs(component.schemaId, component.variantId).and.returnValue(of(res));

    component.getSchemaThresholdStatics();

    expect(schemaService.getSchemaThresholdStatics).toHaveBeenCalledWith(component.schemaId, component.variantId);
    expect(component.thresholdRes.threshold).toEqual(Math.round((res.threshold + Number.EPSILON) * 100) / 100);
  }));

  it(`getSchemaDetailsBySchemaId(), get schema details `, async(()=>{
    // mock data
    const schemaDetails: SchemaListDetails = new SchemaListDetails();
    schemaDetails.totalCount = 10;
    schemaDetails.errorCount = 20;
    schemaDetails.successCount = 40;

    component.schemaId = '265462873';
    spyOn(schemaListService, 'getSchemaDetailsBySchemaId').withArgs(component.schemaId).and.returnValue(of(schemaDetails));

    component.ngOnInit();

    expect(schemaListService.getSchemaDetailsBySchemaId).toHaveBeenCalledWith(component.schemaId);

  }));

  it('ngOnInit(), loaded pre required',async(()=>{
  // mock data
    const schemaid = '23472538';
    const schemalist: SchemaListDetails = new SchemaListDetails();
    schemalist.totalCount = 57; schemalist.errorCount = 114; schemalist.errorUniqueValue = 55; schemalist.totalUniqueValue = 110;
    schemalist.successCount = 76; schemalist.successUniqueValue = 76; schemalist.pulse = true;
    component.schemaId = schemaid;
    spyOn(schemalistSer, 'getSchemaDetailsBySchemaId').withArgs(schemaid).and.returnValue(of(schemalist));

    component.ngOnInit();

    expect(schemalistSer.getSchemaDetailsBySchemaId).toHaveBeenCalledWith(schemaid);
  }));

  it('ngOnInit(), loaded pre required for brach',async(()=>{
    // mock data
      const schemaId = '23472538';
      const schemaList: SchemaListDetails = new SchemaListDetails();
      component.schemaId = schemaId;
      spyOn(schemalistSer, 'getSchemaDetailsBySchemaId').withArgs(schemaId).and.returnValue(of(schemaList));
      component.ngOnInit();
      expect(schemalistSer.getSchemaDetailsBySchemaId).toHaveBeenCalledWith(schemaId);
    }));
});

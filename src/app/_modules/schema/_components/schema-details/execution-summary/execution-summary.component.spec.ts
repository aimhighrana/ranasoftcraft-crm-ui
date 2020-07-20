import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionSummaryComponent } from './execution-summary.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SchemaListDetails } from '@models/schema/schemalist';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { of } from 'rxjs';

describe('ExecutionSummaryComponent', () => {
  let component: ExecutionSummaryComponent;
  let fixture: ComponentFixture<ExecutionSummaryComponent>;
  let schemaListService: SchemalistService;

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
    schemaListService = fixture.debugElement.injector.get(SchemalistService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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
    schemalist.successCount = 76; schemalist.successUniqueValue = 76; schemalist.isInRunning = true;
    component.schemaId = schemaid;
    spyOn(schemaListService, 'getSchemaDetailsBySchemaId').withArgs(schemaid).and.returnValue(of(schemalist));

    component.ngOnInit();

    expect(schemaListService.getSchemaDetailsBySchemaId).toHaveBeenCalledWith(schemaid);
  }));

  it('ngOnInit(), loaded pre required for brach',async(()=>{
    // mock data
      const schemaId = '23472538';
      const schemaList: SchemaListDetails = new SchemaListDetails();
      component.schemaId = schemaId;
      spyOn(schemaListService, 'getSchemaDetailsBySchemaId').withArgs(schemaId).and.returnValue(of(schemaList));
      component.ngOnInit();
      expect(schemaListService.getSchemaDetailsBySchemaId).toHaveBeenCalledWith(schemaId);
    }));
});

import { SchemaDataSource } from './schema-data-source';
import { async, TestBed } from '@angular/core/testing';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import { Any2tsService } from 'src/app/_services/any2ts.service';
import { RequestForSchemaDetailsWithBr } from 'src/app/_models/schema/schemadetailstable';
describe('SchemaDataSource', () => {
  let schemaDetailSerSpy: jasmine.SpyObj<SchemaDetailsService>;
  let any2tsServiceSpy: jasmine.SpyObj<Any2tsService>;
  let schemaDataSourceService:SchemaDataSource;
  beforeEach(async(() => {
    const schemaSerSpy = jasmine.createSpyObj('SchemaDetailsService', ['getSchemaTableDetailsByBrId','getCorrectedRecords', 'getLastBrErrorRecords']);
    const any2tsSpy = jasmine.createSpyObj('Any2tsService', ['any2DataTable','any2SchemaTableData']);
    TestBed.configureTestingModule({
      providers: [
        {provide: SchemaDetailsService, useValue: schemaSerSpy},
        {provide: Any2tsService, useValue: any2tsSpy}
      ]
    }).compileComponents();
    schemaDetailSerSpy = TestBed.inject(SchemaDetailsService) as jasmine.SpyObj<SchemaDetailsService>;
    any2tsServiceSpy = TestBed.inject(Any2tsService) as jasmine.SpyObj<Any2tsService>;
  }));

  beforeEach(()=>{
    schemaDataSourceService = new SchemaDataSource(schemaDetailSerSpy, any2tsServiceSpy);
  });

  it('should create an instance', () => {
    expect(new SchemaDataSource(schemaDetailSerSpy, any2tsServiceSpy)).toBeTruthy();
  });

  it('connect(), should be return []  ', async(() =>{
    const resposne = schemaDataSourceService.connect(null);
    resposne.subscribe(data =>{
      expect(data).toEqual([]);
    });
  }));

  it('disconnect(), complete the dataSource Observale', async(() =>{
    expect(schemaDataSourceService.disconnect(null)).toEqual(undefined);
  }));

  it('getTableData(), method for get index data response ', async(() =>{
    const mockReq: RequestForSchemaDetailsWithBr = new RequestForSchemaDetailsWithBr();
    mockReq.requestStatus = 'corrections';
    mockReq.schemaId = '723657653273';
    mockReq.fetchCount = 0;
    mockReq.fetchSize = 10;

    schemaDetailSerSpy.getLastBrErrorRecords.withArgs(mockReq.schemaId, []).and.returnValue({} as any);
    schemaDetailSerSpy.getCorrectedRecords.withArgs(mockReq.schemaId, 0 , 10).and.returnValue({} as any);

    schemaDetailSerSpy.getSchemaTableDetailsByBrId.withArgs(mockReq).and.returnValue({} as any);

    expect(schemaDetailSerSpy.getLastBrErrorRecords).toBeTruthy();
  }));

  it('showCorrectionIndexData(), get corrected index records ', async(()=>{
      const mockData: any[] = [];
      const response = schemaDataSourceService.showCorrectionIndexData(mockData);
      expect(response).toEqual(mockData);
  }));

  it('getCorrectedRecordsObjnr(), return object numbers ', async(()=>{
    const returnData = schemaDataSourceService.getCorrectedRecordsObjnr();
    expect(returnData).toEqual([]);
  }));
});


import { SchemaDataSource } from './schema-data-source';
import { async, TestBed } from '@angular/core/testing';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
describe('SchemaDataSource', () => {
  let schemaDetailSerSpy: jasmine.SpyObj<SchemaDetailsService>;
  beforeEach(async(() => {
    const schemaSerSpy = jasmine.createSpyObj('SchemaDetailsService', ['getSchemaTableDetailsByBrId']);
    TestBed.configureTestingModule({
      providers: [
        {provide: SchemaDetailsService, useValue: schemaSerSpy}
      ]
    }).compileComponents();
    schemaDetailSerSpy = TestBed.inject(SchemaDetailsService) as jasmine.SpyObj<SchemaDetailsService>;
  }));

  it('should create an instance', () => {
    expect(new SchemaDataSource(schemaDetailSerSpy)).toBeTruthy();
  });
});


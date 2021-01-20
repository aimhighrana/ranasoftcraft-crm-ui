import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SimpleChange, SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SchemaExecutionProgressResponse } from '@models/schema/schema-execution';
import { SharedModule } from '@modules/shared/shared.module';
import { SchemaService } from '@services/home/schema.service';
import { of } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { SchemaProgressComponent } from './schema-progress.component';

describe('SchemaProgressComponent', () => {
  let component: SchemaProgressComponent;
  let fixture: ComponentFixture<SchemaProgressComponent>;
  let schemaService: SchemaService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaProgressComponent ],
      imports: [
        AppMaterialModuleForSpec,
        HttpClientTestingModule,
        SharedModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaProgressComponent);
    component = fixture.componentInstance;
    schemaService = fixture.debugElement.injector.get(SchemaService);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('schemaExecutionProgressInfo(), should return exuection progress info of schema', async() => {
    const schemaId = '155224'
    spyOn(schemaService, 'getSchemaExecutionProgressDetails').withArgs(schemaId).and.returnValue(of({} as SchemaExecutionProgressResponse));
    component.schemaExecutionProgressInfo(schemaId);
    expect(schemaService.getSchemaExecutionProgressDetails).toHaveBeenCalledWith(schemaId);

    schemaService.getSchemaExecutionProgressDetails(schemaId).subscribe(res => {
      expect(component.schemaProgress).toEqual(res);
    })
  });

  it('ngOnchanges(), should called the ngOnchanges', async() => {
    const changes = {
      schemaId : {
        firstChange: true,
        previousValue: undefined,
        currentValue: '155224',
      } as SimpleChange
    } as SimpleChanges;
    component.schemaId = '1256252'
    component.ngOnChanges(changes);

    expect(component.schemaId).toEqual(changes.schemaId.currentValue);

  })
});

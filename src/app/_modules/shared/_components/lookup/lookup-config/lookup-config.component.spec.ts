import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelectModule } from '@angular/material/select';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { of } from 'rxjs';

import { LookupConfigComponent } from './lookup-config.component';

describe('LookupConfigComponent', () => {
  let component: LookupConfigComponent;
  let fixture: ComponentFixture<LookupConfigComponent>;
  let schemadetailsService: SchemaDetailsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, MatSelectModule],
      declarations: [ LookupConfigComponent ],
      providers: [
        SchemaDetailsService,
        HttpClientTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LookupConfigComponent);
    component = fixture.componentInstance;
    schemadetailsService = fixture.debugElement.injector.get(SchemaDetailsService);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getFieldsByModuleId() should call getMetadataFields', async() => {
    spyOn(schemadetailsService, 'getMetadataFields').withArgs('test').and.callFake(() => of(null));
    component.getFieldsByModuleId('test');
    expect(schemadetailsService.getMetadataFields).toHaveBeenCalled();
  });

  it('patchInitialData() should patch form object', () => {
    component.initialData = {
      enableUserField: false,
      fieldDescri: '',
      fieldId: '',
      fieldLookupConfig: {
        lookupColumn: 'test column',
        lookupColumnResult: 'test result',
        moduleId: 'test'
      },
      lookupTargetField: '',
      lookupTargetText: ''
    }
    component.initForm();
    spyOn(schemadetailsService, 'getMetadataFields').and.callFake(() => of(null));
    component.patchInitialData();
    expect(component.lookupForm.value).toEqual({
      lookupColumn: 'test column',
      lookupColumnResult: 'test result',
      moduleId: 'test'
    });
  });
});
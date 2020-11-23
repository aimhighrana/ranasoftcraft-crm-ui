import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { BusinessrulelibrarySidesheetComponent } from './businessrulelibrary-sidesheet.component';

describe('BusinessrulelibrarySidesheetComponent', () => {
  let component: BusinessrulelibrarySidesheetComponent;
  let fixture: ComponentFixture<BusinessrulelibrarySidesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessrulelibrarySidesheetComponent ],
      imports: [
        AppMaterialModuleForSpec,
        HttpClientTestingModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessrulelibrarySidesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

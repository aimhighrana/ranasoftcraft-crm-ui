import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCollaboratorComponent } from './report-collaborator.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ReportService } from '@modules/report/_service/report.service';

describe('ReportCollaboratorComponent', () => {
  let component: ReportCollaboratorComponent;
  let fixture: ComponentFixture<ReportCollaboratorComponent>;
  // let reportServie: jasmine.SpyObj<ReportService>
  beforeEach(async(() => {
    const reportServieSpy = jasmine.createSpyObj('ReportService', [ 'getCollaboratorPermission']);
    TestBed.configureTestingModule({
      declarations: [ ReportCollaboratorComponent ],
      imports:[AppMaterialModuleForSpec, HttpClientTestingModule, ReactiveFormsModule, FormsModule, RouterTestingModule],
      providers:[
        { provide: ReportService, useValue: reportServieSpy },
      ]
    })
    .compileComponents();
    // reportServie = TestBed.inject(ReportService) as jasmine.SpyObj<ReportService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCollaboratorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

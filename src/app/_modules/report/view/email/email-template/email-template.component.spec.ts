import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { EmailTemplateComponent } from './email-template.component';
import { ReportService } from '../../../_service/report.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EmailTemplate } from '../../../_models/email';

describe('EmailTemplateComponent', () => {
  let component: EmailTemplateComponent;
  let fixture: ComponentFixture<EmailTemplateComponent>;
  let reportService: ReportService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailTemplateComponent ],
      imports:[ RouterTestingModule,HttpClientTestingModule]
    })
    .compileComponents();
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    reportService = fixture.debugElement.injector.get(ReportService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('close(), should close the current router' , () => {
    spyOn(router, 'navigate');
    component.close();
    expect(component.close).toBeTruthy();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: `sb/report/send-email`, outer: null } }]);
  });

  it('onTemplateSelection(), should set template' , () => {
    const templates: EmailTemplate[] =  [{ templateName: 'Template 1', subject: 'Subject - Template 1', message: 'Template 2' }];
    spyOn(router, 'navigate');
    spyOnProperty(reportService.selectedTemplate, 'value', 'get').and.returnValue(templates[0]);
    component.onTemplateSelection();
    expect(component.close).toBeTruthy();
  });
});

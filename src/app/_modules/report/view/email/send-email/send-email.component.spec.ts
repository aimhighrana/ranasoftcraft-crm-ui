import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SendEmailComponent } from './send-email.component';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { UserService } from '../../../../../_services/user/userservice.service';
import { ReportService } from '../../../_service/report.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { Userdetails } from '@models/userdetails';
import { PermissionOn } from '../../../../../_models/collaborator'
import { EmailTemplate } from '../../../_models/email';
import { of } from 'rxjs';
import { MdoUiLibraryModule } from 'mdo-ui-library';


describe('SendEmailComponent', () => {
  let component: SendEmailComponent;
  let fixture: ComponentFixture<SendEmailComponent>;
  let userService: UserService;
  let reportService: ReportService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SendEmailComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        AppMaterialModuleForSpec,
        MdoUiLibraryModule]
    })
      .compileComponents();
      router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    userService = fixture.debugElement.injector.get(UserService);
    reportService = fixture.debugElement.injector.get(ReportService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit(), test all prerequired stuff', async(()=>{

    spyOn(component, 'setEmailFormGroup');
    spyOn(component, 'getCollaboratorPermission');
    spyOn(component, 'getSelectedTemplate');
    component.ngOnInit();
    expect(component.setEmailFormGroup).toHaveBeenCalledTimes(1);
    expect(component.getCollaboratorPermission).toHaveBeenCalledTimes(1);
    expect(component.getCollaboratorPermission).toHaveBeenCalledTimes(1);
  }));

  it('close(), should close the current router' , () => {
    spyOn(router, 'navigate');
    component.close();
    expect(component.close).toBeTruthy();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: null }}]);
  });

  it('selectTemplate(), should navigate to select Teamplate' , () => {
    spyOn(router, 'navigate');
    component.selectTemplate();
    expect(component.selectTemplate).toBeTruthy();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { outer: 'outer/report/email-template' } }]);
  });

  it('setEmailFormGroup(), should build the email form' , () => {
    component.setEmailFormGroup();
    expect(component.emailFormGrp).toBeTruthy();
  });

  it('selectUser(), after user selected from Options' , () => {
    const event = {option:{ viewValue: 'test' }} as MatAutocompleteSelectedEvent;
    component.selectUser(event);
    expect(component.emailRecipients.length).toEqual(1);

    component.emailRecipients = ['test'];
    component.selectUser(event);
    expect(component.emailRecipients.length).toEqual(1);
    expect(component.emailTo.value).toBeNull();
  });

  it('sendEmail(), On click of send email validate form and then send' , () => {
    component.emailFormGrp.patchValue({subject:'', message:'', to : ['testuser@ymail.com']})
    component.sendEmail();
    /* Expect statements will be return once api call is done */

    component.emailFormGrp.patchValue({subject:'', message:'', to : []})
    expect(component.sendEmail()).toBeFalse();
  });

  it('addMyself(), On click of add myself set loggedIn user as recipient' , () => {
    const userDetails = {
      email: 'nikhil@prospecta.com',
    } as Userdetails

    spyOn(userService, 'getUserDetails').and.returnValue(of(userDetails));
    component.addMyself();
    expect(component.emailRecipients.length).toEqual(1);
  });

  it('getCollaboratorPermission(), On click of getCollaboratorPermission it should return users' , () => {
    spyOn(reportService,'getCollaboratorPermission').and.returnValue(of({} as PermissionOn));
    component.getCollaboratorPermission('',0);
    expect(component.users).toBeDefined();
  });

  it('remove(),should remove user from recipients list ',()=>{
    component.emailRecipients = ['testuser']
    component.remove('testuser');
    expect(component.emailRecipients.length).toEqual(0);
  });

  it('getSelectedTemplate(),should set template subject and message ',()=>{
    const templates: EmailTemplate[] =  [{ templateName: 'Template 1', subject: 'Subject - Template 1', message: 'Template 2' }];
    spyOnProperty(reportService.selectedTemplate, 'value', 'get').and.returnValue(templates[0]);
    component.getSelectedTemplate();
    expect(component.emailFormGrp.controls.subject.valid).toBeTrue();
    expect(component.emailFormGrp.controls.message.valid).toBeTrue();
  });
});

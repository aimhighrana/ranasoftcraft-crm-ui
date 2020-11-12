import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSchemaCollaboratorsComponent } from './new-schema-collaborators.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { of } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ROLENAMES } from 'src/app/_constants';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';

const mockDialogRef = {
    close: jasmine.createSpy('close')
};
describe('NewSchemaCollaboratorsComponent', () => {
    let component: NewSchemaCollaboratorsComponent;
    let fixture: ComponentFixture<NewSchemaCollaboratorsComponent>;
    let usersSpy;
    const formBuilder: FormBuilder = new FormBuilder();

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                NewSchemaCollaboratorsComponent,
                SearchInputComponent
            ],
            imports: [
                HttpClientTestingModule,
                HttpClientModule,
                MatSnackBarModule,
                AppMaterialModuleForSpec,
                ReactiveFormsModule
            ],
            providers: [
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: FormBuilder, useValue: formBuilder },

                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: [] },
                SchemaDetailsService
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NewSchemaCollaboratorsComponent);
        component = fixture.componentInstance;
        usersSpy = spyOn(component.schemaDetailsService, 'getAllUserDetails').and.callFake(() => {
            return of({
                users: [{
                    userId: null,
                    userName: 'abhilash',
                    fName: 'Abhilash',
                    lName: 'Rajoria',
                    pwd: null,
                    email: 'abhilash.rajoria@prospecta.com',
                    roles: null,
                    status: null,
                    deptId: null,
                    clientId: null,
                    lang: null,
                    application: null,
                    stage: null,
                    dateFormat: null,
                    sso: null,
                    imgUrl: null,
                    ubstitueUse: null,
                    UserStartDat: null,
                    sUserEnddate: null,
                    subsActive: null,
                    keepCopy: null,
                    failedLoginAttempts: 0,
                    noOfLogins: 0,
                    passwordActiveDate: null,
                    fullName: 'Abhilash Rajoria',
                    isPasswordSet: 0,
                    refreshToken: null,
                    adminAccess: 0,
                    digiSignSNO: null,
                    password: null,
                    isServiceAccount: false,
                    selfServiceUserModel: null,
                    userMultiRoleModels: null,
                    userPasswordModel: null,
                    selfService_Remote_Ob: null
                }],
                roles: [],
                groups: []
            })
        })
        component.ngOnInit();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call service to get collaobrators', async () => {
        component.getCollaborators('a',0);
        expect(usersSpy).toHaveBeenCalledWith('a',0);
        expect(component.subscribers.length).toEqual(1)
    });

    it('should set value of form', async () => {
        component.setPermissions({ value: 'Admin' });

        expect(component.form.value.isAdmin).toEqual(true);
        expect(component.form.value.isReviewer).toEqual(false);
        expect(component.form.value.isViewer).toEqual(false);
        expect(component.form.value.isEditor).toEqual(false);

        component.setPermissions({ value: 'Reviewer' });
        expect(component.form.value.isAdmin).toEqual(false);
        expect(component.form.value.isReviewer).toEqual(true);
        expect(component.form.value.isViewer).toEqual(false);
        expect(component.form.value.isEditor).toEqual(false);

        component.setPermissions({ value: 'Viewer' });
        expect(component.form.value.isAdmin).toEqual(false);
        expect(component.form.value.isReviewer).toEqual(false);
        expect(component.form.value.isViewer).toEqual(true);
        expect(component.form.value.isEditor).toEqual(false);

        component.setPermissions({ value: 'Editor' });
        expect(component.form.value.isAdmin).toEqual(false);
        expect(component.form.value.isReviewer).toEqual(false);
        expect(component.form.value.isViewer).toEqual(false);
        expect(component.form.value.isEditor).toEqual(true);
    });

    it(`selectCurrentRole(), set the current role`, async(() => {
        const role = ROLENAMES.ADMIN;
        component.selectCurrentRole(role);
        expect(component.selectedRoleType).toEqual(role);
    }))

    it(`initForm(), should create the initialForm`, async(() => {
        component.initForm();
        expect(component.form).not.toBeUndefined();
        expect(component.form).not.toBeNull();
    }))
});


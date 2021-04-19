import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@modules/shared/shared.module';
import { MdoUiLibraryModule } from 'mdo-ui-library';

import { ProfileComponent } from './profile.component';

fdescribe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileComponent ],
      imports: [
        SharedModule,
        MdoUiLibraryModule,
        FormsModule,
        ReactiveFormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init component', async(() => {
    expect(component.ngOnInit).toBeTruthy();
  }));

  it('updates personal details in database', async(() => {
    expect(component.updatePersonalDetails).toBeTruthy();
  }));

  it('checks form valid status', async(() => {
    component.createForm();
    component.submitForm();
    expect(component.updateForm).toEqual(false);

    component.setValueForFormControl(component.mockValues);
    component.submitForm();
    expect(component.updateForm).toEqual(true);
  }));
});

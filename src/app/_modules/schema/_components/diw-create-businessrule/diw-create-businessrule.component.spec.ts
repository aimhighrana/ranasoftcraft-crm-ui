import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiwCreateBusinessruleComponent } from './diw-create-businessrule.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('DiwCreateBusinessruleComponent', () => {
  let component: DiwCreateBusinessruleComponent;
  let fixture: ComponentFixture<DiwCreateBusinessruleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiwCreateBusinessruleComponent ],
      imports: [AppMaterialModuleForSpec, ReactiveFormsModule, FormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiwCreateBusinessruleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

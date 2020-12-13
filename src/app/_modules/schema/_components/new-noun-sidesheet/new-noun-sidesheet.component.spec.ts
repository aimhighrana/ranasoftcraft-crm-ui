import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { NewNounSidesheetComponent } from './new-noun-sidesheet.component';

describe('NewNounSidesheetComponent', () => {
  let component: NewNounSidesheetComponent;
  let fixture: ComponentFixture<NewNounSidesheetComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewNounSidesheetComponent ],
      imports: [AppMaterialModuleForSpec, RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewNounSidesheetComponent);
    component = fixture.componentInstance;

    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});

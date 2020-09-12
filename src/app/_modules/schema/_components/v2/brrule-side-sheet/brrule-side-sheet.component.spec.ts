import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrruleSideSheetComponent } from './brrule-side-sheet.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('BrruleSideSheetComponent', () => {
  let component: BrruleSideSheetComponent;
  let fixture: ComponentFixture<BrruleSideSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrruleSideSheetComponent ],
      imports:[
        HttpClientTestingModule, AppMaterialModuleForSpec, RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrruleSideSheetComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
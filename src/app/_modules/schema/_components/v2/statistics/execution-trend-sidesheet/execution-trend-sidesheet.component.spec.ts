import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { ExecutionTrendSidesheetComponent } from './execution-trend-sidesheet.component';

describe('ExecutionTrendSidesheetComponent', () => {
  let component: ExecutionTrendSidesheetComponent;
  let fixture: ComponentFixture<ExecutionTrendSidesheetComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutionTrendSidesheetComponent ],
      imports: [AppMaterialModuleForSpec, HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionTrendSidesheetComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();

    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clode sidesheet', () => {

    spyOn(router, 'navigate');
    component.close();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: null } }]);

  });

});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbComponent } from './breadcrumb.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('BreadcrumbComponent', () => {

  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule
      ],
      declarations: [ BreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
/*
  it('should show  default link',()=>{
    expect(fixture.nativeElement.querySelector('div.pros-breadcrumb').innerText).toEqual('default link');
  });

  @Component({
    selector:'pros-breadcrumb',
    template:'<pros-breadcrumb [crumbs]="breadcrumb"></pros-breadcrumb>'
  })
  class BreadcrumbComponent{

  }
  */
});

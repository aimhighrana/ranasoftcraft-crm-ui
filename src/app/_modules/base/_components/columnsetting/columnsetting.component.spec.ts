import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnsettingComponent } from './columnsetting.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('ColumnsettingComponent', () => {
  let component: ColumnsettingComponent;
  let fixture: ComponentFixture<ColumnsettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppMaterialModuleForSpec, RouterTestingModule],
      declarations: [ ColumnsettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnsettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableLoadingComponent } from './table-loading.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { SharedModule } from '@modules/shared/shared.module';

describe('TableLoadingComponent', () => {
  let component: TableLoadingComponent;
  let fixture: ComponentFixture<TableLoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableLoadingComponent ],
      imports: [AppMaterialModuleForSpec, SharedModule]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

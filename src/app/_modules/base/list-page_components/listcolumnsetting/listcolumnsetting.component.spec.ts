import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListColumnsettingComponent } from './listcolumnsetting.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('ListColumnsettingComponent', () => {
  let component: ListColumnsettingComponent;
  let fixture: ComponentFixture<ListColumnsettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppMaterialModuleForSpec, RouterTestingModule],
      declarations: [ListColumnsettingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListColumnsettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('closeSettingColumn() should work', () => {
    spyOn(component.close, 'emit');
    component.closeSettingColumn();
    expect(component.close.emit).toHaveBeenCalledWith(true);
  });

});

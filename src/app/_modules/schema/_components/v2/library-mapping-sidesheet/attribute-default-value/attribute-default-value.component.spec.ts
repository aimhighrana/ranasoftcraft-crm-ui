import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AttributeDefaultValue } from '@models/schema/classification';
import { SharedModule } from '@modules/shared/shared.module';
import { of } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { AttributeDefaultValueComponent } from './attribute-default-value.component';
import { GlobaldialogService } from '@services/globaldialog.service';

describe('AttributeComponent', () => {
  let component: AttributeDefaultValueComponent;
  let fixture: ComponentFixture<AttributeDefaultValueComponent>;
  let globaldialogService: GlobaldialogService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AttributeDefaultValueComponent],
      imports: [AppMaterialModuleForSpec, RouterTestingModule, SharedModule],
      providers: [
        GlobaldialogService, {
        provide: ActivatedRoute,
        useValue: { params: of({ nounSno: '1701' }) }
      }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeDefaultValueComponent);
    component = fixture.componentInstance;
    globaldialogService = fixture.debugElement.injector.get(GlobaldialogService);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init component', () => {
    component.ngOnInit();
    expect(component.valueList).toBeTruthy();
  });
  it('should check if row is valid', () => {
    const row: AttributeDefaultValue = {
      code: 'test',
      shortValue: 'test'
    };
    expect(component.isValidRow(row)).toBeTruthy();
    delete row.code;
    expect(component.isValidRow(row)).toBeFalsy();
  });
  it('should add new empty row', () => {
    component.valueList = [];
    component.addValueRow();
    expect(component.valueList.length).toEqual(1);
  });
  it('should search using searchstring', () => {
    component.searchStr = '';
    component.doSearch('test');
    expect(component.searchStr).toEqual('test');
  });
  it('should decide if row can be displahyed', () => {
    const row: AttributeDefaultValue = {
      code: 'test',
      shortValue: 'test'
    };
    component.searchStr = '';
    expect(component.canDisplayRow(row)).toBeTrue();
    component.searchStr = 'test';
    expect(component.canDisplayRow(row)).toBeTrue();
    component.searchStr = 'test1';
    expect(component.canDisplayRow(row)).toBeFalse();
  });
  it('should delete a record from list', async () => {
    const row: AttributeDefaultValue = {
      code: 'test',
      shortValue: 'test'
    };
    component.valueList = [row];
    spyOn(globaldialogService, 'confirm').and.callFake((a, b) => b('yes'));
    component.deleteValueRow(0);
    expect(globaldialogService.confirm).toHaveBeenCalled();
    expect(component.valueList.length).toEqual(0);
  });
});

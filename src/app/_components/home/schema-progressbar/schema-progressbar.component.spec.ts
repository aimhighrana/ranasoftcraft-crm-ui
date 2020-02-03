import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaProgressbarComponent } from './schema-progressbar.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { BreadcrumbComponent } from '../../../_modules/shared/_components/breadcrumb/breadcrumb.component';
export class SchemaProgressBar {
  constructor(public successValue: number, public errorValue: number, public successClass: string, public errorClass: string) { }
}
describe('SchemaProgressbarComponent', () => {
  let component: SchemaProgressbarComponent;
  let fixture: ComponentFixture<SchemaProgressbarComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule
      ],
      declarations: [SchemaProgressbarComponent, BreadcrumbComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaProgressbarComponent);
    component = fixture.componentInstance;
  });
  const schemaProgressBarObj: SchemaProgressBar = new SchemaProgressBar(10, 90, 'success', 'error');
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('schema-progressbar.component.html : success percentage bar should be create', async(() => {
    component.successValue = schemaProgressBarObj.successValue;
    component.successClass = schemaProgressBarObj.successClass;
    fixture.detectChanges();
    const successBar = fixture.debugElement.query(By.css('.success'));
    const nativeSuccessElement: HTMLElement = successBar.nativeElement;
    const expectedResult = 'Success ' + schemaProgressBarObj.successValue + '%';
    const actualResult = nativeSuccessElement.getAttribute('ng-reflect-message');
    expect(actualResult).toContain(expectedResult);
  }));

});

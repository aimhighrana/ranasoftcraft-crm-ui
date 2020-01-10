import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaTileComponent } from './schema-tile.component';
import { BreadcrumbComponent } from 'src/app/_components/breadcrumb/breadcrumb.component';
import { SchemaProgressbarComponent } from '../../schema-progressbar/schema-progressbar.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { SubstringPipe } from 'src/app/_pipes/substringpipe.pipe';
import { By } from '@angular/platform-browser';

describe('SchemaTileComponent', () => {
  let component: SchemaTileComponent;
  let fixture: ComponentFixture<SchemaTileComponent>;
  let htmlControl: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule
      ],
      declarations: [SchemaTileComponent, BreadcrumbComponent, SchemaProgressbarComponent, SubstringPipe]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaTileComponent);
    component = fixture.componentInstance;
    htmlControl = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('schema-tile: edit button should be triggerEventHandler', () => {
    component.enableEditButton = true;
    component.groupId = '87235642893';
    component.groupName = 'Function Location Group';
    component.schemaId = '389982630238';
    fixture.detectChanges();
    let actualData: any;
    component.editTrigger.subscribe(data => actualData = data);
    htmlControl.querySelector('button').click();
    expect(actualData.groupId).toEqual(component.groupId);
    expect(actualData.groupName).toEqual(component.groupName);
    expect(actualData.schemaId).toEqual(component.schemaId);
  });

  it('schema-tile: delete button should be triggerEventHandler', () => {
    component.enableDeleteButton = true;
    component.groupId = '983968276';
    fixture.detectChanges();
    let actualDelData: any;
    component.deleteSchemaGroup.subscribe(data => actualDelData = data);
    htmlControl.querySelector('button').click();
    expect(actualDelData).toEqual(component.groupId);
  });

  it('schema-tile : showSchemaVariants click trigger', () => {
    component.isSchemaList = 'true';
    component.moduleId = '1006';
    component.schemaId = '876176289689';
    component.groupId = '7869268462938';
    fixture.detectChanges();
    let actualData: any;
    component.showVariantClick.subscribe(data => actualData = data);
    fixture.debugElement.query(By.css('.vt--col')).nativeElement.click();
    expect(actualData.moduleId).toEqual(component.moduleId);
    expect(actualData.groupId).toEqual(component.groupId);
    expect(actualData.schemaId).toEqual(component.schemaId);
  });

  it('schema-tile: check the action button and its order', () => {
    component.enableEditButton = true;
    component.enableDeleteButton = true;
    component.isSchemaList = 'true';
    fixture.detectChanges();
    expect(htmlControl.getElementsByTagName('button').item(0).firstChild.textContent).toEqual('edit');
    expect(htmlControl.getElementsByTagName('button').item(1).firstChild.textContent).toEqual('delete');
    expect(htmlControl.getElementsByTagName('button').item(2).firstChild.textContent).toEqual('info');
  });

});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemabadgeTileComponent } from './schemabadge-tile.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('SchemabadgeTileComponent', () => {
  let component: SchemabadgeTileComponent;
  let fixture: ComponentFixture<SchemabadgeTileComponent>;
  let htmlNative: HTMLElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppMaterialModuleForSpec, RouterTestingModule],
      declarations: [ SchemabadgeTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemabadgeTileComponent);
    component = fixture.componentInstance;
    htmlNative = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('showAddNewTitle: title should create', () => {
    component.showAddNewTitle = 'Add New Schema';
    fixture.detectChanges();
    expect(htmlNative.getElementsByClassName('badge-h3').length).toEqual(1);
    expect(htmlNative.getElementsByClassName('badge-h3').item(0).textContent).toEqual(component.showAddNewTitle);
  });
});

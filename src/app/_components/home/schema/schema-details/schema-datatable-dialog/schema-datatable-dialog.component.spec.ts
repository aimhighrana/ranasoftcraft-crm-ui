import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaDatatableDialogComponent } from './schema-datatable-dialog.component';

describe('SchemaDatatableDialogComponent', () => {
  let component: SchemaDatatableDialogComponent;
  let fixture: ComponentFixture<SchemaDatatableDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaDatatableDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaDatatableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

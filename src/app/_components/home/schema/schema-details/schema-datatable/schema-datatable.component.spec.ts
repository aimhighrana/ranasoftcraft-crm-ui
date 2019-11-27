import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaDatatableComponent } from './schema-datatable.component';

describe('SchemaDatatableComponent', () => {
  let component: SchemaDatatableComponent;
  let fixture: ComponentFixture<SchemaDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaDatatableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

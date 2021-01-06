import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaProgressComponent } from './schema-progress.component';

describe('SchemaProgressComponent', () => {
  let component: SchemaProgressComponent;
  let fixture: ComponentFixture<SchemaProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

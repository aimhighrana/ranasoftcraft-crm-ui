import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeMappingComponent } from './attribute-mapping.component';

describe('AttributeMappingComponent', () => {
  let component: AttributeMappingComponent;
  let fixture: ComponentFixture<AttributeMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

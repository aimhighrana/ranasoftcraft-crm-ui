import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogCheckComponent } from './catalog-check.component';

describe('CatalogCheckComponent', () => {
  let component: CatalogCheckComponent;
  let fixture: ComponentFixture<CatalogCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

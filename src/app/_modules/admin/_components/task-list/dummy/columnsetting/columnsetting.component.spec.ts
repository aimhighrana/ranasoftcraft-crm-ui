import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnsettingComponent } from './columnsetting.component';

describe('ColumnsettingComponent', () => {
  let component: ColumnsettingComponent;
  let fixture: ComponentFixture<ColumnsettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnsettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnsettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

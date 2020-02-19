import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RfcComponent } from './rfc.component';
import { BreadcrumbComponent } from 'src/app/_modules/shared/_components/breadcrumb/breadcrumb.component';
import { MatIconModule, MatCardModule, MatListModule, MatToolbarModule } from '@angular/material';
import { RouterModule } from '@angular/router';

describe('RfcComponent', () => {
  let component: RfcComponent;
  let fixture: ComponentFixture<RfcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, MatCardModule, MatListModule, MatToolbarModule, RouterModule.forRoot([])],
      declarations: [ RfcComponent, BreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

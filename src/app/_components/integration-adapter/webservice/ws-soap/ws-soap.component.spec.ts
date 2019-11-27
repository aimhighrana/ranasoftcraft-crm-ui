import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsSoapComponent } from './ws-soap.component';
import { BreadcrumbComponent } from 'src/app/_components/breadcrumb/breadcrumb.component';
import { MatCardModule, MatToolbarModule, MatIconModule, MatDividerModule, MatChipsModule, MatListModule } from '@angular/material';
import { RouterModule } from '@angular/router';

describe('WsSoapComponent', () => {
  let component: WsSoapComponent;
  let fixture: ComponentFixture<WsSoapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, MatToolbarModule, MatIconModule, MatDividerModule, MatChipsModule, MatListModule, RouterModule.forRoot([])],
      declarations: [ WsSoapComponent, BreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsSoapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

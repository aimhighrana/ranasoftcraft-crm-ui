import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemalistComponent } from './schemalist.component';
import { BreadcrumbComponent } from 'src/app/_components/breadcrumb/breadcrumb.component';
import { MatCardModule, MatToolbarModule, MatIconModule, MatDividerModule, MatChipsModule, MatListModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { HttpClient } from 'selenium-webdriver/http';
import { HttpClientModule } from '@angular/common/http';

describe('SchemalistComponent', () => {
  let component: SchemalistComponent;
  let fixture: ComponentFixture<SchemalistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({   
      imports:[MatCardModule,MatToolbarModule,MatIconModule,MatDividerModule,MatChipsModule,MatListModule,HttpClientModule,RouterModule.forRoot([])],            
      declarations: [ SchemalistComponent,BreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemalistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

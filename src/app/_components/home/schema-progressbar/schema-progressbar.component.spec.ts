import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaProgressbarComponent } from './schema-progressbar.component';
import { BreadcrumbComponent } from '../../breadcrumb/breadcrumb.component';
import { FlexModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MatCardModule, MatToolbarModule, MatIconModule, MatDividerModule, MatChipsModule } from '@angular/material';

describe('SchemaProgressbarComponent', () => {
  let component: SchemaProgressbarComponent;
  let fixture: ComponentFixture<SchemaProgressbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({      
      imports:[FlexModule, MatCardModule,MatToolbarModule,MatIconModule,MatDividerModule,MatChipsModule,RouterModule.forRoot([])],  
      declarations: [ SchemaProgressbarComponent,BreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaProgressbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

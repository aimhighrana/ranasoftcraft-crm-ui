import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaTileComponent } from './schema-tile.component';
import { BreadcrumbComponent } from 'src/app/_components/breadcrumb/breadcrumb.component';
import { MatCardModule, MatToolbarModule, MatIconModule, MatDividerModule, MatChipsModule, MatListModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { SchemaProgressbarComponent } from '../../schema-progressbar/schema-progressbar.component';
import { FlexModule } from '@angular/flex-layout';

describe('SchemaTileComponent', () => {
  let component: SchemaTileComponent;
  let fixture: ComponentFixture<SchemaTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({   
      imports:[FlexModule,MatCardModule,MatToolbarModule,MatIconModule,MatDividerModule,MatChipsModule,MatListModule,RouterModule.forRoot([])],                                  
      declarations: [ SchemaTileComponent,BreadcrumbComponent,SchemaProgressbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

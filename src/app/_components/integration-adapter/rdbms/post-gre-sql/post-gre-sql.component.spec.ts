import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostGreSQLComponent } from './post-gre-sql.component';
import { BreadcrumbComponent } from 'src/app/_components/breadcrumb/breadcrumb.component';
import { MatCardModule, MatToolbarModule, MatIconModule, MatDividerModule, MatChipsModule, MatListModule } from '@angular/material';
import { RouterModule } from '@angular/router';

describe('PostGreSQLComponent', () => {
  let component: PostGreSQLComponent;
  let fixture: ComponentFixture<PostGreSQLComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({ 
      imports:[MatCardModule,MatToolbarModule,MatIconModule,MatDividerModule,MatChipsModule,MatListModule,RouterModule.forRoot([])],                                             
      declarations: [ PostGreSQLComponent,BreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostGreSQLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

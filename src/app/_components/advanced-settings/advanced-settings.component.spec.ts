import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedSettingsComponent } from './advanced-settings.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { MatCardModule, MatToolbarModule, MatIconModule, MatDividerModule, MatChipsModule, MatListModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { AdminTileComponent } from '../admin-tile/admin-tile.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('AdvancedSettingsComponent', () => {
  let component: AdvancedSettingsComponent;
  let fixture: ComponentFixture<AdvancedSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule
      ],
      declarations: [ AdvancedSettingsComponent, BreadcrumbComponent, AdminTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

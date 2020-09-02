import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiwTilesComponent } from './diw-tiles.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

describe('DiwTilesComponent', () => {
  let component: DiwTilesComponent;
  let fixture: ComponentFixture<DiwTilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiwTilesComponent ],
      imports: [AppMaterialModuleForSpec]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiwTilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

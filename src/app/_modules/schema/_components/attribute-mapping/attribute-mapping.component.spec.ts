import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@modules/shared/shared.module';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { AttributeMappingComponent } from './attribute-mapping.component';

describe('AttributeMappingComponent', () => {
  let component: AttributeMappingComponent;
  let fixture: ComponentFixture<AttributeMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeMappingComponent, SearchInputComponent ],
      imports: [AppMaterialModuleForSpec, SharedModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

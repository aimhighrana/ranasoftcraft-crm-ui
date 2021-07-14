import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@modules/shared/shared.module';
import { NounModifierService } from '@services/home/schema/noun-modifier.service';
import { of } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { AttributeDefaultValueComponent } from './attribute-default-value.component';

describe('AttributeComponent', () => {
  let component: AttributeDefaultValueComponent;
  let fixture: ComponentFixture<AttributeDefaultValueComponent>;
  let router: Router;
  let nounModifierService: NounModifierService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeDefaultValueComponent ],
      imports: [AppMaterialModuleForSpec, RouterTestingModule, SharedModule],
      providers: [{
        provide: ActivatedRoute,
        useValue: {params : of({nounSno: '1701'})}
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeDefaultValueComponent);
    component = fixture.componentInstance;

    nounModifierService = fixture.debugElement.injector.get(NounModifierService);
    router = TestBed.inject(Router);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});

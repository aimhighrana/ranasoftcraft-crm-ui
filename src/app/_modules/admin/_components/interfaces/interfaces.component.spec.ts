import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { MdoUiLibraryModule } from 'mdo-ui-library';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InterfacesComponent } from './interfaces.component';

describe('InterfacesComponent', () => {
  let component: InterfacesComponent;
  let fixture: ComponentFixture<InterfacesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        InterfacesComponent
      ],
      imports: [ MdoUiLibraryModule, AppMaterialModuleForSpec],
      providers: [
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfacesComponent);
    component = fixture.componentInstance;
  });

  it('testing ngOnInit', () => {
    component.ngOnInit()
    expect(component.ngOnInit).toBeTruthy();
  })

  it('testing remove', () => {
    component.fruits = ['test', 'tttt']
    component.remove('test');
    component.remove('hhh')
    expect(component.remove).toBeTruthy();
  });
});

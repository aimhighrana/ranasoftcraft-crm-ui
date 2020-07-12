
import { InterfacesComponent } from './interfaces.component';

describe('InterfacesComponent', () => {
  let component: InterfacesComponent;

  beforeEach(() => {
    component = new InterfacesComponent();
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

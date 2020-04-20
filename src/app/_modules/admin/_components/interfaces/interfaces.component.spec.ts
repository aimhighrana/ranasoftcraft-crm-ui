
import { InterfacesComponent } from './interfaces.component';

describe('InterfacesComponent', () => {
  let component;

  beforeEach(() => {
    component = new InterfacesComponent();
  });

  it('testing ngOnInit', () => {
    component.ngOnInit()
  })

  it('testing remove', () => {
    component.fruits = ['test', 'tttt']
    component.remove('test')
  })

  it('testing _filter', () => {
    component.allFruits = ['test']
    component._filter('test');
  })
});

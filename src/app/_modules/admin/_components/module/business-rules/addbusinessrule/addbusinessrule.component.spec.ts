
import { AddbusinessruleComponent } from './addbusinessrule.component';

describe('AddbusinessruleComponent', () => {
  let component;
  beforeEach(() => {
    component = new AddbusinessruleComponent();
  });

  it('testing ngOnInit', () => {
    component.ngOnInit()
  });


  it('testing addNewBusiness', () => {
    component.addNewBusiness()
  });

  it('testing onChangeRadioButton - metadata', () => {

    const ev = {
      value: 'metadata'
    }
    component.onChangeRadioButton(ev)
  })

  it('testing onChangeRadioButton - dependency', () => {

    const ev = {
      value: 'dependency'
    }
    component.onChangeRadioButton(ev)
  })

  it('testing onChangeRadioButton - userdefined', () => {

    const ev = {
      value: 'userdefined'
    }
    component.onChangeRadioButton(ev)
  })
});

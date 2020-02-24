import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgIconComponent } from './svg-icon.component';

describe('SvgIconComponent', () => {
  let component: SvgIconComponent;
  let fixture: ComponentFixture<SvgIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('P_BR_METADATA_RULE, P_BR_UDR_RULE, P_BR_MISSING_RULE  on index 0, 1, 2', () => {
    expect(component.iconPV.indexOf('P_BR_METADATA_RULE') === 0).toBeTruthy();
    expect(component.iconPV.indexOf('P_BR_UDR_RULE') === 1).toBeTruthy();
    expect(component.iconPV.indexOf('P_BR_MISSING_RULE') === 2).toBeTruthy();
  });

  it('size and color should be passed onto svg width and class', () => {
    component.color = 'primary';
    component.size = '50';
    fixture.detectChanges();
    const htmlnative: HTMLElement = fixture.nativeElement;
    expect(htmlnative.getElementsByClassName('primary').length === 1).toBeTruthy();
    expect(htmlnative.getElementsByTagName('svg').length === 1).toBeTruthy();
    expect(htmlnative.getElementsByTagName('svg').item(0).style.width === '50px').toBeTruthy();
  });
});
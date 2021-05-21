import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportLogComponent } from './import-log.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('ImportLogComponent', () => {
  let component: ImportLogComponent;
  let fixture: ComponentFixture<ImportLogComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportLogComponent],
      imports: [RouterTestingModule],
      providers: []
    })
      .compileComponents();
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportLogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit, loaded pre required', (() =>{
    component.ngOnInit();
    expect(component.ngOnInit).toBeTruthy();
    component.getWarningList();
    expect(component.getWarningList).toBeTruthy();

  }));

  it('close(), should close the current router', () => {
    spyOn(router, 'navigate');
    component.close();
    expect(component.close).toBeTruthy();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: null } }]);
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FieldMetaData } from '@models/core/coreModel';
import { SharedModule } from '@modules/shared/shared.module';
import { CoreService } from '@services/core/core.service';
import { of, throwError } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { ListFilterComponent } from './list-filter.component';

describe('ListFilterComponent', () => {
  let component: ListFilterComponent;
  let fixture: ComponentFixture<ListFilterComponent>;
  let coreService: CoreService;
  let router: Router;
  const pathPrams = { moduleId: '1005'};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListFilterComponent ],
      imports: [ AppMaterialModuleForSpec,  RouterTestingModule, SharedModule ],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of(pathPrams)}}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFilterComponent);
    component = fixture.componentInstance;
    coreService = fixture.debugElement.injector.get(CoreService);
    router = TestBed.inject(Router);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should getFldMetadata', () => {


    expect(() => component.getFldMetadata()).toThrowError('Module id cant be null or empty');

    const response = [{
          fieldId: 'name',
          fieldDescri: 'name'
    }] as FieldMetaData[];

    component.moduleId = '1005';
    spyOn(coreService, 'getAllFieldsForView').withArgs(component.moduleId)
      .and.returnValues(of(response), throwError({message: 'api error'}));


    component.getFldMetadata();
    expect(coreService.getAllFieldsForView).toHaveBeenCalledWith(component.moduleId);
    expect(component.metadataFldLst).toEqual(response);


    // api error
    spyOn(console, 'error');
    component.getFldMetadata();
    expect(console.error).toHaveBeenCalled();

  });

  it('should close sidesheet', () => {

    spyOn(router, 'navigate');
    component.close();
    expect(router.navigate).toHaveBeenCalledWith([{outlets: {sb: null}}], {queryParamsHandling: 'preserve'});

  });

});

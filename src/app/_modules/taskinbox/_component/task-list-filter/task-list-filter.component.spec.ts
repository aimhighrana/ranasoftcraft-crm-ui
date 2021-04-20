import { Subject, of } from 'rxjs';
import { SharedModule } from '@modules/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TaskListFilterComponent } from './task-list-filter.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GlobaldialogService } from '@services/globaldialog.service';

describe('TaskListFilterComponent', () => {
  let component: TaskListFilterComponent;
  let fixture: ComponentFixture<TaskListFilterComponent>;
  let router: Router;
  let globalDialogService: GlobaldialogService;
  let queryParams: Subject<Params>;
  const params = { node: 'inbox' };

  beforeEach(async(() => {
    queryParams = new Subject<Params>();
    TestBed.configureTestingModule({
      declarations: [TaskListFilterComponent],
      imports: [AppMaterialModuleForSpec, RouterTestingModule, SharedModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { queryParams, params: of(params) },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListFilterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    globalDialogService = fixture.debugElement.injector.get(GlobaldialogService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have node inbox', () => {
    expect(component.node).toEqual('inbox');
  });
  it('should have queryParam', fakeAsync(() => {
    const settings = [
      {
        fldId: 'Bookmarked',
        value: ['2'],
        startvalue: [],
        endvalue: [],
        operator: 'equal',
        parentnode: '',
      },
    ];
    const f = btoa(JSON.stringify(settings));
    fixture.detectChanges();
    queryParams.next({ s: 'inbox', f });

    // tick to make sure the async observable resolves
    tick();
    expect(component.currentFilterSettings.length).toBe(1);
  }));

  it('close()', () => {
    spyOn(router, 'navigate');
    component.close();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: null } }], {
      queryParamsHandling: 'preserve',
    });
  });

  it('clearAllFilters()', async () => {
    spyOn(globalDialogService, 'confirm');
    component.clearAllFilters();

    expect(globalDialogService.confirm).toHaveBeenCalled();
  });
});

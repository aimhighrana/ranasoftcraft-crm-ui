import { of } from "rxjs";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TaskListDatatableComponent } from "./task-list-datatable.component";
import { SharedModule } from "@modules/shared/shared.module";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { AppMaterialModuleForSpec } from "src/app/app-material-for-spec.module";

describe("TaskListDatatableComponent", () => {
  let component: TaskListDatatableComponent;
  let fixture: ComponentFixture<TaskListDatatableComponent>;
  // let router: Router;
  const queryParams = { s: "inbox", f: "test" };
  const params = { node: "inbox" };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskListDatatableComponent],
      imports: [AppMaterialModuleForSpec, RouterTestingModule, SharedModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of(queryParams), params: of(params) },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListDatatableComponent);
    component = fixture.componentInstance;
    // router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should have node inbox", () => {
    expect(component.node).toEqual("inbox");
  });
});

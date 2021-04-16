import { take } from 'rxjs/operators';
import { IFilterSettings } from './../task-list-datatable/task-list-datatable.component';
import { GlobaldialogService } from '@services/globaldialog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pros-task-list-filter',
  templateUrl: './task-list-filter.component.html',
  styleUrls: ['./task-list-filter.component.scss'],
})
export class TaskListFilterComponent implements OnInit {
  node: string = null;
  activeFilter: IFilterSettings = null;
  currentFilterSettings: IFilterSettings[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private glocalDialogService: GlobaldialogService) {}

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.node = param.node || null;
    });

    this.route.queryParams.pipe(take(1)).subscribe((queryParam) => {
      if (this.currentFilterSettings.length <= 0) {
        const decoded = atob(queryParam.f);
        if (decoded) {
          this.currentFilterSettings = JSON.parse(decoded) || [];
        }
      }
    });
  }
  close() {
    this.router.navigate([{ outlets: { sb: null } }], { queryParamsHandling: 'preserve' });
  }
  clearAllFilters() {
    this.glocalDialogService.confirm({ label: 'Are you sure to reset all filters ?' }, (resp) => {
      if (resp && resp === 'yes') {
        this.currentFilterSettings = [];
        this.activeFilter = null;
      }
    });
  }
}

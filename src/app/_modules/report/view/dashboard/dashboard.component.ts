import { Component, OnInit } from '@angular/core';
import { Breadcrumb } from 'src/app/_models/breadcrumb';
@Component({
  selector: 'pros-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  breadcrumb: Breadcrumb = {
    heading: 'Report Dashboard',
    links: []
  };

  ngOnInit(): void {

  }

}

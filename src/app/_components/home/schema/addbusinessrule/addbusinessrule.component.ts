import { Component, OnInit } from '@angular/core';
import { Breadcrumb } from 'src/app/_models/breadcrumb';

@Component({
  selector: 'pros-addbusinessrule',
  templateUrl: './addbusinessrule.component.html',
  styleUrls: ['./addbusinessrule.component.scss']
})
export class AddbusinessruleComponent implements OnInit {

  breadcrumb: Breadcrumb = {
    heading: 'Add Business Rule',
    links: [
      {
        link: '/home/schema/',
        text: 'Schema group(s)'
      },
      {
        link: '/home/schema/create-schema/',
        text: 'Create Schema'
      }
    ]
  };

  constructor() { }

  ngOnInit() {
  }

}

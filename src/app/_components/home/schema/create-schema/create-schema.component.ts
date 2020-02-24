import { Component, OnInit } from '@angular/core';
import { Breadcrumb } from 'src/app/_models/breadcrumb';

@Component({
  selector: 'pros-create-schema',
  templateUrl: './create-schema.component.html',
  styleUrls: ['./create-schema.component.scss']
})
export class CreateSchemaComponent implements OnInit {

  breadcrumb: Breadcrumb = {
    heading: 'Create Schema',
    links: [
      {
        link: '/home/schema/',
        text: 'Schema group(s)'
      }
    ]
  };
  constructor() { }

  ngOnInit() {
  }

}

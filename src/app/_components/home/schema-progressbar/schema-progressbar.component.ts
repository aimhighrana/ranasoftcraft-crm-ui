import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pros-schema-progressbar',
  templateUrl: './schema-progressbar.component.html',
  styleUrls: ['./schema-progressbar.component.scss']
})
export class SchemaProgressbarComponent implements OnInit {

  @Input()
  successValue: number;
  @Input()
  errorValue: number;
  @Input()
  successClass: string;
  @Input()
  errorClass: string;
  @Input()
  disabledProgress: string;
  constructor() { }

  ngOnInit() {
  }

}

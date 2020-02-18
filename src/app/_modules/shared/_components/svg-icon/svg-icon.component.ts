import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pros-svg-icon',
  templateUrl: './svg-icon.component.html',
  styleUrls: ['./svg-icon.component.scss']
})
export class SvgIconComponent implements OnInit {

  // icon possible values
  iconPV: string[] = [
    'P_BR_METADATA_RULE',
    'P_BR_UDR_RULE',
    'P_BR_MISSING_RULE'
  ];

  @Input()
  size: string;

  @Input()
  icon: string;

  @Input()
  color: string;

  constructor() { }

  ngOnInit() {
  }

}

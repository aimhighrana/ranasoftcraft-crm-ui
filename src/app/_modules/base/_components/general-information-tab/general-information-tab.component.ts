import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pros-general-information-tab',
  templateUrl: './general-information-tab.component.html',
  styleUrls: ['./general-information-tab.component.scss']
})
export class GeneralInformationTabComponent implements OnInit {
  /**
   * This recieves the current active tab
   */
  @Input() currentTab: string;

  constructor() { }

  ngOnInit(): void {
  }

}

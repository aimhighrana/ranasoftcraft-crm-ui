import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'pros-datascope-sidesheet',
  templateUrl: './datascope-sidesheet.component.html',
  styleUrls: ['./datascope-sidesheet.component.scss']
})
export class DatascopeSidesheetComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  /**
   * function to close dataScope side sheet
   */
  close(){
    this.router.navigate([{outlets: {sb: null}}])
  }
}

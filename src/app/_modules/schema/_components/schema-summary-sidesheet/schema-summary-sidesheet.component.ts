import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'pros-schema-summary-sidesheet',
  templateUrl: './schema-summary-sidesheet.component.html',
  styleUrls: ['./schema-summary-sidesheet.component.scss']
})
export class SchemaSummarySidesheetComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  /**
   * Function to close summary sidesheet on click
   */
  close(){
    this.router.navigate([{outlets: {sb: null}}])
  }

}

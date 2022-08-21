import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {


  segment: string = 'list';

  constructor(
    private router: Router
  ) {}

  segmentChange(event: any) {
    this.segment = event.target.value;
    console.log(`Event {}`, this.segment);

  }

  addNewEmployee() {
    this.router.navigate(['afl','tabs','employee','new']);
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pros-create-rule',
  templateUrl: './create-rule.component.html',
  styleUrls: ['./create-rule.component.scss']
})
export class CreateRuleComponent implements OnInit {

  constructor() { }

  typename = 'Type name';
  rulename = 'Rule name';
  erroremsg = 'Error message';
  fields = 'Fields';
  stdfun = 'Stardard function';

  ngOnInit(): void {
  }

}

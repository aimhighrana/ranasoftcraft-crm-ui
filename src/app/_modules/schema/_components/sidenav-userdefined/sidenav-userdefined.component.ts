import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pros-sidenav-userdefined',
  templateUrl: './sidenav-userdefined.component.html',
  styleUrls: ['./sidenav-userdefined.component.scss']
})
export class SidenavUserdefinedComponent implements OnInit {

  constructor() { }

  typename = 'Type name';
  rulename = 'Rule name';
  erroremsg = 'Error message';

  ngOnInit(): void {
  }
}

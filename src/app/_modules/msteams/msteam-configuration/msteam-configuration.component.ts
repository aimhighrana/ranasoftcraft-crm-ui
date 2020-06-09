import { Component, OnInit } from '@angular/core';
import * as microsoftTeams from '@microsoft/teams-js';

@Component({
  selector: 'pros-msteam-configuration',
  templateUrl: './msteam-configuration.component.html',
  styleUrls: ['./msteam-configuration.component.scss']
})
export class MsteamConfigurationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }

  // Login click opens the sign-in page in a pop-up and wait for sucessful login
  login() {
    const jwtToken = localStorage.getItem('JWT-TOKEN');
    if(jwtToken){
      window.location.href = '/#/msteams/report';
    }else{
      microsoftTeams.initialize();
      microsoftTeams.getContext(tContext => {
          microsoftTeams.authentication.authenticate({
            url: '/#/msteams/auth',
            width: 400,
            height: 400,
            successCallback (t) {
                window.location.href = '/#/msteams/report'
            },
            failureCallback (err) {
            }
        });
      });
    }
  }
}

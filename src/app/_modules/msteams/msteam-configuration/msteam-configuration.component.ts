import { Component, OnInit } from '@angular/core';
import * as microsoftTeams from '@microsoft/teams-js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'pros-msteam-configuration',
  templateUrl: './msteam-configuration.component.html',
  styleUrls: ['./msteam-configuration.component.scss']
})
export class MsteamConfigurationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }

  // Login click opens the sign-in page in a pop-up and wait for sucessful login for further
  login() {
    const apiUrl = environment.apiurl;
    const newApiUrl = apiUrl.replace('fapi', '');
    const jwtToken = localStorage.getItem('JWT-TOKEN');
    if(jwtToken){
      window.location.href = newApiUrl + '/fuze/ngx-mdo/index.html#/msteams/report';
    }else{
      microsoftTeams.initialize();
      microsoftTeams.getContext(tContext => {
          microsoftTeams.authentication.authenticate({
            url: newApiUrl + '/fuze/ngx-mdo/index.html#/msteams/auth',
            width: 400,
            height: 400,
            successCallback (t) {
                window.location.href =  newApiUrl + '/fuze/ngx-mdo/index.html#/msteams/report'
            },
            failureCallback (err) {
            }
        });
      });
    }
  }
}

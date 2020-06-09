import { Component, OnInit } from '@angular/core';
import * as microsoftTeams from '@microsoft/teams-js';
import { MsteamsConfigService } from '../_service/msteams-config.service';

export class Report {
  reportId: string;
  reportName: string;
  reportUrl: string;
}

@Component({
  selector: 'pros-msteam-report-configuration',
  templateUrl: './msteam-report-configuration.component.html',
  styleUrls: ['./msteam-report-configuration.component.scss']
})
export class MsteamReportConfigurationComponent implements OnInit {

  constructor(
    private msteamsConfigService: MsteamsConfigService
  ) { }
  reportListSelected: string;
  customUrl: string;

  // Options to either select a report from dropdown or input custom url for the dashboard report page
  radioOptions = [
    {optionId: '1', optionName: 'Select url'},
    {optionId: '2', optionName: 'Custom url'}
  ];



  // selected option in radio button
  selectedOption = this.radioOptions[0].optionId;


  reportList: Report[] = [];

  ngOnInit(): void {
      microsoftTeams.initialize();
      const vm = this;
      // Save configuration changes

      microsoftTeams.settings.registerOnSaveHandler(saveEvent => {
        microsoftTeams.settings.setSettings({
          contentUrl: vm.createTabUrl(), // Mandatory parameter
          entityId: vm.createTabUrl(), // Mandatory parameter
          suggestedDisplayName: vm.getDisplayName()
        });
        saveEvent.notifySuccess();
      });
    // Get list of report urls from MDO
    this.getReportUrls();
  }

 // Get list of report urls from MDO
  getReportUrls(){
    this.msteamsConfigService.getReportUrlList().subscribe(res=>{
      this.reportList = res;
      this.reportListSelected = this.reportList[0].reportUrl;
      this.setValidity(true);
      return this.reportList;
    },error=>console.error(`Error : ${error}`));
  }

  // Enable save button of MS Teams App configuration page once everyting is set/valid
  setValidity(isValid: boolean){
    microsoftTeams.settings.setValidityState(isValid);
  }

  // Change trigger of Radio options in configuration page
  radioChange(optionId: string){
    this.selectedOption = optionId;
    this.setValidity(false);
    if(optionId === this.radioOptions[0].optionId){
      if(this.reportListSelected){
        this.setValidity(true);
      }
    }
    if(optionId === this.radioOptions[1].optionId){
      if(this.customUrl){
        this.setValidity(true);
      }
    }
  }

  // Create the URL that Microsoft Teams will load in the tab. You can compose any URL even with query strings.
  createTabUrl() {
    let selectedReportUrl = '';
    if(this.selectedOption === this.radioOptions[0].optionId && this.reportListSelected){
      selectedReportUrl = this.reportListSelected;
    }
    if(this.selectedOption === this.radioOptions[1].optionId  && this.customUrl){
      selectedReportUrl = this.customUrl;
    }
    return selectedReportUrl;
}

// Display name of the report in MS Teams Tab
  getDisplayName(){
    let displayName = '';
    const vm = this;
    this.reportList.map(report => {
      if(vm.reportListSelected === report.reportUrl){
            displayName = report.reportName;
           }
    })
    return displayName;
  }

  // Enabling save button in MS Teams app on valid select input
  onSelectUrlChange(){
    if(this.selectedOption === this.radioOptions[0].optionId){
      if(this.reportListSelected){
        this.setValidity(true);
      }else{
        this.setValidity(false);
      }
    }

  }

  // Enabling save button in MS Teams app on valid custom url input
  onCustomUrlChange(){
    if(this.selectedOption === this.radioOptions[1].optionId){
      if(this.customUrl){
        this.setValidity(true);
      }else{
        this.setValidity(false);
      }
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportService } from '../../../_service/report.service'
import { EmailTemplate, EmailTemplateBody } from '../../../_models/email';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatAutocomplete,MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'pros-email-template',
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.scss']
})
export class EmailTemplateComponent implements OnInit {
  /* Sample Email Templat HTML */
  htmlEmailTemplate = `<div id="Signature">
  <div>
    <div id="emailBody style=" min-height: 200px;"></div>
     <div style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);">
        <p style="color:rgb(50, 49, 48);text-align:start;font-size:11pt;font-family:Calibri, sans-serif;background-color:white;margin:0px"><b><span style="margin:0px;font-size:12pt;color:rgb(64, 64, 64)">Nikhil Sawant</span></b><b><span style="margin:0px;font-size:12pt;color:rgb(32, 31, 30)"></span></b></p>
        <p style="color:rgb(50, 49, 48);text-align:start;font-size:11pt;font-family:Calibri, sans-serif;background-color:white;margin:0px"><span lang="en-US" style="margin:0px;font-size:12pt;color:rgb(134, 17, 6);background-color:white">Sr. Software Engineer</span><span style="margin:0px;font-size:12pt;color:rgb(62, 0, 0)"></span></p>
        <p style="color:rgb(50, 49, 48);text-align:start;font-size:11pt;font-family:Calibri, sans-serif;background-color:white;margin:0px"><span style="margin:0px;font-size:12pt;color:rgb(64, 64, 64)">+91 9029609296<br><a href="http://www.prospecta.com/" target="_blank" rel="noopener noreferrer" data-auth="NotApplicable" title="http://www.prospecta.com/" data-linkindex="0" style="margin:0px"><span style="margin:0px;color:rgb(5, 99, 193)">www.prospecta.com</span></a></span><span style="margin:0px;color:rgb(64, 64, 64)"><br></span><span style="margin:0px;font-size:14pt;color:rgb(32, 31, 30)"><img data-imagetype="AttachmentByCid" data-custom="AAMkAGJhNDE4MzM5LTA3YzAtNGVlZi04ZjE3LWNkNzM2NDI1MmI1OQBGAAAAAAChli0Jf9R2TYSDAPuqbEU3BwAlPJtzCeDPRZtp8ZNC6RB7AAAAAAEMAAAlPJtzCeDPRZtp8ZNC6RB7AAAUpEJsAAABEgAQAGJlYar8jxtLuzn1DD5MOpY%3D" src="https://attachments.office.net/owa/nikhil.sawant%40prospecta.com/service.svc/s/GetAttachmentThumbnail?id=AAMkAGJhNDE4MzM5LTA3YzAtNGVlZi04ZjE3LWNkNzM2NDI1MmI1OQBGAAAAAAChli0Jf9R2TYSDAPuqbEU3BwAlPJtzCeDPRZtp8ZNC6RB7AAAAAAEMAAAlPJtzCeDPRZtp8ZNC6RB7AAAUpEJsAAABEgAQAGJlYar8jxtLuzn1DD5MOpY%3D&amp;thumbnailType=2&amp;token=eyJhbGciOiJSUzI1NiIsImtpZCI6IjMwODE3OUNFNUY0QjUyRTc4QjJEQjg5NjZCQUY0RUNDMzcyN0FFRUUiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJNSUY1emw5TFV1ZUxMYmlXYTY5T3pEY25ydTQifQ.eyJvcmlnaW4iOiJodHRwczovL291dGxvb2sub2ZmaWNlLmNvbSIsInVjIjoiOGRiZGE2N2RiZGMwNGEyZTk1OTljNzNiODkyNjNjZmEiLCJzaWduaW5fc3RhdGUiOiJbXCJrbXNpXCJdIiwidmVyIjoiRXhjaGFuZ2UuQ2FsbGJhY2suVjEiLCJhcHBjdHhzZW5kZXIiOiJPd2FEb3dubG9hZEA0ZDdhYjYzMi00MGE0LTQyOTQtYmI1Zi00ZWVhNWNlYjRhYjciLCJpc3NyaW5nIjoiV1ciLCJhcHBjdHgiOiJ7XCJtc2V4Y2hwcm90XCI6XCJvd2FcIixcInB1aWRcIjpcIjExNTM4MDExMTkyMTk4MzUwMTdcIixcInNjb3BlXCI6XCJPd2FEb3dubG9hZFwiLFwib2lkXCI6XCI3NjkxMDJkNy1mYzE2LTQyNzEtOTkyYi02Y2M5YmE3MWQ2OThcIixcInByaW1hcnlzaWRcIjpcIlMtMS01LTIxLTEyMjcwODQ0NC0zMTE0NDkzOTg3LTMyMzYyNzQ3NjktMjUzODMzNzJcIn0iLCJuYmYiOjE2MjMzODc3NDYsImV4cCI6MTYyMzM4ODM0NiwiaXNzIjoiMDAwMDAwMDItMDAwMC0wZmYxLWNlMDAtMDAwMDAwMDAwMDAwQDRkN2FiNjMyLTQwYTQtNDI5NC1iYjVmLTRlZWE1Y2ViNGFiNyIsImF1ZCI6IjAwMDAwMDAyLTAwMDAtMGZmMS1jZTAwLTAwMDAwMDAwMDAwMC9hdHRhY2htZW50cy5vZmZpY2UubmV0QDRkN2FiNjMyLTQwYTQtNDI5NC1iYjVmLTRlZWE1Y2ViNGFiNyIsImhhcHAiOiJvd2EifQ.bzCS8jB9sl65HQY3MkRDblqhvOAqi4hPdiS4S-sqFmpg4tyjwg_dIeDx_45ucC2qu11PgmbV-8RcYzG-pb9MzH-MRM_tsqQ5GYf9sRVp0G9Mi3XrG8Sw_WrEhEn4vPBM0goIIqLOQNo-Hi_b7m9FMxnvkAm9pUGEctBLwZ5mvWfsOBExQWWaF-dByTipZDN3T7MYLPgyU_4X70LRIx4aV6fiscgqU2khAW6iAi9Lr_i3RAD5ML3PtBpyviWhZwe3Kbie7uioXrcjzBCsWktvcrTDp03tL0FvYwMhF-IcEl6iqjhc_SknnhQY0pqs4YlQIGB6gWbfx4FplcfOVNUfMQ&amp;X-OWA-CANARY=lp4Nr_MJI0iK9zC41cSqY8DDGuuWLNkYb2154oUqumrHgZ1LMRkbrZz8rtcw3f6fVTAKH_n_g1U.&amp;owa=outlook.office.com&amp;scriptVer=20210524004.18&amp;animation=true" alt="signature_1458797155" style="margin:0px;width:92.99pt;height:44.24pt;cursor:pointer" crossorigin="use-credentials"></span></p>
        <br>
     </div>
  </div>
</div>`

  /* Templates list */
  templates: EmailTemplate[] = [{ _id: '0', desc: 'No' },{ _id: '1', desc: 'Email Template 1' }];

  /* Email Template body */
  emailTemplate: EmailTemplateBody = {subType: 'Dashboard', emailSub: 'Subject', emailText: this.htmlEmailTemplate}
  /* Form group for the language settings */
  templateFormGrp: FormGroup;
  /*  holds the list of filtered options */
  filteredTemplates: Observable<EmailTemplate[]>;

  constructor(private router: Router, private reportService: ReportService) { }

  ngOnInit(): void {
    this.setUpForm();
  }

  /* Close slidesheet */
  close() {
    this.router.navigate([{ outlets: { sb: `sb/report/send-email`, outer: null } }]);
  }

  /*
   * @param el mat auto complete element
   * @returns icon name
   */
   getDropdownPos(el: MatAutocomplete) {
    let pos = 'chevron-down';
    if (el && el.isOpen) {
      pos = 'chevron-up';
    }
    return pos;
  }

  /* Set Filtered list */
  public setupFilteredList() {
    this.filteredTemplates = this.templateFormGrp.controls.templateName.valueChanges.pipe(
      map((template: string | null) => template ? this.filter(template, this.templates) : this.templates?.slice()));
  }

   /* Setup the form*/
  private setUpForm(){
    this.templateFormGrp = new FormGroup({
      templateName: new FormControl(),
    });
    this.templateFormGrp.controls.templateName.setValue('No');
    this.setupFilteredList();
  }

  /**
   * filters data list
   * @param value filter value
   * @param list current list to filter
   */
   private filter(value: string, list: EmailTemplate[]): EmailTemplate[] {
    const filterValue = value?.toLowerCase();
    if (list) {
      return list.filter(temp => temp?.desc?.toLowerCase().indexOf(filterValue) === 0);
    }
  }

  /* Update the template */
  updateTemplate(event: MatAutocompleteSelectedEvent){
    this.reportService.selectedTemplate.next(this.emailTemplate);
    this.close();
  }

}

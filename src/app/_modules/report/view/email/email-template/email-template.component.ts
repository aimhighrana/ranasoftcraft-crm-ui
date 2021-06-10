import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportService } from '../../../_service/report.service'
import { EmailTemplate } from '../../../_models/email';
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

  /* Templates list */
  templates: EmailTemplate[] = [{ templateName: 'No', subject: '', message: '' }, { templateName: 'Template 1', subject: 'Subject - Template 1', message: '<b>Template 2</b>' }]
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
   private filter(value: string, list): EmailTemplate[] {
    const filterValue = value?.toLowerCase();
    if (list) {
      return list.filter(temp => temp?.templateName?.toLowerCase().indexOf(filterValue) === 0);
    }
  }

  /* Update the template */
  updateTemplate(event: MatAutocompleteSelectedEvent){
    const template = this.templates.find(x=>x.templateName === event.option.viewValue);
    this.reportService.selectedTemplate.next(template);
    this.close();
  }

}

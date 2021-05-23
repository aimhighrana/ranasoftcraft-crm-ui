import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportService } from '../../../_service/report.service'
import { EmailTemplate } from '../../../_models/email';

@Component({
  selector: 'pros-email-template',
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.scss']
})
export class EmailTemplateComponent implements OnInit {

  templates: EmailTemplate[] = [{ templateName: "No", subject: "", message: "" }, { templateName: "Template 1", subject: "Subject - Template 1", message: "Template 2" }]
  selected: EmailTemplate = this.templates[0];


  constructor(private router: Router, private reportService: ReportService) { }

  ngOnInit(): void { }

  close() {
    this.router.navigate([{ outlets: { sb: `sb/report/send-email`, outer: null } }]);
  }

  onTemplateSelection() {
    this.reportService.selectedTemplate.next(this.selected);
    this.close();
  }
}

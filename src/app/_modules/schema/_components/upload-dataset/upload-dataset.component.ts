import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'pros-upload-dataset',
  templateUrl: './upload-dataset.component.html',
  styleUrls: ['./upload-dataset.component.scss']
})
export class UploadDatasetComponent implements OnInit {

  constructor() { }
  @ViewChild(MatStepper) stepper!: MatStepper;

  datasetlabel = 'Dataset name';
  brule = 'Schema name';

  ngOnInit(): void {
  }

  // ngAfterViewInit() {document.getElementsByClassName('mat-horizontal-stepper-header-container')[0].style.visibility = 'hidden'}
  step(where: string) {this.stepper[where]();}

}

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pros-generic-textbox',
  templateUrl: './generic-textbox.component.html',
  styleUrls: ['./generic-textbox.component.scss']
})
export class GenericTextboxComponent implements OnInit {

  constructor() { }

  @Input() label: string;
  @Input() placeholder: string;
  @Input() errorMessage: string;
  @Input() value:string;
  ngOnInit(): void {
  }

}

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pros-generic-dropdown',
  templateUrl: './generic-dropdown.component.html',
  styleUrls: ['./generic-dropdown.component.scss']
})
export class GenericDropdownComponent implements OnInit {
  @Input() label: string;
  @Input() placeholder: string;
  @Input() errorMessage: string;
  @Input() value: string;
  @Input() selectedOption: string;
  constructor() { }

  ngOnInit(): void {
  }

}

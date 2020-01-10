import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pros-schemabadge-tile',
  templateUrl: './schemabadge-tile.component.html',
  styleUrls: ['./schemabadge-tile.component.scss']
})
export class SchemabadgeTileComponent implements OnInit {

  @Input()
  createSchemaBadge: boolean;
  @Input()
  showAddNewTitle: string;
  constructor() { }
  ngOnInit() {
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { WidgetService } from 'src/app/_services/widgets/widget.service';

export interface User {
  name: string;
}

@Component({
  selector: 'pros-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})


export class FilterComponent implements OnInit {

  // @Output() filterCriteria = new EventEmitter();

  @Input() widgetId:any;

  myControl = new FormControl();
  options: string[] = new Array();
  arrayBuckets :any[] ;
  filteredOptions: Observable<string[]>;
  constructor(private widgetService : WidgetService) { }

  ngOnInit(): void {
    this.getFilterMetadata();
    this.loadAlldropData();

     this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

  }

  public getFilterMetadata():void{
    this.widgetService.getFilterMetadata(this.widgetId).subscribe(returndata=>{

    });
  }

  private loadAlldropData():void{
    this.widgetService.loadAlldropData().subscribe(returnData=>{
      this.arrayBuckets = returnData.aggregations.total_per_year.buckets
      this.arrayBuckets.forEach(bucket=>{
        this.options.push(bucket.key);
      });
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

   changeEvent(eventdata):void{
    console.log(eventdata.source.value);
    // this.filterCriteria.emit(eventdata.source.value);
  }

}

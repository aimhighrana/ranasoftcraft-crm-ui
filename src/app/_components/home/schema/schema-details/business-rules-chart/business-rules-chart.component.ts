import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';

@Component({
  selector: 'pros-business-rules-chart',
  templateUrl: './business-rules-chart.component.html',
  styleUrls: ['./business-rules-chart.component.scss']
})
export class BusinessRulesChartComponent implements OnInit {

  businessChartDataSet: ChartDataSets[];
  businessChartLabels: Label[];
  businessChartLegend = false;
  businessChartType: ChartType = 'bar';
  businessChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        stacked: true,
        scaleLabel: {
          display: true,
          labelString: 'Business Rules'
        },
        // categoryPercentage: .2,
        // barPercentage: 1,
      }
    ],
      yAxes: [{
        stacked: true,
        scaleLabel: {
          display: true,
          labelString: 'Value'
        }
      }
    ]
    },
    tooltips: {
      mode: 'label'
    }

  };

  constructor(private schemaDetailService: SchemaDetailsService) { }

  ngOnInit() {
    this.getBusinessChartData();
  }

  getBusinessChartData() {
    const data = this.schemaDetailService.getSchemaBusinessRuleChartData();
    if (data != null) {
      this.businessChartDataSet = data.dataSet;
      this.businessChartLabels = data.labels;
    }
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SchemaDetailsService {

  overViewChartData: any = {dataSet: [{type: 'line', label: 'Error', id: 'ERROR_OVERVIEW_ID', backgroundColor: 'rgba(249, 229, 229, 1)', borderColor: 'rgba(195, 0, 0, 1)', fill: false, pointRadius: 5, pointBackgroundColor: 'rgba(195, 0, 0, 1)', data: [90820, 26593, 37414, 2759, 21445, 55548, 29692, 3221, 61699, 81565, 66268, 29015, 36702, 4479, 96348, 77370, 58139, 40629, 62906, 58239, 17238, 90234, 88255, 80064, 74681, 6274, 50131, 91330, 2922, 66071, 46921, 61610, 63397, 64015, 3870, 96347, 81534, 10856, 51797, 69800, 85094, 7304, 65047, 86667, 95840, 11949, 22557, 24269, 41777, 25870, 12708, 67697, 92746, 87360, 48243, 33977, 12193, 98687, 8929, 11214, 59417, 27083, 56531, 51923, 6702, 3589, 36023, 97634, 98700, 2609, 34805, 57637, 4546, 4254, 80786, 25528, 20011, 51319, 15147, 59127, 94158, 76635, 31027, 14595, 98344, 96814, 76988, 73389, 34501, 37787, 14115, 39230, 14412, 11852, 23937, 71849, 34375, 76317, 71649, 48729, 91519, 15032, 32923, 56535, 7936]}, {type: 'line', label: 'Success', id: 'SUCCESS_OVERVIEW_ID', backgroundColor: 'rgba(231, 246, 237, 1)', borderColor: 'rgba(18, 164, 74, 1)', fill: false, pointRadius: 5, pointBackgroundColor: 'rgba(18, 164, 74, 1)', data: [54218, 55272, 24645, 52977, 34070, 26034, 87522, 74420, 72202, 88078, 61760, 29216, 41739, 53566, 86631, 72649, 60635, 52094, 23490, 28981, 28913, 72198, 66847, 32327, 88440, 49677, 58012, 22527, 87783, 24489, 81156, 78738, 86740, 28352, 75396, 24621, 78239, 87347, 53607, 84016, 65602, 64967, 85040, 82358, 50669, 64936, 51425, 39003, 25326, 23040, 83433, 42297, 61996, 41457, 21438, 37834, 59321, 86195, 36898, 60071, 87645, 74876, 21040, 42501, 32009, 36355, 58825, 65465, 29645, 79866, 52415, 70212, 46015, 80352, 36107, 68875, 68085, 47604, 89223, 44208, 60025, 49858, 59566, 70965, 80080, 55704, 44069, 27920, 55473, 67387, 24467, 36985, 50354, 79636, 90511, 77247, 68352, 79854, 68833, 47600, 81423, 55516, 78643, 32656, 43350]}, {type: 'line', label: 'Skipped', id: 'SKIPPED_OVERVIEW_ID', backgroundColor: 'rgba(246, 244, 249, 1)', borderColor: 'rgba(163, 145, 197, 1)', fill: false, pointRadius: 5, pointBackgroundColor: 'rgba(163, 145, 197, 1)', data: [64826, 85935, 68717, 74387, 37820, 84043, 28004, 76792, 52123, 25719, 71180, 68161, 49325, 53214, 64040, 37160, 85721, 80337, 62751, 42681, 86386, 61087, 83510, 43157, 39655, 60510, 41482, 85611, 90249, 22118, 37858, 84629, 59227, 51631, 32089, 38178, 41608, 40032, 34564, 87384, 28460, 66515, 49399, 80702, 66910, 61534, 37293, 29688, 33552, 30933, 51577, 28964, 33318, 59473, 55993, 70312, 46158, 68735, 65643, 57021, 84415, 47103, 36316, 61555, 85694, 46799, 69822, 64614, 84828, 42409, 51533, 23383, 41165, 47829, 70932, 49559, 82642, 84489, 45967, 54023, 66953, 84084, 68642, 84384, 28605, 32863, 90159, 56101, 59904, 43029, 24891, 63502, 88120, 36012, 47673, 51361, 51886, 79636, 77932, 39116, 88434, 77129, 22056, 79637, 44887]}, {type: 'line', label: 'Duplicate', id: 'DUPLICATE_OVERVIEW_ID', backgroundColor: 'rgba(248, 240, 246, 1)', borderColor: 'rgba(182, 104, 170, 1)', fill: false, pointRadius: 5, pointBackgroundColor: 'rgba(182, 104, 170, 1)', data: [34513, 59619, 51892, 68095, 63117, 47807, 38518, 52285, 74833, 32124, 47241, 63816, 86905, 61125, 21831, 46066, 28857, 79893, 39052, 85580, 23528, 34086, 81163, 86802, 49299, 62585, 66267, 83458, 66182, 90443, 83650, 54407, 31585, 72107, 81363, 37991, 45238, 75555, 49905, 22275, 86800, 84828, 43280, 32220, 77043, 66343, 69671, 28596, 68774, 54576, 89929, 34132, 74036, 84088, 54771, 75185, 44566, 61825, 34952, 27048, 89231, 30014, 55159, 25753, 31676, 68569, 86710, 76130, 65201, 57623, 50570, 87568, 52259, 31185, 82627, 21712, 60424, 84619, 50670, 82039, 32342, 74976, 35289, 26273, 82190, 21812, 45424, 25825, 68285, 47299, 89301, 90713, 70323, 74349, 88036, 32378, 45920, 67644, 28431, 24543, 57205, 63441, 44526, 47517, 44274]}], labels: ['24-Oct-2019', '25-Sep-2026', '14-Jan-2021', '20-Jun-2018', '18-Mar-2031', '19-Feb-2010', '22-Mar-2016', '20-Aug-2030', '28-Jan-2021', '30-Apr-2014', '14-Mar-2013', '18-Jul-2028', '10-Mar-2013', '15-Oct-2022', '20-Feb-2031', '13-Nov-2027', '16-Jun-2022', '08-Mar-2022', '15-Mar-2027', '16-Feb-2027', '09-Feb-2027', '03-Feb-2016', '07-May-2016', '26-Mar-2031', '19-Jan-2026', '25-May-2025', '12-May-2014', '01-Mar-2031', '08-Dec-2013', '12-Dec-2017', '08-Aug-2017', '26-Mar-2025', '05-May-2023', '07-Sep-2013', '01-May-2016', '26-Aug-2010', '29-Mar-2017', '15-Oct-2021', '22-Aug-2028', '08-Mar-2030', '21-Nov-2014', '01-Feb-2011', '07-Jul-2013', '20-Apr-2010', '17-Oct-2016', '14-Aug-2011', '27-Sep-2015', '28-May-2010', '19-May-2019', '28-Sep-2024', '27-Mar-2014', '03-Jul-2030', '20-Sep-2026', '22-May-2020', '16-Jul-2028', '12-Apr-2022', '06-Feb-2025', '10-Oct-2028', '07-Jul-2026', '07-Oct-2016', '09-Jan-2020', '11-Aug-2011', '23-Jun-2025', '03-Jun-2013', '04-Feb-2013', '27-Apr-2023', '07-Feb-2021', '28-Oct-2017', '07-May-2019', '18-Mar-2010', '01-Nov-2025', '07-Oct-2026', '17-Sep-2018', '15-Dec-2016', '12-Dec-2015', '10-Nov-2028', '29-Oct-2014', '09-Apr-2017', '15-Apr-2020', '01-Jan-2022', '14-Apr-2024', '29-Sep-2028', '05-Jul-2013', '07-Dec-2010', '21-May-2020', '12-Jun-2011', '19-Dec-2013', '23-Jun-2029', '25-Jul-2012', '07-Jul-2024', '07-Sep-2028', '18-Jan-2021', '05-Dec-2017', '08-Sep-2020', '14-Dec-2011', '19-Mar-2025', '30-Jul-2019', '18-Mar-2023', '27-Sep-2023', '04-Oct-2025', '07-Jul-2026', '15-Oct-2024', '30-May-2023', '13-Dec-2013', '27-Mar-2017']};

  doughnutChartData: any = {labels: ['Success', 'Error'], dataSet: {data: [20, 80]}};

  schemaDataTable: any = {matMenu: ['Details', 'Show Live Data'], columnInfo: [{columnId: 'materialNumber', columnName: 'Material Number', columnDescription: ''}, {columnId: 'plant', columnName: 'Plant', columnDescription: ''}, {columnId: 'mrp_type', columnName: 'MRP Type', columnDescription: ''}, {columnId: 'mrp_controller', columnName: 'MRP Controller', columnDescription: ''}, {columnId: 'reorder_point', columnName: 'Reorder Point', columnDescription: ''}, {columnId: 'max_stock_level', columnName: 'Max Stock Level', columnDescription: ''}, {columnId: 'safety_time', columnName: 'Safety Time', columnDescription: ''}], displayedColumnsForAppend: ['materialNumber', 'plant', 'mrp_type', 'mrp_controller', 'reorder_point', 'max_stock_level', 'safety_time', 'field1', 'field2', 'field3', 'field4', 'status'], displayedColumns: ['actionColumn', 'checkBoxColumn', 'materialNumber', 'plant', 'mrp_type', 'mrp_controller', 'reorder_point', 'max_stock_level', 'safety_time', 'field1', 'field2', 'field3', 'field4', 'status'], dataSource: [{hasError: true, materialNumber: {data: '1234', isInError: false}, plant: {data: 'A234', isInError: true, error_msg: 'Wrong plant data'}, mrp_type: {data: 'PD', isInError: false}, mrp_controller: {data: '001', isInError: true, error_msg: 'Mrp controller must be 007'}, reorder_point: {data: '6,000', isInError: false}, max_stock_level: {data: '5,2345', isInErrro: false}, safety_time: {data: '5,000', isInError: false}, field1: {data: 'Field 1', isInError: false}, field2: {data: '', isInError: true, error_msg: 'Field 2 data is missing'}, field3: {data: '', isInError: false}, field4: {data: 'test data', isInError: false}, status: {all_status: [{status: 'Draft', color: 'accent'}, {status: 'Error', color: 'warn'}, {status: 'Success', color: 'primary'}]}}, {hasError: true, materialNumber: {data: '736785692', isInError: false}, plant: {data: 'A8726834', isInError: false}, mrp_type: {data: 'PD', isInError: false}, mrp_controller: {data: '007', isInError: false}, reorder_point: {data: '34,4543', isInError: false}, max_stock_level: {data: '5,2345', isInErrro: false}, safety_time: {data: '5,000', isInError: false}, field1: {data: 'Field 1', isInError: false}, field2: {data: '', isInError: true, error_msg: 'Field 2 data is missing'}, field3: {data: '', isInError: false}, field4: {data: 'test data', isInError: false}, status: {all_status: [{status: 'Draft', color: 'accent'}, {status: 'Error', color: 'warn'}, {status: 'Success', color: 'primary'}]}}, {hasError: true, materialNumber: {data: '98712678152', isInError: false}, plant: {data: 'A7226', isInError: true, error_msg: 'Invalid plant number'}, mrp_type: {data: 'GD', isInError: true, error_msg: 'Invalid code GD for Mrp type'}, mrp_controller: {data: '007', isInError: false}, reorder_point: {data: '', isInError: true, error_msg: 'Reorder point can not be blank'}, max_stock_level: {data: '5,2345', isInErrro: false}, safety_time: {data: '5,000', isInError: false}, field1: {data: 'Field 1', isInError: false}, field2: {data: '100', isInError: true, error_msg: 'Invalid code 100'}, field3: {data: '', isInError: false}, field4: {data: 'test data', isInError: false}, status: {all_status: [{status: 'Error', color: 'warn'}]}}, {hasError: false, materialNumber: {data: '98712678152', isInError: false}, plant: {data: 'B7623', isInError: false}, mrp_type: {data: 'ID', isInError: false}, mrp_controller: {data: '007', isInError: false}, reorder_point: {data: '234', isInError: false}, max_stock_level: {data: '5,2345', isInErrro: false}, safety_time: {data: '5,000', isInError: false}, field1: {data: 'Field 1', isInError: false}, field2: {data: '20', isInError: false}, field3: {data: '', isInError: false}, field4: {data: 'test data', isInError: false}, status: {all_status: [{status: 'Skipped', color: 'gray'}, {status: 'Duplicate', color: 'warn'}]}}], columnName: {materialNumber: 'Material Number', plant: 'Plant', mrp_type: 'Mrp Type', mrp_controller: 'Mrp Controller', reorder_point: 'Reorder Point', max_stock_level: 'Max Stock Level', safety_time: 'Safety Time', field1: 'Field 1 Data', field2: 'Field 2 Data', field3: 'Field 3 Data', field4: 'Field 4 Data', status: 'Status'}};
  schemaErrorData: any = {matMenu: ['Details', 'Show Live Data'], columnInfo: [{columnId: 'materialNumber', columnName: 'Material Number', columnDescription: ''}, {columnId: 'plant', columnName: 'Plant', columnDescription: ''}, {columnId: 'mrp_type', columnName: 'MRP Type', columnDescription: ''}, {columnId: 'mrp_controller', columnName: 'MRP Controller', columnDescription: ''}, {columnId: 'reorder_point', columnName: 'Reorder Point', columnDescription: ''}, {columnId: 'max_stock_level', columnName: 'Max Stock Level', columnDescription: ''}, {columnId: 'safety_time', columnName: 'Safety Time', columnDescription: ''}], displayedColumnsForAppend: ['materialNumber', 'plant', 'mrp_type', 'mrp_controller', 'reorder_point', 'max_stock_level', 'safety_time', 'field1', 'field2', 'field3', 'field4', 'status'], displayedColumns: ['actionColumn', 'checkBoxColumn', 'materialNumber', 'plant', 'mrp_type', 'mrp_controller', 'reorder_point', 'max_stock_level', 'safety_time', 'field1', 'field2', 'field3', 'field4', 'status'], dataSource: [{materialNumber: {data: '1234', isInError: false}, plant: {data: 'A234', isInError: true, error_msg: 'Wrong plant data'}, mrp_type: {data: 'PD', isInError: false}, mrp_controller: {data: '001', isInError: true, error_msg: 'Mrp controller must be 007'}, reorder_point: {data: '6,000', isInError: false}, max_stock_level: {data: '5,2345', isInErrro: false}, safety_time: {data: '5,000', isInError: false}, field1: {data: 'Field 1', isInError: false}, field2: {data: '', isInError: true, error_msg: 'Field 2 data is missing'}, field3: {data: '', isInError: false}, field4: {data: 'test data', isInError: false}, status: {all_status: [{status: 'Draft', color: 'accent'}, {status: 'Error', color: 'warn'}, {status: 'Success', color: 'primary'}]}}, {materialNumber: {data: '736785692', isInError: false}, plant: {data: 'A8726834', isInError: false}, mrp_type: {data: 'PD', isInError: false}, mrp_controller: {data: '007', isInError: false}, reorder_point: {data: '34,4543', isInError: false}, max_stock_level: {data: '5,2345', isInErrro: false}, safety_time: {data: '5,000', isInError: false}, field1: {data: 'Field 1', isInError: false}, field2: {data: '', isInError: true, error_msg: 'Field 2 data is missing'}, field3: {data: '', isInError: false}, field4: {data: 'test data', isInError: false}, status: {all_status: [{status: 'Draft', color: 'accent'}, {status: 'Error', color: 'warn'}, {status: 'Success', color: 'primary'}]}}, {materialNumber: {data: '98712678152', isInError: false}, plant: {data: 'A7226', isInError: true, error_msg: 'Invalid plant number'}, mrp_type: {data: 'GD', isInError: true, error_msg: 'Invalid code GD for Mrp type'}, mrp_controller: {data: '007', isInError: false}, reorder_point: {data: '', isInError: true, error_msg: 'Reorder point can not be blank'}, max_stock_level: {data: '5,2345', isInErrro: false}, safety_time: {data: '5,000', isInError: false}, field1: {data: 'Field 1', isInError: false}, field2: {data: '100', isInError: true, error_msg: 'Invalid code 100'}, field3: {data: '', isInError: false}, field4: {data: 'test data', isInError: false}, status: {all_status: [{status: 'Error', color: 'warn'}]}}], columnName: {materialNumber: 'Material Number', plant: 'Plant', mrp_type: 'Mrp Type', mrp_controller: 'Mrp Controller', reorder_point: 'Reorder Point', max_stock_level: 'Max Stock Level', safety_time: 'Safety Time', field1: 'Field 1 Data', field2: 'Field 2 Data', field3: 'Field 3 Data', field4: 'Field 4 Data', status: 'Status'}};
  schemaCategoryData: any = {dataSet: [{type: 'line', label: 'Validness', id: 'Validness_01', backgroundColor: 'rgba(217,83,79,0.75)', fill: false, data: [1000, 2000, 4000, 5000]}, {type: 'line', label: 'Accuracy', id: 'Accuracy_01', backgroundColor: 'rgba(92,184,92,0.75)', fill: false, data: [500, 600, 700, 800]}], labels: ['01-NOV', '02-NOV', '03-NOV', '02-NOV']};

  schemaStatusCount: any = {status_count: {All: 177, Error: 10, Success: 30, Skipped: 70, Draft: 40, Duplicate: 4, Outdated: 23}};
  schemaBusinessRuleChartData: any = {labels: ['MRP Controller', 'Reorder point', 'Rounding Value', 'Max stock level'], dataSet: [{label: 'Error', data: [100, 200, 230, 150], backgroundColor: '#c30000', hoverBackgroundColor: '#c30000'}, {label: 'Success', data: [30, 40, 200, 400], backgroundColor: '#12a44a', hoverBackgroundColor: '#12a44a'}, {label: 'Skipped', data: [50, 80, 120, 0], backgroundColor: '#a391c5', hoverBackgroundColor: '#a391c5'}, {label: 'Duplicate', data: [100, 300, 60, 20], backgroundColor: '#b668aa', hoverBackgroundColor: '#b668aa'}, {label: 'Draft', data: [10, 0, 155, 100], backgroundColor: '#66aa00', hoverBackgroundColor: '#66aa00'}, {label: 'Outdated', data: [0, 4, 5, 1], backgroundColor: '#dd4477', hoverBackgroundColor: '#dd4477'}]};
  constructor() { }

  getOverViewChartData() {
    return this.overViewChartData;
  }

  getDoughnutChartData() {
    return this.doughnutChartData;
  }

  getSchemaDetailsTableData() {
    return this.schemaDataTable;
  }

  getCategoryChartData() {
    return  this.schemaCategoryData;
  }

  getSchemaStatusCount() {
    return  this.schemaStatusCount;
  }

  getSchemaAllErrorData() {
    return this.schemaErrorData;
  }
  getSchemaBusinessRuleChartData() {
    return this.schemaBusinessRuleChartData;
  }
}

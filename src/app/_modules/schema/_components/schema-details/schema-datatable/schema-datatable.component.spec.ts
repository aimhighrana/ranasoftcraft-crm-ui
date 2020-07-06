import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SchemaDatatableComponent } from './schema-datatable.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldExitsResponse, MetadataModeleResponse, Heirarchy, SchemaBrInfo, MetadataModel } from 'src/app/_models/schema/schemadetailstable';
import { PageEvent } from '@angular/material/paginator';
import { RouterTestingModule } from '@angular/router/testing';

describe('SchemaDatatableComponent', () => {
  let component: SchemaDatatableComponent;
  let fixture: ComponentFixture<SchemaDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [ SchemaDatatableComponent ],
      providers:[]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('findFieldExitsOnMetaRes(), find the field parent ids ', async(()=>{
    const mockRes: FieldExitsResponse = new FieldExitsResponse();
    mockRes.fieldId = 'VALUE';
    const actualValue =  component.findFieldExitsOnMetaRes('VALUE');
    component.selectedGridIds = ['MATL_DESC_GRID'];
    component.selectedHierarchyIds = ['420'];
    component.allMetaDataFields.next(new MetadataModeleResponse());
    expect(mockRes).toEqual(actualValue);


  }));

  it('dataTableTrackByFun(), data table track by ', async(()=>{
      const mdaRec = {key:'MAT0000123'};
      const actualValue =  component.dataTableTrackByFun(0, mdaRec);
      expect(mdaRec.key).toEqual(actualValue);
  }));

  it('applyGridField(), update table view for selected grid fields ', async(()=>{
    expect(component.applyGridField('LANGUAGEGRID_01', true)).toEqual(undefined);
  }));

  it('applyHeirarchyField(), update table view for selected heirarchy fields', async(()=>{
    expect(component.applyHeirarchyField('420', true)).toEqual(undefined);
  }));

  it('hierarchyTrackBy() , track by for hierarchy fields', async(()=>{
    const heiObj: Heirarchy = new Heirarchy();
    heiObj.fieldId = '420';
    heiObj.heirarchyId = '420';
    heiObj.heirarchyText = 'Testing Hei..';
    expect(component.hierarchyTrackBy(heiObj)).toEqual(heiObj.heirarchyId);
  }));

  it('gridTrackBy() , track by for grid fields', async(()=>{
    expect(component.gridTrackBy('HELLO_GRID_01')).toEqual('HELLO_GRID_01');
  }));

  it('hasError() , check the field is in error', async(()=>{
    const row = {} as any;
    expect(component.hasError(row, 'VALUE')).toEqual(false);
    row.row_status = {fieldData:'Error,Success'};
    row.VALUE = {isCorrected:false};
    const brInfo: SchemaBrInfo = new SchemaBrInfo();
    brInfo.fields =  ['VALUE','DESC'];
    component.schemaBrInfoList = [brInfo];
    expect(component.hasError(row, 'VALUE')).toEqual(true);

  }));

  it('isCorrected(), check the field is corrected or not', async(()=>{
    let row = {} as any;
    row.VALUE = {isCorrected:true};
    expect(component.isCorrected(row, 'VALUE',0)).toEqual(true);

    row = {} as any;
    expect(component.isCorrected(row, 'VALUE',0)).toEqual(false);

  }));

  it('isEditable(), check field is editable or note', async(()=>{
    const metaDataFieldList: MetadataModel = {} as MetadataModel;
    metaDataFieldList.fieldId = 'TEST123';
    metaDataFieldList.dataType = 'CHAR';
    metaDataFieldList.picklist = '0';
    component.metaDataFieldList = {TEST123:metaDataFieldList};
    const row = {} as any;
    row.row_status = {fieldData:'Outdated'};
    expect(component.isEditable('TEST123',row)).toEqual(false);

    component.metaDataFieldList = {};
    expect(component.isEditable('TEST123',row)).toEqual(false);
  }));

  it('showErrorMessages(), show error message matTooltip', async(()=>{
    const row = {} as any;
    row.row_status = {fieldData:'Error,Success'};
    const brInfo: SchemaBrInfo = new SchemaBrInfo();
    brInfo.fields =  ['VALUE','DESC'];
    brInfo.dynamicMessage = 'Testing br 1';
    component.schemaBrInfoList = [brInfo];
    expect(component.showErrorMessages(row, 'VALUE')).toEqual(brInfo.dynamicMessage);

    component.schemaBrInfoList = [];
    expect(component.showErrorMessages(row, 'VALUE')).toEqual('');

    row.row_status = {fieldData:'Success'};
    expect(component.showErrorMessages(row, 'VALUE')).toEqual('');
  }));

  it('doCorrection(), start correction on blur to field', async(()=>{
      const row = {
        OBJECTNUMBER :{
          fieldData: '387632'
        }
      }

      expect(component.doCorrection(row, 'HELLO_TEST','Test123',0)).toEqual(undefined);
  }));

  it('editCurrentCell(), edit current cell', async(()=>{
    expect(component.editCurrentCell('VALUE',1)).toEqual(undefined);
  }));

  it('dynamicChipColor(), get dynamic chip color ', async(()=>{
    let status = 'error';
    expect(component.dynamicChipColor(status)).toEqual('errorChip');
    status = 'success';
    expect(component.dynamicChipColor(status)).toEqual('successChip');
    status = 'corrections';
    expect(component.dynamicChipColor(status)).toEqual('correctedChip');
    status = 'skipped';
    expect(component.dynamicChipColor(status)).toEqual('skippedChip');
    status = '';
    expect(component.dynamicChipColor(status)).toEqual('');

  }));

  it('doPagination(), call while pagination ', async(()=>{
    const pageEvent = new PageEvent();
    pageEvent.pageIndex = 0;
    pageEvent.pageSize = 10;
    expect(component.doPagination(pageEvent)).toEqual(undefined);
  }));

  it('loadSchameDataByStatus(), load the schema data based on status index ', async(()=>{
    expect(component.loadSchameDataByStatus(0)).toEqual(undefined);
  }));

  it('isGroup(), check the group is enable or not', async(()=>{
      expect(component.isGroup(0,{isGroup:true})).toEqual(true);
      expect(component.isGroup(0,{isGroup:false})).toEqual(false);
      expect(component.isGroup(0,{})).toEqual(undefined);
  }));

  it('masterToggle(), should toggle', async(()=>{
    expect(component.masterToggle()).toEqual(undefined);
  }));


  it('matChipCountLabel(), should return the status count by status index', async(()=>{
    component.schemaDetails.totalCount = 100;
    const allCount =  component.matChipCountLabel(0);
    expect(100).toEqual(allCount);

    component.schemaDetails.errorCount = 20;
    const errorCount =  component.matChipCountLabel(1);
    expect(20).toEqual(errorCount);

    component.schemaDetails.successCount = 79;
    const successCount =  component.matChipCountLabel(2);
    expect(79).toEqual(successCount);

    component.schemaDetails.correctionValue = 1;
    const correctedCount =  component.matChipCountLabel(4);
    expect(1).toEqual(correctedCount);
  }));


});

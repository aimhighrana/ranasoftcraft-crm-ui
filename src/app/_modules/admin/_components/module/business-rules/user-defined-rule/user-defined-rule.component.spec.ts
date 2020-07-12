import { UserDefinedRuleComponent } from './user-defined-rule.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { BreadcrumbComponent } from 'src/app/_modules/shared/_components/breadcrumb/breadcrumb.component';
import { AddTileComponent } from 'src/app/_modules/shared/_components/add-tile/add-tile.component';
import { of } from 'rxjs';
import { UdrCdktreeService, ItemNodeInfo, BlockType, ItemNode } from './udr-cdktree.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UdrConditionFormComponent } from './udr-condition-form/udr-condition-form.component';
import { UdrConditionControlComponent } from './udr-condition-control/udr-condition-control.component';
import { UDRHierarchyModel, UDRBlocksModel, UdrModel } from '../business-rules.modal';

describe('UserDefinedRuleComponent', () => {
  let component: UserDefinedRuleComponent;
  let fixture: ComponentFixture<UserDefinedRuleComponent>;
  let schemaService:SchemaService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule,
        ReactiveFormsModule , HttpClientTestingModule, FormsModule
      ],
      declarations: [UserDefinedRuleComponent, BreadcrumbComponent, AddTileComponent, UdrConditionFormComponent, UdrConditionControlComponent],
      providers: [
        SchemaService, UdrCdktreeService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDefinedRuleComponent);
    component = fixture.componentInstance;
    schemaService = fixture.debugElement.injector.get(SchemaService);
  });

  it('fetchConditionList(), should call service for get all condition list', async(()=>{

    spyOn(schemaService,'getConditionList').and.returnValue(of([]));

    component.fetchConditionList([]);

    expect(schemaService.getConditionList).toHaveBeenCalledTimes(1);
  }));

  it('ngOnInit(), should load pre required ', async(()=>{
    spyOn(schemaService,'getConditionList').and.returnValue(of([]));

    component.ngOnInit();

    expect(schemaService.getConditionList).toHaveBeenCalledTimes(1);
  }));

  it('addNewItem(), should add to ne item', async(()=>{
    component.treeControl.dataNodes = [];
    component.addNewItem(new ItemNodeInfo(), BlockType.COND);
    expect(component.addNewItem).toBeTruthy();
  }));

  it('createBlock(), create blocks', async(()=>{
    component.createBlock(BlockType.AND);
    expect(component.enableBlock).toEqual(true);
  }));

  it('returnConditional(), should return conditional', async(()=>{
   // mock data
    const u1: UDRHierarchyModel = new UDRHierarchyModel();
    u1.id = '72367463287';
    u1.blockRefId = '72745832';

    const hierarchy: UDRBlocksModel = new UDRBlocksModel();
    hierarchy.id = '72745832';
    hierarchy.blockType = BlockType.COND;

    const udrDto: UdrModel = new UdrModel();
    udrDto.blocks = [hierarchy];
    component.udrModel = udrDto;
    // call actual method
    const actualRes = component.returnConditional([u1]);

    expect(actualRes.length).toEqual(1);

  }));

  it('returnConditionInfo(), should return conditional information', async(()=>{
    // mock data
    const u1: UDRHierarchyModel = new UDRHierarchyModel();
    u1.id = '72367463287';
    u1.blockRefId = '72745832';

    const hierarchy: UDRBlocksModel = new UDRBlocksModel();
    hierarchy.id = '72745832';
    hierarchy.blockType = BlockType.OR;

    const udrDto: UdrModel = new UdrModel();
    udrDto.blocks = [hierarchy];

    component.udrModel = udrDto;
    // call actual method
    const actualRes = component.returnConditionInfo([u1]);
    expect(actualRes.length).toEqual(1);

  }));

  it('openAllPanels(), should open all accordiation', async(()=>{
    component.openAllPanels();

    expect(component.expandPanel).toEqual(true);
  }));

  it('closeAllPanels(), should close all accordiation', async(()=>{
    component.closeAllPanels();

    expect(component.expandPanel).toEqual(false);
  }));

  it('prepareConditionDesc(), generate condition based on aggrigation operator', async(()=>{
      const condition: UDRBlocksModel = new UDRBlocksModel();
      condition.conditionOperator = 'EQUAL';
      condition.conditionFieldValue = '1234';
      condition.conditionFieldId = 'UNIT';

      let res = component.prepareConditionDesc(condition);

      expect(res).toEqual('UNIT === 1234');

      condition.conditionOperator = 'STARTS_WITH';
      res = component.prepareConditionDesc(condition);

      expect(res).toEqual('UNIT startWith("1234")');
  }));

  it('udrBlocksModelFromChildren(), block model ', async(()=>{
    const childNode: ItemNode[] = [
      {children:[],item:'And Block',nodeId:'7367826875'}
    ];

    const hierarchy: UDRBlocksModel = new UDRBlocksModel();
    hierarchy.id = '72745832';
    hierarchy.blockType = BlockType.OR;

    const udrDto: UdrModel = new UdrModel();
    udrDto.blocks = [hierarchy];

    component.udrModel = udrDto;
    component.conditionList = [];

    component.udrBlocksModelFromChildren(childNode);
    expect(component.udrModel.blocks.length).toEqual(2);
  }));

  it('blocksToUDRBlocksModel(), udr blocks', async(()=>{
    component.dataSource.data = [
      {nodeId:'3768753',children:[],item:'And Block'}
    ];

    const hierarchy: UDRBlocksModel = new UDRBlocksModel();
    hierarchy.id = '72745832';
    hierarchy.blockType = BlockType.OR;

    const udrDto: UdrModel = new UdrModel();
    udrDto.blocks = [hierarchy];
    udrDto.udrHierarchies = [];

    component.udrModel = udrDto;

    component.blocksToUDRBlocksModel();
    expect(component.blocksToUDRBlocksModel).toBeTruthy();
  }));


  it('deleteConditionaBlock(), delete condition block', async(()=>{
    // mock data
    const blockId = '632546325';

    component.moduleId = '234';
    spyOn(schemaService,'deleteConditionBlock').withArgs(blockId).and.returnValue(of(true));

    spyOn(schemaService,'getConditionList').withArgs(component.moduleId).and.returnValue(of([]));

    // call actual method
    component.deleteConditionaBlock(blockId);

    expect(schemaService.deleteConditionBlock).toHaveBeenCalledWith(blockId);
    expect(schemaService.getConditionList).toHaveBeenCalledWith(component.moduleId);

  }));
});

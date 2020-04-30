import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { UDRBlocksModel, UdrModel, UDRHierarchyModel, CoreSchemaBrInfo } from '../business-rules.modal';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { Observable, of } from 'rxjs';
import { MatAccordion } from '@angular/material/expansion';
import { ItemNodeInfo, ItemNode, UdrCdktreeService, BlockType } from './udr-cdktree.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'pros-user-defined-rule',
  templateUrl: './user-defined-rule.component.html',
  styleUrls: ['./user-defined-rule.component.scss']
})
export class UserDefinedRuleComponent implements OnInit {



  fieldForm: FormGroup;
  enableBlock = false;
  expandPanel = false;

  @Input()
  schemaId: string;

  @Input()
  moduleId: string;

  @Input()
  brId: string;

  @Input()
  brType: string;

  @Output()
  evtSaved: EventEmitter<CoreSchemaBrInfo> = new EventEmitter();

  conditionList: UDRBlocksModel[] = [];
  conditionListOb: Observable<UDRBlocksModel[]> = of([]);

  /**
   * Store selected condition on block as key | value
   */
  selectedBlocks: any = {} as any;

  /**
   * Global variable for hold user defined rule informations
   */
  udrModel: UdrModel = new UdrModel();

  level = 1;

  udrDescFrmCtrl: FormControl = new FormControl('');
  searchBlockCtrl: FormControl = new FormControl('');

  flatNodeMap = new Map<ItemNodeInfo, ItemNode>();

  nestedNodeMap = new Map<ItemNode, ItemNodeInfo>();

  treeControl: FlatTreeControl<ItemNodeInfo>;

  treeFlattener: MatTreeFlattener<ItemNode, ItemNodeInfo>;

  dataSource: MatTreeFlatDataSource<ItemNode, ItemNodeInfo>;

  @ViewChild('accordion', { static: true }) accordion: MatAccordion;

  constructor(
    private schemaService: SchemaService,
    private _formBuilder: FormBuilder,
    private treeDataSource: UdrCdktreeService,
    private snackBar: MatSnackBar
  ) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<ItemNodeInfo>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }


  ngOnInit() {

    this.fieldForm = this._formBuilder.group({
      fieldValue: '',
    });

    this.fetchConditionList(null);

    this.treeDataSource.dataSource.subscribe(data=>{
      this.dataSource.data = data;
    });

    this.searchBlockCtrl.valueChanges.subscribe(val=>{
      if(val && typeof val === 'string') {
        this.conditionListOb = of(this.conditionList.filter(fil => fil.blockDesc.toLocaleLowerCase().indexOf(val.toLocaleLowerCase()) !== -1));
      } else {
        this.conditionListOb = of(this.conditionList);
      }
    });

    if(this.brId) {
      this.schemaService.getUdrBusinessRuleInfo(this.brId).subscribe(res=>{
        this.udrModel = res;

        // set value to udrDescFrmCtrl
        this.udrDescFrmCtrl.setValue(res.brInfo ? res.brInfo.brInfo : '');
        console.log(res);
        this.prepareDataSourceWhileEdit(res);
      },error=>console.error(`Error : ${error}`));
    }

  }

  getLevel = (node: ItemNodeInfo) => node.level;

  isExpandable = (node: ItemNodeInfo) => true;

  getChildren = (node: ItemNode): ItemNode[] => node.children;

  hasChild = (_: number, _nodeData: ItemNodeInfo) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: ItemNodeInfo) => _nodeData.item === 'condition_search';

  transformer = (node: ItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item ? existingNode : new ItemNodeInfo();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  addNewItem(node: ItemNodeInfo, blockType: BlockType, nodeId?: string) {
    console.log(this.flatNodeMap.get(node));
    if(this.treeControl.dataNodes.length) {
      this.treeDataSource.insertOperatorBlocks(this.flatNodeMap.get(node), blockType, this.treeControl.dataNodes.length, nodeId);
    }
  }

  openAllPanels() {
    this.expandPanel = true;
    this.accordion.openAll();
  }

  closeAllPanels() {
    this.expandPanel = false;
    this.accordion.closeAll();
  }

  fetchConditionList(sno: string[]) {
    this.schemaService.getConditionList().subscribe(res=>{
      this.conditionList = res;
      this.conditionListOb = of(res);
    },error=>console.error(`Error : ${error}`));
  }

  createBlock(block: BlockType, nodeId?: string) {
    this.enableBlock = true;
    this.treeDataSource.initialize(block, nodeId);
  }

  /**
   *
   * @param element child elements
   */
  appendAbleFunc(element: UDRHierarchyModel[]) {
    // for conditional
    const searchItmNode =  this.treeControl.dataNodes.filter(fil => (fil.item === 'condition_search' && fil.level === this.level))[0];
    this.assignConBlocks(this.returnConditional(element), searchItmNode, true);

    // for child blocks
    const block =  this.returnConditionInfo(element);
    block.forEach(b=>{
      const node =  this.treeControl.dataNodes.filter(fil => ((fil.item.toLocaleLowerCase() === 'and block' || fil.item.toLocaleLowerCase() === 'or block') && fil.level === this.level-1))[0];
      if(node) {
        this.level++;
        this.addNewItem(node, b.blockType, b.id);
      }
      // check childs
      const childElement = this.udrModel.udrHierarchies.filter(fil => fil.parentId === b.id);
      if(childElement.length) {
        // recursion for append child nodes
        this.appendAbleFunc(childElement);
      }
    });
  }

  returnConditional(ele: UDRHierarchyModel[]): UDRBlocksModel[] {
    const cond: UDRBlocksModel[] = [];
    ele.forEach(e=>{
      const data = this.udrModel.blocks.filter(fil => fil.id === e.blockRefId)[0];
      if(data.blockType === BlockType.COND) {
        cond.push(data);
      }
    });
    return cond;
  }

  returnConditionInfo(element: UDRHierarchyModel[]): UDRBlocksModel[] {
    const cond: UDRBlocksModel[] = [];
    element.forEach(e=>{
      const data = this.udrModel.blocks.filter(fil => fil.id === e.blockRefId)[0];
      if(data.blockType === BlockType.AND || data.blockType === BlockType.OR) {
        cond.push(data);
      }
    });
    return cond;
  }

  prepareDataSourceWhileEdit(response: UdrModel) {
    const udrHierarchies = response.udrHierarchies ? response.udrHierarchies : [];
    const blocks = response.blocks ? response.blocks : [];
    const parentNode = udrHierarchies.filter(fil => fil.parentId === null)[0];
    const parentNodeDesc = blocks.filter(fil=> fil.id === parentNode.blockRefId)[0];

    // parent node object
    this.createBlock(parentNodeDesc.blockType, parentNode.blockRefId);

    // load childs
    const currParentNode = parentNode.blockRefId;

    const childElement = udrHierarchies.filter(fil => fil.parentId === currParentNode);
    this.appendAbleFunc(childElement);


    // udrHierarchies.forEach(udrHie=>{
    //   const condInfo = blocks.filter(fil=> fil.id === udrHie.blockRefId)[0];
    //   if(condInfo.id !== parentNode.blockRefId) {
    //     if(udrHie.parentId && condInfo && condInfo.blockType === BlockType.COND && udrHie.parentId === currParentNode) {

    //       // get previous node
    //       const searchItmNode =  this.treeControl.dataNodes.filter(fil => (fil.item === 'condition_search' && fil.level === level))[0];
    //       this.assignConBlocks([condInfo], searchItmNode, true);
    //     } else if(condInfo && (condInfo.blockType === BlockType.OR || condInfo.blockType === BlockType.AND)){
    //       const node =  this.treeControl.dataNodes.filter(fil => (fil.item !== 'condition_search' && fil.level === level-1))[0];
    //       level++;
    //       currParentNode = condInfo.id;
    //       this.addNewItem(node, condInfo.blockType, currParentNode);
    //     }
    //   }
    // });

  }

  /**
   * Use for generate conditional operator to conditional symbol
   * @param condition parameter should dynamic
   */
  prepareConditionDesc(condition: UDRBlocksModel): string {
    let conDesc = '';
    switch (condition.conditionOperator.toLocaleUpperCase()) {
      case 'EQUAL':
        conDesc = `=== ${condition.conditionFieldValue}`;
        break;
      case 'STARTS_WITH':
        conDesc = `startWith("${condition.conditionFieldValue}")`;
        break;
      case 'ENDS_WITH':
        conDesc = `endWith("${condition.conditionFieldValue}")`;
        break;
      case 'CONTAINS':
        conDesc = `contains("${condition.conditionFieldValue}")`;
        break;
      case 'IN':
        conDesc = `in("${condition.conditionFieldValue}")`;
        break;
      case 'NOT_IN':
        conDesc = `notIn("${condition.conditionFieldValue}")`;
        break;

      case 'LESS_THAN':
        conDesc = `< ${condition.conditionFieldValue}`;
        break;

      case 'LESS_THAN_EQUAL':
        conDesc = `<= ${condition.conditionFieldValue}`;
        break;

      case 'GREATER_THAN':
        conDesc = `> ${condition.conditionFieldValue}`;
        break;
      case 'GREATER_THAN_EQUAL':
        conDesc = `>= ${condition.conditionFieldValue}`;
        break;

      case 'RANGE':
        conDesc = `range("${condition.conditionFieldStartValue}","${condition.conditionFieldEndValue}")`;
        break;

      case 'COUNT_IN':
        conDesc = `countIn("${condition.conditionFieldValue}")`;
        break;

      case 'COUNT_LESS_THAN':
        conDesc = `countLessThen("${condition.conditionFieldValue}")`;
        break;

      case 'COUNT_LESS_THAN_EQUAL':
        conDesc = `countLessThenEqual("${condition.conditionFieldValue}")`;
        break;

      case 'COUNT_GREATER_THAN':
        conDesc = `countGreaterThen("${condition.conditionFieldValue}")`;
        break;

      case 'COUNT_GREATER_THAN_EQUAL':
        conDesc = `countGreaterThenEqual("${condition.conditionFieldValue}")`;
        break;

      case 'COUNT_RANGE':
        conDesc = `countRange("${condition.conditionFieldValue}")`;
        break;

      case 'EMPTY':
        conDesc = `is EMPTY`;
        break;

      case 'NOT_EMPTY':
        conDesc = `is not EMPTY`;
        break;

      case 'AVG_IN':
        conDesc = `averageIn()`;
        break;

      default:
        conDesc = `${condition.conditionOperator}`;
        break;
    }
    return `${condition.conditionFieldId} ${conDesc}`;
  }


  assignConBlocks(event: UDRBlocksModel[], node: ItemNodeInfo, isEditMode?:boolean ) {
    const nodeLevel = this.treeControl.dataNodes.indexOf(node);
    const itemkey = this.treeControl.dataNodes[nodeLevel -1];
    this.treeDataSource.addConBlock(this.flatNodeMap.get(itemkey), event, isEditMode);
    this.selectedBlocks[this.flatNodeMap.get(node).nodeId] = event;
  }

  selectedConBlocks(node: ItemNodeInfo): UDRBlocksModel[] {
    return this.selectedBlocks[this.flatNodeMap.get(node).nodeId];
  }

  blocksToUDRBlocksModel() {
    const nodeItems = this.dataSource.data;
    if(nodeItems) {
      nodeItems.forEach(node=>{
        const obj = new UDRBlocksModel();
        obj.id = node.nodeId;
        obj.blockDesc = node.item;
        obj.blockType = node.item === 'And Block' ? BlockType.AND : BlockType.OR;
        this.udrModel.blocks.push(obj);

        const hieObj = new UDRHierarchyModel();
        hieObj.blockRefId = node.nodeId;
        this.udrModel.udrHierarchies.push(hieObj);

        // get from childrens
        if(node.children) {
          this.udrBlocksModelFromChildren(node.children);
          this.makeBlockHierarch(node.children, node);
        }
      });
    }
  }

  udrBlocksModelFromChildren(childNode: ItemNode[]) {
    childNode.forEach(chldNode=>{
      if(chldNode.item !== 'condition_search') {
        if(chldNode.item === 'And Block' || chldNode.item === 'Or Block') {
          const obj = new UDRBlocksModel();
          obj.id = chldNode.nodeId;
          obj.blockDesc = chldNode.item;
          obj.blockType = chldNode.item === 'And Block' ? BlockType.AND : BlockType.OR;
          this.udrModel.blocks.push(obj);
        } else {
          const blck =  this.conditionList.filter(fill => String(fill.id) === chldNode.nodeId)[0];
          this.udrModel.blocks.push(blck);
        }
      }
      if(chldNode.children) {
        this.udrBlocksModelFromChildren(chldNode.children);
      }
    });
  }

  makeBlockHierarch(childNode: ItemNode[], parentNode: ItemNode) {
    for(let i= 0; i<childNode.length; i++) {
      const chldNode = childNode[i];
      if(chldNode.item !== 'condition_search') {
        const obj = new UDRHierarchyModel();
        obj.blockRefId = chldNode.nodeId;
        obj.leftIndex = (i-1) >0 ? i-1 : null;
        obj.rightIndex = (i+1) < childNode.length ? i+1 : null;
        obj.parentId = parentNode.nodeId;
        this.udrModel.udrHierarchies.push(obj);
      }
      if(chldNode.children) {
        this.makeBlockHierarch(chldNode.children, chldNode);
      }
    }
  }

  /**
   *  Emit the chnages value to add business rule componenet
   * @param brInfo saved or update br information
   */
  discard(brInfo: CoreSchemaBrInfo) {
    this.evtSaved.emit(brInfo);
  }

  /**
   * Call http for save update user defined rule
   */
  finishUdrProcess() {
    // create business rule object
    const brInfo = new CoreSchemaBrInfo();
    brInfo.brInfo = this.udrDescFrmCtrl.value;
    brInfo.brType = this.brType;
    this.udrModel.brInfo = brInfo;
    brInfo.brId = this.brId ? this.brId : null;
    brInfo.brIdStr = this.brId ? this.brId : null;

    // create block object & maintain hierarchy
    this.udrModel.blocks = [];
    this.udrModel.udrHierarchies = [];
    this.blocksToUDRBlocksModel();

    console.log(this.udrModel);

    console.log(this.treeControl.dataNodes);
    console.log(this.dataSource.data);

    this.schemaService.saveUpdateUDR(this.udrModel).subscribe(res=>{
      this.snackBar.open(`Successfully saved !`, 'Close',{duration:5000});
      brInfo.brId  = res;
      brInfo.brIdStr = res;
      this.discard(brInfo);
    },error=> {
      this.snackBar.open(`Something went wrong `, 'Close',{duration:5000});
    });


  }

}

import { Component, OnInit } from '@angular/core';
import { Breadcrumb } from 'src/app/_models/breadcrumb'; import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { CreateUpdateSchema } from '../../business-rules/business-rules.modal';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemalistService } from 'src/app/_services/home/schema/schemalist.service';
import * as _ from 'lodash';

@Component({
  selector: 'pros-create-schema',
  templateUrl: './create-schema.component.html',
  styleUrls: ['./create-schema.component.scss']
})
export class CreateSchemaComponent implements OnInit {

  breadcrumb: Breadcrumb = {
    heading: 'Create Schema',
    links: [
      {
        link: '/home/schema/',
        text: 'Schema group(s)'
      }
    ]
  };
  selectdBrData: any;
  schemaName: string;
  params: any;
  businessRulesStaticList: any;
  businessRuleNames: any;
  filterList: any;
  categoriesNames: any;
  categoriesNamesList: any = [];
  searchCategories: any = [];
  enableCreateCategoryBtn = false;
  showBusinessPage = false;
  enableSaveBtn = false;
  businessrulelength: any;
  createUpdateParams = new CreateUpdateSchema();
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  schemaDetails: any;

  constructor(private service: SchemaService, private activatedRoute: ActivatedRoute, private router: Router, private schemaListService: SchemalistService) { }

  ngOnInit() {

    this.activatedRoute.params.subscribe(params => {
      this.params = params;
    })
    this.getCategoriesData();
    this.getSchemaData();
  }

  getSchemaData() {

    this.schemaListService.getSchemaDetailsBySchemaId(this.params.schemaId).subscribe(res => {
      this.schemaDetails = res;
      console.log('res', res);
      if (this.schemaDetails) {
        this.getBusinessRulesData();
        this.schemaName = this.schemaDetails.schemaDescription;
        this.enableSaveButton();
      }
      else {
        sessionStorage.clear();
      }
    })
  }

  search(value: string) {
    const filter = value.toLowerCase();
    this.businessRuleNames = this.filterList.filter(list => list.brInfo.toLowerCase().indexOf(filter) >= 0);
  }

  navigateToListPage() {
    this.router.navigate(['/home/schema/schema-list', this.params.groupId]);
  }

  showAddBusinessRulePage() {
    this.showBusinessPage = true;
  }

  searchCategoryNames(val: string) {
    console.log('cccccccccccccc', val);
    const filter = val.toLowerCase();
    this.categoriesNames = this.searchCategories.filter(list => list.categoryDesc.toLowerCase().indexOf(filter) >= 0);
  }

  showParentPage() {
    console.log('showing parent page');
    this.showBusinessPage = false;
    if (this.schemaDetails) {
      this.getBusinessRulesData();
    }
    else {
      this.businessRuleNames = this.returnBrsList();
      this.handleNullCondition();
    }
  }

  handleNullCondition() {
    this.enableCreateCategoryBtn = false;
    if (this.businessRuleNames.length > 0) {
      this.enableCreateCategoryBtn = true;
    }
  }


  getCategoriesData() {

    this.service.getAllCategoriesList().subscribe(res => {
      console.log('all categories list = ', res);
      this.categoriesNames = res;
      this.searchCategories = res;
    })
  }

  getBusinessRulesData() {

    this.service.getAllBusinessRules(this.schemaDetails.schemaId).subscribe(res => {
      if (res) {
        const response: any = res;
        this.businessrulelength = response.length + 1;
        this.businessRuleNames = _.uniqBy(response, 'brId');
        this.filterList = response;
        this.handleNullCondition();
        sessionStorage.setItem('brsList', JSON.stringify(this.businessRuleNames));
        this.onloadShowCategories(this.businessRuleNames);
      }
    })
  }


  editBusinessRuls(brData) {
    this.selectdBrData = brData;
    console.log('brData = ', brData);
    this.showBusinessPage = true;
  }

  deleteBusinessRule(list, index) {
    console.log('data = ', list, index);

    if (this.schemaDetails) {
      this.service.deleteBr(list.brId).subscribe(res => {
        console.log('resssssssssssssss', res)
      })
    }
    else {
      const listBr = this.returnBrsList();
      listBr.splice(index, 1);
      this.businessRuleNames = listBr;
      this.handleNullCondition();
      sessionStorage.setItem('brsList', JSON.stringify(listBr));
    }
  }


  drop(event: CdkDragDrop<string[]>, index) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    else {
      const loop: any = [];

      // for (let k = 0; k < event.container.data.length; k++) {
      //   if (event.container.data[k]['brId'] === event.previousContainer.data[event.previousIndex]['brId']) {
      //     loop.push(true)
      //   }
      //   else {
      //     loop.push(false);
      //   }
      // }

      event.container.data.map((data: any) => {
        const previousIndex: any = event.previousContainer.data[event.previousIndex];
        if (data.brId === previousIndex.brId) {
          loop.push(true)
        }
        else {
          loop.push(false);
        }
      })

      if (loop.includes(true)) {
        return;
      }

      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }

    const dropIndexValue = this.categoriesNamesList[index];
    this.categoriesNamesList[index] = this.loopData(dropIndexValue);
    this.businessRuleNames = this.returnBrsList();
  }


  returnBrsList() {
    return JSON.parse(sessionStorage.getItem('brsList'));
  }


  updateBrCategoryId() {

    this.categoriesNamesList.map((list) => {
      list.businessRules.forEach((ls) => this.businessRuleNames.forEach(br => {

        if (ls.brId === br.brId) {
          br.categoryId = list.categoryId;
        }
      }));
    })
    return this.businessRuleNames;
  }

  // to override the business rules categorotyID
  loopData(obj) {
    const brList: any = []
    obj.businessRules.map((dt, i) => {
      dt.categoryId = obj.categoryId;
      brList.push(dt)
    })
    obj.businessRules = brList;
    return obj;
  }

  onloadShowCategories(obj) {
    const as: any = [];
    console.log(obj, this.categoriesNames)
    _.uniqBy(obj, 'brId').forEach((br) => this.categoriesNames.forEach((ct) => {
      if (Number(br.categoryId) === Number(ct.categoryId)) {
        ct.businessRules.push(br);
        as.push(ct);
        // this.categoriesNamesList = as.filter((item, i, ar) => ar.indexOf(item) === i);
        this.categoriesNamesList = as;
      }
    }))
  }


  // on change categories dropdown
  changeCategoryNameId(ev, i) {
    const selData = ev.option ? ev.option.value : '';
    const exitData = this.categoriesNames.filter(objId =>
      objId.categoryDesc === selData
    );
    this.categoriesNamesList[i].categoryDesc = exitData[0].categoryDesc ? exitData[0].categoryDesc : null;
    this.categoriesNamesList[i].categoryId = exitData[0].categoryId ? exitData[0].categoryId : null;
    this.categoriesNamesList[i] = this.loopData(this.categoriesNamesList[i]);
  }


  removeBrFromCategory(index1, index2) {
    this.categoriesNamesList[index1].businessRules.splice(index2, 1);
  }


  enableSaveButton() {
    this.enableSaveBtn = false;
    if (this.schemaName) {
      this.enableSaveBtn = true;
    }
  }

  addCategory() {

    const category = {
      categoryDesc: '',
      businessRules: []
    }
    this.categoriesNamesList.push(category);
  }

  createUpdateSchema() {
    this.createUpdateParams.discription = this.schemaName;
    this.createUpdateParams.moduleId = this.params.moduleId;
    this.createUpdateParams.schemaId = this.schemaDetails ? this.schemaDetails.schemaId : null;
    this.createUpdateParams.schemaGroupId = this.params.groupId;
    this.createUpdateParams.brs = this.updateBrCategoryId();
    console.log('params = ', this.createUpdateParams);
    this.service.createUpdateSchema(this.createUpdateParams).subscribe(response => {
      console.log('create update schema Response = ', response);
      if (response) {
        this.navigateToListPage();
      }
    })
  }

  // sortFunc(a, b) {
  //   return a.count - b.count
  // }

}

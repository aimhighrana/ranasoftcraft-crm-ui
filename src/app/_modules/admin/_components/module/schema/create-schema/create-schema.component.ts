import { Component, OnInit } from '@angular/core';
import { Breadcrumb } from 'src/app/_models/breadcrumb'; import { CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem } from '@angular/cdk/drag-drop';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { CreateUpdateSchema, CoreSchemaBrInfo, Category, BusinessRuleType } from '../../business-rules/business-rules.modal';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemalistService } from 'src/app/_services/home/schema/schemalist.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'pros-create-schema',
  templateUrl: './create-schema.component.html',
  styleUrls: ['./create-schema.component.scss']
})
export class CreateSchemaComponent implements OnInit {

  schemaName: string;
  businessRuleNames: any;
  filterList: any;
  categoriesNames: any;
  categoriesNamesList: any = [];
  searchCategories: any = [];
  enableCreateCategoryBtn = false;
  showBusinessPage = false;
  businessrulelength: any;

  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  schemaDetails: any;

  schemaId: string;
  moduleId: string;
  schemaGroupId: string;
  fragment: string;
  brList: CoreSchemaBrInfo[] = [];
  brListOb : Observable<CoreSchemaBrInfo[]> = of([]);

  categoryList: Category[] = [];
  /**
   * Use for store br mapped on particular category
   * As key value pair | kay is the index of form array and value is CoreSchemaBrInfo[]
   */
  categoryBrMap: any = {} as any;

  dynCategoryFrmGrp: FormGroup;

  breadcrumb: Breadcrumb = {
    heading: 'Create Schema',
    links: [
      {
        link: '/home/schema/',
        text: 'Schema group(s)'
      },
      {
        link: ``,
        text: 'Schema list'
      }
    ]
  };

  constructor(
    private service: SchemaService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private schemaListService: SchemalistService,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.moduleId = params.moduleId ? params.moduleId : '';
      this.schemaId = params.schemaId ? (params.schemaId.toLowerCase() === 'new' ? '' : params.schemaId) : '';
      this.schemaGroupId = params.groupId ? params.groupId : '';
    });

    this.dynCategoryFrmGrp =  this.formBuilder.group({
      categories: this.formBuilder.array([])
    });

    // update breadcrum
    this.breadcrumb.links[1].link = `/home/schema/schema-list/${this.schemaGroupId}`;

    this.activatedRoute.fragment.subscribe(frag=>{
      this.fragment = frag;
    });
    this.getCategoriesData();
    if(this.schemaId) {
      this.getSchemaData();
    }
  }

  getSchemaData() {
    this.schemaListService.getSchemaDetailsBySchemaId(this.schemaId).subscribe(res => {
      this.schemaDetails = res;
      if (this.schemaDetails) {
        this.getBusinessRulesData();
        this.schemaName = this.schemaDetails.schemaDescription;
      }
    })
  }

  search(value: string) {
    const filter = value.toLowerCase();
    this.businessRuleNames = this.filterList.filter(list => list.brInfo.toLowerCase().indexOf(filter) >= 0);
  }

  navigateToListPage() {
    this.router.navigate(['/home/schema/schema-list', this.schemaGroupId]);
  }

  /**
   * Open Business Rule Componenet using fragment
   * For fragment see router.navigate method imp..
   */
  showAddBusinessRulePage() {
    this.router.navigate(['/home/schema/create-schema', this.moduleId , this.schemaGroupId, this.schemaId], {fragment:'missing'});
  }

  getCategoriesData() {
    this.service.getAllCategoriesList().subscribe(res => {
      this.categoryList = res;
      this.categoriesNames = res;
      this.searchCategories = res;
    })
  }

  /**
   * Should return all business rules that assigned to schema
   */
  getBusinessRulesData() {
    this.service.getAllBusinessRules(this.schemaId).subscribe(res => {
      if (res) {
        // update brids
        res.forEach(r=>{
          r.brId = r.brIdStr;
        });
        // set to assigned brlist
        this.brList = res;
        this.brListOb = of(res);

        // map to assigned categories
        const assignedCat = res.map(map => map.categoryId);
        const distinctAssignedcat = new Set(assignedCat);
        const assinedcatObj: Category[] = [];
        distinctAssignedcat.forEach(each=>{
            const cat = this.categoryList.filter(fil => fil.categoryId === String(each))[0];
            if(cat) {
              assinedcatObj.push(cat);
            }
        });

        // add to form array
        const categories = this.dynCategoryFrmGrp.controls.categories as FormArray;
        assinedcatObj.forEach((each, index)=>{
          categories.push(this.formBuilder.group({
            category: [each]
          }));
          const assignedBrs = res.filter(fil => String(fil.categoryId) === each.categoryId);
          this.categoryBrMap[categories.length-1] = assignedBrs;
        });
      }
    })
  }

  /**
   * While click edit then should call this
   * @param brId Selected br id
   * @param brType type for edit based on type
   */
  editBusinessRuls(brId: string, brType: string) {
    let fragmentTo = '';
    if(brType === BusinessRuleType.BR_MANDATORY_FIELDS) {
      fragmentTo = 'missing';
    } else if(brType === BusinessRuleType.BR_METADATA_RULE) {
      fragmentTo = 'metadata';
    } else if(brType === BusinessRuleType.BR_CUSTOM_SCRIPT) {
      fragmentTo = 'userdefined';
    } else if(brType === BusinessRuleType.BR_REGEX_RULE) {
      fragmentTo = 'regex';
    }
    this.router.navigate(['/home/schema/create-schema', this.moduleId , this.schemaGroupId, this.schemaId], {queryParams:{brId}, fragment:fragmentTo});
  }

  /**
   * When try to drop any dropable container , then this method should called
   * @param event current event use for dropable container
   * @param index index of item
   * @param dropOutsideBr check its from outside dropable container
   */
  drop(event: CdkDragDrop<any>, index, dropOutsideBr?: boolean) {
    if (event.previousContainer === event.container) {
      const inBrList = (event.container.element.nativeElement.classList).contains('inBrList');
      if(inBrList) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        // update br execution order
        this.brList.forEach((br, idx)=>{
          br.order = idx +1;
        });
      } else {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      }
    }
    else {
      const dropAbleBr = event.previousContainer.data[event.previousIndex] as CoreSchemaBrInfo;
      const iscategoryAssign = (event.previousContainer.element.nativeElement.classList).contains('inCategory');
      if(!iscategoryAssign) {
        if(event.container.data.indexOf(dropAbleBr) ===-1) {
          // check already exits on any category assigned
          let isExits = false;
          console.log(this.categoryBrMap);
          Object.keys(this.categoryBrMap).forEach(cat=>{
            const afterFill = this.categoryBrMap[cat] ? this.categoryBrMap[cat].filter(fill=> fill.brIdStr === dropAbleBr.brIdStr) : [];
            if(afterFill.length) {
              isExits = true;
              return;
            }
          });
          if(!isExits) {
            copyArrayItem(event.previousContainer.data, event.container.data,event.previousIndex,  event.currentIndex);
          }
        }
      } else {
        if((event.container.element.nativeElement.classList).contains('inCategory')) {
          if(event.container.data.indexOf(dropAbleBr) ===-1) {
            transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex,event.currentIndex);
          }
        } else {
          event.previousContainer.data.splice(event.previousIndex, 1);
        }

      }

    }
  }

  removeBrFromCategory(index1, index2) {
    this.categoriesNamesList[index1].businessRules.splice(index2, 1);
  }

  /**
   * Use for add new category
   */
  addCategory() {
    const categories = this.dynCategoryFrmGrp.controls.categories as FormArray;
    categories.push(this.formBuilder.group({
      category: ['']
    }));
    this.categoryBrMap[categories.length-1] = [];
  }

  /**
   * Use for remove category
   * @param index of removeable category
   */
  removeCategory(index: number) {
    const categories = this.dynCategoryFrmGrp.controls.categories as FormArray;
    categories.removeAt(index);

    // remove mapping br also
    delete this.categoryBrMap[index];
  }

  /**
   * After add new or modified exiting br then should reflect on ui
   * @param brInfo is the CoreSchemaBrInfo which is new or may be updated by add-business-rule componenet
   */
  afterSavedBrinfo(brInfo: CoreSchemaBrInfo) {
    if(brInfo) {
      const isAvailBr = this.brList.filter(fil => fil.brIdStr === brInfo.brIdStr);
      if(isAvailBr.length) {
        this.brList.splice(this.brList.indexOf(isAvailBr[0]), 1, brInfo);
      } else {
        this.brList.push(brInfo);
      }
      // update br execution order
      this.brList.forEach((br, index)=>{
        br.order = index +1;
      });
      this.brListOb = of(this.brList);
    }
  }

  /**
   *
   * @param cat is the selected drop val from autocomplete
   */
  categoryDisplayWith(cat: Category): string {
    return cat ? cat.categoryDesc : null;
  }

  /**
   * Use for check has any categories with empty values
   */
  checkIsEmptyCategory(): boolean {
    const categories = this.dynCategoryFrmGrp.controls.categories as FormArray;
    for(let i =0; i< categories.length; i++) {
      if(categories.at(0).value.category === undefined || categories.at(i).value.category === '' || (typeof categories.at(i).value.category === 'string' && categories.at(i).value.category.trim() === '')) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if category doesn't have assigned rules then return true | false
   * And also update category id
   */
  checkIsEmptycategoryAssigned(): boolean {
    let status = false;
    if(this.categoryBrMap) {
      const categories = this.dynCategoryFrmGrp.controls.categories as FormArray;
      Object.keys(this.categoryBrMap).forEach((each,index)=>{
        if(this.categoryBrMap[each] === undefined || this.categoryBrMap[each].length === 0) {
          status = true;
        } else {
          const catId = categories.at(index).value ? categories.at(index).value.category.categoryId : '';
          this.categoryBrMap[each].forEach(br=>{
            this.updateCategoryId(catId, br.brIdStr);
          });
        }
      })
    }
    return status;
  }

  /**
   * Use for update categoryid and brIds
   * @param catId updated category id
   * @param brIdStr business rule id
   */
  updateCategoryId(catId: string, brIdStr: string) {
    this.brList.filter(fil =>{
      if(fil.brIdStr === brIdStr) {
        fil.brId = brIdStr;
        fil.categoryId = catId;
      }
    });

  }

  /**
   * Delete business rule
   * Should call deleteBr service
   * @param brId business rule id
   */
  deleteBr(brId: string) {
    this.service.deleteBr(brId).subscribe(res=>{
      if(res) {
        this.matSnackBar.open(`Successfully deleted`, 'Close',{duration:5000});
        const br = this.brList.filter(fil=> fil.brIdStr === brId)[0];
        if(br) {
          this.brList.splice(this.brList.indexOf(br),1);
          // reorder
          this.brList.forEach((br01, index)=>{
            br01.order = index++;
          });
          this.brListOb = of(this.brList);

          // remove from br mapped , category
          Object.keys(this.categoryBrMap).forEach((cat, index)=>{
            const data = this.categoryBrMap[cat];
            const br01 = data.filter(fil=> fil.brIdStr === brId)[0];
            if(br01) {
              data.splice(data.indexOf(br01),1);
              this.categoryBrMap[index] = data;
              return false;
            }
          });
        }
      }
    }, error=>{
      this.matSnackBar.open(`Something went wrong`, 'Close',{duration:5000});
    });
  }

  /**
   *
   * @param brId removeable brid
   * @param index Index of category
   */
  removeMappedBr(br: CoreSchemaBrInfo, index: number) {
    if(br && index !== undefined) {
      const brMap =  this.categoryBrMap[index];
      if(brMap) {
        brMap.splice(brMap.indexOf(br),1);
        this.categoryBrMap[index] = brMap;
      }
    }
  }
  /**
   * Call http for save update schema and br mapping
   * along with goup
   */
  createUpdateSchema() {
    console.log(this.dynCategoryFrmGrp);
    console.log(this.categoryBrMap);
    if(this.checkIsEmptyCategory()) {
      this.matSnackBar.open(`Category name can't blank`, 'Close',{duration:5000});
      return false;
    }
    const res = this.checkIsEmptycategoryAssigned();
    console.log(res);
    if(res) {
      this.matSnackBar.open(`Please assign rule(s) in category`, 'Close',{duration:5000});
      return false;
    }

    console.log(this.brList);

    const request: CreateUpdateSchema = new CreateUpdateSchema();
    request.moduleId = this.moduleId;
    request.schemaGroupId = this.schemaGroupId;
    request.discription = this.schemaName;
    request.schemaId = this.schemaId;
    request.brs = this.brList;

    console.log('request : {}', request);
    this.service.createUpdateSchema(request).subscribe(response => {
      console.log('create update schema Response = ', response);
      if(response) {
        this.schemaId = response;
        this.matSnackBar.open(`Successfully saved`, 'Close',{duration:5000});
      }
    }, error=>{
      this.matSnackBar.open(`Something went wrong`, 'Close',{duration:5000});
    })
  }


}

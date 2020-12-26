import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AttributeMapData, AttributesMapping } from '@models/schema/classification';
import { AttributesDoc, NounModifier } from '@models/schema/noun-modifier';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { NounModifierService } from '@services/home/schema/noun-modifier.service';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { UserService } from '@services/user/userservice.service';
import { debounceTime } from 'rxjs/operators';

interface Status {
  text: string;
  code: string;
  isSeleted: boolean;
}

@Component({
  selector: 'pros-library-mapping-sidesheet',
  templateUrl: './library-mapping-sidesheet.component.html',
  styleUrls: ['./library-mapping-sidesheet.component.scss']
})
export class LibraryMappingSidesheetComponent implements OnInit {

  moduleId: string;

  libraryNounCode: string;

  libraryModifierCode: string;


  localNounsList: NounModifier[] = [];


  LocalModifiersList: NounModifier[] = [];


  LocalAttributesList: AttributesDoc[] = [];

  /**
   * form to hold mapping data
   */
  mappingForm: FormGroup;

  /**
   * form submission state
   */
  submitted = false;

  /**
   * Get gsn attributes ..
   */
  gsnAttributes: AttributesDoc[] = [];

  preInpVal = '';

  /**
   * Store material group info ..
   */
  mgroup: string;

  statas: Status[] = [
    {code:'matched', text:'Matched', isSeleted: false},
    {code:'suggest', text:'Suggested', isSeleted: false},
    {code:'unmapped', text:'Unmapped', isSeleted: false},
  ];

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private schemaDetailsService: SchemaDetailsService,
    private nounModifierService: NounModifierService,
    private snackBar: MatSnackBar,
    private sharedServices: SharedServiceService,
    private userDetails: UserService
    ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.moduleId = params.moduleId;
      this.libraryNounCode = params.nounCode;
      this.libraryModifierCode = params.modCode;

      this.buildMappingForm();

    });

    this.getLocalNouns();

    this.getAttributesFromGsn(this.libraryNounCode, this.libraryModifierCode);
  }

  /**
   * fetch already saved mappings
   */
  getAttributesMapping() {
    this.nounModifierService.getAttributesMapping(this.libraryNounCode, this.libraryModifierCode)
      .subscribe(resp => {
        this.patchMappingForm(resp);
      });
  }

  /**
   * Build attribute mapping form
   */
  buildMappingForm() {

    this.mappingForm = this.formBuilder.group({
      libraryNounCode: [this.libraryNounCode || ''],
      localNounCode: [''],
      libraryModCode: [this.libraryModifierCode || ''],
      localModCode: [''],
      attributeMapData: this.formBuilder.array([])
    });

    this.mappingForm.get('localNounCode').valueChanges.subscribe(nounCode => {
      const loadForThisNn = typeof nounCode === 'string' ? nounCode : nounCode.NOUN_CODE;
      this.getLocalModifiers(loadForThisNn);
      this.mappingForm.get('localModCode').setValue('');
    });

    this.mappingForm.get('localModCode').valueChanges.subscribe(modCode => {
      const nnCode = this.mappingForm.get('localNounCode').value;
      const loadForThisNn = typeof nnCode === 'string' ? nnCode : '';
      const modeCode =  typeof modCode === 'string' ? modCode : '';
      this.getLocalAttributes(loadForThisNn, modeCode);
    });

    (this.mappingForm.get('attributeMapData') as FormArray).valueChanges.subscribe(values => {
      values.forEach(v=>{
        const exAttr = this.gsnAttributes.filter(fil => fil.ATTRIBUTE_ID === v.libraryAttributeCode)[0];
        exAttr.localAttributeCode = v.localAttributeCode ? v.localAttributeCode.ATTRIBUTE_ID : '';
        exAttr.localAttributeText = v.localAttributeCode ? v.localAttributeCode.ATTR_CODE : '';
      });
    });
  }

  patchMappingForm(attributesMapping: AttributesMapping) {
    if (attributesMapping.attributeMapData) {
      const {localNounCode, localModCode} = attributesMapping;
      this.mappingForm.patchValue({localNounCode, localModCode});
      console.log(this.mappingForm.value);

      attributesMapping.attributeMapData.forEach(mapData => {
        const index = this.attributeMapData.value.findIndex(v => v.libraryAttributeCode === mapData.libraryAttributeCode);
        if (index !== -1) {
          this.attributeMapData.at(index).patchValue({localAttributeCode: mapData.localAttributeCode});
        }
      })
    }
  }

  getLocalNouns() {
    const plantCode = '0';
    this.nounModifierService.getLocalNouns(plantCode)
      .subscribe(nouns => {
        this.localNounsList = nouns;
      })
  }

  getLocalModifiers(nounCode) {
    this.nounModifierService.getLocalModifier('0', nounCode)
      .subscribe(modifiers => {
        this.LocalModifiersList = modifiers;
        console.log(this.LocalModifiersList);
      })
  }

  getLocalAttributes(nounCode, modifierCode) {
    // const params = {plantCode: '0', nounCode, modifierCode: '', searchString: ''};
    this.nounModifierService.getLocalAttribute(nounCode, modifierCode, '0')
      .subscribe(attributes => {
        this.LocalAttributesList = attributes;
      })
  }

  getAttributesFromGsn(nounCode: string , modCode: string) {
    this.userDetails.getUserDetails().subscribe(user=>{
      this.nounModifierService.getGsnAttribute(nounCode, modCode, user.plantCode).subscribe(res=>{
        this.gsnAttributes = res.ATTRIBUTES ? res.ATTRIBUTES : [];
        this.mgroup = res.MGROUP ? res.MGROUP : '';
        // create form ..
        this.gsnAttributes.forEach(att=>{
          this.addAttributeMappingRow(att);
        });

        this.getAttributesMapping();
      });
    });
  }

  /**
   * Add attribute mapping row
   */
  addAttributeMappingRow(attr: AttributesDoc) {

    this.attributeMapData.push(
      this.formBuilder.group({
        libraryAttributeCode: [attr && attr.ATTR_CODE ? attr.ATTR_CODE : ''],
        libraryAttributeText: [attr && (attr.ATTR_DESC ? attr.ATTR_DESC :  attr.ATTR_CODE) ? attr.ATTR_CODE : ''],
        localAttributeCode: [attr && attr.localAttributeCode ? attr.localAttributeCode : ''],
        localAttributeText: [attr && attr.localAttributeText ? attr.localAttributeText : ''],
        status: [attr && attr.status ? attr.status : 'unmapped']
      })
    );

  }

  save() {

    this.submitted = true;

    if (this.mappingForm.invalid) {
      this.snackBar.open('Please enter the missing fields !', 'close', { duration: 3000 });
      return;
    }

    const mappings = this.mappingForm.value;
    const attrMapRequest: AttributesMapping = {} as AttributesMapping;
    attrMapRequest.localNounCode = mappings.localNounCode ?  mappings.localNounCode : '';
    attrMapRequest.localModCode = mappings.localModCode ? mappings.localModCode : '';
    attrMapRequest.libraryNounCode = this.libraryNounCode ? this.libraryNounCode : '';
    attrMapRequest.libraryModCode = this.libraryModifierCode ? this.libraryModifierCode : '';

    attrMapRequest.attributeMapData = [];

    mappings.attributeMapData.forEach(mm=>{
      const attr:AttributeMapData = {} as AttributeMapData;
      attr.libraryAttributeCode = mm.libraryAttributeCode;
      attr.localAttributeCode = typeof mm.localAttributeCode === 'string' ? mm.localAttributeCode : mm.localAttributeCode.ATTRIBUTE_ID;
      attrMapRequest.attributeMapData.push(attr);
    });

    console.log(attrMapRequest);

    this.nounModifierService.saveAttributesMapping(attrMapRequest)
      .subscribe(resp => {
        this.snackBar.open('Successfully created!', 'close', { duration: 3000 });
        this.close();
      },
        error => {
          this.snackBar.open('Something went wrong!', 'close', { duration: 3000 });
        });

  }

  get attributeMapData() {
    return this.mappingForm.get('attributeMapData') as FormArray;
  }

  setFormControlValue(controlName, value) {
    this.mappingForm.get(controlName).setValue(value);
  }

  /* nounSelected(nounCode) {
    this.getMasterLibraryModifiers(nounCode);
    this.setFormControlValue('localNounCode', nounCode);
    console.log(nounCode);
  }

  modifierSelected(modifier) {
    this.setFormControlValue('localModCode', modifier.NOUN_CODE);
    this.getMasterLibraryAttributes(this.mappingForm.value.localNounCode, modifier.MODE_CODE );
    console.log(modifier.MODE_CODE);
  }

  attributeSelected(libraryAttributeCode, localAttributeCode) {
    const index = this.attributeMapData.value.findIndex(mapData => mapData.libraryAttributeCode === libraryAttributeCode);
    if (index !== -1) {
      this.attributeMapData.at(index).patchValue({localAttributeCode});
    } else {
      const mapData = {libraryAttributeCode, localAttributeCode}
      this.addAttributeMappingRow(mapData);
    }
  } */

  get selectedNounCode() {
    return this.mappingForm.get('localNounCode').value ? this.mappingForm.get('localNounCode').value : '';
  }

  openNounSidesheet() {
    // need material group
    this.router.navigate(['', { outlets: { outer: `outer/schema/noun/${this.moduleId}/${this.mgroup}` } }])
  }

  openModifierSidesheet() {
    this.router.navigate(['', { outlets: { outer: `outer/schema/modifier/${this.moduleId}/${this.mgroup}/${this.selectedNounCode.NOUN_CODE}` } }])
  }

  openAttributeSidesheet() {
    this.router.navigate(['', { outlets: { outer: `outer/schema/attribute/${this.selectedNounCode.NOUN_ID}` } }])
  }

  close() {
    this.router.navigate([{ outlets: { sb: null } }]);
  }

  /**
   * Filte attributes based on status or serach ..
   * @param sta status ..
   */
  filterAsStatus(sta: string) {
    const preVState = this.statas.filter(f=> f.code === sta)[0];
    const index = this.statas.indexOf(preVState);
    if(preVState.isSeleted) {
      this.statas.splice(index, 1);
      preVState.isSeleted = false;
      this.statas.splice(index,0,preVState);
    } else {
      this.statas.splice(index, 1);
      preVState.isSeleted = true;
      this.statas.splice(index,0,preVState);
    }
    this.preInpVal = '';
    this.filterAttribute('',this.statas.filter(f=> f.isSeleted === true).map(map=> map.code));
  }

  /**
   * Search attribute from global serach ...
   * @param val text for search attributes ..
   */
  searchAttributeVal(val: string) {
    debounceTime(1000);
    this.filterAttribute(val);
  }

  /**
   * filter attribute fuzzy search ..
   * @param serachString search able string ..
   * @param status search for what ..
   */
  filterAttribute(serachString?: string, status?: string []) {
    let filterAttr = this.gsnAttributes;
    if(serachString && serachString.trim()) {
      filterAttr = this.gsnAttributes.filter(fil=> (fil.ATTR_CODE.toLocaleLowerCase().indexOf(serachString.toLocaleLowerCase()) !==-1 ||
                            fil.ATTR_DESC.toLocaleLowerCase().indexOf(serachString.toLocaleLowerCase()) !==-1));
    }
    if(status) {
      status.forEach(st=>{
        const ft = filterAttr.filter(f => f.status === st);
        filterAttr.push(...ft);
      });

    }
    const frmAray = this.mappingForm.get('attributeMapData') as FormArray;
    frmAray.clear();
    filterAttr.forEach(att=>{
      this.addAttributeMappingRow(att);
    });
  }

  /**
   *
   * @param gsnNounCode gdnNounCode ...
   */
  nounSuggestion(gsnNounCode: string): NounModifier {
    const nnn = this.localNounsList.filter(f=> f.NOUN_ID.toLocaleLowerCase().indexOf(gsnNounCode.toLocaleLowerCase()))[0];
    return nnn;
  }


  modifierSuggestion(gsnModeCode: string): NounModifier{
    const nnn = this.LocalModifiersList.filter(f=> f.MODE_CODE.toLocaleLowerCase().indexOf(gsnModeCode.toLocaleLowerCase()))[0];
    return nnn;
  }


  attributeSuggestion(gsnAttributeCode: string): AttributesDoc {
    const nnn = this.LocalAttributesList.filter(f=> f.ATTR_CODE.toLocaleLowerCase().indexOf(gsnAttributeCode.toLocaleLowerCase()))[0];
    return nnn;
  }



  createNewWidgetFor(f: string) {
    if(f === 'noun') {
      this.openNounSidesheet();
    } else if(f === 'modifier') {
      this.openModifierSidesheet();
    } else if(f === 'attribute') {
      this.openAttributeSidesheet();
    }
  }


}

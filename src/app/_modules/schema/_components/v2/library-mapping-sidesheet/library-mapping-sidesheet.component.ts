import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AttributeMapData, AttributesMapping } from '@models/schema/classification';
import { AttributesDoc, ClassificationMappingRequest, ClassificationMappingResponse, NounModifier } from '@models/schema/noun-modifier';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { NounModifierService } from '@services/home/schema/noun-modifier.service';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { UserService } from '@services/user/userservice.service';
import { TransientService } from 'mdo-ui-library';
import { debounceTime } from 'rxjs/operators';

interface Status {
  text: string;
  code: string;
  count: number;
  isSeleted: boolean;
}

@Component({
  selector: 'pros-library-mapping-sidesheet',
  templateUrl: './library-mapping-sidesheet.component.html',
  styleUrls: ['./library-mapping-sidesheet.component.scss']
})
export class LibraryMappingSidesheetComponent implements OnInit {

  moduleId: string;

  /**
   * Hold current schema id
   */
  schemaId: string;

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
  searchString = '';

  /**
   * Store material group info ..
   */
  mgroup: string;
  isMapped = false;
  statas: Status[] = [
    {code:'matched', count: 0, text:'Matched', isSeleted: false},
    {code:'suggested', count: 0, text:'Suggested', isSeleted: false},
    {code:'unmatched', count: 0, text:'Unmatched', isSeleted: false},
  ];
  classificationCategory: ClassificationMappingResponse;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private schemaDetailsService: SchemaDetailsService,
    private nounModifierService: NounModifierService,
    private snackBar: TransientService,
    private sharedServices: SharedServiceService,
    private userDetails: UserService
    ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.moduleId = params.moduleId;
      this.libraryNounCode = params.nounCode;
      this.libraryModifierCode = params.modCode;
      this.schemaId = params.schemaId;
      this.activatedRoute.queryParams.subscribe((queryParams) => {
        this.isMapped = Boolean(queryParams.isMapped === 'true');
        this.buildMappingForm();
      });
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
    const data = this.mappingForm.value;
    const request: ClassificationMappingRequest = {
      nounCode: data.libraryNounCode,
      modCode: data.libraryModCode,
      nounDesc: '',
      modDesc: '',
      attrList: this.gsnAttributes.map((att) => {
        const attr = {
          attrCode: att.ATTR_CODE,
          attrDesc: att.ATTR_DESC
        };
        return attr;
      })
    };
    if(this.isMapped) {
      this.gsnAttributes.forEach((row) => {
        row.status = 'matched';
        this.addAttributeMappingRow(row);
      });
    } else {
      this.nounModifierService.getClassificationMappingData(request).subscribe((resp) => {
        resp =  {
          noun: {
            source: '',
            targetCtrl: {
              MANDATORY: '',
              ATTRIBUTE_ID: '',
              ATTR_DESC: '',
              ATTR_CODE: '',
              TEXT_FIELD: '',
              DROPDOWN_FIELD:'',
              ATTRIBUTES_VALUES:'',
              LENGTH: '',
              DESC_ACTIVE:'',
              FIELD_TYPE: '',
            },
            status: 'unmatched'
          },
          modifier: {
            source: '',
            targetCtrl: {
              MANDATORY: '',
              ATTRIBUTE_ID: '',
              ATTR_DESC: '',
              ATTR_CODE: '',
              TEXT_FIELD: '',
              DROPDOWN_FIELD:'',
              ATTRIBUTES_VALUES:'',
              LENGTH: '',
              DESC_ACTIVE:'',
              FIELD_TYPE: '',
            },
            status: 'suggested'
          },
          attrLists:[{
              source: '',
              targetCtrl: {
                MANDATORY: '',
                ATTRIBUTE_ID: '',
                ATTR_DESC: '',
                ATTR_CODE: '--',
                TEXT_FIELD: '',
                DROPDOWN_FIELD:'',
                ATTRIBUTES_VALUES:'',
                LENGTH: '',
                DESC_ACTIVE:'',
                FIELD_TYPE: '',
              },
              status: 'suggested'
          }]
        };
        this.classificationCategory = resp;
        const frmAray = this.mappingForm.get('attributeMapData') as FormArray;
        frmAray.clear();
        const status = this.isMapped? 'matched' : 'unmatched';
        this.gsnAttributes.forEach((row) => {
          row.status = this.classificationCategory.attrLists.find(x => x.targetCtrl?.ATTR_CODE === row.ATTR_CODE)?.status.toLowerCase() || status;
          this.addAttributeMappingRow(row);
        });
        this.statas.forEach((stat) => {
          stat.count = this.attributeMapData.value.filter(row => row.status === stat.code).length
          + [resp.modifier.status, resp.noun.status].filter(status => status.toLowerCase() === stat.code).length;
        });
      });
    }
  }

  getStatus(fieldname: string) {
    const status = this.isMapped? 'matched' : 'unmatched';
    return this.classificationCategory
    ? this.classificationCategory[fieldname]?.status?.toLowerCase()
      || this.classificationCategory.attrLists.find(row => row.targetCtrl?.ATTR_CODE === fieldname)?.status.toLowerCase()
      || status
    : status;
  }

  canDisplayField(fieldname: string) {
    const status = this.getStatus(fieldname);
    const selectedStatus = this.statas.filter(row => row.isSeleted).map(row => row.code);
    return !selectedStatus.length || selectedStatus.includes(status);
  }

  canDisplayAttribute(value) {
    const searchStr = this.searchString.toLowerCase();
    return (!searchStr || (value.libraryAttributeText || value.libraryAttributeCode).toLowerCase().includes(searchStr)) && this.canDisplayField(value.libraryAttributeCode);
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
        let exAttr = this.gsnAttributes.filter(fil => fil.ATTRIBUTE_ID === v.libraryAttributeCode)[0];
        exAttr = exAttr ? exAttr : new AttributesDoc();
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
    if(nounCode||modifierCode)
    this.nounModifierService.getLocalAttribute(nounCode, modifierCode, '0')
      .subscribe(attributes => {
        this.LocalAttributesList = attributes;
      },error=>{
        console.log('Error loading Local Attributes', error);
        console.log(error);
      })
  }

  getAttributesFromGsn(nounCode: string , modCode: string) {
    this.userDetails.getUserDetails().subscribe(user=>{
      console.log('Caling attribute api', nounCode, modCode, user.plantCode);
      this.nounModifierService.getGsnAttribute(nounCode, modCode, user.plantCode).subscribe(res=>{
        this.gsnAttributes = res.ATTRIBUTES ? res.ATTRIBUTES : [];
        this.mgroup = res.MGROUP ? res.MGROUP : '';
        this.getAttributesMapping();
      }, error => {
        // Test Function starts
        const res  ={'SHORT_DESC':null,'LONG_DESC':null,'MANUFACTURER':null,'PARTNO':null,'NOUN_LONG':null,'NOUN_CODE':'RELAY','NOUN_ID':null,'MODE_CODE':'ASSEMBLY','MOD_LONG':null,'UNSPSC':null,'UNSPSC_DESC':null,'MGROUP':'electrical relays and accessories','ATTRIBUTES':[{'MANDATORY':'0','ATTRIBUTE_ID':'556659709411771566','ATTR_DESC':'HEAT SINK','ATTR_CODE':'HEAT SINK','TEXT_FIELD':'false','DROPDOWN_FIELD':'true','ATTRIBUTES_VALUES':null},{'MANDATORY':'0','ATTRIBUTE_ID':'806309029946291363','ATTR_DESC':'660 VAC','ATTR_CODE':'660 VAC','TEXT_FIELD':'false','DROPDOWN_FIELD':'true','ATTRIBUTES_VALUES':null},{'MANDATORY':'0','ATTRIBUTE_ID':'698677964805359701','ATTR_DESC':'50 A','ATTR_CODE':'50 A','TEXT_FIELD':'false','DROPDOWN_FIELD':'true','ATTRIBUTES_VALUES':null},{'MANDATORY':'0','ATTRIBUTE_ID':'875000061862357095','ATTR_DESC':'3 W','ATTR_CODE':'3 W','TEXT_FIELD':'false','DROPDOWN_FIELD':'true','ATTRIBUTES_VALUES':null},{'MANDATORY':'0','ATTRIBUTE_ID':'536213119970963522','ATTR_DESC':'--','ATTR_CODE':'--','TEXT_FIELD':'false','DROPDOWN_FIELD':'true','ATTRIBUTES_VALUES':null},{'MANDATORY':'0','ATTRIBUTE_ID':'386283772916406823','ATTR_DESC':'--','ATTR_CODE':'--','TEXT_FIELD':'false','DROPDOWN_FIELD':'true','ATTRIBUTES_VALUES':null},{'MANDATORY':'0','ATTRIBUTE_ID':'842029563364864818','ATTR_DESC':'--','ATTR_CODE':'--','TEXT_FIELD':'false','DROPDOWN_FIELD':'true','ATTRIBUTES_VALUES':null},{'MANDATORY':'0','ATTRIBUTE_ID':'873533793106140575','ATTR_DESC':'--','ATTR_CODE':'--','TEXT_FIELD':'false','DROPDOWN_FIELD':'true','ATTRIBUTES_VALUES':null},{'MANDATORY':'0','ATTRIBUTE_ID':'619039059793861681','ATTR_DESC':'PANEL','ATTR_CODE':'PANEL','TEXT_FIELD':'false','DROPDOWN_FIELD':'true','ATTRIBUTES_VALUES':null},{'MANDATORY':'0','ATTRIBUTE_ID':'195659578631390226','ATTR_DESC':'--','ATTR_CODE':'--','TEXT_FIELD':'false','DROPDOWN_FIELD':'true','ATTRIBUTES_VALUES':null},{'MANDATORY':'0','ATTRIBUTE_ID':'332983479494141746','ATTR_DESC':'--','ATTR_CODE':'--','TEXT_FIELD':'false','DROPDOWN_FIELD':'true','ATTRIBUTES_VALUES':null},{'MANDATORY':'0','ATTRIBUTE_ID':'321850039293403042','ATTR_DESC':'--','ATTR_CODE':'--','TEXT_FIELD':'false','DROPDOWN_FIELD':'true','ATTRIBUTES_VALUES':null},{'MANDATORY':'0','ATTRIBUTE_ID':'700337140126953413','ATTR_DESC':'--','ATTR_CODE':'--','TEXT_FIELD':'false','DROPDOWN_FIELD':'true','ATTRIBUTES_VALUES':null},{'MANDATORY':'0','ATTRIBUTE_ID':'296302413945997794','ATTR_DESC':'--','ATTR_CODE':'--','TEXT_FIELD':'false','DROPDOWN_FIELD':'true','ATTRIBUTES_VALUES':null},{'MANDATORY':'0','ATTRIBUTE_ID':'253046953977586241','ATTR_DESC':'--','ATTR_CODE':'--','TEXT_FIELD':'false','DROPDOWN_FIELD':'true','ATTRIBUTES_VALUES':null},{'MANDATORY':'0','ATTRIBUTE_ID':'571950879301744450','ATTR_DESC':'--','ATTR_CODE':'--','TEXT_FIELD':'false','DROPDOWN_FIELD':'true','ATTRIBUTES_VALUES':null},{'MANDATORY':'0','ATTRIBUTE_ID':'762980065633042591','ATTR_DESC':'--','ATTR_CODE':'--','TEXT_FIELD':'false','DROPDOWN_FIELD':'true','ATTRIBUTES_VALUES':null},{'MANDATORY':'0','ATTRIBUTE_ID':'657898411525272022','ATTR_DESC':'--','ATTR_CODE':'--','TEXT_FIELD':'false','DROPDOWN_FIELD':'true','ATTRIBUTES_VALUES':null},{'MANDATORY':'0','ATTRIBUTE_ID':'108680459667187621','ATTR_DESC':'--','ATTR_CODE':'--','TEXT_FIELD':'false','DROPDOWN_FIELD':'true','ATTRIBUTES_VALUES':null},{'MANDATORY':'0','ATTRIBUTE_ID':'818852862876049336','ATTR_DESC':'--','ATTR_CODE':'--','TEXT_FIELD':'false','DROPDOWN_FIELD':'true','ATTRIBUTES_VALUES':null},{'MANDATORY':'0','ATTRIBUTE_ID':'860806687185273927','ATTR_DESC':'--','ATTR_CODE':'--','TEXT_FIELD':'false','DROPDOWN_FIELD':'true','ATTRIBUTES_VALUES':null},{'MANDATORY':'0','ATTRIBUTE_ID':'760579005703298521','ATTR_DESC':'--','ATTR_CODE':'--','TEXT_FIELD':'false','DROPDOWN_FIELD':'true','ATTRIBUTES_VALUES':null},{'MANDATORY':'0','ATTRIBUTE_ID':'326491031680016514','ATTR_DESC':'--','ATTR_CODE':'--','TEXT_FIELD':'true','DROPDOWN_FIELD':'false','ATTRIBUTES_VALUES':null},{'MANDATORY':'0','ATTRIBUTE_ID':'787081299558045389','ATTR_DESC':'electrical relays and accessories','ATTR_CODE':'electrical relays and accessories','TEXT_FIELD':'true','DROPDOWN_FIELD':'false','ATTRIBUTES_VALUES':null}]};
        this.gsnAttributes = res.ATTRIBUTES ? res.ATTRIBUTES : [];
        this.mgroup = res.MGROUP ? res.MGROUP : '';

        this.getAttributesMapping();
        console.log(' Error in calling API', error);
        // Test Fuunction Ends
      });
    });
  }

  /**
   * Add attribute mapping row
   */
  addAttributeMappingRow(attr: AttributesDoc) {
    const status = this.isMapped? 'matched' : 'unmatched';
    this.attributeMapData.push(
      this.formBuilder.group({
        libraryAttributeCode: [attr && attr.ATTR_CODE ? attr.ATTR_CODE : ''],
        libraryAttributeText: [attr && (attr.ATTR_DESC ? attr.ATTR_DESC :  attr.ATTR_CODE) ? attr.ATTR_CODE : ''],
        localAttributeCode: [attr && attr.localAttributeCode ? attr.localAttributeCode : ''],
        localAttributeText: [attr && attr.localAttributeText ? attr.localAttributeText : ''],
        status: [attr && attr.status ? attr.status : status]
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

    this.nounModifierService.saveAttributesMapping(attrMapRequest, this.schemaId)
      .subscribe(resp => {
        this.snackBar.open('Successfully created!', 'close', { duration: 3000 });
        this.sharedServices.setAfterMappingSaved(true);
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
    this.router.navigate(['', { outlets: {sb:`sb/schema/attribute-mapping/${this.moduleId}/${this.libraryNounCode}/${this.libraryModifierCode}`,
    outer: `outer/schema/noun/${this.moduleId}/${this.mgroup}` }}]);
  }

  openModifierSidesheet() {
    this.router.navigate(['', { outlets: {sb:`sb/schema/attribute-mapping/${this.moduleId}/${this.libraryNounCode}/${this.libraryModifierCode}`,
    outer: `outer/schema/modifier/${this.moduleId}/${this.mgroup}/${this.selectedNounCode}` }}]);
  }

  openAttributeSidesheet() {
    this.router.navigate(['', { outlets: {sb:`sb/schema/attribute-mapping/${this.moduleId}/${this.libraryNounCode}/${this.libraryModifierCode}`,
    outer: `outer/schema/attribute/${this.selectedNounCode}` }}]);
  }

  close() {
    this.router.navigate([{ outlets: { sb: null } }]);
  }

  /**
   * Filte attributes based on status or serach ..
   * @param sta status ..
   */
  filterAsStatus(status: Status) {
    status.isSeleted = !status.isSeleted;
  }

  /**
   * Search attribute from global serach ...
   * @param val text for search attributes ..
   */
  searchAttributeVal(val: string) {
    debounceTime(1000);
    this.searchString = val;
  }

  /**
   *
   * @param gsnNounCode gdnNounCode ...
   */
  nounSuggestion(gsnNounCode: string): NounModifier {
    const nnn = this.localNounsList.filter(f=> f.NOUN_ID.toLocaleLowerCase().indexOf(gsnNounCode.toLocaleLowerCase()) !== -1)[0];
    return nnn;
  }


  modifierSuggestion(gsnModeCode: string): NounModifier{
    const nnn = this.LocalModifiersList.filter(f=> f.MODE_CODE.toLocaleLowerCase().indexOf(gsnModeCode.toLocaleLowerCase()) !== -1)[0];
    return nnn;
  }


  attributeSuggestion(gsnAttributeCode: string): AttributesDoc {
    const nnn = this.LocalAttributesList.filter(f=> f.ATTR_CODE.toLocaleLowerCase().indexOf(gsnAttributeCode.toLocaleLowerCase()) !== -1)[0];
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

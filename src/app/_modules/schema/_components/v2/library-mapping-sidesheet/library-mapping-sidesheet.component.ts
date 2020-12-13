import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AttributesMapping } from '@models/schema/classification';
import { NounModifierService } from '@services/home/schema/noun-modifier.service';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';

@Component({
  selector: 'pros-library-mapping-sidesheet',
  templateUrl: './library-mapping-sidesheet.component.html',
  styleUrls: ['./library-mapping-sidesheet.component.scss']
})
export class LibraryMappingSidesheetComponent implements OnInit {

  moduleId: string;

  libraryNounCode: string;

  libraryModifierCode: string;


  localNounsList: any[] = [];


  LocalModifiersList: any[] = [];


  LocalAttributesList: any[] = [];

  /**
   * form to hold mapping data
   */
  mappingForm: FormGroup;

  /**
   * form submission state
   */
  submitted = false;

  STATIC_ATTRIBUTES = ['Color', 'Diameter', 'Length', 'Load limit'];

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private schemaDetailsService: SchemaDetailsService,
    private nounModifierService: NounModifierService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      this.moduleId = params.moduleId;
      this.libraryNounCode = params.nounCode;
      this.libraryModifierCode = params.modCode;

      this.buildMappingForm();

      this.getAttributesMapping();
    });

    this.getLocalNouns();

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
        this.getLocalModifiers(nounCode);
        // TODO reset form controls
    });

    this.mappingForm.get('localModCode').valueChanges.subscribe(modCode => {
        const nounCode = this.mappingForm.get('localNounCode').value;
        if(nounCode && modCode) {
          this.getLocalAttributes(nounCode, modCode);
        }
    });



    this.STATIC_ATTRIBUTES.forEach(attr => {

      this.addAttributeMappingRow({
        libraryAttributeCode: attr,
        localAttributeCode: ''
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

  /**
   * Add attribute mapping row
   */
  addAttributeMappingRow(row?) {

    this.attributeMapData.push(
      this.formBuilder.group({
        libraryAttributeCode: [row && row.libraryAttributeCode ? row.libraryAttributeCode : ''],
        localAttributeCode: [row && row.localAttributeCode ? row.localAttributeCode : '']
      })
    );

  }

  save() {

    this.submitted = true;

    if (this.mappingForm.invalid) {
      this.snackBar.open('Please enter the missing fields !', 'close', { duration: 3000 });
      return;
    }

    console.log(this.mappingForm.value);

    const request: AttributesMapping = { ...this.mappingForm.value } as AttributesMapping;

    this.nounModifierService.saveAttributesMapping(request)
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

  get selectedNoun() {
    return this.localNounsList.find(noun => noun.NOUN_CODE === this.mappingForm.value.localNounCode);
  }

  openNounSidesheet() {
    // need material group
    this.router.navigate(['', { outlets: { outer: `outer/schema/noun/${this.moduleId}/40142300` } }])
  }

  openModifierSidesheet() {
    // need material group and library noun code
    if (!this.selectedNoun) {
      this.snackBar.open('You must select a noun first !', 'close', { duration: 3000 });
      return;
    }
    this.router.navigate(['', { outlets: { outer: `outer/schema/modifier/${this.moduleId}/40142300/${this.selectedNoun.NOUN_CODE}` } }])
  }

  openAttributeSidesheet() {
    // need library nounSno
    if (!this.selectedNoun) {
      this.snackBar.open('You must select a noun first !', 'close', { duration: 3000 });
      return;
    }
    this.router.navigate(['', { outlets: { outer: `outer/schema/attribute/${this.selectedNoun.noun_ID}` } }])
  }

  close() {
    this.router.navigate([{ outlets: { sb: null } }]);
  }

}

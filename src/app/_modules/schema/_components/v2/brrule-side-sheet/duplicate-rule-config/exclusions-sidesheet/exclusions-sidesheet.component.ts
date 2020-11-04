import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'pros-exclusions-sidesheet',
  templateUrl: './exclusions-sidesheet.component.html',
  styleUrls: ['./exclusions-sidesheet.component.scss']
})
export class ExclusionsSidesheetComponent implements OnInit, OnDestroy {

  fId: string;
  serachText = '';

  exclusionControl = new FormControl('');
  synonymsForm: FormGroup ;
  subscription: Subscription;

  constructor(private router: Router,
    private sharedService: SharedServiceService,
    private formBuilder: FormBuilder,
    ) { }


  ngOnInit(): void {

    this.synonymsForm = this.formBuilder.group({
      synonymsArray: this.formBuilder.array([])
    });

    this.subscription = this.sharedService.getExclusionData()
      .subscribe(data => {
        if (data && data.fId) {
          this.initExclusionData(data);
        } else {
          this.router.navigate([{ outlets: { outer: null } }]);
        }
      })
  }


  /**
   * set initial exclusion data
   * @param data initial value
   */
  initExclusionData(data) {

    this.fId = data.fId;

    this.exclusionControl.setValue(data.ival ? data.ival.split(',').join('\n') : '');

    const synonyms = data.sval ? data.sval.replace(/[:]/g, ' ').split(',') : [];


    synonyms.forEach(synonym => {
      this.synonymsArray.push(
        this.formBuilder.group({
          text: synonym,
          editActive: false,
          visible: true
        })
      )
    })

  }

  /**
   * add a new synonym group
   */
  addSynonymGroup() {

    this.synonymsArray.insert(0, this.formBuilder.group({
      text: '',
      editActive: true,
      visible: true
    }))
  }


  /**
   * start synonym group edition
   * @param index group index
   */
  editSynonymGroup(index) {

    const group = this.synonymsArray.at(index);

    group.patchValue({
      text: this.splitStringLines(group.value.text),
      editActive: true
    })
  }


  /**
   * convert a multiline string to space separate single line
   * @param value string to be formatted
   */
  concatStringLines(value: string): string {
    return value.replace(/[ ]/g, '').split('\n').join(' ');
  }

  /**
   * convert space separate string to a multiline string
   * @param value string to be formatted
   */
  splitStringLines(value: string) {
    return value.split(' ').join('\n');
  }

  /**
   * remove a synonym group
   * @param index element to remove
   */
  removeSynonymGroup(index) {
    this.synonymsArray.removeAt(index);
  }

  /**
   * Save a synonym group after edition
   * @param value new value
   * @param index synonym index
   */
  saveSynonymGroup(index) {

    const group = this.synonymsArray.at(index);
    const groupText = this.concatStringLines(group.value.text.replace(/[:,]/g,''));

    group.patchValue({
        text: groupText,
        editActive: false,
        visible: groupText.toLowerCase().indexOf(this.serachText) !== -1
      })
  }

  searchWords(searchText){
    if(!searchText){
      this.synonymsArray.controls.forEach( control => control.patchValue({visible:true}));
      this.serachText = '';
      return;
    }

    this.synonymsArray.controls.forEach( control => {
      if(control.value.text.toLowerCase().indexOf(searchText.toLowerCase()) !== -1){
        control.patchValue({visible:true})
      } else {
        control.patchValue({visible:false})
      }
    });

    this.serachText = searchText;
  }


  /**
   * function to emit data and close the dialog
   */
  close() {

    const result = { fId: this.fId, exclusion: 0, ival: '', sval: '' };
    const exclusionArray = this.exclusionControl.value ? this.exclusionControl.value.trim().replace(/[ ,:]/g,'').split('\n') : [];
    result.ival = exclusionArray.join(',');
    result.exclusion = exclusionArray.length;
    result.sval = this.synonymsArray.value.map(e => e.text.replace(/[ ]/g, ':')).join(',');
    console.log(result);
    this.subscription.unsubscribe();
    this.sharedService.setExclusionData(result);

    this.router.navigate([{ outlets: { outer: null } }]);
  }

  get synonymsArray(){
    return this.synonymsForm.get('synonymsArray') as FormArray;
  }

  ngOnDestroy() {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }



}

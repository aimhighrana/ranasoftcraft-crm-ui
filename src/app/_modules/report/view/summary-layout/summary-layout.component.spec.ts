import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryLayoutComponent } from './summary-layout.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WidgetService } from '@services/widgets/widget.service';
import { LayoutTabResponse, LayoutFieldsResponse } from '@modules/report/_models/widget';
import { of } from 'rxjs';

describe('SummaryLayoutComponent', () => {
  let component: SummaryLayoutComponent;
  let fixture: ComponentFixture<SummaryLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryLayoutComponent ],
      imports:[HttpClientTestingModule, ReactiveFormsModule, FormsModule, RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getLayoutMetadata(), get layoutMetdata', async(()=>{
    const service = fixture.debugElement.injector.get(WidgetService);
    const listofFields :LayoutFieldsResponse[] = new Array();
    const Fields :LayoutFieldsResponse = {tcode:123,fieldId:'abc',fieldDescri:'abc desc',dataType:'CHAR',picklist:1,dispCriteria:0,strucId:'',mandatory:true,hidden:true,isCheckList:true,maxChar:0,dependency:'',parentField:'',locType:'',refField:'',textAreaLength:20,textAreaWidth:10,value:'',sno:''};
    listofFields.push(Fields);
    const metadata :LayoutTabResponse = {tabCode:'123',tabDesc:'Tab',headerType:'N',helpLink:'',refParentObjectId:'',fieldsList:listofFields};
    const listofTabs :LayoutTabResponse[] = new Array();
    listofTabs.push(metadata);
    spyOn(service,'getLayoutMetadata').withArgs('653267432','12345').and.returnValue(of(listofTabs));

    component.layoutMetadata.next(listofTabs);

    component.getLayoutMetadata('653267432','12345');

    expect(service.getLayoutMetadata).toHaveBeenCalledWith('653267432','12345');
  }));

  it('getlayoutData(), get layoutData', async(()=>{
    const service = fixture.debugElement.injector.get(WidgetService);
    const data :any = {};
    spyOn(service,'getlayoutData').withArgs('653267432','12345').and.returnValue(of(data));

    component.getlayoutData('653267432','12345');

    expect(service.getlayoutData).toHaveBeenCalledWith('653267432','12345');
  }));

});

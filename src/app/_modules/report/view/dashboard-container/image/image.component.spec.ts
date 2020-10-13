import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageComponent } from './image.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WidgetImageModel } from '../../../_models/widget';

describe('ImageComponent', () => {
  let component: ImageComponent;
  let fixture: ComponentFixture<ImageComponent>;
  let htmlnative: HTMLElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageComponent ],
      imports:[AppMaterialModuleForSpec,HttpClientTestingModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageComponent);
    component = fixture.componentInstance;
    htmlnative = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('img tag , should create', async(()=>{
    const widget = new WidgetImageModel();
    widget.imageUrl = 'https://www.rawpixel.com/image/535216/red-coming-soon-neon-icon-vector';
    widget.imageName = 'Coming soon..';

    component.widgetImage = widget;
    fixture.detectChanges();
    expect(htmlnative.getElementsByClassName('img-content').length).toEqual(1, 'Img tag should be create');
    // expect((htmlnative.getElementsByClassName('img-content').item(0) as HTMLDivElement).style.background).toContain(widget.imageUrl, `Img src should be equal to ${widget.imageUrl}`);

    widget.imagesno = '61254675245';
    widget.imageUrl = '';
    widget.imageName = 'Coming_Mdo_img..';
    component.widgetImage = widget;
    // const mockUrl =`/MDOSF/dashBoardPanelIcons/${widget.imageName}/?iconSno=${widget.imagesno}`;
    fixture.detectChanges();
    expect(htmlnative.getElementsByClassName('img-content').length).toEqual(1, 'Img tag should be create');
    // expect((htmlnative.getElementsByClassName('img-content').item(0) as HTMLDivElement).style.background).toContain(mockUrl, `Img src should be containt equal to ${mockUrl}`);
  }));
});

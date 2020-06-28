import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Breadcrumb } from '@models/breadcrumb';


import Modeler from 'bpmn-js/lib/Modeler';
import lintModule from 'bpmn-js-bpmnlint';

import customPaletteModule from './config/palette';
import contextPadProvider from './config/context_pad';
import customRules from './config/rules';
import bpmnlintConfig from './config/validation/lint-config';



@Component({
  selector: 'pros-bpmn-builder',
  templateUrl: './bpmn-builder.component.html',
  styleUrls: ['./bpmn-builder.component.scss']
})
export class BpmnBuilderComponent implements OnInit, OnDestroy {

  modeler;
  linting;
  zoomRate = 0.8;
  zoomStep = 0.1;
  blankDigramUrl = '/assets/bpmn/blank.bpmn' ;
  blankDiagram ;
  selectedElement ;

  breadcrumb: Breadcrumb = {
    heading: 'Bpmn Builder',
    links: [
      {
        link: '/admin/default',
        text: 'Platform Settings'
      },
      {
        link: '/admin/modules',
        text: 'Modules'
      }
    ]
  };


  constructor(private http: HttpClient) { }

  ngOnInit() {

    // Modeler configuration
    this.modeler = new Modeler({
      container: '#canvas',
      width: '100%',
      height: '600px',
      bpmnRenderer: {
        // defaultFillColor: '#333',
        defaultStrokeColor: '#007bff'
      },
      textRenderer: {
        defaultStyle: {
          fontFamily: 'Roboto, "Helvetica Neue", sans-serif',
          // fontWeight: 'bold',
          fontSize: '20px',
          lineHeight: 1.6
        }
      },
      keyboard: { bindTo: document },

      linting: {
        bpmnlint: bpmnlintConfig,
        active: true
      },

      additionalModules: [
        customPaletteModule,
        customRules,
        contextPadProvider,
        lintModule
      ]
    });

    this.linting = this.modeler.get('linting');
    this.init();
    this.resetZoom();

    /* this.modeler.on('element.changed', (e) => {
      this.selectedElement = e.element ;
    }); */

    this.modeler.on('selection.changed', (e) => {
        this.selectedElement = e.newSelection[0] ;
    });

  }

  // Init the bpmn modeler with a blank diagram
  init(): void {
    this.http.get(this.blankDigramUrl,
      {
        headers: { observe: 'response' }, responseType: 'text'
      }).subscribe(
        (x: any) => {
          this.modeler.importXML(x);
          this.blankDiagram = x ;
          console.log(x);
      },
    );
  }

  // load an existing bpmn diagram
  load(event){
    console.log(event);
    const diagram = event.target.files[0] ;
    if ( diagram ){
      const fileReader = new FileReader();
      fileReader.readAsText(diagram) ;
      fileReader.onload = (e) => {
        console.log('Loaded diagram : ', fileReader.result);
        this.modeler.importXML(fileReader.result);
        // Clear the input
        event.srcElement.value = null;
      }
    }
  }

  save(): void {

    /*
    // check if there is any validation issue
    if (Object.keys(this.linting._issues).length !== 0) {
      alert('Invalid diagram !')
      return;
    }

    // check if diagram validation is enabled
    if (!this.linting._active) {
      alert('Diagram validation should be enabled !')
      return;
    }
    */

    this.modeler.saveXML({ format: true }, (err: any, xml: any) => {
      if (err) {
        console.log('Error Occurred while saving XML', err);
      } else {
        console.log(xml.replace(/&#34;/g,'"'));

        /*
        var blob = new Blob([xml], {type: "application/xml;charset=utf-8"});
        saveAs(blob, "diagram.xml");
        */

      }
    })
  }


  zoomIn() {
    this.zoomRate += this.zoomStep;
    this.modeler.get('canvas').zoom(this.zoomRate);
  }

  zoomOut() {
    this.zoomRate = this.zoomRate - this.zoomStep > 0 ? this.zoomRate - this.zoomStep : 0.1;
    this.modeler.get('canvas').zoom(this.zoomRate);
  }

  resetZoom() {
    this.modeler.get('zoomScroll').reset();
    this.zoomRate = 0.8;
    this.modeler.get('canvas').zoom(this.zoomRate);
  }

  onUpdateProperties(values){
    if(!this.selectedElement)
      return ;

    console.log(values) ;
    const modeling = this.modeler.get('modeling') ;
    modeling.updateProperties(this.selectedElement,values) ;
    if(values.name){
      modeling.updateLabel(this.selectedElement,values.name) ;
    }
  }

  ngOnDestroy() {
    this.modeler.destroy();
  }

}

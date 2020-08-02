import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { Breadcrumb } from '@models/breadcrumb';

import Modeler from 'bpmn-js/lib/Modeler';
import lintModule from 'bpmn-js-bpmnlint';

import customPaletteModule from './config/palette';
import contextPadProvider from './config/context_pad';
import customRules from './config/rules';
import bpmnlintConfig from './config/validation/lint-config';
import { WorkflowBuilderService } from '@services/workflow-builder.service';




@Component({
  selector: 'pros-bpmn-builder',
  templateUrl: './bpmn-builder.component.html',
  styleUrls: ['./bpmn-builder.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BpmnBuilderComponent implements OnInit, OnDestroy {

  modeler;
  linting;
  zoomRate = 0.8;
  zoomStep = 0.1;
  blankDigramUrl = '/assets/bpmn/blank.bpmn';
  modelerWidth = '100%';


  blankDiagram = '<?xml version="1.0" encoding="UTF-8"?>'
     +'<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="Definitions_0f0redl" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="6.5.1">'
     +'<bpmn:process id="Process_01r63rg" isExecutable="false" moduleId="1005" pathName="WF72"/>'
     +'<bpmndi:BPMNDiagram id="BPMNDiagram_1" >'
     +'<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_01r63rg" /></bpmndi:BPMNDiagram></bpmn:definitions>';


  selectedElement;

  // Bpmn step types
  ELEMENT_TYPES = {
    Activity: 'bpmn:UserTask',
    Determination: 'bpmn:ExclusiveGateway',
    Connection: 'bpmn:SequenceFlow',
    Email_Escalation: 'bpmn:SendTask',
    Background: 'bpmn:ServiceTask',
    End: 'bpmn:EndEvent'
  }

  nextId = 1;

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

  wfDefParams = {
    plantCode:'MDO1003',
    moduleId:'1005',
    pathName: '',
    // sno:'',
    userName:'DemoInit',
    stepDataxml:''
  }

  subscriptionsList: Subscription[] = [];


  constructor(private wfService: WorkflowBuilderService,
              private route : ActivatedRoute) { }

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

    // read moduleId and pathName from query params
    this.subscriptionsList.push(
      this.route.queryParams.subscribe(params => {
          this.wfDefParams.moduleId = params.moduleId;
          this.wfDefParams.pathName = params.pathname;
          this.init() ;
          this.resetZoom();
      })
    )


    /* this.modeler.on('element.changed', (e) => {
      this.selectedElement = e.element ;
    });
    */
    const self = this ;
    this.modeler.get('eventBus').on('shape.added', 999999, (event) => {
      if(event.element.type === this.ELEMENT_TYPES.End){
        // set end step color
        const modeling = self.modeler.get('modeling');
        setTimeout(() => {
          modeling.setColor(event.element, {
            stroke: 'red'
          });
      },100);
    }
      setTimeout(() => {
        self.setElementId(event.element);
      }, 100) ;
      // console.log(event.element);
    });



    this.modeler.on('selection.changed', (e) => {
      this.selectedElement = e.newSelection[0];
    });

    this.modeler.get('eventBus').on('connection.added', (event) => {
      console.log()
      const modeling = self.modeler.get('modeling');
      if (modeling.isRejection && event.element.source.type === self.ELEMENT_TYPES.Activity){
        // set rejection color
        setTimeout(() => {
          modeling.setColor(event.element, {
            stroke: 'red'
          });
          // set the rejection attribute to true
          modeling.updateProperties(event.element, {
            rejection: true,
            conditions : JSON.stringify([])
          });

          // set the source element rejectionToStep
          modeling.updateProperties(event.element.source, {
            rejectionToStep : event.element.target.id
          })

          modeling.isRejection = false;
        }, 100)
      }
      /*
      else {
        modeling.updateProperties(event.element, {
          rejection: false,
          conditions : JSON.stringify([])
        });
      }*/
      modeling.isRejection = false;
   });

   this.modeler.get('eventBus').on('connection.removed', (event) => {
    this.handleConnectionCreation(event);
  });

  }

  // Init the bpmn modeler with a diagram
  init(): void {
    // check if module Id and pathname are present
    if (this.wfDefParams.moduleId && this.wfDefParams.pathName){

      this.subscriptionsList.push(
        this.wfService.getwfDefinition(this.wfDefParams)
            .subscribe(resp => {
              if(resp.stepXml){
                const diagram = resp.stepXml.replace(/'/g, '&#34;');
                this.modeler.importXML(diagram);
              } else {
                this.clearDiagram();
              }
            })
      )
    }

  }

  // clear all diagram elements
  clearDiagram(){
    if (this.wfDefParams.moduleId && this.wfDefParams.pathName){
      this.modeler.importXML(this.blankDiagram, (err: any, xml: any) => {
        const rootElement = this.modeler.get('canvas').getRootElement();
        const modeling = this.modeler.get('modeling');
        modeling.updateProperties(rootElement, {
          moduleId: this.wfDefParams.moduleId,
          pathName: this.wfDefParams.pathName
        })
      });
    }
  }

  // load an existing bpmn diagram
  load(event) {
    const diagram = event.target.files[0];
    if (diagram) {
      const fileReader = new FileReader();
      fileReader.readAsText(diagram);
      fileReader.onload = (e) => {
        const finalDiagram = fileReader.result.toString().replace(/'/g, '&#34;')
        this.modeler.importXML(finalDiagram);
        console.log('Loaded diagram : ', finalDiagram);
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

        console.log(xml.replace(/&#34;/g, '\''));


        const body = {
          ...this.wfDefParams,
          stepDataxml : xml.replace(/&#34;/g, '\'')
        };

        this.subscriptionsList.push(
          this.wfService.saveWfDefinition(body)
              .subscribe(resp => console.log(resp))
        )


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

  onUpdateProperties(values) {
    if (!this.selectedElement)
      return;

    console.log(values);

    const modeling = this.modeler.get('modeling');
    modeling.updateProperties(this.selectedElement, values);

    if (values.name) {
      modeling.updateLabel(this.selectedElement, values.name);
    }

    /* set connection color depending if it's a rejection or not
    if(this.selectedElement.type === this.ELEMENT_TYPES.Connection) {
      modeling.setColor(this.selectedElement, {
        stroke: this.selectedElement.businessObject.$attrs.rejection ? 'red' : '#007bff',
      });
    }
    */
  }

  setElementId(element){
    if(  element.type !== this.ELEMENT_TYPES.Activity
      && element.type !== this.ELEMENT_TYPES.Determination
      && element.type !== this.ELEMENT_TYPES.Email_Escalation
      && element.type !== this.ELEMENT_TYPES.Background
      || element.id.match(/^\d+$/))
      return ;

    const newId = this.nextId > 9 ? 'S' + this.nextId : 'S0' + this.nextId;
    const modeling = this.modeler.get('modeling');
    modeling.updateProperties(element, {id : newId});
    this.nextId++;
  }

  handleConnectionCreation(event){
    if(event.element.businessObject.$attrs.rejection){
      const modeling = this.modeler.get('modeling');
      const source = event.element.source;
      const nextRejection = source.outgoing.find(out => out.businessObject.$attrs.rejection) ;
      console.log('nextRejection', nextRejection)
      const rejectTo = nextRejection ? nextRejection.target.id : '';
      // set the source element rejectionToStep
      setTimeout(()=>{
        modeling.updateProperties(source, {
          rejectionToStep : rejectTo
        })
      }, 100)
    }
  }

  ngOnDestroy() {
    this.modeler.destroy();
    this.subscriptionsList.forEach(sub => sub.unsubscribe());
  }


}



export class CustomPalette {
  constructor(private bpmnFactory: any, private create: any, private elementFactory: any, private palette: any, private translate) {
    palette.registerProvider(this);
  }

  getPaletteEntries(element) {
    const {
      // bpmnFactory,
      create,
      elementFactory,
      // palette
      // translate
    } = this;

    /*
    function createTask(suitabilityScore) {
      return function (event) {
        const businessObject = bpmnFactory.create('bpmn:Task');

        businessObject.suitable = suitabilityScore;

        const shape = elementFactory.createShape({
          type: 'bpmn:Task',
          businessObject
        });

        create.start(event, shape);
      }
    }
    */


    function createAction(type: string, group: string, className: string, title: string = null, options: any = {}) {
      function createListener(event: any) {
        const shape = elementFactory.createShape(Object.assign({ type }, options));
        if (options) {
          shape.businessObject.di.isExpanded = options.isExpanded;
        }
        create.start(event, shape);
      }

      return {
        group,
        className,
        title: title || 'Create ' + type.replace(/^bpmn\:/, ''),
        action: {
          dragstart: createListener,
          click: createListener
        }
      };
    }

    return {

      'create.start-event':
        createAction('bpmn:Task', 'activity', 'bpmn-icon-task', 'Add a start step'),

      'create.user-task':
        createAction('bpmn:UserTask', 'activity', 'bpmn-icon-user-task', 'Create an activity'),

      'create.exclusive-gateway':
        createAction('bpmn:ExclusiveGateway', 'activity', 'bpmn-icon-gateway-xor', 'Create a determination step'),

      'create.email-task':
        createAction('bpmn:SendTask', 'activity', 'bpmn-icon-send-task', 'Create an email step'),

      'create.service-task':
        createAction('bpmn:ServiceTask', 'activity', 'bpmn-icon-service-task', 'Create a background step'),

      'create.end-event':
        createAction('bpmn:EndEvent', 'activity', 'bpmn-icon-end-event-none', 'Add an end step'),


    }
  }
}
const inject = '$inject' ;
CustomPalette[inject] = [ 'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate'
];

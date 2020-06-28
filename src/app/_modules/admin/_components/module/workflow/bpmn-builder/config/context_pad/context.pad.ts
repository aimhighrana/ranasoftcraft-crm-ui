
import ContextPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider'

export class CustomContextPadProvider extends ContextPadProvider  {


static $inject = ['config.contextPad', 'injector', 'eventBus', 'contextPad', 'modeling', 'elementFactory', 'connect', 'create', 'popupMenu', 'canvas', 'rules', 'translate'];
constructor(config: any, injector: any, eventBus: any, contextPad: any, modeling: any, elementFactory: any, connect: any, create: any, popupMenu: any, canvas: any, rules: any, translate: any) {
    super(config, injector, eventBus, contextPad, modeling, elementFactory, connect, create, popupMenu, canvas, rules, translate);


}

getContextPadEntries(element) {

    const result = super.getContextPadEntries(element);

    delete result.replace ;
    delete result['append.end-event'] ;
    delete result['append.gateway'] ;
    delete result['append.append-task'] ;
    delete result['append.intermediate-event'] ;


    if (element.type === 'bpmn:SendTask'){
        delete result.connect ;
    }

    return result;

}
}




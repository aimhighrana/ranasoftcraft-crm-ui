import inherits from 'inherits';
import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';

export default function CustomRules(eventBus) {
  RuleProvider.call(this, eventBus);
}

inherits(CustomRules, RuleProvider);
CustomRules.$inject = ['eventBus'];

CustomRules.prototype.init = function () {


  this.addRule('connection.create', 1100, (context) => {
    console.log('connection creation')
    const source = context.source ;
    const target = context.target;

    // send step don't allow outgoing connections
    if (source.type === 'bpmn:SendTask') { return null; }

    // determination step don't allow more than one incoming connection
    if (target.type === 'bpmn:ExclusiveGateway' && target.incoming.length >= 1) { return null; }

    // start step don't allow incoming connection
    if (target.type === 'bpmn:Task') { return null; }

    // start step don't allow more than one outgoing connection
    if (source.type === 'bpmn:Task' && source.outgoing.length >= 1) { return null; }

    // end step don't allow more than one incoming connection
    if (target.type === 'bpmn:EndEvent' && target.incoming.length >= 1) { return null; }


  });


  // don't allow more than one start step
  this.addRule('shape.create', 1100, (context) => {
    console.log('shape creation :', context.target.children);
    const source = context.shape ;
    const target = context.target;

    if (source.type === 'bpmn:Task' && target.children.some (shape => shape.type === 'bpmn:Task')) { return false; }

  });

};
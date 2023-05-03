import {getXml} from '../../../common/util/IoUtilities';
import {createTempModelerFromXml} from '../../../editor/ModelerHandler';
import {
  addCamundaInputParameter,
  getRootProcess,
} from '../../../common/util/ModellingUtilities';
import {getAllElementsInProcess, insertShape} from '../../../common/util/TransformationUtilities';
import * as consts from '../QHAnaConstants';
import * as qhanaConsts from '../QHAnaConstants';

export async function startQHAnaReplacementProcess(xml) {
  let modeler = await createTempModelerFromXml(xml);
  let elementRegistry = modeler.get('elementRegistry');

  // get root element of the current diagram
  const definitions = modeler.getDefinitions();
  const rootProcess = getRootProcess(definitions);

  console.log(rootProcess);

  if (typeof rootProcess === 'undefined') {

    console.log('Unable to retrieve root process element from definitions!');
    return { status: 'failed', cause: 'Unable to retrieve root process element from definitions!' };
  }

  // Mark process as executable
  rootProcess.isExecutable = true;

  // get all QHAna Service Tasks from the process

  // get all PlanQK modeling constructs from the process
  const qhanaServiceTasks = getAllElementsInProcess(rootProcess, elementRegistry, consts.QHANA_SERVICE_TASK);
  console.log('Process contains ' + qhanaServiceTasks.length + ' QHAna service tasks to replace...');

  const qhanaServiceStepTasks = getAllElementsInProcess(rootProcess, elementRegistry, consts.QHANA_SERVICE_STEP_TASK);
  console.log('Process contains ' + qhanaServiceStepTasks.length + ' QHAna service step tasks to replace...');

  // skip transformation if no QHAna service tasks and no QHAna service step tasks exist in the process
  if ((!qhanaServiceTasks || !qhanaServiceTasks.length) && (!qhanaServiceStepTasks || !qhanaServiceStepTasks.length)) {
    return { status: 'transformed', xml: xml };
  }

  // replace each qhana:QHAnaServiceTask with an ServiceTask with external implementation
  for (let qhanaServiceTask of qhanaServiceTasks) {

    let replacementSuccess = false;
    console.log('Replacing QHAna service task with id %s ', qhanaServiceTask.element.id);
    replacementSuccess = await replaceQHAnaServiceTaskByServiceTask(definitions, qhanaServiceTask.element, qhanaServiceTask.parent, modeler);

    if (!replacementSuccess) {
      console.log('Replacement of QHAna service task with id ' + qhanaServiceTask.element.id + ' failed. Aborting process!');
      return {
        status: 'failed',
        cause: 'Replacement of QHAna service task with id ' + qhanaServiceTask.element.id + ' failed. Aborting process!'
      };
    }
  }

  // replace each qhana:QHAnaServiceStepTask with an ServiceTask with external implementation
  for (let qhanaServiceTask of qhanaServiceStepTasks) {

    let replacementSuccess = false;
    console.log('Replacing QHAna service step task with id %s ', qhanaServiceTask.element.id);
    replacementSuccess = await replaceQHAnaServiceStepTaskByServiceTask(definitions, qhanaServiceTask.element, qhanaServiceTask.parent, modeler);

    if (!replacementSuccess) {
      console.log('Replacement of QHAna service step task with id ' + qhanaServiceTask.element.id + ' failed. Aborting process!');
      return {
        status: 'failed',
        cause: 'Replacement of QHAna service step task with id ' + qhanaServiceTask.element.id + ' failed. Aborting process!'
      };
    }
  }

  const transformedXml = await getXml(modeler);
  // await saveResultXmlFn(transformedXml);
  return {status: 'transformed', xml: transformedXml};
}


/**
 * Replace the given QHAna service task by a BPMN service task
 */
async function replaceQHAnaServiceTaskByServiceTask(definitions, qhanaServiceTask, parentProcess, modeler) {

  const bpmnFactory = modeler.get('bpmnFactory');

  // create a BPMN service task with implementation external
  const topic = 'qhana-plugin.' + qhanaServiceTask.get(qhanaConsts.IDENTIFIER);
  const newServiceTask = bpmnFactory.create('bpmn:ServiceTask', {type: 'external', topic: topic});

  let result = insertShape(definitions, parentProcess, newServiceTask, {}, true, modeler, qhanaServiceTask);

  // set the properties of the QHAna Service Task as inputs of the new Service Task
  if (result.success && result.element) {
    const newElement = result.element;
    addCamundaInputParameter(newElement.businessObject, "qhanaIdentifier", qhanaServiceTask.qhanaIdentifier, bpmnFactory);
    addCamundaInputParameter(newElement.businessObject, "qhanaVersion", qhanaServiceTask.qhanaVersion, bpmnFactory);
    addCamundaInputParameter(newElement.businessObject, "qhanaName", qhanaServiceTask.qhanaName, bpmnFactory);
    addCamundaInputParameter(newElement.businessObject, "qhanaDescription", qhanaServiceTask.qhanaDescription, bpmnFactory);
  }

  return result['success'];
}

/**
 * Replace the given QHAna service step task by a BPMN service task
 */
async function replaceQHAnaServiceStepTaskByServiceTask(definitions, qhanaServiceTask, parentProcess, modeler) {

  const bpmnFactory = modeler.get('bpmnFactory');

  // create a BPMN service task with implementation external and the topic defined in the next step attribute
  const topic = 'plugin-step.' + consts.NEXT_STEP;
  const newServiceTask = bpmnFactory.create('bpmn:ServiceTask', {type: 'external', topic: topic});

  let result = insertShape(definitions, parentProcess, newServiceTask, {}, true, modeler, qhanaServiceTask);

  // set the properties of the QHAna Service Step Task as inputs of the new Service Task
  if (result.success && result.element) {
    const newElement = result.element;
    addCamundaInputParameter(newElement.businessObject, "qhanaNextStep", qhanaServiceTask.qhanaNextStep, bpmnFactory);
  }
  return result['success'];
}

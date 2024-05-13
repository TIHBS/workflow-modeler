/**
 * Event handler used to trigger custom HTML events if the workflow of the modeler changes.
 */
import {getModeler} from "../ModelerHandler";
import {loadDiagram} from "../util/IoUtilities";

// ref to the current quantum workflow modeler
let modelerComponent;

/**
 * Initialize the event handler by defining the modeler component.
 *
 * @param newModelerComponent The quantum workflow modeler component.
 */
export function initEditorEventHandler(newModelerComponent) {
  modelerComponent = newModelerComponent;

    modelerComponent.addEventListener(
        "quantum-workflow-load",
        (event) => {
            console.log("Should load quantum workflow: " + event.detail.workflowName);
            loadDiagram(event.detail.workflow, getModeler(),true);
        },
        false
    );

    modelerComponent.addEventListener(
        "quantum-workflow-transform",
        (event) => {
            console.log("Should transform quantum workflow to camunda: " + event.detail.workflowName);
            // const xmlTransformed = transformDiagram(event.detail.workflow, getModeler(),true);
            // dispatchWorkflowTransformedEvent(xmlTransformed);
        },
        false
    );
}

/**
 * Trigger new workflow event as custom HTML event, dispatched via the quantum workflow modeler component.
 *
 * @param type The type of the event, one of the workflowEventTypes
 * @param workflowXml The workflow diagram as xml string the current event is triggered for.
 * @param workflowSvg The SVG representation of the workflow.
 * @param workflowName The name of the workflow diagram the current event is triggered for.
 * @returns {*} Boolean, true if either event's cancelable attribute value is false or its preventDefault() method was
 *                          not invoked, and false otherwise.
 */
export function dispatchWorkflowEvent(type, workflowXml, workflowSvg, workflowName) {
  const newEvent = new CustomEvent(type, {
    detail: {
      workflowName: workflowName,
      workflowSvg: workflowSvg,
      workflow: workflowXml,
    },
    cancelable: true,
  });
  return modelerComponent?.dispatchEvent?.(newEvent) ?? true;
}

/**
 * Add event listener for the custom HTML event of the given type. The listener is added to the current quantum workflow
 * modeler component and calls the given callback function when the event is fired.
 *
 * @param type The type of the event, one of the workflowEventTypes
 * @param callBckFunction The function defining the action executed when the event occurs
 */
export function addWorkflowEventListener(type, callBckFunction) {
  modelerComponent.addEventListener(
    type,
    (event) => callBckFunction(event),
    false
  );
}

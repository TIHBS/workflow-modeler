import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js-properties-panel/dist/assets/element-templates.css';
import 'bpmn-js-properties-panel/dist/assets/properties-panel.css';
import './extensions/quantme/styling/quantme.less';
import './editor/resources/styling/modeler.css';
import './editor/resources/styling/editor-ui.css';
import './common/camunda-components/styles/style.less';

import React from 'react';
import {createRoot} from 'react-dom/client';
import ButtonToolbar from "./editor/ui/ButtonToolbar";
import {createNewDiagram, loadDiagram} from "./common/util/IoUtilities";
import NotificationHandler from "./editor/ui/notifications/NotificationHandler";
import {createModeler, getModeler} from "./editor/ModelerHandler";
import {getPluginButtons, getTransformationButtons} from "./editor/plugin/PluginHandler";
import {setPluginConfig} from "./editor/plugin/PluginConfigHandler";
import * as editorConfig from './editor/config/EditorConfigManager';

export const notificationHandler = new NotificationHandler([]);

class QuantumWorkflowModeler extends HTMLElement {

  workflowModel;

  connectedCallback() {
    this.innerHTML = `
            <div style="display: flex; flex-direction: column; height: 100%">
              <div id="button-container" style="flex-shrink: 0;"></div>
              <hr class="toolbar-splitter" />
              <div id="main-div" style="display: flex; flex: 1">
                <div id="canvas" style="width: 100%"></div>
                <div id="properties" style="overflow: auto; max-height: 93.5vh; width: 25%; background: #f8f8f8;"></div>
              </div>
              <div id="notification-container"></div>
            </div>`;

    // const urlParams = new URLSearchParams(window.location.search);
    // this.workflowModel = urlParams.get('workflow');
    // this.startModeler();

    const self = this;
    window.addEventListener("message", function(event) {
      console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
      console.log(event.origin);
      console.log(window.location.href);
      if (event.origin === window.location.href.replace(/\/$/, '')
        && event.data && event.data.workflow && typeof event.data.workflow === 'string' && event.data.workflow.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
        const xmlString = event.data.workflow;
        // Do something with the XML string
        self.workflowModel = xmlString;
        editorConfig.setFileName(event.data.name);
        console.log('################################################################################');
        console.log('################################################################################');
        console.log(event.data.name);
        console.log(xmlString);
        // self.startModeler();
        loadDiagram(xmlString, getModeler());
      }
    });
  }

  startModeler() {
    const configs = this.pluginConfigsList;
    console.log(configs);
    setPluginConfig(configs);

    const modeler = createModeler('#canvas', '#properties');

    const handler = NotificationHandler.getInstance();
    const notificationComponent = handler.createNotificationsComponent([]);

    const notificationRoot = createRoot(document.getElementById('notification-container'))
    notificationRoot.render(<div>{notificationComponent}</div>);

    // create a transformation button for each transformation method of a active plugin
    const transformationButtons = getTransformationButtons();

    // integrate react components into the html component
    const root = createRoot(document.getElementById('button-container'))
    root.render(<ButtonToolbar modeler={modeler} pluginButtons={getPluginButtons()}
                               transformButtons={transformationButtons}/>);

    if (this.workflowModel) {
      loadDiagram(this.workflowModel, getModeler());
    } else {
      createNewDiagram(modeler);
    }

    const beforeUnloadListener = (event) => {
      event.preventDefault();
      return event.returnValue = '';
    };
    addEventListener("beforeunload", beforeUnloadListener, {capture: true});
  }

  get pluginConfigs() {
    return this.pluginConfigsList || [];
  }

  set pluginConfigs(pluginConfigs) {
    console.log(pluginConfigs);
    this.pluginConfigsList = pluginConfigs;
    this.startModeler();
  }
}

window.customElements.define('quantum-workflow', QuantumWorkflowModeler);
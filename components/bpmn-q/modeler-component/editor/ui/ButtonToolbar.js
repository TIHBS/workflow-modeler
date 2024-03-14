import React, { Fragment } from "react";
import SaveButton from "./SaveButton";
import OpenButton from "./OpenButton";
import NewDiagramButton from "./NewDiagramButton";
import DeploymentButton from "./DeploymentButton";
import ConfigPlugin from "../config/ConfigPlugin";
import TransformationToolbarButton from "./TransformationToolbarButton";
import UploadButton from "./UploadButton";
import ShortcutPlugin from "../shortcut/ShortcutPlugin";
import XMLViewerButton from "./XMLViewerButton";
import PlanqkSaveButton from "./PlanqkSaveButton";
import PlanqkDeploymentButton from "./PlanqkDeploymentButton";

/**
 * React component which displays the toolbar of the modeler
 *
 * @param props Properties of the toolbar
 * @returns {JSX.Element} The React component
 * @constructor
 */
export default function ButtonToolbar(props) {
  const { modeler, pluginButtons, transformButtons, planqkIntegration } = props;

  const hasTransformations = transformButtons.length > 0;

  return (
    <Fragment>
      {planqkIntegration && (
          <div className="qwm-toolbar">
            <PlanqkSaveButton modeler={modeler}/>
            <hr className="qwm-toolbar-splitter"/>
            <PlanqkDeploymentButton modeler={modeler}/>
            <hr className="qwm-toolbar-splitter"/>
            <OpenButton planqkIntegration={planqkIntegration}/>
            <SaveButton modeler={modeler} planqkIntegration={planqkIntegration} />
          </div>
      )}
      {!planqkIntegration && (
          <div className="qwm-toolbar">
          <hr className="qwm-toolbar-splitter" />
          <NewDiagramButton modeler={modeler} />
          <SaveButton modeler={modeler} planqkIntegration={planqkIntegration} />
          <OpenButton planqkIntegration={planqkIntegration} />
          <UploadButton />
          <XMLViewerButton />
          <hr className="qwm-toolbar-splitter" />
          <ConfigPlugin />
          <hr className="qwm-toolbar-splitter" />
          {hasTransformations && (
            <TransformationToolbarButton
              subButtons={transformButtons}
              title="Transform Workflow"
              styleClass="qwm-workflow-transformation-btn"
            />
          )}
          <DeploymentButton modeler={modeler} />
          <hr className="qwm-toolbar-splitter" />
          {React.Children.toArray(pluginButtons)}
          <ShortcutPlugin />
        </div>
      )}
    </Fragment>
  );
}

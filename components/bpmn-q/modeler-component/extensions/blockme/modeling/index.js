/**
 * Copyright (c) 2024 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import QuantMERenderer from "./QuantMERenderer";
import QuantMEReplaceMenuProvider from "./QuantMEReplaceMenuProvider";
import QuantMEFactory from "./QuantMEFactory";
import QuantMEPathMap from "./QuantMEPathMap";
import QuantMEPropertiesProvider from "./properties-provider/BlockMEPropertiesProvider";
import BpmnKeyboardBinding from "./BpmnKeyboardBindings";
import BpmnEditorActions from "./BpmnEditorActions";
import BpmnKeyboard from "./BpmnKeyboard";
import QuantMEActivityBehavior from "./QuantMEActivityBehavior";
import QuantMESubProcessBehavior from "./QuantMESubProcessBehavior";
import QuantMERules from "./QuantMERules";

export default {
  __init__: [
    "quantMERenderer",
    "quantMEReplaceMenu",
    "bpmnFactory",
    "quantMEPathMap",
    "propertiesProvider",
    "keyboardBindings",
    "editorActions",
    "keyboard",
    "quantMEActivityBehavior",
    "quantMESubProcessBehavior",
    "quantMERules",
  ],
  quantMERenderer: ["type", QuantMERenderer],
  quantMEReplaceMenu: ["type", QuantMEReplaceMenuProvider],
  bpmnFactory: ["type", QuantMEFactory],
  quantMEPathMap: ["type", QuantMEPathMap],
  propertiesProvider: ["type", QuantMEPropertiesProvider],
  keyboardBindings: ["type", BpmnKeyboardBinding],
  editorActions: ["type", BpmnEditorActions],
  keyboard: ["type", BpmnKeyboard],
  quantMEActivityBehavior: ["type", QuantMEActivityBehavior],
  quantMESubProcessBehavior: ["type", QuantMESubProcessBehavior],
  quantMERules: ["type", QuantMERules],
};

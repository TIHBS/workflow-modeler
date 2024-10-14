import * as consts from "../Constants";

// replace options for a BPMN task
export const TASK = [
  {
    id: "invoke-sc-function-task",
    label: "Invoke SC Function Task",
    className: "qwm bpmn-icon-invoke-sc-function-task",
    target: {
      type: consts.BLOCKME_INVOKE_SC_FUNCTION_TASK,
    },
  },
  {
    id: "send-tx-task",
    label: "Send Tx Task",
    className: "qwm bpmn-icon-send-tx-task",
    target: {
      type: consts.BLOCKME_SEND_TX_TASK,
    },
  },
  {
    id: "receive-tx-task",
    label: "Receive Tx Task",
    className: "qwm bpmn-icon-receive-tx-task",
    target: {
      type: consts.BLOCKME_RECEIVE_TX_TASK,
    },
  },
  {
    id: "ensure-tx-state-task",
    label: "Ensure Tx State Task",
    className: "qwm bpmn-ensure-tx-state-task",
    target: {
      type: consts.BLOCKME_ENSURE_TX_STATE_TASK,
    },
  },

];

// replace options for a BPMN data store
export const DATA_STORE = [];
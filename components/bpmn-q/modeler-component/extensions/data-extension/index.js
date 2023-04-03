import './resources/data-flow-styles.css';
import DataFlowRenderer from './rendering/DataFlowRenderer';
import DataFlowReplaceMenuProvider from './menu/DataFlowReplaceMenuProvider';
import DataFlowPaletteProvider from './palette/DataFlowPaletteProvider';
import DataFlowRulesProvider from './rules/DataFlowRulesProvider';
import DataFlowContextPadProvider from './context-pad/DataFlowContextPadProvider';

export default {
  __init__: ['dataFlowRenderer', 'dataFlowMenuProvider', 'dataFlowPaletteProvider', 'dataFlowRules', 'dataFlowContextPadProvider'],
  dataFlowRenderer: ['type', DataFlowRenderer],
  dataFlowMenuProvider: ['type', DataFlowReplaceMenuProvider],
  dataFlowPaletteProvider: ['type', DataFlowPaletteProvider],
  dataFlowRules: ['type', DataFlowRulesProvider],
  dataFlowContextPadProvider: ['type', DataFlowContextPadProvider],
};
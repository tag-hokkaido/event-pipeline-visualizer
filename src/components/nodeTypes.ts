import { SimpleEventNode } from "./SimpleEventNode"
import type { NodeProps } from "reactflow"
import type { SimpleEventInstance, SimpleVisualizerConfig, EventTypeDefinition, NodeStyleDefinition } from "../core/SimpleEventVisualizer"

interface SimpleEventNodeData {
  event: SimpleEventInstance;
  config: SimpleVisualizerConfig;
  eventTypeDefinition?: EventTypeDefinition;
  nodeStyleDefinition?: NodeStyleDefinition;
}

// React Flow用のnodeTypesとedgeTypesを別ファイルで定義
export const nodeTypes = {
  eventNode: SimpleEventNode as React.ComponentType<NodeProps<SimpleEventNodeData>>,
} as const

export const edgeTypes = {} as const 
import { SimpleEventNode } from "./SimpleEventNode"
import { PipelineGroupNode } from "./PipelineGroupNode"
import type { NodeProps } from "reactflow"
import type { SimpleEventInstance, SimpleVisualizerConfig, EventTypeDefinition, NodeStyleDefinition } from "../core/SimpleEventVisualizer"
import type { PipelineGroupNodeData } from "./PipelineGroupNode"

export interface SimpleEventNodeData {
  event: SimpleEventInstance;
  eventTypeDefinition?: EventTypeDefinition;
}

// React Flow用のnodeTypesとedgeTypesを別ファイルで定義
export const nodeTypes = {
  eventNode: SimpleEventNode as React.ComponentType<NodeProps<SimpleEventNodeData>>,
  pipelineGroup: PipelineGroupNode as React.ComponentType<NodeProps<PipelineGroupNodeData>>,
} as const 
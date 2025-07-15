"use client"

import { useMemo, useEffect, useCallback, useRef } from "react"
import ReactFlow, {
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  ConnectionMode,
  type BackgroundVariant,
  ReactFlowInstance,
  useReactFlow,
} from "reactflow"
import "reactflow/dist/style.css"
import { nodeTypes, edgeTypes } from "./nodeTypes"
import type { SimpleEventInstance, SimpleVisualizerConfig } from "../core/SimpleEventVisualizer"

interface SimpleVisualizerComponentProps {
  events: SimpleEventInstance[]
  config: SimpleVisualizerConfig
  onEventUpdate: () => void
}

export function SimpleVisualizerComponent({ events, config }: SimpleVisualizerComponentProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null)
  const previousNodeCount = useRef(0)

  const { nodeData, edgeData } = useMemo(() => {
    const nodeMap = new Map<string, Node>()
    const edgeList: Edge[] = []

    // パイプライン別にグループ化
    const pipelineGroups = events.reduce((acc, event) => {
      const pipelineId = event.config.pipelineId || "default"
      if (!acc[pipelineId]) {
        acc[pipelineId] = []
      }
      acc[pipelineId].push(event)
      return acc
    }, {} as Record<string, SimpleEventInstance[]>)

    let yOffset = 30
    const nodeSpacing = config.nodeSpacing || { x: 300, y: 200 }
    const pipelineSpacing = config.pipelineSpacing || 300

    Object.entries(pipelineGroups).forEach(([pipelineId, pipelineEvents]) => {
      const rootEvents = pipelineEvents.filter(e => !e.parent)

      const positionNodes = (eventList: SimpleEventInstance[], x: number, y: number, level = 0) => {
        eventList.forEach((event, index) => {
          const nodeId = event.id
          const nodeY = y + index * nodeSpacing.y

          // イベントタイプ定義を取得
          const eventTypeDefinition = config.eventTypeConfig?.eventTypes?.[event.config.type]

          nodeMap.set(nodeId, {
            id: nodeId,
            type: "eventNode",
            position: { x: x + level * nodeSpacing.x, y: nodeY },
            data: { 
              event, 
              config,
              eventTypeDefinition,
              nodeStyleDefinition: config.eventTypeConfig?.nodeStyles
            },
          })

          if (event.parent) {
            edgeList.push({
              id: `${event.parent.id}-${nodeId}`,
              source: event.parent.id,
              target: nodeId,
              type: "smoothstep",
              animated: event.status === "running",
              style: { stroke: "#6b7280" },
            })
          }

          if (event.children.length > 0) {
            positionNodes(event.children, x, nodeY, level + 1)
          }
        })
      }

      positionNodes(rootEvents, 60, yOffset)
      yOffset += pipelineSpacing
    })

    return {
      nodeData: Array.from(nodeMap.values()),
      edgeData: edgeList,
    }
  }, [events, config])

  // Update nodes and edges
  useEffect(() => {
    setNodes(nodeData)
    setEdges(edgeData)
  }, [nodeData, edgeData, setNodes, setEdges])

  // 新しいノードが追加されたときにビューを追従
  useEffect(() => {
    if (reactFlowInstance.current && nodeData.length > previousNodeCount.current) {
      // 新しいノードが追加された場合、少し遅延させてからビューを調整
      const timeoutId = setTimeout(() => {
        reactFlowInstance.current?.fitView({
          padding: 0.2,
          includeHiddenNodes: false,
          minZoom: 0.1,
          maxZoom: 1.5,
        })
      }, 100)

      return () => clearTimeout(timeoutId)
    }
    previousNodeCount.current = nodeData.length
  }, [nodeData.length])

  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstance.current = instance
  }, [])

  return (
    <div className="w-full h-full" style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView={false}
        fitViewOptions={{ padding: 0.5, includeHiddenNodes: false }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
        minZoom={0.1}
        maxZoom={2}
        style={{ backgroundColor: '#f9fafb' }}
        proOptions={{ hideAttribution: true }}
        onInit={onInit}
      >
        <Background variant={"dots" as BackgroundVariant} gap={12} size={1} color="#e5e7eb" />
        {config.showControls && <Controls />}
        {config.showMinimap && (
          <MiniMap 
            nodeColor="#3b82f6"
            maskColor="rgba(0, 0, 0, 0.1)"
            style={{ width: 180, height: 120 }}
          />
        )}
      </ReactFlow>
    </div>
  )
} 
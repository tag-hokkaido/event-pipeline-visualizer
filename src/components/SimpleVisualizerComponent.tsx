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
} from "reactflow"
import "reactflow/dist/style.css"
import { nodeTypes } from "./nodeTypes"
import type { SimpleEventInstance, SimpleVisualizerConfig, EventTypeConfig } from "../core/SimpleEventVisualizer"

interface SimpleVisualizerComponentProps {
  events: SimpleEventInstance[]
  config: SimpleVisualizerConfig
  eventTypeConfig: EventTypeConfig
}

export function SimpleVisualizerComponent({ events, config, eventTypeConfig }: SimpleVisualizerComponentProps) {
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

    // パイプライングループノードを作成
    const createPipelineGroupNodes = () => {
      const groupNodes: Node[] = []
      
      Object.entries(pipelineGroups).forEach(([pipelineId, pipelineEvents]) => {
        // パイプラインのステータスを計算
        const statuses = pipelineEvents.map(e => e.status)
        let overallStatus: 'running' | 'completed' | 'failed' | 'pending' = 'pending'
        
        if (statuses.includes('failed')) {
          overallStatus = 'failed'
        } else if (statuses.includes('running')) {
          overallStatus = 'running'
        } else if (statuses.every(s => s === 'completed')) {
          overallStatus = 'completed'
        }

        // パイプライングループノードを作成（背景として）
        const groupNode: Node = {
          id: `pipeline-group-${pipelineId}`,
          type: 'pipelineGroup',
          position: { x: 0, y: 0 }, // 後で調整
          data: {
            pipelineId,
            pipelineName: `Pipeline ${pipelineId}`,
            eventCount: pipelineEvents.length,
            status: overallStatus,
            children: pipelineEvents.map(e => e.id)
          },
          draggable: false, // 背景なのでドラッグ不可
          selectable: false, // 背景なので選択不可
          style: {
            width: 'auto',
            height: 'auto',
            minWidth: 300,
            minHeight: 200,
          },
        }
        
        groupNodes.push(groupNode)
      })
      
      return groupNodes
    }

    const nodeSpacing = config.nodeSpacing || { x: 300, y: 200 }
    const pipelineSpacing = config.pipelineSpacing || 100
    const nodeHeight = 80 // ノードの推定高さ

    // パイプラインの位置を計算（固定間隔）
    const calculatePipelineLayout = () => {
      const pipelinePositions = new Map<string, { x: number; y: number; height: number }>()
      let currentY = 30
      const sortedPipelineIds = Object.keys(pipelineGroups).sort()

      for (const pipelineId of sortedPipelineIds) {
        pipelinePositions.set(pipelineId, {
          x: 60,
          y: currentY,
          height: 400 // 固定高さ
        })

        // 次のパイプラインの開始位置を設定（固定間隔）
        currentY += 500 // 固定間隔
      }

      return pipelinePositions
    }

    const pipelinePositions = calculatePipelineLayout()

    // パイプライングループノードを作成
    const groupNodes = createPipelineGroupNodes()
    
    // シンプルなノード配置（グループ間の重なり回避のみ）
    Object.entries(pipelineGroups).forEach(([pipelineId, pipelineEvents]) => {
      const rootEvents = pipelineEvents.filter(e => !e.parent)
      const pipelinePos = pipelinePositions.get(pipelineId)!

      const positionNodes = (eventList: SimpleEventInstance[], x: number, y: number, level = 0) => {
        let nodeIndex = 0
        eventList.forEach((event) => {
          const nodeId = event.id
          const nodeY = y + nodeIndex * nodeSpacing.y
          const nodeX = x + level * nodeSpacing.x

          // イベントタイプ定義を取得
          const eventTypeDefinition = eventTypeConfig?.eventTypes?.[event.config.type]

          nodeMap.set(nodeId, {
            id: nodeId,
            type: "eventNode",
            position: { x: nodeX, y: nodeY },
            data: { 
              event, 
              eventTypeDefinition
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
            // 子ノードは同じx位置で、次のレベルに配置
            positionNodes(event.children, x, nodeY, level + 1)
          }

          nodeIndex++
        })
      }

      positionNodes(rootEvents, pipelinePos.x, pipelinePos.y)
    })

    // グループノードの位置とサイズを設定（固定サイズ）
    groupNodes.forEach((groupNode) => {
      const pipelineId = groupNode.data.pipelineId
      const pipelinePos = pipelinePositions.get(pipelineId)
      if (pipelinePos) {
        groupNode.position = { 
          x: pipelinePos.x - 75, 
          y: pipelinePos.y - 75 
        }
        
        groupNode.style = {
          width: 600,
          height: 400,
          minWidth: 300,
          minHeight: 200,
          zIndex: -1, // 背景として配置
          pointerEvents: 'none', // マウスイベントを無効化
        }
      }
    })

    // グループノードをメインのノードマップに追加
    groupNodes.forEach(groupNode => {
      nodeMap.set(groupNode.id, groupNode)
    })

    return {
      nodeData: Array.from(nodeMap.values()),
      edgeData: edgeList,
    }
  }, [events, config, eventTypeConfig])

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
        connectionMode={ConnectionMode.Loose}
        fitView={false}
        fitViewOptions={{ padding: 0.5, includeHiddenNodes: false }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
        minZoom={0.1}
        maxZoom={2}
        style={{ backgroundColor: '#f9fafb' }}
        proOptions={{ hideAttribution: true }}
        onInit={onInit}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
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
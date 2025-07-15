import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'

export interface PipelineGroupNodeData {
  pipelineId: string
  pipelineName: string
  eventCount: number
  status: 'running' | 'completed' | 'failed' | 'pending'
  children: string[] // 子ノードのID
}

export function PipelineGroupNode({ data }: NodeProps<PipelineGroupNodeData>) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return '#3b82f6'
      case 'completed':
        return '#10b981'
      case 'failed':
        return '#ef4444'
      case 'pending':
        return '#6b7280'
      default:
        return '#6b7280'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running':
        return 'Running'
      case 'completed':
        return 'Completed'
      case 'failed':
        return 'Failed'
      case 'pending':
        return 'Pending'
      default:
        return 'Unknown'
    }
  }

  return (
    <div className="pipeline-group-node">
      <Handle type="target" position={Position.Top} />
      
      <div 
        className="border-2 border-dashed border-gray-300 bg-gray-50/50 rounded-lg p-3 w-full h-full"
        style={{ 
          borderColor: getStatusColor(data.status),
          backgroundColor: `${getStatusColor(data.status)}10`,
          minWidth: '300px',
          minHeight: '200px'
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-700">
            {data.pipelineName || `Pipeline ${data.pipelineId}`}
          </h3>
          <span 
            className="text-xs text-white px-2 py-1 rounded"
            style={{ backgroundColor: getStatusColor(data.status) }}
          >
            {getStatusText(data.status)}
          </span>
        </div>
                  <p className="text-xs text-gray-500 mb-1">
            {data.eventCount} events
          </p>
        <div className="text-xs text-gray-600">
          ID: {data.pipelineId}
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
} 
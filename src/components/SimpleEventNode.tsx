import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import {
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { SimpleEventNodeData } from "./nodeTypes";

// アイコンマッピングは不要になりました

export const SimpleEventNode = memo(
  ({ data }: NodeProps<SimpleEventNodeData>) => {
    const { event, eventTypeDefinition } = data;

    // eventTypeDefinitionは必須
    if (!eventTypeDefinition) {
      console.warn(`Event type definition not found for type: ${event.config.type}`);
      return null;
    }

    const eventTypeDef = eventTypeDefinition;

    const getStatusIcon = () => {
      switch (event.status) {
        case "running":
          return <Loader2 className="w-5 h-5 animate-spin text-blue-600" />;
        case "completed":
          return <CheckCircle className="w-5 h-5 text-green-600" />;
        case "failed":
          return <XCircle className="w-5 h-5 text-red-600" />;
        default:
          return <Clock className="w-5 h-5 text-gray-500" />;
      }
    };

    const getStatusColor = () => {
      switch (event.status) {
        case "running":
          return `border-blue-400 bg-white shadow-lg shadow-blue-100`;
        case "completed":
          return `border-green-300 bg-white shadow-md shadow-green-100`;
        case "failed":
          return `border-red-300 bg-white shadow-md shadow-red-100`;
        default:
          return `border-gray-300 bg-white shadow-md shadow-gray-100`;
      }
    };

    const getIconBackgroundStyle = () => {
      const baseColors = eventTypeDef.color;

      // アイコン背景は常にイベントタイプの色を保持
      if (eventTypeDef.iconBackground) {
        const { primary, secondary } = eventTypeDef.iconBackground;
        return secondary
          ? {
              background: `linear-gradient(to bottom right, ${primary}, ${secondary})`,
            }
          : { backgroundColor: primary };
      }
      return { backgroundColor: baseColors.primary };
    };

    const getEventIcon = () => {
      try {
        // 動的にLucideアイコンをインポート
        const IconComponent = require(`lucide-react`)[eventTypeDef.icon];
        return IconComponent ? <IconComponent className="w-5 h-5" /> : <Clock className="w-5 h-5" />;
      } catch {
        return <Clock className="w-5 h-5" />;
      }
    };

    // ノードスタイルを適用
    const getNodeStyle = () => {
      const baseStyle =
        "p-4 rounded-xl border-2 flex flex-col justify-between gap-4 min-w-[220px] max-w-[280px] transition-all duration-300 bg-white";
      const statusStyle =
        event.status === "running"
          ? "ring-2 ring-blue-300 ring-opacity-60 scale-105"
          : "hover:scale-102";

      return `${baseStyle} ${getStatusColor()} ${statusStyle}`;
    };

    return (
      <div className={getNodeStyle()} style={{ backgroundColor: "#ffffff" }}>
        <Handle
          type="target"
          position={Position.Top}
          className="w-4 h-4 bg-blue-500 border-2 border-white"
        />

        {/* Header with Icon and Status */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className={`p-3 rounded-xl text-white ${
              event.status === "running" ? "animate-pulse" : ""
            }`}
            style={getIconBackgroundStyle()}
          >
            {/* イベントタイプアイコンは常に固定 */}
            {getEventIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <div
              className={`font-bold text-base truncate ${
                event.status === "running"
                  ? "text-blue-900"
                  : event.status === "completed"
                  ? "text-green-900"
                  : event.status === "failed"
                  ? "text-red-900"
                  : "text-gray-900"
              }`}
            >
              {event.config.name}
            </div>
            <div className="text-sm text-gray-600 truncate font-medium">
              {eventTypeDef.name}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {getStatusIcon()}
            {event.status === "running" && (
              <div className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                LIVE
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {event.status === "failed" && event.error && (
          <div className="text-sm text-red-800 mb-3 bg-red-50 px-3 py-2 rounded-lg border border-red-300">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="font-semibold text-red-700 text-sm">Error</span>
            </div>
            <div className="text-red-700 text-sm">
              {event.error}
            </div>
          </div>
        )}

        {/* Duration Display */}
        {event.startTime && (
          <div className="text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded-lg border border-gray-200 mb-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800">Duration</span>
              <span className="font-bold text-gray-900">
                {event.endTime
                  ? `${event.endTime - event.startTime}ms`
                  : event.status === "running"
                  ? `${Date.now() - event.startTime}ms`
                  : "Waiting"}
              </span>
            </div>
          </div>
        )}

        {/* Progress Message */}
        {event.message && (
          <div className="text-sm text-gray-800 bg-blue-100 px-3 py-2 rounded-lg border border-blue-300">
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-800">→</span>
              <span className="font-medium">{event.message}</span>
            </div>
          </div>
        )}

        {/* Progress Bar for Running Events */}
        {event.status === "running" && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-blue-800">
                Progress
              </span>
              <span className="text-sm font-bold text-blue-700">
                {Math.round(event.progress)}%
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${event.progress}%` }}
              />
            </div>
          </div>
        )}

        <Handle
          type="source"
          position={Position.Bottom}
          className="w-4 h-4 bg-blue-500 border-2 border-white"
        />
      </div>
    );
  }
);

SimpleEventNode.displayName = "SimpleEventNode";

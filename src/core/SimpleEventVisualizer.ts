

// イベントタイプ定義
export interface EventTypeDefinition {
  name: string
  icon: string // lucide-reactのアイコン名
  color: {
    primary: string
    secondary: string
    background: string
  }
  iconBackground?: {
    primary: string
    secondary?: string
  }
  style?: {
    borderColor?: string
    backgroundColor?: string
    textColor?: string
  }
}

// ノードスタイル定義
export interface NodeStyleDefinition {
  width?: string
  height?: string
  padding?: string
  borderRadius?: string
  fontSize?: string
  fontWeight?: string
  shadow?: string
  animation?: string
}

// イベントタイプとスタイルの設定
export interface EventTypeConfig {
  eventTypes: Record<string, EventTypeDefinition>
  defaultEventType?: string
  nodeStyles?: NodeStyleDefinition
}

// シンプルなイベント設定
export interface SimpleEventConfig {
  id: string
  name: string
  type: string
  pipelineId?: string
  parentId?: string
}

// シンプルなビジュアライザー設定
export interface SimpleVisualizerConfig {
  nodeSpacing?: { x: number; y: number }
  pipelineSpacing?: number
  showControls?: boolean
  showMinimap?: boolean
  eventTypeConfig?: EventTypeConfig
}

// イベントステータス
export type EventStatus = "pending" | "running" | "completed" | "failed"

// イベントインスタンス
export interface SimpleEventInstance {
  id: string
  config: SimpleEventConfig
  status: EventStatus
  progress: number
  startTime?: number
  endTime?: number
  error?: string
  message?: string
  parent?: SimpleEventInstance
  children: SimpleEventInstance[]
}

// デフォルトのイベントタイプ定義
const DEFAULT_EVENT_TYPES: Record<string, EventTypeDefinition> = {
  "file-operation": {
    name: "File Operation",
    icon: "FileText",
    color: {
      primary: "#3b82f6",
      secondary: "#dbeafe",
      background: "#eff6ff"
    }
  },
  "data-processing": {
    name: "Data Processing",
    icon: "Database",
    color: {
      primary: "#10b981",
      secondary: "#d1fae5",
      background: "#ecfdf5"
    }
  },
  "api-call": {
    name: "API Call",
    icon: "Globe",
    color: {
      primary: "#f59e0b",
      secondary: "#fef3c7",
      background: "#fffbeb"
    }
  },
  "database": {
    name: "Database",
    icon: "Server",
    color: {
      primary: "#8b5cf6",
      secondary: "#ede9fe",
      background: "#f5f3ff"
    }
  },
  "notification": {
    name: "Notification",
    icon: "Bell",
    color: {
      primary: "#ef4444",
      secondary: "#fee2e2",
      background: "#fef2f2"
    }
  }
}

export class SimpleEventVisualizer {
  private events: Map<string, SimpleEventInstance> = new Map()
  private eventTypeConfig: EventTypeConfig
  private listeners: Array<(events: SimpleEventInstance[]) => void> = []

  constructor(config: EventTypeConfig) {

    // イベントタイプ設定の初期化
    this.eventTypeConfig = {
      eventTypes: { ...DEFAULT_EVENT_TYPES, ...config.eventTypes },
      defaultEventType: config.defaultEventType || "file-operation",
      nodeStyles: config.nodeStyles
    }
  }

  // イベントタイプ定義を取得
  getEventTypeDefinition(type: string): EventTypeDefinition {
    return this.eventTypeConfig.eventTypes[type] || this.eventTypeConfig.eventTypes[this.eventTypeConfig.defaultEventType!]
  }

  // 全イベントタイプ定義を取得
  getAllEventTypeDefinitions(): Record<string, EventTypeDefinition> {
    return this.eventTypeConfig.eventTypes
  }

  // ノードスタイル定義を取得
  getNodeStyleDefinition(): NodeStyleDefinition | undefined {
    return this.eventTypeConfig.nodeStyles
  }

  // イベント開始
  startEvent(id: string, config: Omit<SimpleEventConfig, 'id'>): void {
    if (this.events.has(id)) {
      console.warn(`Event ${id} already exists`)
      return
    }

    const event: SimpleEventInstance = {
      id,
      config: { ...config, id },
      status: "running",
      progress: 0,
      startTime: Date.now(),
      children: [],
    }

    // 親子関係の設定
    if (config.parentId) {
      const parent = this.events.get(config.parentId)
      if (parent) {
        event.parent = parent
        parent.children.push(event)
      }
    }

    this.events.set(id, event)
    this.notifyListeners()
  }

  // 進捗更新
  updateProgress(id: string, progress: number, message?: string): void {
    const event = this.events.get(id)
    if (event) {
      event.progress = progress
      if (message) event.message = message
      this.notifyListeners()
    }
  }

  // イベント完了
  completeEvent(id: string, success: boolean = true, error?: string): void {
    const event = this.events.get(id)
    if (event) {
      event.status = success ? "completed" : "failed"
      event.endTime = Date.now()
      if (error) event.error = error
      this.notifyListeners()
    }
  }

  // 全イベント取得
  getAllEvents(): SimpleEventInstance[] {
    return Array.from(this.events.values())
  }

  // 全イベントクリア
  clear(): void {
    this.events.clear()
    this.notifyListeners()
  }

  // リスナー管理
  onUpdate(callback: (events: SimpleEventInstance[]) => void): () => void {
    this.listeners.push(callback)
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  private notifyListeners(): void {
    const events = Array.from(this.events.values())
    this.listeners.forEach(listener => listener(events))
  }
} 
# API Reference

## 概要

Event Pipeline Visualizerは、リアルタイムでイベントパイプラインを可視化するReactライブラリです。このドキュメントでは、ライブラリの詳細なAPI仕様を説明します。

## メインクラス

### SimpleEventVisualizer

イベントパイプラインの管理と状態追跡を行うメインクラスです。

#### コンストラクタ

```typescript
constructor(config?: SimpleVisualizerConfig)
```

**パラメータ:**
- `config` (オプション): ビジュアライザーの設定

**例:**
```typescript
const visualizer = new SimpleEventVisualizer({
  eventTypeConfig: customEventTypes
})
```

#### メソッド

##### startEvent(id, config)

新しいイベントを開始します。

```typescript
startEvent(id: string, config: SimpleEventConfig): void
```

**パラメータ:**
- `id`: イベントの一意なID
- `config`: イベントの設定

**例:**
```typescript
visualizer.startEvent("load-data", {
  name: "データ読み込み",
  type: "file-operation",
  pipelineId: "data-processing",
  parentId: "init" // オプション
})
```

##### updateProgress(id, progress, message?)

イベントのプログレスを更新します。

```typescript
updateProgress(id: string, progress: number, message?: string): void
```

**パラメータ:**
- `id`: イベントのID
- `progress`: プログレス値（0-100）
- `message` (オプション): プログレスメッセージ

**例:**
```typescript
visualizer.updateProgress("load-data", 50, "ファイルを読み込み中...")
```

##### completeEvent(id, success)

イベントを完了状態にします。

```typescript
completeEvent(id: string, success: boolean): void
```

**パラメータ:**
- `id`: イベントのID
- `success`: 成功したかどうか

**例:**
```typescript
visualizer.completeEvent("load-data", true)
```

##### failEvent(id, error)

イベントを失敗状態にします。

```typescript
failEvent(id: string, error: string): void
```

**パラメータ:**
- `id`: イベントのID
- `error`: エラーメッセージ

**例:**
```typescript
visualizer.failEvent("load-data", "ファイルが見つかりません")
```

##### clear()

すべてのイベントをクリアします。

```typescript
clear(): void
```

##### onUpdate(callback)

イベント更新時のコールバックを設定します。

```typescript
onUpdate(callback: (events: SimpleEventInstance[]) => void): void
```

**パラメータ:**
- `callback`: イベント配列を受け取るコールバック関数

**例:**
```typescript
visualizer.onUpdate((events) => {
  setEvents(events)
})
```

## Reactコンポーネント

### SimpleVisualizerComponent

イベントパイプラインを可視化するメインのReactコンポーネントです。

#### Props

```typescript
interface SimpleVisualizerComponentProps {
  events: SimpleEventInstance[]
  config: SimpleVisualizerConfig
  onEventUpdate: () => void
}
```

**プロパティ:**
- `events`: 表示するイベントの配列
- `config`: ビジュアライザーの設定
- `onEventUpdate`: イベント更新時のコールバック

**例:**
```typescript
<SimpleVisualizerComponent 
  events={events}
  config={{
    nodeSpacing: { x: 300, y: 200 },
    pipelineSpacing: 300,
    showControls: true,
    showMinimap: true,
    eventTypeConfig: customEventTypes
  }}
  onEventUpdate={() => {}}
/>
```

### SimpleEventNode

個別のイベントノードを表示するコンポーネントです。

#### Props

```typescript
interface SimpleEventNodeData {
  event: SimpleEventInstance
  config: SimpleVisualizerConfig
  eventTypeDefinition?: EventTypeDefinition
  nodeStyleDefinition?: NodeStyleDefinition
}
```

## 型定義

### SimpleEventConfig

イベントの設定を定義する型です。

```typescript
interface SimpleEventConfig {
  name: string                    // イベント名
  type: string                    // イベントタイプ
  pipelineId: string              // パイプラインID
  parentId?: string               // 親イベントID（オプション）
}
```

### SimpleVisualizerConfig

ビジュアライザーの設定を定義する型です。

```typescript
interface SimpleVisualizerConfig {
  nodeSpacing?: { x: number; y: number }     // ノード間の間隔
  pipelineSpacing?: number                   // パイプライン間の間隔
  showControls?: boolean                     // コントロールパネルの表示
  showMinimap?: boolean                      // ミニマップの表示
  eventTypeConfig?: EventTypeConfig          // イベントタイプ設定
}
```

### SimpleEventInstance

イベントのインスタンスを表す型です。

```typescript
interface SimpleEventInstance {
  id: string                      // イベントID
  config: SimpleEventConfig       // イベント設定
  status: EventStatus             // イベントステータス
  progress: number                // プログレス（0-100）
  message?: string                // プログレスメッセージ
  error?: string                  // エラーメッセージ
  startTime: number               // 開始時刻
  endTime?: number                // 終了時刻
  parent?: SimpleEventInstance    // 親イベント
  children: SimpleEventInstance[] // 子イベント
}
```

### EventStatus

イベントのステータスを表す型です。

```typescript
type EventStatus = 'pending' | 'running' | 'completed' | 'failed'
```

### EventTypeConfig

イベントタイプの設定を定義する型です。

```typescript
interface EventTypeConfig {
  eventTypes: Record<string, EventTypeDefinition>
  defaultEventType: string
  nodeStyles?: NodeStyleDefinition
}
```

### EventTypeDefinition

個別のイベントタイプの定義を表す型です。

```typescript
interface EventTypeDefinition {
  name: string                    // イベントタイプ名
  icon: string                    // アイコン名
  color: {
    primary: string               // プライマリカラー
    secondary: string             // セカンダリカラー
    background: string            // 背景色
  }
  iconBackground?: {
    primary: string               // アイコン背景プライマリカラー
    secondary: string             // アイコン背景セカンダリカラー
  }
}
```

### NodeStyleDefinition

ノードのスタイル定義を表す型です。

```typescript
interface NodeStyleDefinition {
  width?: string                  // ノード幅
  padding?: string                // パディング
  borderRadius?: string           // 角丸
  fontSize?: string               // フォントサイズ
  fontWeight?: string             // フォントウェイト
  shadow?: string                 // シャドウ
}
```

## イベントタイプ

### デフォルトイベントタイプ

ライブラリには以下のデフォルトイベントタイプが含まれています：

- `file-operation`: ファイル操作
- `data-processing`: データ処理
- `api-call`: API呼び出し
- `database`: データベース操作
- `notification`: 通知

### カスタムイベントタイプ

カスタムイベントタイプは以下のように定義できます：

```typescript
const customEventTypes: EventTypeConfig = {
  eventTypes: {
    "custom-operation": {
      name: "Custom Operation",
      icon: "Server",
      color: {
        primary: "#8b5cf6",
        secondary: "#ede9fe",
        background: "#f5f3ff"
      },
      iconBackground: {
        primary: "#8b5cf6",
        secondary: "#7c3aed"
      }
    }
  },
  defaultEventType: "custom-operation",
  nodeStyles: {
    width: "280px",
    padding: "1rem",
    borderRadius: "0.75rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
  }
}
```

## 利用可能なアイコン

以下のアイコン名が使用できます：

- `FileText` - ファイル操作
- `Database` - データベース・データ処理
- `Globe` - API呼び出し
- `Server` - サーバー処理
- `Bell` - 通知
- `Clock` - 待機状態
- `Play` - 実行中
- `CheckCircle` - 完了
- `XCircle` - エラー
- `AlertTriangle` - 警告

## 使用例

### 基本的な使用例

```typescript
import { SimpleEventVisualizer, SimpleVisualizerComponent } from 'event-pipeline-visualizer'
import { useRef, useEffect, useState } from 'react'

function App() {
  const visualizerRef = useRef<SimpleEventVisualizer | null>(null)
  const [events, setEvents] = useState([])

  useEffect(() => {
    if (!visualizerRef.current) {
      visualizerRef.current = new SimpleEventVisualizer()
      
      visualizerRef.current.onUpdate((events) => {
        setEvents(events)
      })
    }
  }, [])

  const handleStartPipeline = () => {
    const visualizer = visualizerRef.current
    if (!visualizer) return

    // イベントの開始
    visualizer.startEvent("load-data", {
      name: "データ読み込み",
      type: "file-operation",
      pipelineId: "demo",
    })

    // プログレス更新
    setTimeout(() => visualizer.updateProgress("load-data", 50, "読み込み中..."), 1000)
    setTimeout(() => visualizer.updateProgress("load-data", 100, "完了"), 2000)
    setTimeout(() => visualizer.completeEvent("load-data", true), 2000)
  }

  return (
    <div>
      <button onClick={handleStartPipeline}>パイプライン開始</button>
      <div className="w-full h-96">
        <SimpleVisualizerComponent 
          events={events}
          config={{
            nodeSpacing: { x: 300, y: 200 },
            pipelineSpacing: 300,
            showControls: true,
            showMinimap: true
          }}
          onEventUpdate={() => {}}
        />
      </div>
    </div>
  )
}
```

### 並列処理の例

```typescript
const handleParallelDemo = () => {
  const visualizer = visualizerRef.current
  if (!visualizer) return

  // 初期化イベント
  visualizer.startEvent("init", {
    name: "初期化",
    type: "file-operation",
    pipelineId: "parallel-demo",
  })
  setTimeout(() => visualizer.completeEvent("init", true), 500)

  // 並列イベントの開始
  setTimeout(() => {
    visualizer.startEvent("task1", {
      name: "タスク1",
      type: "data-processing",
      pipelineId: "parallel-demo",
      parentId: "init",
    })

    visualizer.startEvent("task2", {
      name: "タスク2",
      type: "api-call",
      pipelineId: "parallel-demo",
      parentId: "init",
    })

    visualizer.startEvent("task3", {
      name: "タスク3",
      type: "database",
      pipelineId: "parallel-demo",
      parentId: "init",
    })
  }, 500)
}
```

## エラーハンドリング

### イベントの失敗処理

```typescript
try {
  // 何らかの処理
  await someAsyncOperation()
  visualizer.completeEvent("operation", true)
} catch (error) {
  visualizer.failEvent("operation", error.message)
}
```

### エラー状態の表示

イベントが失敗状態になると、ノードにエラーメッセージが表示され、視覚的にエラー状態であることが分かります。

## パフォーマンス最適化

### React Flowの最適化

ライブラリは以下の最適化を行っています：

- `nodeTypes`と`edgeTypes`の静的な定義
- 不要な再レンダリングの防止
- 効率的な状態管理

### 大量のイベント処理

大量のイベントを処理する場合は、以下の点に注意してください：

- イベントの適切なクリア
- メモリ使用量の監視
- 必要に応じたイベントの削除

## トラブルシューティング

### よくある問題

1. **React Flowの警告が表示される**
   - `nodeTypes`と`edgeTypes`が正しく定義されているか確認
   - コンポーネントの再レンダリングで新しいオブジェクトが作成されていないか確認

2. **イベントが表示されない**
   - `onUpdate`コールバックが正しく設定されているか確認
   - イベントの`pipelineId`が正しく設定されているか確認

3. **スタイルが適用されない**
   - `eventTypeConfig`が正しく設定されているか確認
   - CSSクラスが正しく読み込まれているか確認

### デバッグ

開発時は以下の方法でデバッグできます：

```typescript
// イベントの状態をログ出力
visualizer.onUpdate((events) => {
  console.log('Events updated:', events)
  setEvents(events)
})
``` 
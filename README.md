# Event Pipeline Visualizer

リアルタイムでイベントパイプラインを可視化するシンプルで使いやすいReactライブラリです。API呼び出し、データ処理、ファイル操作などの非同期処理をノードグラフとして動的に表示します。

## ✨ 特徴

- 🚀 **シンプルなAPI**: 最小限の設定で即座に使用可能
- 🎨 **カスタマイズ可能**: イベントタイプとノードスタイルを自由に定義
- 📊 **リアルタイム更新**: プログレスバーとステータス表示
- 🔄 **自動レイアウト**: 新しいノードの自動追従とビュー調整
- 🎯 **並列処理対応**: 複数のイベントを同時に実行・表示
- 📱 **レスポンシブ**: モバイル対応のレスポンシブデザイン

## 🚀 インストール

```bash
npm install event-pipeline-visualizer
```

## 📦 基本的な使用方法

### 1. ライブラリの初期化

```tsx
import { SimpleEventVisualizer, SimpleVisualizerComponent } from 'event-pipeline-visualizer'
import { useRef, useEffect, useState } from 'react'

function App() {
  const visualizerRef = useRef<SimpleEventVisualizer | null>(null)
  const [events, setEvents] = useState([])

  useEffect(() => {
    // ビジュアライザーを初期化
    if (!visualizerRef.current) {
      visualizerRef.current = new SimpleEventVisualizer()
      
      // イベント更新時のコールバック
      visualizerRef.current.onUpdate((events) => {
        setEvents(events)
      })
    }
  }, [])

  return (
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
  )
}
```

### 2. イベントの開始と管理

```tsx
// イベントの開始
visualizer.startEvent("load-data", {
  name: "データ読み込み",
  type: "file-operation",
  pipelineId: "data-processing",
})

// プログレス更新
visualizer.updateProgress("load-data", 50, "ファイルを読み込み中...")
visualizer.updateProgress("load-data", 100, "完了")

// イベント完了
visualizer.completeEvent("load-data", true)

// 子イベントの開始（親イベント完了後）
visualizer.startEvent("process-data", {
  name: "データ処理",
  type: "data-processing",
  pipelineId: "data-processing",
  parentId: "load-data", // 親イベントのID
})
```

### 3. 並列処理の実行

```tsx
// 複数のイベントを並列で開始
visualizer.startEvent("db-query", {
  name: "データベースクエリ",
  type: "database",
  pipelineId: "parallel-demo",
  parentId: "init-parallel",
})

visualizer.startEvent("api-call", {
  name: "外部API呼び出し",
  type: "api-call",
  pipelineId: "parallel-demo",
  parentId: "init-parallel",
})

visualizer.startEvent("file-process", {
  name: "ファイル処理",
  type: "file-operation",
  pipelineId: "parallel-demo",
  parentId: "init-parallel",
})
```

## 🎨 カスタムイベントタイプ

### イベントタイプの定義

```tsx
const customEventTypes = {
  eventTypes: {
    "file-operation": {
      name: "File Operation",
      icon: "FileText",
      color: {
        primary: "#3b82f6",
        secondary: "#dbeafe",
        background: "#eff6ff"
      },
      iconBackground: {
        primary: "#3b82f6",
        secondary: "#1d4ed8"
      }
    },
    "data-processing": {
      name: "Data Processing",
      icon: "Database",
      color: {
        primary: "#10b981",
        secondary: "#d1fae5",
        background: "#ecfdf5"
      },
      iconBackground: {
        primary: "#10b981",
        secondary: "#059669"
      }
    },
    "api-call": {
      name: "API Call",
      icon: "Globe",
      color: {
        primary: "#f59e0b",
        secondary: "#fef3c7",
        background: "#fffbeb"
      },
      iconBackground: {
        primary: "#f59e0b",
        secondary: "#d97706"
      }
    }
  },
  defaultEventType: "file-operation",
  nodeStyles: {
    width: "280px",
    padding: "1rem",
    borderRadius: "0.75rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
  }
}

// ビジュアライザーの初期化時に設定
const visualizer = new SimpleEventVisualizer({
  eventTypeConfig: customEventTypes
})
```

### 利用可能なアイコン

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

## ⚙️ 設定オプション

### SimpleVisualizerConfig

```tsx
interface SimpleVisualizerConfig {
  nodeSpacing?: { x: number; y: number }     // ノード間の間隔
  pipelineSpacing?: number                   // パイプライン間の間隔
  showControls?: boolean                     // コントロールパネルの表示
  showMinimap?: boolean                      // ミニマップの表示
  eventTypeConfig?: EventTypeConfig          // イベントタイプ設定
}
```

### EventTypeConfig

```tsx
interface EventTypeConfig {
  eventTypes: Record<string, EventTypeDefinition>
  defaultEventType: string
  nodeStyles?: NodeStyleDefinition
}
```

## 🔧 API Reference

### SimpleEventVisualizer

| Method | Description |
|--------|-------------|
| `constructor(config?)` | ビジュアライザーの初期化 |
| `startEvent(id, config)` | イベントの開始 |
| `updateProgress(id, progress, message?)` | プログレスの更新 |
| `completeEvent(id, success)` | イベントの完了 |
| `failEvent(id, error)` | イベントの失敗 |
| `clear()` | 全イベントのクリア |
| `onUpdate(callback)` | イベント更新時のコールバック設定 |

### SimpleEventConfig

```tsx
interface SimpleEventConfig {
  name: string                    // イベント名
  type: string                    // イベントタイプ
  pipelineId: string              // パイプラインID
  parentId?: string               // 親イベントID（オプション）
}
```

## 📱 Demo

デモアプリケーションを実行してライブラリの動作を確認できます：

```bash
cd demo
npm install
npm run dev
```

ブラウザで http://localhost:3000 を開いてデモを確認してください。

## 🛠️ 開発

```bash
# ライブラリのビルド
npm run build

# 型チェック
npm run type-check

# デモアプリの開発サーバー起動
npm run demo:dev
```

## 📦 プロジェクト構造

```
event-pipeline-visualizer/
├── src/                          # ライブラリソース
│   ├── core/                     # コアライブラリ
│   │   └── SimpleEventVisualizer.ts
│   ├── components/               # Reactコンポーネント
│   │   ├── SimpleVisualizerComponent.tsx
│   │   ├── SimpleEventNode.tsx
│   │   └── nodeTypes.ts
│   └── index.ts                  # メインエクスポート
├── demo/                         # デモアプリケーション
│   ├── app/                      # Next.jsアプリ
│   ├── components/               # デモ用コンポーネント
│   └── package.json
├── package.json                  # ライブラリ設定
└── README.md                     # このファイル
```

## 🤝 貢献

プルリクエストやイシューの報告を歓迎します。貢献する前に、以下の手順を確認してください：

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照してください。 
# プロジェクト構造

## 📦 現在のプロジェクト構造

```
event-pipeline-visualizer/
├── 📦 src/                          # ライブラリソース
│   ├── core/                        # コアライブラリ
│   │   └── SimpleEventVisualizer.ts # メインのビジュアライザークラス
│   ├── components/                  # Reactコンポーネント
│   │   ├── SimpleVisualizerComponent.tsx # メインのビジュアライザーコンポーネント
│   │   ├── SimpleEventNode.tsx      # 個別のイベントノードコンポーネント
│   │   └── nodeTypes.ts             # React Flow用のノードタイプ定義
│   └── index.ts                     # メインエクスポート
├── 🎮 demo/                         # デモアプリケーション
│   ├── app/                         # Next.jsアプリ
│   │   ├── page.tsx                 # メインページ
│   │   ├── layout.tsx               # レイアウト
│   │   └── globals.css              # グローバルスタイル
│   ├── components/                  # デモ用コンポーネント
│   │   └── ui/                      # UIコンポーネント（shadcn/ui）
│   ├── hooks/                       # カスタムフック
│   ├── lib/                         # ユーティリティ
│   ├── public/                      # 静的ファイル
│   ├── package.json                 # デモアプリの依存関係
│   ├── next.config.mjs              # Next.js設定
│   ├── tailwind.config.ts           # Tailwind CSS設定
│   └── tsconfig.json                # TypeScript設定
├── 📚 docs/                         # ドキュメント（将来の拡張用）
├── 🧪 tests/                        # テスト（将来の拡張用）
├── 📦 dist/                         # ビルド出力（生成される）
├── package.json                     # ライブラリのpackage.json
├── tsconfig.json                    # TypeScript設定
├── rollup.config.js                 # Rollupビルド設定
├── .gitignore                       # Git除外設定
├── PROJECT_STRUCTURE.md             # このファイル
└── README.md                        # プロジェクト全体のREADME
```

## 🎯 設計思想

### シンプルさを重視
- **最小限のAPI**: 複雑な設定なしで即座に使用可能
- **直感的な操作**: イベントの開始、更新、完了が簡単
- **軽量**: 必要最小限の機能に絞り込み

### 拡張性
- **カスタムイベントタイプ**: JSON形式で簡単に定義可能
- **柔軟なスタイリング**: 色、アイコン、レイアウトを自由にカスタマイズ
- **プラグイン対応**: 将来の機能拡張を考慮した設計

### パフォーマンス
- **React Flow最適化**: nodeTypes/edgeTypesの適切なメモ化
- **効率的なレンダリング**: 必要な部分のみ更新
- **自動ビュー調整**: 新しいノードの自動追従

## 🔧 技術スタック

### ライブラリ
- **React 18+**: メインのUIフレームワーク
- **React Flow 11+**: ノードグラフの可視化
- **TypeScript**: 型安全性の確保
- **Rollup**: ライブラリのビルド

### デモアプリ
- **Next.js 15+**: フルスタックフレームワーク
- **Tailwind CSS**: スタイリング
- **shadcn/ui**: UIコンポーネント
- **Lucide React**: アイコン

## 📁 ファイル詳細

### ライブラリコア (`src/`)

#### `src/core/SimpleEventVisualizer.ts`
- メインのビジュアライザークラス
- イベントの管理と状態の追跡
- リアルタイム更新の処理
- カスタムイベントタイプのサポート

#### `src/components/SimpleVisualizerComponent.tsx`
- React Flowを使用したメインのビジュアライザーコンポーネント
- ノードとエッジのレンダリング
- 自動ビュー調整機能
- コントロールパネルとミニマップの統合

#### `src/components/SimpleEventNode.tsx`
- 個別のイベントノードコンポーネント
- プログレスバーとステータス表示
- カスタムアイコンとスタイリング
- エラー状態の表示

#### `src/components/nodeTypes.ts`
- React Flow用のノードタイプ定義
- パフォーマンス最適化のための静的な定義

### デモアプリ (`demo/`)

#### `demo/app/page.tsx`
- メインのデモページ
- サンプルパイプラインの実行
- 並列処理のデモ
- インタラクティブなコントロール

#### `demo/components/ui/`
- shadcn/uiベースのUIコンポーネント
- ボタン、カード、その他のUI要素

## 🚀 開発ワークフロー

### ライブラリ開発
```bash
# 型チェック
npm run type-check

# ライブラリビルド
npm run build

# 開発モード（監視）
npm run dev
```

### デモアプリ開発
```bash
# デモアプリの開発サーバー起動
npm run demo:dev

# デモアプリのビルド
npm run demo:build
```

### テスト（将来の拡張）
```bash
# ユニットテスト
npm run test

# E2Eテスト
npm run test:e2e
```

## 📦 パッケージング

### ライブラリの配布
- **CommonJS**: `dist/index.js`
- **ES Modules**: `dist/index.esm.js`
- **TypeScript型定義**: `dist/index.d.ts`

### 依存関係
- **peerDependencies**: React, React DOM
- **dependencies**: React Flow
- **devDependencies**: TypeScript, Rollup, ESLint

## 🔮 将来の拡張計画

### Phase 1: 機能拡張
- [ ] イベントの一時停止/再開機能
- [ ] イベントのリトライ機能
- [ ] より詳細なプログレス表示
- [ ] エクスポート機能（PNG, SVG）

### Phase 2: パフォーマンス最適化
- [ ] 仮想化による大量ノード対応
- [ ] Web Workers による重い処理の分離
- [ ] メモリ使用量の最適化

### Phase 3: エコシステム
- [ ] プラグインシステム
- [ ] テーマシステム
- [ ] アニメーション強化
- [ ] アクセシビリティ対応

## 📋 品質保証

### コード品質
- **TypeScript**: 厳密な型チェック
- **ESLint**: コードスタイルの統一
- **Prettier**: コードフォーマット

### テスト戦略
- **ユニットテスト**: 個別コンポーネントのテスト
- **統合テスト**: コンポーネント間の連携テスト
- **E2Eテスト**: 実際の使用シナリオのテスト

### ドキュメント
- **README**: 基本的な使用方法
- **API Reference**: 詳細なAPI仕様
- **Examples**: 実用的なサンプルコード
- **Changelog**: 変更履歴の管理 
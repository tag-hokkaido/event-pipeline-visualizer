# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- 新しいノードの自動ビュー追従機能
- React Flowのパフォーマンス最適化（nodeTypes/edgeTypesのメモ化）
- カスタムイベントタイプの完全サポート
- 並列処理のデモ機能

### Changed
- プロジェクト構造の大幅な簡素化
- APIのシンプル化（SimpleEventVisualizerクラス）
- コンポーネント名の統一（SimpleVisualizerComponent, SimpleEventNode）

### Fixed
- React Flowの警告（nodeTypes/edgeTypesの新規作成）を解消
- デモアプリの設定オブジェクトのメモ化
- 型定義の整理と統一

## [0.1.0] - 2024-01-XX

### Added
- 初回リリース
- 基本的なイベントパイプライン可視化機能
- React Flowベースのノードグラフ表示
- リアルタイムプログレス更新
- カスタムイベントタイプ定義
- 並列処理のサポート
- デモアプリケーション（Next.js）
- TypeScript完全対応
- Rollupビルド設定

### Features
- `SimpleEventVisualizer`クラス
- `SimpleVisualizerComponent`Reactコンポーネント
- `SimpleEventNode`個別ノードコンポーネント
- イベントの開始、更新、完了API
- プログレスバーとステータス表示
- カスタムアイコンとスタイリング
- 自動レイアウト調整
- コントロールパネルとミニマップ

### Technical
- React 18+対応
- React Flow 11+使用
- TypeScript型安全性
- Rollupによるライブラリビルド
- Next.js 15+デモアプリ
- Tailwind CSS + shadcn/ui
- Lucide Reactアイコン

---

## バージョニング方針

このプロジェクトは[Semantic Versioning](https://semver.org/)に従います：

- **MAJOR**: 互換性のないAPI変更
- **MINOR**: 後方互換性のある機能追加
- **PATCH**: 後方互換性のあるバグ修正

## 貢献者

このプロジェクトに貢献してくださった方々に感謝します。 
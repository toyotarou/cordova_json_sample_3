# PokedexApp

Apache Cordova 製の Android アプリ。GitHub 上の公開 JSON データを取得してポケモン図鑑を表示します。一覧画面でのスプライト表示と、進化チェーンをスワイプで閲覧できる詳細ダイアログが特徴です。

---

## アプリ情報

| 項目 | 値 |
|---|---|
| アプリ名 | PokedexApp |
| パッケージ ID | com.example.pokedex |
| バージョン | 1.0.0 |
| ライセンス | Apache-2.0 |

---

## 対応プラットフォーム

| プラットフォーム | パッケージ | バージョン |
|---|---|---|
| Android | cordova-android | ^14.0.1 |

---

## 主な機能

### ポケモン一覧
- 全ポケモンを番号・名前・スプライト画像付きで一覧表示
- ローディングスピナー・エラーメッセージ表示に対応

### 詳細ダイアログ（進化チェーン PageView）
タップしたポケモンの詳細をダイアログで表示。進化チェーン全体をスライダーで確認できます。

| UI 要素 | 説明 |
|---|---|
| スライダー | CSS scroll-snap によるページ送り。モバイルのネイティブスワイプ操作に対応 |
| 矢印ボタン | ← → で前後のポケモンへ移動 |
| ドットインジケーター | 進化チェーン内の現在位置をドットで表示 |
| スライドカウンター | `1 / 3` 形式で現在位置を表示 |

### 各ポケモンの表示情報

| 項目 | 内容 |
|---|---|
| 画像 | PokeAPI スプライト |
| 名前・番号 | 例: `No. 001 Bulbasaur` |
| タイプ | タイプバッジ（色分け）で表示 |
| 弱点 | 弱点バッジで表示 |
| Height / Weight / Egg | 基本ステータス |

---

## 外部データソース

| URL | 説明 |
|---|---|
| `https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json` | ポケモン全データ（名前・タイプ・進化情報など） |
| `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png` | ポケモンスプライト画像（PokeAPI） |

> pokedex.json に含まれる画像 URL は serebii.net のリンク切れのため、PokeAPI のスプライトに差し替えています。

---

## アーキテクチャ

外部ライブラリ・フレームワーク不使用。モジュールパターンで関心を分離しています。

| モジュール | ファイル | 役割 |
|---|---|---|
| `PokemonStore` | `js/pokemon.js` | データ取得・モデル管理・進化チェーン解決 |
| `UI` | `js/ui.js` | レンダリング・ダイアログ・スライダー制御 |
| エントリーポイント | `js/app.js` | Cordova `deviceready` 後に初期化・データ取得を実行 |

---

## プロジェクト構成

```
cordova_json_sample_3/
├── config.xml          # Cordova 設定ファイル
├── package.json        # npm / Cordova 依存関係
└── www/
    ├── index.html      # メイン画面（一覧 + 詳細ダイアログ）
    ├── css/            # スタイルシート（タイプバッジの色定義など）
    ├── img/            # 画像リソース
    └── js/
        ├── pokemon.js  # PokemonStore（データ層）
        ├── ui.js       # UI モジュール（表示層）
        ├── app.js      # エントリーポイント
        └── index.js    # Cordova イベント管理
```

---

## セットアップ・ビルド

```bash
# 依存関係インストール
npm install

# Android ビルド
npx cordova build android

# Android 実機 / エミュレーターで実行
npx cordova run android
```

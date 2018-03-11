# GoogleMapBlockField

Movable Type 7のBlockEditor（ブロックエディタ）にフィールド（フォーマット）「GoogleMap」を追加します。

## 使用法

- インストール後、システム＞設定＞プラグイン＞GoogleMapBlockFieldの設定にご自身のAPIキーを入力してください。  
※詳細は[キーの取得、認証 | Google Maps JavaScript API | Google Developers](https://developers.google.com/maps/documentation/javascript/get-api-key?hl=ja)をご覧ください。

## HTMLに出力した際の処理例

JavaScriptを使用して表示する方法があります。  
`samples/dispmaps.html`をご覧ください。（57行目の`YOUR_API_KEY`にご自身のAPIキーを入力してください。）

## 補足・制約事項

- 2017/03/01現在のMT7を使用して開発しました。
- `/path/to/mt`の下に`mt-static`がある前提になっています。（改善方法調査中）

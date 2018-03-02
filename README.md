# GoogleMapBlockField

Movable Type 7のBlockEditor（ブロックエディタ）にフィールド（フォーマット）「GoogleMap」を追加します。

## 使用法

- インストール前に、`plugins/tmpl/editor.tmpl`内の`YOUR_API_KEY`をご自身のAPIキーに置き換えてください。  
※詳細は[キーの取得、認証 | Google Maps JavaScript API | Google Developers](https://developers.google.com/maps/documentation/javascript/get-api-key?hl=ja)をご覧ください。

## 補足・制約事項

- 2017/03/01現在のMT7を使用して開発しました。
- ジオコーディング（住所から緯度・経度の算出）は未実装です。
- `/path/to/mt`の下に`mt-static`がある前提になっています。（改善方法調査中）

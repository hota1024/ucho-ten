![ucho-ten-ogp](https://user-images.githubusercontent.com/24543982/234512275-b8faebf0-cb11-4950-9740-21764db71d65.png)

# ☸ Ucho-ten

Ucho-ten(有頂天) は「数字」の表示を抑えた Bluesky クライアントです。

| ☸ メイン | <https://ucho-ten.net> |
|:----|:----|
| 🛠 ステージング | <https://stating.ucho-ten.net> |

## 📖 設計思想

特にTwitterやInstagramなどSNSは「いいね」「拡散」「フォロワー」といった要素の数が可視化され、それを意識するように設計されていると考えています。

拡散・リアクションをする際に、本当に自分の価値観で判断しているのか、はたまた、数字があるから「面白い」「これはすごい」と思うのか、無意識にバイアスが働くことで分別がつきにくいように感じています。

また「数字」が増えることに快楽を感じる性質を、少なからず、人間にあるのではないかと考えています。
例えば「スマホゲー広告おける数字が増えるゲーム」「SNSでのバズり」「炎上事に対するリアクション数」など、気軽に享受できる快楽に強く惹かれてしまうのではないでしょうか。

そのためUcho-tenでは、数字と、それを感知する要素を排除することで、他者の評価と自分の評価の境界線を明確にし、「自分の評価軸とは何か」に関する再考、あるいは「自身の価値観で判断する」機会を「気軽に」作れるできるのではないか。

という仮説を立てて、設計・開発されました。

## 🩹 バグ報告について

既知のバグについては[こちら](https://github.com/hota1024/ucho-ten/issues?q=is%3Aopen+is%3Aissue+label%3Abug)から確認できます。

新しくバグを発見した際は[こちら](https://github.com/hota1024/ucho-ten/issues/new/choose) から「Bug report」のテンプレートを使用して issue を作成していただけると幸いです。

## 🔨 技術スタック

Ucho-ten では以下の技術を使用しています。

- `@atproto/api`
- Next.js
- NextUI
- Vercel

## Develop

```shell
yarn install
yarn next
```

動作確認にはBlueSkyのアカウントが利用可能です。セキュリティのためAppPasswordの発行をおすすめします。


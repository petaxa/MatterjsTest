# Vue 3でMatter.jsを使いたい
[codeSandboxにあった先人の足跡](https://codesandbox.io/s/matter-js-forked-xohc25?file=/src/App.vue:64-69)を参考に自分でも書いてみた。  
先人の足跡はVue2っぽいのでmain.jsは少し変更が必要だった。

## Matter.js導入のためにやったこと
1. Vueプロジェクトをinitしnpm installを実行

1. npm install matter-jsを実行

1. src/test.svgを作成、中身に何かを格納しておく

1. Vue.config.productionTipをfalseに設定  
→ 必要なさそう ([Vue3 グローバルAPI config.productionTipの削除](https://v3.ja.vuejs.org/guide/migration/global-api.html#config-productiontip-%E3%81%AE%E5%89%8A%E9%99%A4))

1. main.jsで以下のようにコードを編集
    * vueからのimportにhを追加
    ```JavaScript:main.js
    import { createApp, h } from 'vue'
    ```
    * createApp()の返り値をappに代入(mountを分離)
    ```diff_JavaScript
    - const app = createApp(App).mount('#app')
    + const app = createApp(App)
    + app.mount('#app')
    ```
    * renderを追加(あんまりわかってない)
    ```JavaScript:main.js
    app.component('anchored-heading', {
      render() {
          return h(App, {ref: 'root'})
      }
    })
    ```

1. npm install [pathseg](https://www.npmjs.com/package/pathseg)を実行(SVGのなにかっぽい。わからん;;)  
  `All new development should use the SVG Path Data API.` ということではあるらしい。

1. [先人の足跡](https://codesandbox.io/s/matter-js-forked-xohc25?file=/src/App.vue:64-69)のApp.vueをコピー  

1. script setupへの対応
    1. script setupにし、App.vueのmounted内をonMountedに移動、onMountedをexport default外に移動
        ```JavaScript:App.vue
        - <script>
        + <script setup>
        ```
        ```JavaScript:App.vue
        - mounted() {
        -     // いろいろ
        - }
        + onMounted(() => {
        +     // いろいろ
        + })
        ```
    1. export defaultを削除
    1. templateのdivタグにrefを追加、"root"としておく
        ```JavaScript:App.vue
        - <div id="app"></div>
        + <div id="app" ref="root"></div>
        ```
    1. scriptでrefオブジェクトとしてroot(refで定義した名前)を定義
        ```JavaScript:App.vue
        const root = ref(null)
        ```
    1. Render.create()の引数のオブジェクトでelementの値をroot.valueとする
        ```JavaScript:App.vue
        - element: this.$el,
        + element: root.value,
        ```

1. onMountedから出せるものは出す
Matter用の変数とengine, runnerの作成は外に出してもちゃんと動いた
```JavaScript:App.vue
// これらは外に。
// Matter
const root = ref(null)
const Engine = Matter.Engine
const Render = Matter.Render
const Runner = Matter.Runner
const Common = Matter.Common
const MouseConstraint = Matter.MouseConstraint
const Mouse = Matter.Mouse
const World = Matter.World
const Vertices = Matter.Vertices
const Svg = Matter.Svg
const Bodies = Matter.Bodies
const Composite = Matter.Composite
// create engine
const engine = Engine.create()
const world = engine.world;
// create runner
const runner = Runner.create();
```

1. Composite.add(world, 追加するもの) でオブジェクトを追加できる
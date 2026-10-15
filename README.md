# Charles — Personal Portfolio

个人作品、摄影与技术笔记。使用原生 HTML、CSS、JavaScript 构建，部署于 GitHub Pages。

[访问网站](https://kingston-115.github.io/)

## 设计与交互

- 石墨黑、暖白与荧光绿的作品集版式，搭配本地 Syne / JetBrains Mono 字体。
- SVG 线框雕塑、标题入场、滚动揭示、控制曲线描绘与轻量视差。
- 八个项目、四项竞赛经历、本地摄影预览和学习资源。
- 手机导航、键盘可操作的项目弹窗与摄影横向浏览。
- 动效暂停开关与系统「减少动态效果」支持；装饰动画离开视口后暂停。
- GSAP 与 Lenis 本地打包；禁用 JavaScript 时，项目仍可通过原生 details 展开阅读。

## 本地预览与构建

```sh
npm ci
npm run build
python -m http.server 4173 --bind 127.0.0.1
```

打开 http://127.0.0.1:4173 。只调整首页时可运行 `npm run build:home`。

## 编辑位置

| 文件 | 用途 |
| --- | --- |
| `scripts/build-home.mjs` | 首页结构、项目摘要、导航与页面文案 |
| `js/project-data.mjs` | 项目和荣誉详情，由构建脚本生成静态内容，同时供弹窗使用 |
| `css/home.css` | 首页版式、响应式样式和 CSS 动画 |
| `js/home.js` | 滚动动效、菜单、弹窗、摄影交互和可选数据更新 |
| `assets/signal-knot.svg` | 首页线框图形 |
| `photos/gallery_code.txt` | 摄影原图列表 |
| `scripts/build-thumbnails.mjs` | 生成 WebP 缩略图与摄影清单 |
| `articles.html` / `gallery.html` / `game.html` | 文章、完整画廊与小游戏 |

`index.html` 和 `js/home.min.js` 是生成文件，修改源文件后运行 `npm run build:home`，并一起提交构建结果。`npm run build` 会依次生成图片、首页、Tailwind 样式和图标包。首页使用独立样式；其他页面继续使用 Tailwind 和共享字体样式。

项目卡片的时钟、无人机及响应曲线为概念图形；具体技术内容见项目详情。GitHub Stars 与访问计数是可选的外部数据，加载失败不影响浏览。

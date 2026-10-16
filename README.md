# Charles — Personal Portfolio

个人作品、摄影与技术笔记。使用原生 HTML、CSS、JavaScript 构建，部署于 GitHub Pages。

[访问网站](https://kingston-115.github.io/)

## 设计与交互

- 石墨黑、暖白与荧光绿的作品集版式，搭配本地 Syne / JetBrains Mono 字体。
- 首屏使用横向「∞」形的半扭转三维莫比乌斯带，以石墨金属表面、荧光绿边缘、暖白刻线和轨道刻度呼应网站主题色；交叉处有真实前后距离，受限多轴转动保持无穷符号的辨识度。
- 八个作品均配有独立三维概念场景：多层控制响应、实体智能时钟、悬浮无人机、激光扫描台、监测船声呐、起伏织物、立体电子琴与层叠网页；桌面指针移动改变相机视角，手机可自动播放。
- 八个项目、四项竞赛经历、本地摄影预览和学习资源。
- 手机导航、键盘可操作的项目弹窗与摄影横向浏览。
- 全站中文 / English 即时切换，覆盖首页、文章、摄影和游戏；保存偏好并在站内跳转时保持一致。
- 动效暂停开关与系统「减少动态效果」支持；装饰动画离开视口后暂停。
- GSAP、Lenis 与 Three.js 本地打包；三维模块延后加载、共享一个 WebGL 上下文，仅渲染可见场景。手机限制分辨率与帧率，减少填充开销。
- WebGL 不可用、上下文丢失或模块加载失败时保留原有插画；禁用 JavaScript 时，项目仍可通过原生 details 展开阅读。

## 本地预览与构建

```sh
npm ci
npm run build
python -m http.server 4173 --bind 127.0.0.1
```

打开 http://127.0.0.1:4173 。只调整首页时可运行 `npm run build:home`。

运行 `npm run test:i18n` 检查翻译完整性、变量匹配和静态构建稳定性。

## 编辑位置

| 文件 | 用途 |
| --- | --- |
| `scripts/build-home.mjs` | 首页结构、项目摘要、导航与页面文案 |
| `scripts/project-art.mjs` | 八个作品的 SVG / CSS 回退插画，构建时生成 |
| `css/project-art.css` | 三维画布、回退插画动画与响应式展示 |
| `js/spatial-models.js` | 首屏与八个作品的真实几何、材质、灯光和独立动画 |
| `js/mobius-geometry.mjs` / `scripts/build-mobius.mjs` | 莫比乌斯几何与使用同一曲面生成的静态回退图 |
| `js/spatial-scenes.js` | 单一渲染器、可见性、相机跟随、帧率限制与故障回退 |
| `js/project-data.mjs` | 项目和荣誉详情，由构建脚本生成静态内容，同时供弹窗使用 |
| `js/project-data.en.mjs` | 项目和荣誉详情的英文版本，与中文保持相同的项目 ID |
| `js/locales.mjs` | 全站中英文文案，按稳定的键维护 |
| `js/i18n.js` | 全站语言选择、存储、链接与动态文字更新 |
| `scripts/i18n-markup.mjs` | 构建时为静态文字添加翻译键，保留图标、代码和页面结构 |
| `css/home.css` | 首页版式、响应式样式和 CSS 动画 |
| `js/home.js` | 滚动动效、菜单、弹窗、摄影交互和可选数据更新 |
| `assets/mobius.svg` | 首屏三维模块加载前或不可用时的莫比乌斯插画 |
| `photos/gallery_code.txt` | 摄影原图列表 |
| `scripts/build-thumbnails.mjs` | 生成 WebP 缩略图与摄影清单 |
| `articles.html` / `gallery.html` / `game.html` | 文章、完整画廊与小游戏 |

`index.html`、`js/home.min.js` 和 `js/spatial.min.js` 是生成文件，修改源文件后运行 `npm run build:home`，并一起提交构建结果。三维模块独立打包并延后加载，首页内容和导航不依赖其加载成功。`npm run build` 会依次生成图片、首页、Tailwind 样式和图标包。首页使用独立样式；其他页面继续使用 Tailwind 和共享字体样式。

语言默认中文。选择后使用 `localStorage` 保存，并通过站内链接的 `?lang=zh` / `?lang=en` 参数传递；明确的 URL 参数优先于已保存偏好。支持同源标签页同步，存储不可用时仍可通过链接保持语言。切换不会重置项目弹窗、文章筛选或游戏状态；无 JavaScript 时保留可阅读的中文静态页面。

修改已标记的文案时，编辑 `js/locales.mjs` 中对应的 `[中文, English, 可选的原始文案]`，保持翻译键稳定。添加新文案时在目录中登记，或显式添加 `data-i18n="key"`；混合图标和文字的元素只标记文字节点。动态 UI 使用 `siteI18n.setText()` / `setAttribute()`，不要直接覆盖带翻译键的内容。构建会更新静态页面中的中文默认值。运行 `npm run build:home` 会同时构建全站语言包；`js/i18n.min.js` 也须随源文件提交。

项目卡片中的场景均为概念图形；具体技术内容见项目详情。三维模型进入视口后才创建，离开视口、打开详情或切换到后台时停止渲染，同时遵循全局动效开关和系统减少动态效果设置。暂停时保留当前三维画面；初次打开即减少动态效果时显示静态三维构图。上下文恢复后自动恢复可用的三维画面。GitHub Stars 与访问计数是可选的外部数据，加载失败不影响浏览。

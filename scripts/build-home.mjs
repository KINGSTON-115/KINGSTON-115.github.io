import { writeFile, readFile } from 'node:fs/promises';
import { projectDetails } from '../js/project-data.mjs';
import { localizeMarkup, languagePicker } from './i18n-markup.mjs';

const arrow = '<span aria-hidden="true">↗</span>';
const projects = [
  ['llmPidTuner', '01', 'CONTROL × INTELLIGENCE', 'LLM–PID<br>TUNER.', '让大模型走进真实控制系统。连接本地仿真与硬件，以可观察、可回退的方式探索自动调参。', 'Python / PID / LLM', 'signal'],
  ['nexus', '02', 'CONNECTED OBJECTS', 'NEXUS<br> 智能时钟', '从一块 ESP32 开始，把语音、时间与智能连接到桌面。', 'ESP32-S3 / LVGL / WebSocket', 'clock'],
  ['drone', '03', 'IOT ECOSYSTEM', '共享<br> 无人机柜', '连接小程序、云端与实体柜，让设备共享形成完整闭环。', 'MiniApp / Spring Boot / MQTT', 'drone'],
  ['laser', '04', 'MACHINE VISION', '精准激光除草机', '在视觉识别与运动控制之间，探索精准农业的另一种可能。', 'YOLOv8 / OpenCV / Jetson', 'laser'],
  ['ship', '05', 'AUTONOMOUS SYSTEMS', '北斗水质监测船', '从航向控制到远距离遥测，让嵌入式系统走进真实水域。', 'STM32 / BeiDou / LoRa', 'ship'],
  ['culture', '06', 'GENERATIVE CULTURE', '黎族文化 AIGC', '将传统纹样转化为生成式表达，探索技术与文化的交点。', 'Stable Diffusion / LoRA', 'culture'],
  ['piano', '07', 'BACK TO THE BITS', '51 单片机电子琴', '中断、时序、频率。从寄存器出发，让代码发出声音。', 'C51 / PWM / Hardware', 'piano'],
  ['portfolioSite', '08', 'DIGITAL PLAYGROUND', '你正在浏览的作品', '一个持续生长的数字空间，收集工程、影像与新的想法。', 'HTML / JavaScript / Motion', 'web'],
];

const chart = `<svg class="response-chart" viewBox="0 0 640 360" fill="none" aria-hidden="true"><path class="chart-grid" d="M40 40V310H610M40 100H610M40 170H610M40 240H610M180 40V310M320 40V310M460 40V310M600 40V310"/><path class="chart-target" d="M40 128H610"/><path class="chart-before" d="M40 300C92 300 94 40 152 48S210 245 266 218S310 84 369 98S415 166 475 155S540 119 610 128"/><path class="chart-after" d="M40 300C100 300 100 112 170 112S235 132 280 128H610"/><circle cx="610" cy="128" r="5" fill="currentColor"/></svg>`;
function visual(kind) {
  if (kind === 'signal') return `<div class="chart-top"><span>RESPONSE / CLOSED LOOP</span><span class="live-dot">SIM → REAL</span></div>${chart}<div class="chart-legend"><span><i></i> TUNED RESPONSE</span><span>概念示意 / CONCEPT</span></div>`;
  if (kind === 'clock') return '<div class="clock-object"><div class="clock-face"><span>NEXUS / CONNECTED</span><strong>09<span>:</span>41</strong><small>MAKE TIME FOR IDEAS.</small><div class="clock-wave">▂ ▄ ▆ ▃ █ ▅ ▂ ▄ ▇ ▅ ▂</div></div></div><span class="object-caption">FORM STUDY / 02</span>';
  if (kind === 'drone') return '<div class="drone-object"><i></i><i></i><i></i><i></i><b>+</b></div><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><span class="object-caption">CONNECTED / 03</span>';
  const symbols = {laser:'⌖',ship:'↗',culture:'✳',piano:'≋',web:'{ }'};
  return `<span class="project-symbol" aria-hidden="true">${symbols[kind]}</span>`;
}
const cards = projects.map(([id, no, label, title, description, tags, kind], i) => `<details class="project-card ${i===0?'project-featured':i<3?'project-large':'project-small'} reveal" id="project-${id}">
  <summary data-project="${id}" aria-haspopup="dialog">
    <div class="project-art art-${kind}" aria-hidden="true">${visual(kind)}</div>
    <div class="project-copy"><div class="eyebrow"><span>${no} / ${label}</span>${i===0?'<span class="star-badge">★ <span class="gh-stars">700+</span> STARS</span>':''}</div><h3>${title}</h3><p>${description}</p><div class="project-bottom"><span>${tags}</span><span class="round-arrow" aria-hidden="true">↗</span></div></div>
  </summary><div class="project-fallback detail-body" data-project-content="${id}">${projectDetails[id].content}</div>
</details>`).join('\n');

const awards = [
  ['smartcar2024','2024','第十九届全国大学生智能车竞赛','摄像头组 · 华南赛区','一等奖'],
  ['smartcar2025','2025','第二十届全国大学生智能车竞赛','电磁组 · 华南赛区','三等奖'],
  ['robocom2025','2025','睿抗机器人开发者大赛','魔力元宝 · 海南赛区','二等奖'],
  ['robocom2024','2024','睿抗机器人开发者大赛','魔力元宝 · 海南赛区','三等奖'],
].map(([id,year,title,subtitle,prize])=>`<details class="award-row reveal"><summary data-project="${id}" aria-haspopup="dialog"><span class="award-year">${year}</span><span class="award-name"><strong>${title}</strong><small>${subtitle}</small></span><span class="award-prize">${prize}</span>${arrow}</summary><div class="project-fallback detail-body" data-project-content="${id}">${projectDetails[id].content}</div></details>`).join('');
const manifest=JSON.parse(await readFile(new URL('../photos/gallery_manifest.json',import.meta.url),'utf8'));
const photoNames=[['IMG_5069','海边暮色','晚霞映照下的海浪与远山'],['IMG_3045','海岸漫步','海岸、礁石与远处山丘'],['IMG_7422','偶遇小伙伴','街边正在被抚摸的柯基犬'],['IMG_3898','晴空与棕榈','蓝天下的棕榈树、路灯与海滨建筑'],['IMG_6958','树影之间','阳光穿过绿树，洒落在公园草地上']];
const photographs=photoNames.map(([name,title,description],i)=>{
 const photo=manifest.find(p=>p.thumbnail.endsWith(`/${name}.webp`));
 return `<a class="photo-card" href="gallery.html" aria-label="浏览摄影集：${title}"><div class="photo-crop"><img src="${photo.thumbnail}" width="${photo.width}" height="${photo.height}" alt="${description}" loading="lazy" decoding="async"></div><div class="photo-caption"><span data-i18n="home.frame" data-i18n-vars='{"number":"00${i+1}"}'>FRAME / 00${i+1}</span><span>${title} ${arrow}</span></div></a>`;
}).join('');
const resources=[['01','ROBOTICS','ROS2 入门 21 讲','BV16B4y1Q7jQ'],['02','AI × CONTROL','AI 自动化调参 PID','BV1xbfYBUEig'],['03','FULL STACK','微信小程序开发','BV1WgQdYNERe'],['04','FUNDAMENTALS','翁恺 · C 语言程序设计','BV1dr4y1n7vA'],['05','EMBEDDED','51 单片机入门','BV1Mb411e7re'],['06','HARDWARE','STM32 入门教程','BV1th411z7sn']].map(([n,label,title,bv])=>`<a class="resource-link reveal" href="https://www.bilibili.com/video/${bv}/" target="_blank" rel="noopener noreferrer"><span class="eyebrow">${n} / ${label}</span><strong>${title}</strong><span class="resource-source">BILIBILI ${arrow}</span></a>`).join('');

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Charles — Engineering ideas into reality.</title>
  <meta name="description" content="Charles 的个人作品集：在嵌入式、机器人与生成式 AI 之间，将想法变成真实作品。探索开源项目、摄影与技术笔记。">
  <meta name="theme-color" content="#10110f">
  <link rel="canonical" href="https://kingston-115.github.io/">
  <meta property="og:title" content="Charles — Ideas into reality.">
  <meta property="og:description" content="工程、影像与好奇心。Charles 的个人作品与实验。">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://kingston-115.github.io/">
  <meta property="og:image" content="https://kingston-115.github.io/photos/thumbs/IMG_3045.webp">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%23d1ff54'/%3E%3Ctext x='50%25' y='72%25' text-anchor='middle' font-family='sans-serif' font-weight='bold' font-size='48' fill='%2310110f'%3EC%3C/text%3E%3C/svg%3E">
  <link rel="preload" href="fonts/syne-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="fonts/jetbrains-mono-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="assets/signal-knot.svg" as="image">
  <link rel="stylesheet" href="css/global.css">
  <link rel="stylesheet" href="css/home.css">
  <script src="js/i18n.min.js"></script>
  <script src="js/home.min.js" defer></script>
  <script async src="https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>
</head>
<body>
  <a class="skip-link" href="#main">跳到主要内容</a>
  <div class="reading-progress" aria-hidden="true"></div>
  <header class="site-header">
    <a class="wordmark" href="#about" aria-label="Charles 首页">c<span class="wordmark-dot">.</span><span class="wordmark-name">CHARLES</span></a>
    <nav class="desktop-nav" aria-label="主导航"><a href="#projects">作品 <span aria-hidden="true">01</span></a><a href="#gallery">影像 <span aria-hidden="true">02</span></a><a href="articles.html">文字 <span aria-hidden="true">03</span></a></nav>
    <div class="nav-actions">${languagePicker()}<button class="motion-toggle" type="button" aria-pressed="false" aria-label="暂停装饰动效" title="暂停装饰动效"><span aria-hidden="true">Ⅱ</span></button><a class="nav-contact" href="#contact">LET’S TALK ${arrow}</a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="打开导航菜单"><span></span><span></span></button></div>
    <nav id="mobile-menu" class="mobile-menu" aria-label="手机导航" hidden><a href="#projects">01 / 项目作品 ${arrow}</a><a href="#awards">02 / 荣誉记录 ${arrow}</a><a href="#gallery">03 / 摄影作品 ${arrow}</a><a href="articles.html">04 / 思考记录 ${arrow}</a><a href="#contact">05 / 联系我 ${arrow}</a></nav>
  </header>
  <main id="main">
    <section class="hero page-gutter" id="about" aria-labelledby="hero-title">
      <div class="hero-topline eyebrow"><span class="live-dot">INDEPENDENT DEVELOPER</span><span>ENGINEERING / ART / CURIOSITY</span></div>
      <div class="hero-layout">
        <div class="hero-copy">
          <p class="hero-intro">你好，我是 Charles <span aria-hidden="true">↘</span></p>
          <h1 id="hero-title"><span class="title-line"><span>IDEAS</span></span><span class="title-line"><span>INTO <em>REALITY.</em></span></span></h1>
          <div class="hero-description"><span class="tiny-cross" aria-hidden="true">+</span><p>游走在模拟电路与生成式 AI 之间。<br>用工程实现想法，用好奇心探索边界。</p></div>
          <div class="hero-actions"><a class="primary-button" href="#projects">探索我的作品 <span aria-hidden="true">↘</span></a><a class="text-link" href="https://github.com/KINGSTON-115" target="_blank" rel="noopener noreferrer">GITHUB ${arrow}</a></div>
        </div>
        <div class="hero-art" aria-label="由连续曲线组成的抽象线框雕塑">
          <div class="art-guide guide-horizontal" aria-hidden="true"></div><div class="art-guide guide-vertical" aria-hidden="true"></div>
          <span class="art-coordinate coord-top">FIG. 001 / CONTINUOUS EXPLORATION</span>
          <div class="sculpture-parallax"><div class="sculpture-float"><img class="signal-sculpture" src="assets/signal-knot.svg" width="600" height="600" alt="荧光绿线框交织形成的三维环结" fetchpriority="high"></div></div>
          <span class="art-coordinate coord-bottom">ANALOG SOUL.<br>DIGITAL MIND.</span><span class="art-plus" aria-hidden="true">+</span>
        </div>
      </div>
      <div class="hero-bottom"><span class="eyebrow">EMBEDDED SYSTEMS <span class="muted">/</span> GENERATIVE AI</span><a href="#projects" class="scroll-cue"><span>SCROLL TO EXPLORE</span><span class="scroll-line" aria-hidden="true"></span></a><span class="eyebrow hero-index">PORTFOLIO — 01 / 04</span></div>
    </section>
    <div class="discipline-strip" aria-hidden="true"><div class="strip-track">${Array.from({length:4},()=>'<span>HARDWARE</span><i>✳</i><span>SOFTWARE</span><i>✳</i><span class="strip-outline">SOMEWHERE IN BETWEEN</span><i>✳</i>').join('')}</div></div>
    <section id="projects" class="work-section page-gutter section-space" aria-labelledby="work-title">
      <div class="section-heading reveal"><div><span class="eyebrow section-label">01 / SELECTED WORK</span><h2 id="work-title">把想法，<br><span class="muted">做成作品。</span></h2></div><p>从第一行代码到真实世界的反馈。<br>这里是我的工程实践与持续实验。<span class="section-count">08 PROJECTS ↘</span></p></div>
      <div class="project-grid">${cards}</div>
    </section>
    <section id="awards" class="awards-section page-gutter section-space" aria-labelledby="awards-title"><div class="section-heading reveal"><div><span class="eyebrow section-label">02 / MILESTONES</span><h2 id="awards-title">在探索中，<br><span class="muted">留下坐标。</span></h2></div><p>每一个结果背后，<br>都是无数次调试与重新出发。</p></div><div class="award-list">${awards}</div></section>
    <section id="gallery" class="gallery-section section-space" aria-labelledby="gallery-title"><div class="section-heading page-gutter reveal"><div><span class="eyebrow section-label">03 / THROUGH MY LENS</span><h2 id="gallery-title">代码之外，<br><span class="muted">还有世界。</span></h2></div><div class="gallery-heading-aside"><p>把日常中值得停留的一瞬，<br>留在取景框里。</p><a class="text-link" href="gallery.html">完整摄影集 ${arrow}</a></div></div><div class="photo-rail" tabindex="0" role="region" aria-label="摄影作品，左右滑动或使用方向键浏览">${photographs}<a class="photo-end" href="gallery.html"><span>KEEP<br>LOOKING.</span><span class="round-arrow" aria-hidden="true">↗</span></a></div><div class="gallery-controls page-gutter"><span class="eyebrow">DRAG TO DISCOVER / 滑动浏览</span><div><button class="rail-button" type="button" data-direction="-1" aria-label="上一组照片">←</button><button class="rail-button" type="button" data-direction="1" aria-label="下一组照片">→</button></div></div></section>
    <section id="resources" class="resources-section page-gutter section-space" aria-labelledby="resources-title"><div class="section-heading reveal"><div><span class="eyebrow section-label">04 / OPEN NOTEBOOK</span><h2 id="resources-title">保持饥饿。<br><span class="muted">保持好奇。</span></h2></div><div><p>一路上帮助过我的学习资源，<br>也分享给正在出发的你。</p><a class="text-link" href="articles.html">我的思考记录 ${arrow}</a></div></div><div class="resource-grid">${resources}</div></section>
  </main>
  <footer id="contact" class="contact-section page-gutter"><div class="contact-top eyebrow"><span>HAVE AN IDEA? / 有个想法？</span><span>LET’S MAKE IT HAPPEN.</span></div><a class="contact-title" href="mailto:liangchengchao16@gmail.com"><span>LET’S<br>BUILD.</span><span class="contact-arrow" aria-hidden="true">↗</span></a><div class="contact-bottom"><p>聊聊技术、项目，或任何有趣的事。<a href="mailto:liangchengchao16@gmail.com">liangchengchao16@gmail.com</a></p><div class="social-links"><a href="https://github.com/KINGSTON-115" target="_blank" rel="noopener noreferrer">GITHUB ${arrow}</a><a href="https://space.bilibili.com/26031666" target="_blank" rel="noopener noreferrer">BILIBILI ${arrow}</a><a href="https://x.com/kingsto55984264" target="_blank" rel="noopener noreferrer">X ${arrow}</a><button type="button" data-copy="c877616326">微信 <span>c877616326</span></button><button type="button" data-copy="2877616326">QQ <span>2877616326</span></button></div></div><div class="footer-colophon eyebrow"><span data-i18n="home.credit" data-i18n-vars='{"year":${new Date().getFullYear()}}'>© ${new Date().getFullYear()} CHARLES / BUILT WITH CURIOSITY</span><div><a href="game.html">PLAY A LITTLE ↗</a><a href="https://sbti.fancc.de5.net/" target="_blank" rel="noopener noreferrer">MBTI ↗</a><span class="visitor-stats">VIEWS <span id="busuanzi_value_site_pv">—</span></span><a href="#about">BACK TO TOP ↑</a></div></div></footer>
  <dialog id="project-dialog" aria-labelledby="dialog-title"><div class="dialog-shell"><div class="dialog-top"><span class="eyebrow">PROJECT / FIELD NOTES</span>${languagePicker()}<button class="dialog-close" type="button" aria-label="关闭项目详情">✕</button></div><h2 id="dialog-title"></h2><div class="dialog-tags"></div><div class="detail-body dialog-body"></div><div class="dialog-bottom eyebrow">CHARLES / ENGINEERING & EXPLORATION</div></div></dialog>
  <div id="toast" role="status" aria-live="polite"></div>
</body>
</html>`;
await writeFile(new URL('../index.html',import.meta.url),localizeMarkup(html, 'home')+'\n','utf8');
console.log('Built homepage with 8 project archives, 4 milestones, and local photography.');

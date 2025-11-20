# CHARLES // PERSONAL_SYSTEM_PORTFOLIO

![System Status](https://img.shields.io/badge/SYSTEM-ONLINE-brightgreen?style=for-the-badge&logo=linux)
![Design Style](https://img.shields.io/badge/STYLE-CYBERPUNK_TERMINAL-000000?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/CORE-HTML5%20%2F%20CSS3-orange?style=for-the-badge)

> "Stay Hungry, Stay Foolish. Code is the new alchemy."

## 0x00 // INTRODUCTION (项目简介)

此仓库托管了 **Charles** 的个人主页与技术归档。
作为一个游走在 **模拟电路** 与 **生成式 AI** 边缘的开发者，这个网站摒弃了现代 Web 繁杂的框架，回归纯粹的 HTML/CSS。

设计灵感来源于旧时代终端机与赛博朋克美学：
* **极简主义 (Minimalism)**：无多余脚本，加载速度极快。
* **终端风格 (Terminal aesthetic)**：单宽字体、黑底白字、高对比度。
* **响应式设计 (Responsive)**：适配桌面端与移动端视口。

🔗 **Live Demo**: [https://kingston-115.github.io](https://kingston-115.github.io)

---

## 0x01 // USER_PROFILE (关于作者)

**IDENTITY**: Charles  
**ROLE**: 电子信息专业本科生 / 嵌入式开发者  
**LOCATION**: Hainan / Shenzhen (Loading...)  
**FOCUS**: 
* 🛠 **Embedded Systems**: ESP32, STM32, C51 (Register-level programming)
* ⚡ **Industrial Control**: PLC Ladder Logic, Motor Control
* 🤖 **AI & Robotics**: ROS2, YOLOv8, Computer Vision
* 🌐 **IoT Full Stack**: Spring Boot, WebSocket, MiniProgram

---

## 0x02 // FEATURED_PROJECTS (精选案例)

已归档在网站 `CASE_STUDIES` 模块中的核心项目：

| ID | 项目名称 | 核心技术栈 | 简介 |
|:--:|:---|:---|:---|
| **01** | **Nexus 智能时钟** | `ESP32-S3`, `WebSocket`, `LLM` | 集成大模型后端的桌面智能终端，支持自然语言语音交互。 |
| **02** | **共享无人机柜** | `MiniApp`, `Java`, `IoT Protocol` | 低空经济全栈方案，实现云端监控与自动归还检测。 |
| **03** | **精准激光除草机** | `Jetson Nano`, `YOLOv8`, `OpenCV` | 配合二自由度云台控制高能激光束，实现亚毫米级除草。 |
| **04** | **北斗水质监测船** | `STM32`, `BeiDou`, `LoRa` | 自主巡航监测平台，集成双模定位与 PID 路径跟踪算法。 |
| **05** | **黎族文化 AIGC** | `Stable Diffusion`, `LoRA` | 基于传统纹样训练的生成式艺术模型。 |

---

## 0x03 // SYSTEM_ARCHITECTURE (目录结构)

本站采用原生文件系统路由，结构清晰，便于维护。

```text
root/
├── index.html          # [Level 1] 系统入口 / 个人主页
├── articles.html       # [Level 2] 思考归档 / 文章列表区
├── assets/             # 静态资源库
│   ├── css/            # 样式表 (如分离样式时使用)
│   └── images/         # 项目演示图与摄影作品
├── posts/              # [Level 3] 文章详情子系统
│   ├── 001-nexus.html  # 具体技术文档页面
│   └── ...
└── README.md           # 系统说明文档 (You are here)

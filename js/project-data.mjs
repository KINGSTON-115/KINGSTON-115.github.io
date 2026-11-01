export const projectDetails = {
            plcAnalog: {
                title: "PLC 模拟量扩展模块 · 四层 PCB 与投产验证",
                tags: ["Cadence Allegro", "4-Layer PCB", "Schematic Debug", "Prototype Validation"],
                content: `
                    <p class="project-role">2026.06–2026.09 / 独立完成扩展模块 Layout，协作完成相关板卡打样贴片验证。</p>
                    <h3>1. 从原理图到四层板</h3>
                    <p>面向 PLC 模拟量扩展模块，使用 <strong>Cadence Allegro</strong> 独立完成四层 PCB Layout。工作覆盖原理图网络核查、布局布线与板级检查，将电路连接关系落实到可制造的板卡设计。</p>
                    <h3>2. 强弱电间距与网络排查</h3>
                    <p>按项目约束执行强弱电安全间距：<strong>220V ≥ 3mm，24V ≥ 2mm</strong>。核查时定位到原理图跨页网络标号错误造成的飞线缺失，修正网络连接后继续布局检查，避免把不完整连接带入制板流程。</p>
                    <h3>3. 打样、贴片与工程协作</h3>
                    <p>与同事协作完成相关触控板 Layout、打样及贴片验证，将版图工作衔接到实物板卡。把原理图问题定位、四层板设计与实物验证串联起来，积累面向投产的板级工程经验。</p>
                `
            },
            aiKnowledge: {
                title: "AI 客服知识库管理平台",
                tags: ["Software Architecture", "Access Control", "Alibaba Cloud", "Windows Deployment"],
                content: `
                    <p class="project-role">2026.07–2026.08 / 独立完成需求梳理、软件架构与前后端开发，交付多部门使用。</p>
                    <h3>1. 从一线问题定义工作流</h3>
                    <p>原有客服知识库仅能由单一后台账号上传，内容更新容易形成瓶颈。我深入客服一线调研，将需求转化为<strong>开放上传权限 + 配套审核流程</strong>，兼顾多人参与与内容管理。</p>
                    <h3>2. 前后端与云知识库对接</h3>
                    <p>独立设计软件架构并完成前后端开发，把上传、权限与审核流程组织成可使用的管理平台；对接<strong>阿里云知识库接口</strong>，连接本地管理入口和云端知识维护能力。</p>
                    <h3>3. Windows 交付与持续迭代</h3>
                    <p>打包为 <strong>Windows 一键部署包</strong>，交付多个部门使用，并结合反馈持续迭代。个人贡献贯穿需求分析、流程设计、接口集成与部署交付，覆盖从业务问题到可部署软件的完整交付链路。</p>
                `
            },
            nexus: {
                title: "Nexus 智能时钟",
                tags: ["ESP32-S3", "WebSocket", "LLM", "LVGL"],
                content: `
                    <h3>1. 项目背景</h3>
                    <p>传统桌面时钟功能单一，而智能音箱往往受限于厂商生态。本项目旨在构建一个开源、可高度定制的桌面智能终端，作为连接物理世界与 AI 数字世界的桥梁。</p>
                    <h3>2. 硬件架构</h3>
                    <p>核心采用 <strong>ESP32-S3</strong> 双核芯片，主频 240MHz，具备强大的 AI 算力与 Wi-Fi/蓝牙通信能力。外设包括：</p>
                    <ul>
                        <li><strong>显示：</strong>1.28 英寸圆形 TFT LCD (GC9A01)，240x240 分辨率。</li>
                        <li><strong>音频：</strong>I2S 全向麦克风 (INMP441) + MAX98357A 功放。</li>
                        <li><strong>电源：</strong>TP4056 锂电池充电管理 + 稳压电路。</li>
                    </ul>
                    <h3>3. 软件与算法</h3>
                    <p>基于 <strong>FreeRTOS</strong> 实时操作系统架构，分为 UI 任务、网络任务与音频处理任务。</p>
                    <ul>
                        <li><strong>UI 框架：</strong>移植 LVGL 8.3，设计了高帧率动态表盘与交互界面。</li>
                        <li><strong>AI 通信：</strong>通过 WebSocket 协议与后端服务器建立长连接。后端集成 OpenAI/通义千问 API，将语音转文字 (STT) -> 大模型推理 -> 文字转语音 (TTS) 的全流程延迟压缩至 2秒以内。</li>
                    </ul>
                    <h3>4. 核心难点</h3>
                    <p>在 ESP32 有限的 RAM (512KB) 中同时运行 LVGL 图形栈与 Wi-Fi 协议栈是最大挑战。通过优化 DMA 传输缓冲区与内存复用机制，成功解决了内存溢出问题，保持了系统稳定性。</p>
                `
            },
            drone: {
                title: "共享无人机柜系统",
                tags: ["WeChat MiniApp", "Spring Boot", "IoT", "MQTT"],
                content: `
                    <h3>1. 项目概述</h3>
                    <p>针对校园及景区场景下的无人机租赁需求，开发了一套完整的软硬件解决方案。用户通过微信小程序即可完成实名认证、扫码开柜、电池租赁及飞行记录查看。</p>
                    <h3>2. 技术栈</h3>
                    <ul>
                        <li><strong>前端：</strong>微信小程序原生开发，使用 Canvas 绘制飞行轨迹。</li>
                        <li><strong>后端：</strong>Java Spring Boot 微服务架构，集成微信支付接口，使用 Redis 处理高并发下的柜门状态锁。</li>
                        <li><strong>物联网：</strong>柜体主控通过 4G 模块接入 MQTT Broker，实现了毫秒级的开锁响应与心跳监测。</li>
                    </ul>
                    <h3>3. 核心功能</h3>
                    <p>系统具备<strong>自动归还检测</strong>功能：通过柜内的 RFID 读写器与红外传感器，自动识别归还的无人机型号及配件完整性，并触发自动结算流程。</p>
                `
            },
            laser: {
                title: "精准激光除草机",
                tags: ["YOLOv11s", "STM32F103", "SPI / DAC", "XY Galvanometer", "PX4"],
                content: `
                    <p class="project-role">2025.04–2025.07 / 项目负责人，承担机械结构搭建、硬件调试与系统联调；海南省级立项大创项目。</p>
                    <h3>1. 实时采集与目标识别</h3>
                    <p>使用 USB 免驱摄像头实时采集图像，微调 <strong>YOLOv11s</strong> 识别杂草坐标，再通过串口下发至 <strong>STM32F103</strong> 主控，把视觉识别结果送入硬件执行链路。</p>
                    <h3>2. SPI-DAC 与 XY 振镜</h3>
                    <p>MCU 完成坐标解算后，经 <strong>SPI 驱动 DAC 输出 ±10V 模拟量</strong>，精确控制 XY 轴振镜电机。调试工作贯穿图像坐标、通信、模拟量输出与执行机构，逐段完成联调。</p>
                    <h3>3. 车身导航与整机集成</h3>
                    <p>通过 <strong>PX4 + GPS + 地面站</strong> 实现车身自动导航。我负责机械结构搭建、硬件调试与系统联调，将视觉、激光指向和移动平台整合为完整系统。</p>
                `
            },
            ship: {
                title: "北斗水质监测船",
                tags: ["STM32F4", "BeiDou/GPS", "LoRa", "PID"],
                content: `
                    <h3>1. 系统构成</h3>
                    <p>该无人船由船体结构、动力系统、主控单元及水质检测模块组成。主控芯片选用 STM32F407，因其丰富的外设接口（UART, I2C, ADC）足以应对多传感器数据并发。</p>
                    <h3>2. 导航与控制</h3>
                    <p>集成北斗/GPS 双模定位模块，结合电子罗盘获取航向角。通过计算目标航点与当前位置的偏差，利用 PID 算法调节双电机差速，实现高精度的路径跟踪与自主巡航。</p>
                    <h3>3. 通信链路</h3>
                    <p>针对野外无公网环境，设计了基于 <strong>LoRa (SX1278)</strong> 的私有通信协议。实现了 433MHz 频段下的数据透传，有效传输距离覆盖半径 5km，确保岸基上位机能实时接收 pH、浑浊度等水质数据。</p>
                `
            },
            culture: {
                title: "非遗文化 AIGC · 模型训练与 Web 应用",
                tags: ["Stable Diffusion", "LoRA", "Captioning", "Web"],
                content: `
                    <h3>1. 数据处理与标注</h3>
                    <p>围绕非遗文化的生成式表达，完成图像清洗与 <strong>Captioning</strong> 标注整理，将数据准备衔接到模型训练流程。个人技术实践侧重数据质量、标注一致性与抽象纹样的表达。</p>
                    <h3>2. 生成模型与适配</h3>
                    <p>基于 <strong>Stable Diffusion</strong>，使用 <strong>LoRA（低秩适配）</strong>开展轻量微调，结合提示词组织与生成结果检查，积累从数据预处理到模型适配的实践经验。</p>
                    <h3>3. Web 端应用集成</h3>
                    <p>搭建基于提示词的 Web 生成工具，将模型能力接入交互页面，串联用户输入与图像生成流程，体现从模型训练到应用集成的个人工程实践。</p>
                `
            },
            piano: {
                title: "51 单片机微型电子琴",
                tags: ["C51", "PWM", "Hardware"],
                content: `
                    <h3>1. 开发理念</h3>
                    <p>在这个高级语言横行的时代，通过纯 C 语言操作寄存器，回归计算机科学的底层逻辑。这是一个关于中断、时序与频率的极客实验。</p>
                    <h3>2. 核心实现</h3>
                    <ul>
                        <li><strong>音调生成：</strong>利用定时器 T0 产生不同频率的中断，翻转 I/O 口电平输出方波，驱动无源蜂鸣器。频率计算基于十二平均律标准音高。</li>
                        <li><strong>按键扫描：</strong>设计了非阻塞式的 4x4 矩阵键盘扫描算法，配合状态机去抖动，即使在快速连弹下也能准确识别按键。</li>
                        <li><strong>存储回放：</strong>利用单片机内部 EEPROM 实现了简易的乐曲录制与掉电保存功能。</li>
                    </ul>
                `
            },
            llmPidTuner: {
                title: "LLM-PID-Tuner 智能调参系统",
                tags: ["Python", "MATLAB / Simulink", "System Identification", "LLM", "Safety Rollback"],
                content: `
                    <h3>1. 项目定位</h3>
                    <p>这是一个面向真实控制系统的 LLM 辅助 PID 调参工具。目标是把“靠经验反复试错”的调参过程，变成可观察、可复现、可回退的数据闭环。</p>
                    <h3>2. 核心架构</h3>
                    <ul>
                        <li><strong>三种模式：</strong>硬件串口实调、Python 本地仿真与 MATLAB/Simulink，覆盖算法验证到真实执行系统。</li>
                        <li><strong>决策层：</strong>通过 Prompt Engineering 引导 LLM 解析系统响应数据，生成下一轮 PID 参数建议。</li>
                        <li><strong>安全层：</strong>系统辨识、安全回退、参数保护与最佳状态记忆，约束自动调参过程。</li>
                        <li><strong>Simulink 闭环：</strong>自动注入参数、采集响应数据并循环调参，串联仿真模型与自动化决策。</li>
                    </ul>
                    <h3>3. 工程亮点</h3>
                    <p>支持 OpenAI 兼容 API（OpenAI / DeepSeek / Ollama / LM Studio），提供 <code>system_id.py</code> 初值建议和 <code>benchmark.py</code> 对比验证，并打包为可直接使用的 <code>llm-pid-tuner.exe</code>。</p>
                    <h3>4. 结果与价值</h3>
                    <p>项目独立完成，开发周期为 2026.02–2026.04。GitHub 获得 <strong><span class="gh-stars">892</span> Stars</strong>，更新时记录 86 Forks；配套教程视频累计 4.8 万播放、1446 点赞与 4140 收藏。</p>
                    <p>Industrial Monitor Direct 官方知识库专题长文将其与四大经典整定方法对比；FRC 社区 Delphi 讨论将其作为 LLM 在线调参案例引用。</p>
                    <p class="mt-4"><a href="https://github.com/KINGSTON-115/llm-pid-tuner" target="_blank" rel="noopener noreferrer" class="underline">查看项目仓库</a></p>
                `
            },
            portfolioSite: {
                title: "个人网站开源系统",
                tags: ["HTML5", "JavaScript", "TailwindCSS", "GSAP", "Open Source"],
                content: `
                    <h3>1. 项目定位</h3>
                    <p>这是我独立开发并长期维护的个人网站开源项目，既是个人品牌展示窗口，也是项目归档、内容输出与视觉实验的统一载体。</p>
                    <h3>2. 设计与工程</h3>
                    <p>整体采用 <strong>原生 HTML/CSS/JavaScript</strong> 构建，结合 TailwindCSS、GSAP 与 Lenis 实现轻量化页面结构、流畅滚动体验与赛博终端风格视觉语言，在保持高自由度的同时兼顾可维护性。</p>
                    <h3>3. 开源定位</h3>
                    <p>我将主页、项目案例、摄影内容与交互式模块整合为统一的信息架构，让它不仅是“展示页”，更是一个持续演化的公开作品集系统。</p>
                    <h3>4. 访问入口</h3>
                    <p><a href="https://github.com/KINGSTON-115/KINGSTON-115.github.io" target="_blank" rel="noopener noreferrer" class="underline">查看 GitHub 仓库</a></p>
                `
            },
            robocom2025: {
                title: "2025 睿抗机器人 - 二等奖",
                tags: ["Robocom", "海南赛区"],
                content: "<p>在复杂地形越野项目中，我主要负责机器人底盘的运动学解算与姿态控制算法。通过引入卡尔曼滤波融合 IMU 数据，显著提升了机器人在高速行驶中的稳定性。</p>"
            },
            robocom2024: {
                title: "2024 睿抗机器人 - 三等奖",
                tags: ["Robocom", "海南赛区"],
                content: "<p>负责视觉抓取模块的调试。利用 OpenCV 进行色块识别与定位，配合机械臂逆运动学解算，完成了目标物体的自动分拣任务。</p>"
            },
            smartcar2024: {
                title: "第十九届智能车 - 一等奖",
                tags: ["STC 摄像头组", "STC32F", "C / PID", "华南赛区"],
                content: "<p>2024.03–2024.07，担任摄像头自动循迹小车项目负责人。基于 <strong>STC32F、双线性 CCD、双 380 有刷电机后驱与高扭矩舵机前轮转向</strong>搭建系统。</p><p>使用 C 语言实现图像采集、自适应阈值二值化、中线提取与赛道元素特征识别状态机；升级 PID 循迹控制与电机主动差速。自主建模碳纤维底盘并交付厂方制作，将算法调试与机械实现衔接起来。</p>"
            },
            smartcar2025: {
                title: "第二十届智能车 - 三等奖",
                tags: ["微缩电磁组", "华南赛区"],
                content: "<p>负责电磁信号采集电路的设计与 PCB 绘制。采用了多级运放放大微弱的电磁感应信号，并通过软件滤波算法有效滤除了电机干扰噪声。</p>"
            }
        };

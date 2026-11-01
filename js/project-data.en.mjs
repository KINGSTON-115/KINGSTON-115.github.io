export const projectDetails = {
  plcAnalog: {
    title: 'PLC analog expansion · four-layer PCB and production validation',
    tags: ['Cadence Allegro', '4-Layer PCB', 'Schematic Debug', 'Prototype Validation'],
    content: `
      <p class="project-role">June–September 2026 / Independently completed the module layout; collaborated on related board prototyping and assembly validation.</p>
      <h3>1. From schematic to four-layer board</h3><p>Independently completed the four-layer PCB layout for a PLC analog expansion module in <strong>Cadence Allegro</strong>. The work covered net checks, placement, routing and board-level review, translating circuit connectivity into a manufacturable design.</p>
      <h3>2. Spacing constraints and connectivity debugging</h3><p>Applied project-specific spacing constraints of <strong>at least 3 mm for 220 V and 2 mm for 24 V</strong>. Traced missing ratsnest connections to incorrect cross-sheet net labels in the schematic, corrected connectivity and continued layout review before fabrication.</p>
      <h3>3. Prototyping, assembly and collaboration</h3><p>Worked with colleagues on related touch-panel layout, prototyping and assembly validation, connecting layout work to physical boards. Linked schematic debugging, four-layer design and physical validation to build board-level engineering experience for production.</p>`
  },
  aiKnowledge: {
    title: 'AI customer-service knowledge management platform',
    tags: ['Software Architecture', 'Access Control', 'Alibaba Cloud', 'Windows Deployment'],
    content: `
      <p class="project-role">July–August 2026 / Independently handled requirements, software architecture and frontend/backend development; delivered to multiple departments.</p>
      <h3>1. Turning frontline needs into a workflow</h3><p>A single administrator account handled all knowledge uploads, creating an update bottleneck. Interviews with customer-service staff informed an <strong>open upload permission model with an approval workflow</strong>, balancing participation with content management.</p>
      <h3>2. Application and cloud integration</h3><p>Designed the software architecture and implemented both frontend and backend, bringing uploads, permissions and review into one management platform. Integrated the <strong>Alibaba Cloud knowledge-base API</strong> to connect the local management interface with cloud knowledge maintenance.</p>
      <h3>3. Windows delivery and iteration</h3><p>Packaged a <strong>one-click Windows deployment bundle</strong>, delivered it to multiple departments and iterated on feedback. My contribution covered requirements, workflow design, API integration and deployment, taking the project from a business need to usable software.</p>`
  },
  nexus: {
    title: 'Nexus smart clock',
    tags: ['ESP32-S3', 'WebSocket', 'LLM', 'LVGL'],
    content: `
      <h3>1. Background</h3>
      <p>Traditional desk clocks offer limited functionality, while smart speakers often lock users into a vendor’s ecosystem. This project is an open-source, highly customizable desktop terminal that connects the physical world with AI.</p>
      <h3>2. Hardware architecture</h3>
      <p>The core is a dual-core <strong>ESP32-S3</strong> running at 240 MHz, with AI processing capabilities and Wi-Fi/Bluetooth connectivity. Peripherals include:</p>
      <ul><li><strong>Display:</strong> a 1.28-inch round TFT LCD (GC9A01), with a resolution of 240 × 240.</li><li><strong>Audio:</strong> an INMP441 omnidirectional I2S microphone and a MAX98357A amplifier.</li><li><strong>Power:</strong> TP4056 lithium battery charging management and voltage regulation.</li></ul>
      <h3>3. Software and algorithms</h3>
      <p>The <strong>FreeRTOS</strong> architecture separates UI, networking and audio processing into dedicated tasks.</p>
      <ul><li><strong>UI:</strong> an LVGL 8.3 port with animated watch faces and a responsive interface.</li><li><strong>AI connection:</strong> a persistent WebSocket connection to a backend integrating OpenAI and Qwen APIs. The speech-to-text → language model → text-to-speech pipeline completes in under two seconds.</li></ul>
      <h3>4. Main challenge</h3>
      <p>Running the LVGL graphics stack alongside Wi-Fi within the ESP32’s 512 KB of RAM was the main challenge. Optimizing DMA buffers and reusing memory resolved overflows and stabilized the system.</p>`
  },
  drone: {
    title: 'Shared drone locker system',
    tags: ['WeChat MiniApp', 'Spring Boot', 'IoT', 'MQTT'],
    content: `
      <h3>1. Overview</h3><p>A complete hardware and software solution for drone rental on campuses and at tourist attractions. A WeChat mini app handles identity verification, QR-code locker access, battery rental and flight records.</p>
      <h3>2. Technology stack</h3><ul><li><strong>Frontend:</strong> a native WeChat mini app, with Canvas-based flight-path visualization.</li><li><strong>Backend:</strong> Java Spring Boot microservices, WeChat Pay integration and Redis locks for locker-door state under concurrent requests.</li><li><strong>IoT:</strong> the locker controller connects to an MQTT broker over 4G, enabling millisecond-level unlock responses and heartbeat monitoring.</li></ul>
      <h3>3. Key feature</h3><p><strong>Automatic return detection</strong> uses RFID readers and infrared sensors inside the locker to identify the drone model and check accessories, then trigger automatic settlement.</p>`
  },
  laser: {
    title: 'Precision laser weeder',
    tags: ['YOLOv11s', 'STM32F103', 'SPI / DAC', 'XY Galvanometer', 'PX4'],
    content: `
      <p class="project-role">April–July 2025 / Project lead responsible for mechanical construction, hardware debugging and system integration; a provincial student innovation project.</p>
      <h3>1. Capture and recognition</h3><p>A driver-free USB camera captures live images. A fine-tuned <strong>YOLOv11s</strong> model identifies weed coordinates and sends them over serial to the <strong>STM32F103</strong> controller, linking computer vision to hardware execution.</p>
      <h3>2. SPI-DAC and XY galvanometers</h3><p>The MCU calculates coordinates and drives a DAC over <strong>SPI to output ±10 V analog signals</strong> for XY galvanometer motors. Integration covers image coordinates, communication, analog output and actuation.</p>
      <h3>3. Navigation and system integration</h3><p><strong>PX4, GPS and a ground station</strong> provide automatic vehicle navigation. I built the mechanical structure, debugged hardware and integrated vision, laser pointing and the mobile platform.</p>`
  },
  ship: {
    title: 'BeiDou water monitoring vessel',
    tags: ['STM32F4', 'BeiDou/GPS', 'LoRa', 'PID'],
    content: `
      <h3>1. System architecture</h3><p>The unmanned vessel combines a hull, propulsion, a main controller and water-quality sensors. The STM32F407 provides enough UART, I2C and ADC interfaces to handle concurrent sensor data.</p>
      <h3>2. Navigation and control</h3><p>Dual-mode BeiDou/GPS positioning works with an electronic compass to determine heading. A PID controller adjusts differential thrust based on the error between the current position and the target waypoint, enabling precise path tracking and autonomous navigation.</p>
      <h3>3. Communications</h3><p>A custom protocol built on <strong>LoRa (SX1278)</strong> supports locations without public network coverage. Transparent data transmission at 433 MHz covers a radius of 5 km, allowing the shore station to receive pH, turbidity and other water-quality readings in real time.</p>`
  },
  culture: {
    title: 'Cultural heritage AIGC · model training and web application',
    tags: ['Stable Diffusion', 'LoRA', 'Captioning', 'Web'],
    content: `
      <h3>1. Data preparation and captioning</h3><p>Prepared and cleaned images and organized <strong>captions</strong> for generative exploration of intangible cultural heritage. My technical work focuses on data quality, consistent labels and the representation of abstract patterns.</p>
      <h3>2. Generative models and adaptation</h3><p>Used <strong>Stable Diffusion</strong> with <strong>LoRA (Low-Rank Adaptation)</strong> for lightweight fine-tuning, combining prompt organization and output review to build practical experience from data preprocessing to model adaptation.</p>
      <h3>3. Web application integration</h3><p>Built a prompt-based web generation tool that connects model capabilities to an interactive page, linking user input with image generation and demonstrating my engineering work from model training to application integration.</p>`
  },
  piano: {
    title: '8051 mini synthesizer',
    tags: ['C51', 'PWM', 'Hardware'],
    content: `
      <h3>1. Concept</h3><p>An experiment in interrupts, timing and frequency: return to the fundamentals of computing by manipulating registers directly in C.</p>
      <h3>2. Implementation</h3><ul><li><strong>Tone generation:</strong> Timer T0 generates interrupts at different frequencies, toggling an I/O pin to drive a passive buzzer with square waves. Frequencies follow twelve-tone equal temperament.</li><li><strong>Key scanning:</strong> a non-blocking 4 × 4 matrix scan, with state-machine debouncing, reliably recognizes rapid keystrokes.</li><li><strong>Recording and playback:</strong> onboard EEPROM stores simple melodies and retains them across power cycles.</li></ul>`
  },
  llmPidTuner: {
    title: 'LLM-PID-Tuner',
    tags: ['Python', 'MATLAB / Simulink', 'System Identification', 'LLM', 'Safety Rollback'],
    content: `
      <h3>1. Purpose</h3><p>An LLM-assisted PID tuning tool for real control systems. It turns experience-based trial and error into an observable, reproducible data loop with rollback support.</p>
      <h3>2. Architecture</h3><ul><li><strong>Three modes:</strong> serial-connected hardware, local Python simulation and MATLAB/Simulink.</li><li><strong>Decision layer:</strong> prompt engineering guides the model to analyze system-response data and suggest PID parameters.</li><li><strong>Safety layer:</strong> system identification, rollback, parameter protection and best-state memory constrain the tuning process.</li><li><strong>Simulink loop:</strong> automatic parameter injection, response-data collection and repeated tuning connect the simulation model with automated decisions.</li></ul>
      <h3>3. Engineering details</h3><p>Supports OpenAI-compatible APIs, including OpenAI, DeepSeek, Ollama and LM Studio. Includes <code>system_id.py</code> for initial parameter suggestions and <code>benchmark.py</code> for comparisons, plus a ready-to-use <code>llm-pid-tuner.exe</code> package.</p>
      <h3>4. Results</h3><p>Independently developed in February–April 2026. The project has <strong><span class="gh-stars">892</span> GitHub stars</strong> and had 86 forks at this update. Its tutorial video reached 48,000 views, 1,446 likes and 4,140 saves.</p>
      <p>An Industrial Monitor Direct knowledge-base article compares it with four classical tuning methods. A Delphi discussion in the FRC community cites it as an example of online LLM tuning.</p>
      <p><a href="https://github.com/KINGSTON-115/llm-pid-tuner" target="_blank" rel="noopener noreferrer">View project repository</a></p>`
  },
  portfolioSite: {
    title: 'Open-source personal portfolio',
    tags: ['HTML5', 'JavaScript', 'TailwindCSS', 'GSAP', 'Open Source'],
    content: `
      <h3>1. Purpose</h3><p>A personal website that I develop and maintain independently, bringing together my identity, project archive, writing and visual experiments.</p>
      <h3>2. Design and engineering</h3><p>Built with <strong>native HTML, CSS and JavaScript</strong>, alongside TailwindCSS, GSAP and Lenis. Lightweight pages, smooth scrolling and terminal-inspired visuals balance creative freedom with maintainability.</p>
      <h3>3. Open source</h3><p>The homepage, project studies, photography and interactive modules share one information architecture: an evolving, public portfolio.</p>
      <h3>4. Repository</h3><p><a href="https://github.com/KINGSTON-115/KINGSTON-115.github.io" target="_blank" rel="noopener noreferrer">View on GitHub</a></p>`
  },
  robocom2025: {
    title: '2025 ROBOCOM — 2nd prize', tags: ['ROBOCOM', 'Hainan regional'],
    content: '<p>I developed chassis kinematics and attitude-control algorithms for a robot navigating complex terrain. Fusing IMU data with a Kalman filter significantly improved stability at high speeds.</p>'
  },
  robocom2024: {
    title: '2024 ROBOCOM — 3rd prize', tags: ['ROBOCOM', 'Hainan regional'],
    content: '<p>I tuned the vision-guided grasping module. OpenCV color-region detection and localization, combined with robotic-arm inverse kinematics, enabled automatic object sorting.</p>'
  },
  smartcar2024: {
    title: '19th Smart Car Competition — 1st prize', tags: ['STC camera category', 'STC32F', 'C / PID', 'South China regional'],
    content: '<p>Led the camera-guided line-following car project in March–July 2024. Built around <strong>STC32F, dual linear CCD cameras, two rear-drive 380 brushed motors and a high-torque front-steering servo</strong>.</p><p>Implemented image acquisition, adaptive-threshold binarization, centerline extraction and a track-element recognition state machine in C. Upgraded PID line following and active differential motor control, and modeled a carbon-fiber chassis for external fabrication.</p>'
  },
  smartcar2025: {
    title: '20th Smart Car Competition — 3rd prize', tags: ['Miniature electromagnetic category', 'South China regional'],
    content: '<p>I designed the electromagnetic signal acquisition circuit and PCB. Cascaded operational amplifiers boosted weak induction signals, while software filtering removed motor interference.</p>'
  }
};

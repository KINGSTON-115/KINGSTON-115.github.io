export const projectDetails = {
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
    tags: ['OpenCV', 'YOLOv8', 'Jetson Nano', 'Laser'],
    content: `
      <h3>1. Background</h3><p>Chemical weed control can contaminate soil and damage crops. Laser weeding offers an alternative, but requires real-time vision and precise beam control.</p>
      <h3>2. Computer vision</h3><p>A lightweight <strong>YOLOv8n</strong> model is accelerated with TensorRT on a Jetson Nano. HSV filtering and histogram equalization help handle complex field lighting, bringing weed-recognition accuracy above 95%.</p>
      <h3>3. Servo control</h3><p>A two-axis gimbal maps image pixels to physical angles through coordinate transforms. An incremental PID controller drives the servos to respond quickly and track moving targets.</p>`
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
    title: 'Li cultural heritage through generative AI',
    tags: ['Stable Diffusion', 'LoRA', 'Dataset', 'AI Art'],
    content: `
      <h3>1. Purpose</h3><p>Traditional Li textile techniques are recognized as intangible cultural heritage, yet their patterns have limited digital representation and contemporary applications. This project explores new digital forms for that heritage through generative AI.</p>
      <h3>2. Model training</h3><p>More than 2,000 high-quality images of Li patterns were collected in the field, cleaned and manually captioned. A dedicated <strong>LoRA (Low-Rank Adaptation)</strong> model trained on Stable Diffusion 1.5 recognizes cultural motifs such as the Hercules figure and the Gangong bird.</p>
      <h3>3. Application</h3><p>A web-based generation tool lets designers use simple prompts to create modern clothing sketches incorporating Li elements, making cultural and creative design more accessible.</p>`
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
    tags: ['Python', 'PID Control', 'Serial', 'LLM', 'Safety Rollback'],
    content: `
      <h3>1. Purpose</h3><p>An LLM-assisted PID tuning tool for real control systems. It turns experience-based trial and error into an observable, reproducible data loop with rollback support.</p>
      <h3>2. Architecture</h3><ul><li><strong>Two modes:</strong> local simulation and real hardware connected through serial CSV.</li><li><strong>Decision layer:</strong> the language model proposes the next PID parameters based on response-curve quality.</li><li><strong>Safety layer:</strong> parameter bounds, conservative rollback and best-state memory keep tuning under control.</li></ul>
      <h3>3. Engineering details</h3><p>Supports OpenAI-compatible APIs, including OpenAI, DeepSeek, Ollama and LM Studio. Includes <code>system_id.py</code> for initial parameter suggestions and <code>benchmark.py</code> for comparisons, plus a ready-to-use <code>llm-pid-tuner.exe</code> package.</p>
      <h3>4. Results</h3><p>The project has received <strong><span class="gh-stars">700+</span> GitHub stars</strong>. In temperature and motion control applications, it reduces manual tuning rounds and improves convergence and stability.</p>
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
    title: '19th Smart Car Competition — 1st prize', tags: ['Camera category', 'South China regional'],
    content: '<p>As the algorithm lead, I designed track-edge extraction using dynamic thresholds based on an improved Otsu method. Inverse perspective mapping (IPM) corrected image distortion, greatly improving robustness under rapidly changing light.</p>'
  },
  smartcar2025: {
    title: '20th Smart Car Competition — 3rd prize', tags: ['Electromagnetic category', 'South China regional'],
    content: '<p>I designed the electromagnetic signal acquisition circuit and PCB. Cascaded operational amplifiers boosted weak induction signals, while software filtering removed motor interference.</p>'
  }
};

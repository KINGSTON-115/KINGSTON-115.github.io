import { WebGLRenderer, PCFSoftShadowMap, ACESFilmicToneMapping } from 'three';
import { createModel } from './spatial-models.js';

// One GPU context serves the visible scenes. Each DOM canvas keeps its last frame
// so clipping, scrolling, dialogs and CSS entrance transitions remain native.
export function createSpatialScenes({ isEnabled, isBlocked }) {
  const elements = [...document.querySelectorAll('[data-spatial]')];
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  let renderer;
  try {
    renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch { return { sync() {} }; }
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  const states = elements.map(element => {
    const canvas = document.createElement('canvas');
    canvas.className = 'spatial-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return null;
    element.append(canvas);
    return { element, canvas, context, model: null, visible: false, dirty: true, time: 0, x: 0, y: 0, targetX: 0, targetY: 0, width: 0, height: 0, failed: false };
  }).filter(Boolean);
  const byElement = new Map(states.map(state => [state.element, state]));
  let frame = 0, previous = 0, nextPaint = 0, lost = false, destroyed = false;

  function canPlay(state) {
    return state.visible && !state.failed && !document.hidden && !isBlocked() && isEnabled();
  }
  function needsFrame() {
    return !lost && !destroyed && !document.hidden && !isBlocked()
      && states.some(state => state.visible && !state.failed && (state.dirty || canPlay(state)));
  }
  function sync() {
    states.forEach(state => {
      state.element.dataset.spatialPlaying = String(!lost && canPlay(state));
      if (!isEnabled()) { state.targetX = state.x; state.targetY = state.y; }
    });
    if (needsFrame() && !frame) { previous = 0; nextPaint = 0; frame = requestAnimationFrame(tick); }
    else if (!needsFrame() && frame) { cancelAnimationFrame(frame); frame = 0; previous = 0; }
  }
  function draw(state, dt) {
    if (!state.model) state.model = createModel(state.element.dataset.spatial);
    const { model, canvas, context } = state;
    const width = state.width || state.element.clientWidth;
    const height = state.height || state.element.clientHeight;
    if (!width || !height) return;
    // Cap fill rate on dense/mobile screens, and allocate only visible scenes.
    const dpr = Math.min(devicePixelRatio || 1, innerWidth < 761 ? 1.5 : 1.75);
    const w = Math.round(width * dpr), h = Math.round(height * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    if (renderer.domElement.width !== w || renderer.domElement.height !== h) renderer.setSize(w, h, false);
    model.camera.aspect = width / height;
    const fov = model.camera.fov * Math.PI / 180;
    const distance = model.radius / Math.sin(fov / 2) / Math.min(1, model.camera.aspect);
    model.camera.position.copy(model.cameraDirection).multiplyScalar(distance);
    if (canPlay(state)) {
      state.time += dt;
      const damping = 1 - Math.exp(-dt * 5);
      state.x += (state.targetX - state.x) * damping;
      state.y += (state.targetY - state.y) * damping;
    }
    // Move the camera, not the rendered plane: nearby parts respond more strongly.
    model.camera.position.x += state.x * (state.element.dataset.spatial === 'hero' ? 1.8 : 1.1);
    model.camera.position.y += state.y * .9;
    model.camera.lookAt(0, 0, 0);
    model.camera.updateProjectionMatrix();
    model.animate(state.time);
    renderer.render(model.scene, model.camera);
    context.clearRect(0, 0, w, h);
    context.drawImage(renderer.domElement, 0, 0);
    state.element.classList.add('spatial-ready');
    state.element.dataset.spatialTime = state.time.toFixed(3);
    state.dirty = false;
  }
  function tick(now) {
    frame = 0;
    if (!needsFrame()) return;
    // At most 30fps on touch devices; 60fps where pointer response is useful.
    const interval = finePointer.matches ? 1000 / 60 : 1000 / 30;
    if (previous && now < nextPaint - .5) { frame = requestAnimationFrame(tick); return; }
    const dt = previous ? Math.min((now - previous) / 1000, .05) : 0;
    nextPaint = nextPaint && now - nextPaint < interval ? nextPaint + interval : now + interval;
    previous = now;
    for (const state of states) {
      if (!state.visible || state.failed || (!state.dirty && !canPlay(state))) continue;
      try { draw(state, dt); }
      catch {
        // A failed enhancement must never leave a blank card or interrupt navigation.
        state.failed = true;
        state.element.classList.remove('spatial-ready');
        state.element.dataset.spatialPlaying = 'false';
        state.model?.dispose(); state.model = null;
      }
    }
    if (needsFrame()) frame = requestAnimationFrame(tick);
  }
  const visibility = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const state = byElement.get(entry.target);
      state.visible = entry.isIntersecting;
      if (state.visible && !state.model) state.dirty = true;
    });
    sync();
  });
  const resize = new ResizeObserver(entries => {
    entries.forEach(entry => {
      const state = byElement.get(entry.target);
      state.width = state.element.clientWidth;
      state.height = state.element.clientHeight;
      state.dirty = true;
    });
    sync();
  });
  const removals = [];
  states.forEach(state => {
    visibility.observe(state.element);
    resize.observe(state.element);
    const move = event => {
      if (!finePointer.matches || event.pointerType === 'touch' || !canPlay(state)) return;
      const rect = state.element.getBoundingClientRect();
      state.targetX = ((event.clientX - rect.left) / rect.width - .5) * 2;
      state.targetY = -((event.clientY - rect.top) / rect.height - .5) * 2;
    };
    const leave = () => { state.targetX = 0; state.targetY = 0; };
    state.element.addEventListener('pointermove', move, { passive: true });
    state.element.addEventListener('pointerleave', leave);
    removals.push(() => { state.element.removeEventListener('pointermove', move); state.element.removeEventListener('pointerleave', leave); });
  });
  renderer.domElement.addEventListener('webglcontextlost', event => {
    event.preventDefault(); lost = true;
    states.forEach(state => { state.element.classList.remove('spatial-ready'); state.dirty = true; });
    sync();
  });
  renderer.domElement.addEventListener('webglcontextrestored', () => { lost = false; sync(); });
  function pageHide(event) {
    if (event.persisted) { if (frame) cancelAnimationFrame(frame); frame = 0; return; }
    destroyed = true;
    if (frame) cancelAnimationFrame(frame);
    visibility.disconnect(); resize.disconnect(); removals.forEach(remove => remove());
    states.forEach(state => state.model?.dispose());
    renderer.dispose();
    document.removeEventListener('visibilitychange', sync);
    removeEventListener('pageshow', sync);
    removeEventListener('pagehide', pageHide);
  }
  document.addEventListener('visibilitychange', sync);
  addEventListener('pageshow', sync);
  addEventListener('pagehide', pageHide);
  return { sync };
}

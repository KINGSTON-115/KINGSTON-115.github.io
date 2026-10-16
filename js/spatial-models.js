import * as T from 'three';
import { mobiusPoint, mobiusSurface } from './mobius-geometry.mjs';

const lime = 0xd1ff54;
const ivory = 0xe1e7ce;
const dark = 0x263026;
const v = (x, y, z) => new T.Vector3(x, y, z);
const material = (color, options = {}) => new T.MeshStandardMaterial({ color, roughness: .4, metalness: .35, ...options });
function mesh(parent, geometry, surface, position = [0, 0, 0]) {
  const object = new T.Mesh(geometry, surface);
  object.position.set(...position);
  object.castShadow = true;
  object.receiveShadow = true;
  parent.add(object);
  return object;
}
const box = (p, size, m, pos) => mesh(p, new T.BoxGeometry(...size), m, pos);
const ball = (p, r, m, pos) => mesh(p, new T.SphereGeometry(r, 16, 12), m, pos);
const ring = (p, r, tube, m, pos) => mesh(p, new T.TorusGeometry(r, tube, 8, 96), m, pos);
function line(parent, points, color = lime, opacity = 1) {
  const object = new T.Line(new T.BufferGeometry().setFromPoints(points), new T.LineBasicMaterial({ color, transparent: opacity < 1, opacity }));
  parent.add(object);
  return object;
}
function rod(parent, from, to, radius, surface) {
  const object = mesh(parent, new T.CylinderGeometry(radius, radius, from.distanceTo(to), 10), surface);
  object.position.copy(from).add(to).multiplyScalar(.5);
  object.quaternion.setFromUnitVectors(v(0, 1, 0), to.clone().sub(from).normalize());
  return object;
}
function texture(width, height, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  draw(canvas.getContext('2d'), width, height);
  const map = new T.CanvasTexture(canvas);
  map.colorSpace = T.SRGBColorSpace;
  map.anisotropy = 4;
  return map;
}

function stage(kind) {
  const scene = new T.Scene();
  const root = new T.Group();
  scene.add(root);
  const camera = new T.PerspectiveCamera(kind === 'hero' ? 37 : 36, 1, .1, 40);
  camera.position.set(...(kind === 'hero' ? [0, .1, 8.8] : [3.5, 2.7, 6.5]));
  camera.lookAt(0, 0, 0);
  scene.add(new T.HemisphereLight(0xf4ffdf, 0x18221e, 2));
  const key = new T.DirectionalLight(0xf7ffe6, 4.2);
  key.position.set(-3, 6, 5);
  key.castShadow = kind !== 'hero';
  key.shadow.mapSize.set(512, 512);
  Object.assign(key.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: .5, far: 16 });
  key.shadow.normalBias = .035;
  key.shadow.bias = -.0005;
  scene.add(key);
  const rim = new T.DirectionalLight(kind === 'culture' ? 0xf9b082 : 0xb6f573, 3.5);
  rim.position.set(4, 2, -4);
  scene.add(rim);
  const fill = new T.DirectionalLight(kind === 'hero' ? ivory : 0x98bdcf, 1.3);
  fill.position.set(0, -1, 4);
  scene.add(fill);
  if (kind !== 'hero') {
    const floor = mesh(scene, new T.PlaneGeometry(30, 30), new T.ShadowMaterial({ opacity: .25 }), [0, -1.25, 0]);
    floor.rotation.x = -Math.PI / 2;
    floor.castShadow = false;
    const grid = new T.GridHelper(6, 12, kind === 'ship' ? 0x72bfa9 : 0x859267, kind === 'ship' ? 0x406e60 : 0x4b5940);
    grid.position.y = -1.24;
    grid.material.transparent = true;
    grid.material.opacity = .2;
    scene.add(grid);
  }
  const radius = { hero: 2.5, signal: 2.3, clock: 1.8, drone: 2.2, laser: 2.4, ship: 2.4, culture: 2.1, piano: 2.3, web: 2.45 }[kind];
  return { scene, root, camera, radius };
}

function hero(s) {
  const body = new T.Group(); s.root.add(body);
  const { positions, indices } = mobiusSurface();
  const geometry = new T.BufferGeometry();
  geometry.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  mesh(body, geometry, material(0x343b2d, { side: T.DoubleSide, roughness: .48, metalness: .55, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }));
  // Fine transverse etching and longitudinal circuits describe the ribbon's twist.
  const etching = [];
  for (let i = 0; i < 160; i++) {
    const u = i / 160 * Math.PI * 2;
    etching.push(v(...mobiusPoint(u, -.31)), v(...mobiusPoint(u, .31)));
  }
  body.add(new T.LineSegments(new T.BufferGeometry().setFromPoints(etching), new T.LineBasicMaterial({ color: ivory, transparent: true, opacity: .32 })));
  for (const width of [-.19, 0, .19]) {
    line(body, Array.from({ length: 241 }, (_, i) => v(...mobiusPoint(i / 240 * Math.PI * 2, width))), 0xa6b88b, .42);
  }
  // A Möbius strip has one continuous edge, traced over two revolutions.
  const edgePoints = Array.from({ length: 481 }, (_, i) => v(...mobiusPoint(i / 480 * Math.PI * 4, .32)));
  const edgeCurve = new T.CatmullRomCurve3(edgePoints, true);
  mesh(body, new T.TubeGeometry(edgeCurve, 480, .009, 6, true), new T.MeshBasicMaterial({ color: lime, toneMapped: false }));
  const pulse = ball(body, .025, material(0xeeffbd, { emissive: lime, emissiveIntensity: 2 }));
  const orbit = ring(s.root, 2.23, .004, material(0x66714f, { emissive: 0x303a21, emissiveIntensity: .3 }));
  orbit.rotation.set(.35, -.1, -.03);
  orbit.scale.set(1, .65, 1);
  const ticks = [];
  for (let i = 0; i < 64; i++) {
    const a = i / 64 * Math.PI * 2;
    ticks.push(v(2.26 * Math.cos(a), 2.26 * Math.sin(a), 0), v((i % 8 ? 2.29 : 2.34) * Math.cos(a), (i % 8 ? 2.29 : 2.34) * Math.sin(a), 0));
  }
  orbit.add(new T.LineSegments(new T.BufferGeometry().setFromPoints(ticks), new T.LineBasicMaterial({ color: 0x9ba985, transparent: true, opacity: .35 })));
  s.radius = 2.48;
  return t => {
    body.rotation.set(.12 + Math.sin(t * .17) * .12, -.12 + Math.sin(t * .13) * .26, Math.sin(t * .11) * .045);
    body.position.y = Math.sin(t * .6) * .035;
    pulse.position.set(...mobiusPoint(t * .4, .32));
  };
}

function signal(s) {
  s.camera.position.set(3.4, 2, 7.2); s.camera.lookAt(0, 0, 0);
  const glow = material(lime, { emissive: lime, emissiveIntensity: .5, roughness: .3 });
  const response = (x, damping) => .45 - 1.45 * Math.exp(-x * damping) * Math.cos(x * 3.7);
  const curves = [];
  for (let layer = 0; layer < 3; layer++) {
    const z = -.85 + layer * .85;
    const grid = new T.Group(); s.root.add(grid);
    for (let i = 0; i < 6; i++) line(grid, [v(-2 + i * .8, -1.1, z), v(-2 + i * .8, 1.1, z)], 0x70825a, .22);
    for (let i = 0; i < 4; i++) line(grid, [v(-2, -1.1 + i * .7, z), v(2, -1.1 + i * .7, z)], 0x70825a, .22);
    const points = Array.from({ length: 100 }, (_, i) => { const x = i / 99 * 4; return v(x - 2, response(x, [.45, .9, 2.2][layer]), z); });
    const curve = new T.CatmullRomCurve3(points);
    curves.push(curve);
    mesh(s.root, new T.TubeGeometry(curve, 100, layer === 2 ? .024 : .013, 6, false), layer === 2 ? glow : material(layer === 1 ? 0x9fba83 : 0x64725b));
    line(s.root, [v(-2, .45, z), v(2, .45, z)], 0xe4eed0, .3);
  }
  rod(s.root, v(-2, -1.1, -.85), v(-2, -1.1, .85), .014, glow);
  const cursor = ball(s.root, .075, glow);
  const halo = ring(s.root, .15, .012, glow);
  return t => {
    const point = curves[2].getPoint((t * .1 + .44) % 1);
    cursor.position.copy(point); halo.position.copy(point);
    halo.scale.setScalar(1 + Math.sin(t * 3) * .14);
    s.root.rotation.y = Math.sin(t * .35) * .09;
  };
}

function clock(s) {
  s.camera.position.set(3.2, 1.6, 6.6); s.camera.lookAt(0, 0, 0);
  const object = new T.Group(); s.root.add(object);
  const casing = mesh(object, new T.CylinderGeometry(1.12, 1.12, .5, 64), material(0x91a188, { metalness: .8 }), [0, 0, 0]);
  casing.rotation.x = Math.PI / 2;
  const face = texture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#101b15'; ctx.fillRect(0, 0, w, h);
    ctx.textAlign = 'center'; ctx.fillStyle = '#9dac8b'; ctx.font = '17px monospace'; ctx.fillText('NEXUS / CONNECTED', 256, 153);
    ctx.fillStyle = '#ddff8c'; ctx.font = 'bold 107px monospace'; ctx.fillText('09:41', 256, 277);
    ctx.fillStyle = '#a7b99a'; ctx.font = '13px monospace'; ctx.fillText('MAKE TIME FOR IDEAS.', 256, 325);
    for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2; ctx.beginPath(); ctx.arc(256 + Math.cos(a) * 228, 256 + Math.sin(a) * 228, i % 5 ? 1 : 3, 0, 7); ctx.fill(); }
  });
  mesh(object, new T.CircleGeometry(1.045, 64), new T.MeshBasicMaterial({ map: face }), [0, 0, .258]);
  ring(object, 1.066, .035, material(0xc9d6b5), [0, 0, .27]);
  box(object, [.35, .45, .26], material(dark), [0, -1.05, -.1]);
  box(object, [1.15, .1, .65], material(0x7c8a6d), [0, -1.22, -.06]);
  const bars = Array.from({ length: 15 }, (_, i) => box(object, [.026, .16, .018], material(lime, { emissive: lime, emissiveIntensity: .6 }), [(i - 7) * .052, -.57, .28]));
  const orbit = ring(s.root, 1.65, .007, material(0x718463)); orbit.rotation.x = .9;
  return t => {
    object.rotation.y = -.15 + Math.sin(t * .42) * .25;
    object.rotation.x = Math.sin(t * .3) * .06;
    bars.forEach((bar, i) => { bar.scale.y = .3 + (Math.sin(t * 2.2 + i * .65) + 1) * .55; });
    orbit.rotation.z = t * .1;
  };
}

function drone(s) {
  const object = new T.Group(); s.root.add(object);
  const graphite = material(0x3b493c), metal = material(0xa3b294), accent = material(lime, { emissive: lime, emissiveIntensity: .4 });
  box(object, [.65, .26, 1.05], metal);
  box(object, [.47, .08, .7], graphite, [0, .17, 0]);
  box(object, [.08, .015, .4], accent, [0, .218, 0]);
  const lens = ball(object, .15, graphite, [0, -.12, .58]); lens.scale.z = .65;
  ball(object, .075, accent, [0, -.12, .68]);
  const rotors = [];
  for (const x of [-1, 1]) for (const z of [-1, 1]) {
    rod(object, v(0, 0, 0), v(x * 1.1, 0, z * .95), .065, graphite);
    mesh(object, new T.CylinderGeometry(.13, .12, .25, 16), metal, [x * 1.1, .07, z * .95]);
    const guard = ring(object, .55, .025, metal, [x * 1.1, .12, z * .95]); guard.rotation.x = Math.PI / 2;
    const rotor = new T.Group(); rotor.position.set(x * 1.1, .23, z * .95); object.add(rotor);
    const blade = box(rotor, [.94, .022, .11], material(0xc1cdb0)); blade.rotation.y = .22;
    box(rotor, [.11, .022, .94], material(0x819374));
    ball(rotor, .07, graphite); rotors.push(rotor);
    rod(object, v(x * .3, -.1, z * .38), v(x * .48, -.55, z * .42), .025, metal);
  }
  const radar = ring(s.root, 1.7, .008, material(0x799b63)); radar.rotation.x = Math.PI / 2; radar.position.y = -1.22;
  return t => {
    object.position.y = .15 + Math.sin(t * .9) * .12;
    object.rotation.set(Math.sin(t * .6) * .06, -.35 + Math.sin(t * .32) * .2, Math.cos(t * .55) * .07);
    rotors.forEach((rotor, i) => { rotor.rotation.y = t * (i % 2 ? 6 : -6); });
    radar.scale.setScalar(1 + Math.sin(t) * .13);
  };
}

function laser(s) {
  const green = material(0x628558), metal = material(0x8a9b78), accent = material(lime, { emissive: lime, emissiveIntensity: .65 });
  box(s.root, [4.1, .16, 2.65], material(0x36482e), [0, -1.05, 0]);
  for (let i = 0; i < 15; i++) {
    const x = (i % 5 - 2) * .75, z = (Math.floor(i / 5) - 1) * .77;
    rod(s.root, v(x, -.96, z), v(x, -.52, z), .015, green);
    for (const side of [-1, 1]) { const leaf = ball(s.root, 1, green, [x + side * .11, -.68, z]); leaf.scale.set(.19, .065, .09); leaf.rotation.z = side * .55; }
  }
  for (const x of [-1.85, 1.85]) box(s.root, [.08, 1.8, .1], metal, [x, -.05, -.95]);
  box(s.root, [3.8, .08, .12], metal, [0, .86, -.95]);
  const head = new T.Group(); s.root.add(head);
  box(head, [.4, .28, .35], metal);
  mesh(head, new T.CylinderGeometry(.075, .075, .2, 16), material(dark), [0, -.2, 0]);
  const beam = rod(s.root, v(0, 0, 0), v(0, 1, 0), .009, accent);
  beam.castShadow = false;
  const target = ring(s.root, .24, .016, accent); target.rotation.x = -Math.PI / 2;
  const from = v(), to = v(), axis = v(0, 1, 0), direction = v();
  return t => {
    const x = Math.sin(t * .45) * 1.5;
    head.position.set(x, .7, -.95);
    from.set(x, .46, -.95); to.set(x, -.93, .2 + Math.sin(t * .6) * .5);
    beam.position.copy(from).add(to).multiplyScalar(.5);
    beam.scale.y = from.distanceTo(to);
    beam.quaternion.setFromUnitVectors(axis, direction.copy(to).sub(from).normalize());
    target.position.copy(to); target.position.y += .03;
  };
}

function ship(s) {
  const water = material(0x214e44, { roughness: .24, metalness: .55 });
  const sea = mesh(s.root, new T.CylinderGeometry(2.35, 2.35, .08, 80), water, [0, -.75, 0]);
  const hullShape = new T.Shape();
  hullShape.moveTo(0, 1.24); hullShape.bezierCurveTo(.55, .8, .57, -.7, .38, -1.05); hullShape.lineTo(-.38, -1.05); hullShape.bezierCurveTo(-.57, -.7, -.55, .8, 0, 1.24);
  const boat = new T.Group(); s.root.add(boat);
  const hull = mesh(boat, new T.ExtrudeGeometry(hullShape, { depth: .25, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: .07, bevelThickness: .06 }), material(ivory));
  hull.rotation.x = -Math.PI / 2;
  box(boat, [.64, .3, .85], material(0x54776a), [0, .36, -.1]);
  box(boat, [.52, .09, .72], material(0xb8d6ad), [0, .56, -.1]);
  box(boat, [.54, .16, .025], material(0x192f2d), [0, .4, -.54]);
  rod(boat, v(0, .57, .1), v(0, 1.06, .1), .018, material(ivory));
  ball(boat, .055, material(lime, { emissive: lime, emissiveIntensity: .7 }), [0, 1.07, .1]);
  const ripples = Array.from({ length: 5 }, (_, i) => { const r = ring(s.root, .8 + i * .31, .008, material(0x85bca5)); r.rotation.x = -Math.PI / 2; r.position.y = -.69; return r; });
  const sweep = new T.Group(); sweep.position.y = -.68; s.root.add(sweep);
  rod(sweep, v(0, 0, 0), v(2.2, 0, 0), .012, material(lime));
  return t => {
    boat.position.y = -.45 + Math.sin(t * .8) * .055;
    boat.rotation.set(Math.sin(t * .75) * .045, -.4 + Math.sin(t * .25) * .15, Math.cos(t * .9) * .04);
    ripples.forEach((r, i) => r.scale.setScalar(1 + Math.sin(t * .7 - i) * .04));
    sweep.rotation.y = -t * .28;
    sea.rotation.y = t * .015;
  };
}

function culture(s) {
  s.camera.position.set(2.9, 1.7, 6.8); s.camera.lookAt(0, 0, 0);
  const pattern = texture(768, 512, (ctx, w, h) => {
    ctx.fillStyle = '#492d26'; ctx.fillRect(0, 0, w, h);
    ctx.lineWidth = 3;
    for (let row = 0; row < 5; row++) for (let col = 0; col < 8; col++) {
      const x = col * 96 + 48, y = row * 102 + 51;
      ctx.strokeStyle = (row + col) % 2 ? '#dba575' : '#edddbb';
      for (const r of [34, 24, 10]) { ctx.beginPath(); ctx.moveTo(x, y - r); ctx.lineTo(x + r, y); ctx.lineTo(x, y + r); ctx.lineTo(x - r, y); ctx.closePath(); ctx.stroke(); }
    }
    ctx.strokeStyle = '#eac6a433'; ctx.lineWidth = 1;
    for (let y = 0; y < h; y += 4) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  });
  const geometry = new T.PlaneGeometry(3.6, 2.2, 48, 24);
  const base = geometry.attributes.position.array.slice();
  const cloth = mesh(s.root, geometry, material(0xffffff, { map: pattern, side: T.DoubleSide, roughness: .9, metalness: 0 }));
  cloth.position.y = .05;
  rod(s.root, v(-2.03, 1.3, 0), v(2.03, 1.3, 0), .025, material(0xd4ab80));
  for (const x of [-1.6, 1.6]) rod(s.root, v(x, 1.15, 0), v(x, 1.3, 0), .013, material(ivory));
  const shape = new T.Shape(); shape.moveTo(0, .5); shape.lineTo(.5, 0); shape.lineTo(0, -.5); shape.lineTo(-.5, 0); shape.closePath();
  const pendant = mesh(s.root, new T.ExtrudeGeometry(shape, { depth: .06, bevelEnabled: true, bevelSize: .02, bevelThickness: .02, bevelSegments: 1 }), material(0xd89c6d), [0, -.15, .65]);
  const inset = box(pendant, [.4, .4, .02], material(0x743c2d), [0, 0, .09]); inset.rotation.z = Math.PI / 4;
  box(pendant, [.13, .13, .02], material(ivory), [0, 0, .11]).rotation.z = Math.PI / 4;
  return t => {
    const p = geometry.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = base[i * 3], y = base[i * 3 + 1];
      p.setZ(i, Math.sin(x * 4 + t * .65) * .13 * (1.3 - y) + Math.cos(x * 1.3) * .16);
    }
    p.needsUpdate = true; geometry.computeVertexNormals();
    pendant.rotation.y = Math.sin(t * .5) * .25;
    pendant.position.y = -.15 + Math.sin(t * .8) * .06;
  };
}

function piano(s) {
  s.camera.position.set(3.3, 3.3, 6.2); s.camera.lookAt(0, -.15, 0);
  const object = new T.Group(); s.root.add(object);
  box(object, [3.9, .28, 1.95], material(0x43513b), [0, -.3, 0]);
  box(object, [3.72, .06, .75], material(dark), [0, -.12, -.55]);
  const display = texture(512, 128, (ctx, w, h) => {
    ctx.fillStyle = '#122014'; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#d1ff54'; ctx.lineWidth = 3; ctx.beginPath();
    for (let x = 0; x < w; x++) { const y = h / 2 + Math.sin(x * .06) * 36; if (x) ctx.lineTo(x, y); else ctx.moveTo(x, y); } ctx.stroke();
  });
  const screen = mesh(object, new T.PlaneGeometry(1.35, .37), new T.MeshBasicMaterial({ map: display }), [-1.02, -.075, -.55]); screen.rotation.x = -Math.PI / 2;
  const keys = Array.from({ length: 14 }, (_, i) => {
    const pivot = new T.Group(); object.add(pivot); pivot.position.set(-1.68 + i * .258, -.08, -.05);
    box(pivot, [.24, .12, .85], material(ivory), [0, 0, .425]); return pivot;
  });
  for (const i of [0, 1, 3, 4, 5, 7, 8, 10, 11, 12]) box(object, [.13, .13, .46], material(0x162018), [-1.55 + i * .258, .03, .18]);
  const bars = Array.from({ length: 10 }, (_, i) => box(object, [.05, .025, .23], material(lime, { emissive: lime, emissiveIntensity: .5 }), [i * .11, -.075, -.55]));
  for (const x of [1.35, 1.65]) mesh(object, new T.CylinderGeometry(.1, .11, .12, 20), material(0xb7c59f), [x, -.015, -.55]);
  return t => {
    object.rotation.y = -.16 + Math.sin(t * .32) * .1;
    keys.forEach((key, i) => { const press = Math.max(0, Math.sin(t * 2 - i * .8)) ** 12; key.rotation.x = press * .1; key.children[0].material.color.setHex(press > .4 ? lime : ivory); });
    bars.forEach((bar, i) => { bar.scale.z = .2 + (Math.sin(t * 2.6 + i * .8) + 1) * .5; });
  };
}

function web(s) {
  s.camera.position.set(3.7, 2.1, 7); s.camera.lookAt(0, 0, 0);
  const makeMap = (back) => texture(768, 480, (ctx, w, h) => {
    ctx.fillStyle = back ? '#283a29' : '#131c12'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#647557'; ctx.fillRect(0, 42, w, 2);
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(24 + i * 20, 22, 4, 0, 7); ctx.fillStyle = i ? '#91a67e' : '#d1ff54'; ctx.fill(); }
    ctx.fillStyle = '#e9eddd'; ctx.font = 'bold 53px sans-serif'; ctx.fillText(back ? 'SELECTED' : 'IDEAS INTO', 38, 133); ctx.fillText(back ? 'WORK.' : 'REALITY.', 38, 194);
    ctx.fillStyle = '#c5ef73'; ctx.fillRect(38, 230, 125, 28);
    for (let i = 0; i < 3; i++) { ctx.fillStyle = ['#a9bf81', '#526f50', '#d7d6bc'][i]; ctx.fillRect(38 + i * 238, 308, 218, 125); }
  });
  const panels = [];
  for (let i = 0; i < 3; i++) {
    const panel = new T.Group(); s.root.add(panel);
    panel.position.set(-.2 + i * .16, .25 - i * .16, -.85 + i * .65);
    box(panel, [3.3, 2.05, .09], material(i === 2 ? 0x9db688 : 0x4d6548));
    mesh(panel, new T.PlaneGeometry(3.23, 1.98), new T.MeshBasicMaterial({ map: makeMap(i !== 2) }), [0, 0, .051]);
    panels.push(panel);
  }
  const knot = mesh(panels[2], new T.TorusKnotGeometry(.32, .085, 64, 8), material(lime), [.88, .28, .36]);
  const chip = new T.Group(); s.root.add(chip); chip.position.set(-1.65, -.55, 1);
  box(chip, [.65, .65, .15], material(ivory));
  const label = texture(128, 128, ctx => { ctx.fillStyle = '#e1e7ce'; ctx.fillRect(0, 0, 128, 128); ctx.fillStyle = '#284324'; ctx.font = 'bold 44px monospace'; ctx.textAlign = 'center'; ctx.fillText('</>', 64, 80); });
  mesh(chip, new T.PlaneGeometry(.62, .62), new T.MeshBasicMaterial({ map: label }), [0, 0, .08]);
  return t => {
    panels.forEach((panel, i) => { panel.position.y = .25 - i * .16 + Math.sin(t * .55 + i * .9) * .07; panel.rotation.y = Math.sin(t * .3) * .07; });
    knot.rotation.set(t * .2, t * .35, 0);
    chip.position.y = -.55 + Math.sin(t * .8) * .12;
    chip.rotation.set(.05, Math.sin(t * .5) * .14, -.1);
  };
}

const factories = { hero, signal, clock, drone, laser, ship, culture, piano, web };
export function createModel(kind) {
  const model = stage(kind);
  model.animate = factories[kind](model);
  model.animate(0);
  model.cameraDirection = model.camera.position.clone().normalize();
  model.dispose = () => {
    const geometries = new Set(), materials = new Set(), textures = new Set();
    model.scene.traverse(object => {
      if (object.geometry) geometries.add(object.geometry);
      if (object.material) for (const m of [object.material].flat()) { materials.add(m); if (m.map) textures.add(m.map); }
      object.shadow?.dispose();
    });
    geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose());
  };
  return model;
}

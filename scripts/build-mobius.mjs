import { writeFile } from 'node:fs/promises';
import { mobiusPoint } from '../js/mobius-geometry.mjs';

// Project the same half-twist surface for no-WebGL / no-JavaScript visitors.
function project(u, width) {
  const [x, y, z] = mobiusPoint(u, width);
  const rx = .12, ry = -.12, rz = 0;
  const y1 = y * Math.cos(rx) - z * Math.sin(rx), z1 = y * Math.sin(rx) + z * Math.cos(rx);
  const x2 = x * Math.cos(ry) + z1 * Math.sin(ry), z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);
  const x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz), y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);
  const scale = 113 * 8 / (8 - z2);
  return [300 + x3 * scale, 300 - y3 * scale, z2];
}
const point = p => `${p[0].toFixed(2)},${p[1].toFixed(2)}`;
const faces = [];
for (let i = 0; i < 160; i++) {
  const u = i / 160 * Math.PI * 2, next = (i + 1) / 160 * Math.PI * 2;
  const p = [project(u, -.32), project(u, .32), project(next, .32), project(next, -.32)];
  const depth = p.reduce((sum, p) => sum + p[2], 0) / 4;
  const light = Math.round(12 + (Math.sin(u - 1) + 1) * 8);
  faces.push({ depth, svg: `<polygon points="${p.map(point).join(' ')}" fill="hsl(82 14% ${light}%)"/><path d="M${point(p[0])}L${point(p[1])}" stroke="#e1e7ce" stroke-opacity=".3" stroke-width=".6"/><path d="M${point(p[0])}L${point(p[3])}M${point(p[1])}L${point(p[2])}" stroke="#d1ff54" stroke-width="1.7"/>` });
}
faces.sort((a, b) => a.depth - b.depth);
await writeFile(new URL('../assets/mobius.svg', import.meta.url), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><ellipse cx="300" cy="300" rx="266" ry="160" fill="none" stroke="#9ba985" stroke-opacity=".3"/>${faces.map(f => f.svg).join('')}</svg>\n`);

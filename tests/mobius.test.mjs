import test from 'node:test';
import assert from 'node:assert/strict';
import { mobiusPoint, mobiusSurface } from '../js/mobius-geometry.mjs';

const near = (a, b) => a.forEach((n, i) => assert.ok(Math.abs(n - b[i]) < 1e-10));
test('half-twist joins the reversed width and its single boundary closes after two turns', () => {
  for (const width of [-.32, -.2, 0, .2, .32]) near(mobiusPoint(2 * Math.PI, width), mobiusPoint(0, -width));
  near(mobiusPoint(4 * Math.PI, .32), mobiusPoint(0, .32));
  assert.notDeepEqual(mobiusPoint(2 * Math.PI, .32), mobiusPoint(0, .32));
});
test('the infinity crossing is separated in depth', () => {
  const front = mobiusPoint(0, 0), back = mobiusPoint(Math.PI, 0);
  near(front.slice(0, 2), back.slice(0, 2));
  assert.ok(front[2] - back[2] > .8);
});
test('the ribbon has finite vertices and nondegenerate triangles', () => {
  const { positions, indices } = mobiusSurface();
  assert.ok(positions.every(Number.isFinite));
  for (let i = 0; i < indices.length; i += 3) {
    const [a, b, c] = indices.slice(i, i + 3).map(index => positions.slice(index * 3, index * 3 + 3));
    const u = b.map((x, j) => x - a[j]), v = c.map((x, j) => x - a[j]);
    const area = Math.hypot(u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]);
    assert.ok(area > 1e-8);
  }
});

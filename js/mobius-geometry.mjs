// A half-twist ribbon around a spatial figure-eight. The crossing has a
// front/back gap; at the seam, (2π, width) = (0, -width).
export function mobiusPoint(u, width) {
  const x = 1.72 * Math.sin(u), y = .78 * Math.sin(2 * u), z = .42 * Math.cos(u);
  const dx = 1.72 * Math.cos(u), dy = 1.56 * Math.cos(2 * u), dz = -.42 * Math.sin(u);
  const planar = Math.hypot(dx, dy), length = Math.hypot(dx, dy, dz);
  const nx = -dy / planar, ny = dx / planar;
  const bx = -dz * ny / length, by = dz * nx / length, bz = planar / length;
  const twist = u / 2 + .25;
  return [x + width * (nx * Math.cos(twist) + bx * Math.sin(twist)),
    y + width * (ny * Math.cos(twist) + by * Math.sin(twist)),
    z + width * bz * Math.sin(twist)];
}

export function mobiusSurface(segments = 240, strips = 20) {
  const positions = [], indices = [];
  for (let i = 0; i <= segments; i++) {
    for (let j = 0; j <= strips; j++) {
      positions.push(...mobiusPoint(i / segments * Math.PI * 2, (j / strips - .5) * .64));
    }
  }
  for (let i = 0; i < segments; i++) for (let j = 0; j < strips; j++) {
    const a = i * (strips + 1) + j, b = a + strips + 1;
    indices.push(a, b, a + 1, b, b + 1, a + 1);
  }
  return { positions, indices };
}

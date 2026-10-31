/* Procedural material icons and swatches.
   Each material has palette[4], pattern and seed, so every icon is unique. */

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rgba(hex, alpha = 1) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

function shade(hex, amount) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  const r = Math.max(0, Math.min(255, ((n >> 16) & 255) + amount));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amount));
  const b = Math.max(0, Math.min(255, (n & 255) + amount));
  return `rgb(${r}, ${g}, ${b})`;
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function drawGrain(ctx, s, pal, rand, count, alpha) {
  for (let i = 0; i < count; i++) {
    const x = rand() * s;
    const y = rand() * s;
    const r = 0.5 + rand() * Math.max(1, s / 38);
    ctx.fillStyle = rgba(pal[Math.floor(rand() * 4)], alpha * (0.3 + rand() * 0.7));
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPattern(ctx, s, mat, rand) {
  const pal = mat.palette && mat.palette.length === 4 ? mat.palette : ['#d8d8d8', '#a8a8a8', '#787878', '#e8e8e8'];
  const pattern = mat.pattern || 'grain';
  const u = s / 48;

  if (pattern === 'grain') {
    drawGrain(ctx, s, pal, rand, Math.round(120 * (s / 48)), 0.55);
    for (let i = 0; i < 10; i++) {
      const x = rand() * s;
      const y = rand() * s;
      ctx.strokeStyle = rgba(pal[2], 0.25);
      ctx.lineWidth = Math.max(0.7, u * 0.9);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (rand() - 0.5) * 9 * u, y + (rand() - 0.5) * 9 * u);
      ctx.stroke();
    }
  } else if (pattern === 'speckle') {
    drawGrain(ctx, s, pal, rand, Math.round(46 * (s / 48)), 0.7);
    for (let i = 0; i < 15; i++) {
      const x = rand() * s;
      const y = rand() * s;
      const r = (1.5 + rand() * 3.5) * u;
      ctx.fillStyle = rgba(pal[Math.floor(rand() * 4)], 0.45 + rand() * 0.45);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (pattern === 'strata') {
    let y = 0;
    let i = 0;
    while (y < s) {
      const h = (3 + rand() * 6) * u;
      ctx.fillStyle = rgba(pal[i % 4], 0.42 + rand() * 0.3);
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= s; x += s / 8) {
        ctx.lineTo(x, y + Math.sin(x / s * Math.PI * 2 + i) * 1.2 * u);
      }
      ctx.lineTo(s, y + h);
      for (let x = s; x >= 0; x -= s / 8) {
        ctx.lineTo(x, y + h + Math.sin(x / s * Math.PI * 2 + i + 1) * 1.2 * u);
      }
      ctx.closePath();
      ctx.fill();
      y += h;
      i++;
    }
  } else if (pattern === 'crystal') {
    for (let i = 0; i < 7; i++) {
      const cx = rand() * s;
      const cy = rand() * s;
      const r = (4 + rand() * 9) * u;
      const sides = 4 + Math.floor(rand() * 3);
      ctx.beginPath();
      for (let k = 0; k < sides; k++) {
        const a = (k / sides) * Math.PI * 2 + rand() * 0.4;
        const px = cx + Math.cos(a) * r * (0.7 + rand() * 0.5);
        const py = cy + Math.sin(a) * r * (0.7 + rand() * 0.5);
        k ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = rgba(pal[Math.floor(rand() * 4)], 0.22 + rand() * 0.3);
      ctx.fill();
      ctx.strokeStyle = rgba(pal[3], 0.3 + rand() * 0.4);
      ctx.lineWidth = Math.max(0.6, u * 0.8);
      ctx.stroke();
    }
    drawGrain(ctx, s, pal, rand, Math.round(35 * (s / 48)), 0.5);
  } else if (pattern === 'fiber') {
    for (let i = 0; i < 34; i++) {
      const x = rand() * s;
      const y = rand() * s;
      const len = (8 + rand() * 22) * u;
      const a = -0.8 + rand() * 0.35;
      ctx.strokeStyle = rgba(pal[Math.floor(rand() * 4)], 0.22 + rand() * 0.4);
      ctx.lineWidth = Math.max(0.5, (0.6 + rand() * 1.2) * u);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + Math.cos(a) * len * 0.5, y + Math.sin(a) * len * 0.5 + 2 * u, x + Math.cos(a) * len, y + Math.sin(a) * len);
      ctx.stroke();
    }
  } else if (pattern === 'bubble') {
    for (let i = 0; i < 14; i++) {
      const x = rand() * s;
      const y = rand() * s;
      const r = (2 + rand() * 6) * u;
      ctx.fillStyle = rgba(pal[Math.floor(rand() * 4)], 0.18 + rand() * 0.22);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = rgba(pal[0], 0.28 + rand() * 0.25);
      ctx.lineWidth = Math.max(0.6, u * 0.8);
      ctx.stroke();
      ctx.fillStyle = rgba('#ffffff', 0.22);
      ctx.beginPath();
      ctx.arc(x - r * 0.32, y - r * 0.34, Math.max(0.5, r * 0.2), 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (pattern === 'scale') {
    const step = 7 * u;
    for (let row = 0; row * step < s + step; row++) {
      for (let col = 0; col * step < s + step; col++) {
        const x = col * step + (row % 2 ? step / 2 : 0);
        const y = row * step;
        ctx.beginPath();
        ctx.arc(x, y, step * 0.62, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.strokeStyle = rgba(pal[row % 4], 0.34 + rand() * 0.22);
        ctx.lineWidth = Math.max(0.7, u);
        ctx.stroke();
      }
    }
    drawGrain(ctx, s, pal, rand, Math.round(30 * (s / 48)), 0.4);
  } else if (pattern === 'vein') {
    const branch = (x, y, angle, len, depth) => {
      if (depth <= 0 || len < 1) return;
      const nx = x + Math.cos(angle) * len;
      const ny = y + Math.sin(angle) * len;
      ctx.strokeStyle = rgba(pal[depth % 4], 0.3 + depth * 0.12);
      ctx.lineWidth = Math.max(0.7, depth * 1.1 * u);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + Math.cos(angle + 0.3) * len * 0.5, y + Math.sin(angle + 0.3) * len * 0.5, nx, ny);
      ctx.stroke();
      branch(nx, ny, angle - 0.5 - rand() * 0.5, len * (0.55 + rand() * 0.25), depth - 1);
      branch(nx, ny, angle + 0.5 + rand() * 0.5, len * (0.55 + rand() * 0.25), depth - 1);
    };
    for (let i = 0; i < 3; i++) {
      branch(rand() * s, s * 0.85 + rand() * s * 0.15, -Math.PI / 2 + (rand() - 0.5), s * 0.24, 4);
    }
  } else if (pattern === 'spark') {
    for (let i = 0; i < 12; i++) {
      const x = rand() * s;
      const y = rand() * s;
      const r = (2 + rand() * 6) * u;
      ctx.fillStyle = rgba(pal[Math.floor(rand() * 4)], 0.35 + rand() * 0.5);
      ctx.beginPath();
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2;
        const rr = k % 2 ? r * 0.32 : r;
        const px = x + Math.cos(a) * rr;
        const py = y + Math.sin(a) * rr;
        k ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    }
    drawGrain(ctx, s, pal, rand, Math.round(40 * (s / 48)), 0.4);
  } else if (pattern === 'ring') {
    const cx = s * (0.42 + rand() * 0.16);
    const cy = s * (0.42 + rand() * 0.16);
    for (let i = 12; i > 0; i--) {
      ctx.beginPath();
      ctx.arc(cx, cy, (i / 12) * s * 0.62, 0, Math.PI * 2);
      ctx.strokeStyle = rgba(pal[i % 4], 0.16 + (i % 3) * 0.1);
      ctx.lineWidth = Math.max(0.8, (1 + (i % 4)) * u);
      ctx.stroke();
    }
    drawGrain(ctx, s, pal, rand, Math.round(40 * (s / 48)), 0.35);
  } else if (pattern === 'wave') {
    for (let i = 0; i < 5; i++) {
      const y0 = (i + 1) * (s / 6);
      ctx.beginPath();
      for (let x = 0; x <= s; x += s / 20) {
        const y = y0 + Math.sin((x / s) * Math.PI * 4 + i * 1.4) * s * 0.035;
        x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.strokeStyle = rgba(pal[i % 4], 0.3 + rand() * 0.3);
      ctx.lineWidth = Math.max(0.8, (1 + (i % 2)) * u);
      ctx.stroke();
    }
    drawGrain(ctx, s, pal, rand, Math.round(30 * (s / 48)), 0.35);
  } else if (pattern === 'flame') {
    for (let i = 0; i < 7; i++) {
      const x = rand() * s;
      const y = s * 0.55 + rand() * s * 0.45;
      const r = (4 + rand() * 9) * u;
      ctx.beginPath();
      ctx.moveTo(x, y - r * 1.7);
      ctx.bezierCurveTo(x + r, y - r * 0.2, x + r * 0.7, y + r * 0.7, x, y + r * 0.7);
      ctx.bezierCurveTo(x - r * 0.7, y + r * 0.7, x - r, y - r * 0.2, x, y - r * 1.7);
      ctx.fillStyle = rgba(pal[Math.floor(rand() * 4)], 0.22 + rand() * 0.35);
      ctx.fill();
    }
    drawGrain(ctx, s, pal, rand, Math.round(45 * (s / 48)), 0.45);
  }

  // universal grain overlay
  drawGrain(ctx, s, pal, rand, Math.round(18 * (s / 48)), 0.22);
}

export function drawMaterialIcon(canvas, mat, size = 48) {
  if (!canvas || !mat) return;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.round(size * dpr);
  canvas.height = Math.round(size * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, size, size);

  const pal = mat.palette && mat.palette.length === 4
    ? mat.palette
    : [mat.color || '#a8a8a8', mat.color || '#888888', '#5a5a5a', '#d8d8d8'];
  const rand = mulberry32((mat.seed || 1) * 2654435761);

  // base gradient
  const g = ctx.createLinearGradient(0, 0, size, size);
  g.addColorStop(0, pal[0]);
  g.addColorStop(0.45, pal[1]);
  g.addColorStop(1, pal[2]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  // pattern clipped to a rounded tile
  ctx.save();
  roundRect(ctx, 0, 0, size, size, size * 0.12);
  ctx.clip();
  drawPattern(ctx, size, mat, rand);

  // light / shadow pass
  const shine = ctx.createLinearGradient(0, 0, 0, size);
  shine.addColorStop(0, 'rgba(255,255,255,0.20)');
  shine.addColorStop(0.28, 'rgba(255,255,255,0.04)');
  shine.addColorStop(0.72, 'rgba(0,0,0,0.02)');
  shine.addColorStop(1, 'rgba(0,0,0,0.28)');
  ctx.fillStyle = shine;
  ctx.fillRect(0, 0, size, size);

  const glow = ctx.createRadialGradient(size * 0.28, size * 0.18, 0, size * 0.28, size * 0.18, size * 0.9);
  glow.addColorStop(0, 'rgba(255,255,255,0.18)');
  glow.addColorStop(0.55, 'rgba(255,255,255,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);
  ctx.restore();

  // border
  ctx.strokeStyle = 'rgba(255,255,255,0.16)';
  ctx.lineWidth = Math.max(0.8, size / 60);
  roundRect(ctx, 0.5, 0.5, size - 1, size - 1, size * 0.12);
  ctx.stroke();

  // state accent
  if (mat.state === 'liquid' || mat.state === 'gas' || mat.state === 'plasma' || mat.state === 'fire' || mat.state === 'energy') {
    const accent = ctx.createLinearGradient(0, size * 0.75, 0, size);
    accent.addColorStop(0, 'rgba(255,255,255,0)');
    accent.addColorStop(1, rgba(pal[3], 0.38));
    ctx.fillStyle = accent;
    ctx.fillRect(0, size * 0.7, size, size * 0.3);
  }
}

export function drawWorldPattern(ctx, mat, x, y, w, h, seedOffset = 0) {
  const rand = mulberry32(((mat.seed || 1) + seedOffset * 17) * 2654435761);
  const pal = mat.palette || [mat.color, mat.color, mat.color, mat.color];
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, pal[0]);
  g.addColorStop(0.5, pal[1]);
  g.addColorStop(1, pal[2]);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  drawPattern(ctx, Math.max(w, h), mat, rand);
  ctx.restore();
}

export { mulberry32, rgba, shade, roundRect };

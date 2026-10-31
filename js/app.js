import { MATERIALS, CATEGORIES, MATERIAL_BY_NAME } from './data.js';
import { SandSim } from './sim.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const nf = new Intl.NumberFormat('pl-PL');

const SCENES = {
  volcano: { name: 'Wulkan', title: 'Wulkan', icon: 'volcano' },
  garden: { name: 'Ogród', title: 'Ogród', icon: 'garden' },
  lab: { name: 'Laboratorium', title: 'Laboratorium', icon: 'lab' },
  desert: { name: 'Pustynia', title: 'Pustynia', icon: 'desert' },
  space: { name: 'Kosmos', title: 'Kosmos', icon: 'space' },
};

const CATEGORY_ICONS = {
  earth: '<path d="M3 18h18M5 14h14M7 10h10M9 6h6"/><path d="m4 18 3-8M20 18l-3-8"/>',
  sand: '<circle cx="7" cy="8" r="1"/><circle cx="12" cy="6" r="1"/><circle cx="17" cy="9" r="1"/><circle cx="9" cy="13" r="1"/><circle cx="14" cy="15" r="1"/><circle cx="18" cy="14" r="1"/><circle cx="6" cy="18" r="1"/><circle cx="11" cy="19" r="1"/><circle cx="16" cy="19" r="1"/>',
  metal: '<path d="M5 9h14l-2 8H7L5 9Z"/><path d="M8 9V7h8v2"/><path d="M9 13h6"/>',
  gas: '<path d="M7 17a4 4 0 0 1 .6-7.9A5.2 5.2 0 0 1 17.4 10 3.5 3.5 0 0 1 18 17H7Z"/><path d="M9 20h7"/>',
  liquid: '<path d="M12 3c3.2 4.1 5.2 6.8 5.2 9.2a5.2 5.2 0 0 1-10.4 0C6.8 9.8 8.8 7.1 12 3Z"/><path d="M9.5 13.5c.4 1.2 1.3 1.8 2.5 1.8"/>',
  flask: '<path d="M9 3h6M10 3v6l-5.2 9a2 2 0 0 0 1.8 3h10.8a2 2 0 0 0 1.8-3L14 9V3"/><path d="M7 15h10"/><circle cx="10" cy="18" r=".7"/><circle cx="14" cy="17" r=".7"/>',
  flame: '<path d="M12 3c2.1 4 5.2 5.2 5.2 9.2A5.2 5.2 0 0 1 12 21a5.2 5.2 0 0 1-5.2-5.2c0-2 1-3.2 2.1-5.2 0 3 1.1 4.1 2.1 4.1 1-2 0-5 1-8.7Z"/><path d="M12 18c-1 0-1.7-.7-1.7-1.7 0-.9.7-1.6 1.7-2.8 1 1.2 1.7 1.9 1.7 2.8 0 1-.7 1.7-1.7 1.7Z"/>',
  bolt: '<path d="m13 2-8 11h6l-1 9 9-13h-6l1-7Z"/>',
  leaf: '<path d="M20 4C12 4 6 8 6 14a5 5 0 0 0 5 5c6 0 9-6 9-15Z"/><path d="M5 20c2-5 6-9 11-11"/>',
  mushroom: '<path d="M4 11a8 8 0 0 1 16 0H4Z"/><path d="M9 11v6a3 3 0 0 0 6 0v-6"/><path d="M7 8c1.4-1.4 3-2 5-2s3.6.6 5 2"/>',
  paw: '<circle cx="7" cy="9" r="1.5"/><circle cx="11" cy="6.5" r="1.5"/><circle cx="16" cy="7" r="1.5"/><circle cx="18.5" cy="11" r="1.5"/><path d="M8.5 15.5c0-2 1.5-4 3.5-4s3.5 2 3.5 4c0 2.2-1.8 3.5-3.5 3.5s-3.5-1.3-3.5-3.5Z"/>',
  apple: '<path d="M12 7.5C8 5.5 5 8.5 5 12.5c0 4 3 8 5 8 1 0 1-.5 2-.5s1 .5 2 .5c2 0 5-4 5-8 0-4-3-7-7-5Z"/><path d="M12 7.5c0-2 1-3.2 3-4"/>',
  brick: '<path d="M3 6h18v12H3zM3 12h18M9 6v6M15 12v6"/>',
  rings: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="2"/><path d="M12 4v2M12 18v2M4 12h2M18 12h2"/>',
  hex: '<path d="m12 3 7 4v10l-7 4-7-4V7l7-4Z"/><path d="m12 8 3.5 2v4L12 16l-3.5-2v-4L12 8Z"/>',
  glass: '<path d="M7 3h10l-1 6a4 4 0 0 1-8 0L7 3Z"/><path d="M12 13v7M8.5 20h7"/><path d="M8.5 7h7"/>',
  snow: '<path d="M12 2v20M4 7l16 10M20 7 4 17M8 4l4 3 4-3M8 20l4-3 4 3M3 10l4 2-4 2M21 10l-4 2 4 2"/>',
  planet: '<circle cx="12" cy="12" r="6"/><path d="M4 15c4 3 12 3 16 0M6 8c3-2 9-2 12 0"/><circle cx="17" cy="7" r="1"/>',
  radiation: '<circle cx="12" cy="12" r="2"/><path d="M12 3a9 9 0 0 1 7.8 4.5l-4.7 2.7A3.6 3.6 0 0 0 12 9V3ZM4.2 7.5A9 9 0 0 0 4.2 16.5l4.7-2.7A3.6 3.6 0 0 1 7.3 12a3.6 3.6 0 0 1 1.6-1.8L4.2 7.5ZM12 15a3.6 3.6 0 0 0 3.1-1.8l4.7 2.7A9 9 0 0 1 12 21v-6Z"/>',
  sparkles: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/>',
  chip: '<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 7V3M14 7V3M10 21v-4M14 21v-4M7 10H3M7 14H3M21 10h-4M21 14h-4"/><rect x="10" y="10" width="4" height="4" rx=".5"/>',
  molecule: '<circle cx="7" cy="8" r="2"/><circle cx="17" cy="7" r="2"/><circle cx="12" cy="17" r="2"/><path d="m9 9 6-1M8.5 10l2.5 5M15.5 9 13 15"/>',
  factory: '<path d="M3 20V9l5 3V9l5 3V6h4v14H3Z"/><path d="M6 20v-3M10 20v-3M14 20v-3M18 20v-3M17 3h3v3"/>',
  diamond: '<path d="m12 3 7 6-7 12L5 9l7-6Z"/><path d="M5 9h14M12 3 9 9l3 12 3-12-3-6Z"/>',
  wrench: '<path d="M14.5 5.5a4 4 0 0 0-5 5L4 16l4 4 5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-3-3 2.5-2.5Z"/>',
};

const TOOL_LABELS = {
  brush: 'Pędzel', eraser: 'Gumka', line: 'Linia', heat: 'Ciepło',
  cool: 'Zimno', spark: 'Iskra', vacuum: 'Odkurzacz',
};

const app = {
  sim: null,
  selectedId: MATERIAL_BY_NAME.get('Piasek kwarcowy')?.id || 1,
  filterCategory: 'all',
  query: '',
  filtered: MATERIALS,
  paused: false,
  speed: 1,
  gridCols: 2,
  rowHeight: 71,
  painting: false,
  lineStart: null,
  pointerId: null,
  lastHover: null,
  toastTimer: 0,
  lastFrame: performance.now(),
  fpsFrames: 0,
  fpsTime: 0,
  acc: 0,
  lastHud: 0,
  resizeTimer: 0,
};

function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/Ł/g, 'L')
    .toLowerCase();
}

function formatNumber(value) {
  return nf.format(Math.round(value));
}

function formatTemp(value) {
  if (value == null || !Number.isFinite(value)) return '—';
  const rounded = Math.round(value);
  if (Math.abs(rounded) >= 1000) return `${nf.format(rounded)}°C`;
  return `${rounded}°C`;
}

function formatDensity(value) {
  if (value == null) return '—';
  if (value < 0.01) return `${value.toFixed(4)} g/cm³`;
  if (value < 1) return `${value.toFixed(2)} g/cm³`;
  return `${value.toFixed(2)} g/cm³`;
}

function formatConductivity(value) {
  if (value == null) return '—';
  if (value >= 100) return `${Math.round(value)} W/mK`;
  if (value >= 10) return `${value.toFixed(1)} W/mK`;
  return `${value.toFixed(2)} W/mK`;
}

function formatHeat(value) {
  if (value == null) return '—';
  return `${nf.format(Math.round(value))} J/kgK`;
}

function drawMaterialIcon(canvas, material, size = 44) {
  const dpr = 2;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, size, size);
  const rng = mulberry32(material.textureSeed ^ 0x9e3779b9);
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, material.colorLight);
  grad.addColorStop(0.45, material.color);
  grad.addColorStop(1, material.colorDark);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, size, size);
  ctx.clip();
  ctx.globalAlpha = 0.42;
  ctx.strokeStyle = material.colorLight;
  ctx.fillStyle = material.colorLight;
  const pattern = material.pattern;
  const s = size;
  if (pattern === 'grain' || pattern === 'speckle' || pattern === 'dots') {
    const count = pattern === 'dots' ? 11 : 26;
    for (let i = 0; i < count; i++) {
      const x = rng() * s, y = rng() * s;
      const r = pattern === 'dots' ? 1.2 + rng() * 2 : 0.5 + rng() * 1.4;
      ctx.globalAlpha = pattern === 'dots' ? 0.3 : 0.2 + rng() * 0.35;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (pattern === 'strata' || pattern === 'brushed') {
    const lines = pattern === 'strata' ? 6 : 14;
    for (let i = 0; i < lines; i++) {
      const y = (i + 0.5) * s / lines + (rng() - 0.5) * 2;
      ctx.globalAlpha = 0.12 + rng() * 0.2;
      ctx.lineWidth = pattern === 'strata' ? 2 + rng() * 3 : 0.6;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(s, y + (rng() - 0.5) * 2);
      ctx.stroke();
    }
  } else if (pattern === 'facets' || pattern === 'crystal') {
    for (let i = 0; i < 5; i++) {
      ctx.globalAlpha = 0.1 + rng() * 0.22;
      ctx.beginPath();
      const cx = rng() * s, cy = rng() * s;
      ctx.moveTo(cx, cy);
      for (let k = 0; k < 3; k++) ctx.lineTo(cx + (rng() - 0.5) * s * 0.9, cy + (rng() - 0.5) * s * 0.9);
      ctx.closePath();
      ctx.fill();
    }
  } else if (pattern === 'ripple' || pattern === 'veins') {
    const lines = pattern === 'ripple' ? 5 : 4;
    for (let i = 0; i < lines; i++) {
      ctx.globalAlpha = 0.18 + rng() * 0.2;
      ctx.lineWidth = 0.8 + rng();
      ctx.beginPath();
      for (let x = 0; x <= s; x += 2) {
        const y = s * (0.2 + i * 0.15) + Math.sin((x / s) * Math.PI * 2 + i) * s * 0.055;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  } else if (pattern === 'bubbles' || pattern === 'spores') {
    for (let i = 0; i < 9; i++) {
      const x = rng() * s, y = rng() * s, r = 1 + rng() * 3.5;
      ctx.globalAlpha = 0.2 + rng() * 0.28;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
      if (pattern === 'spores') {
        ctx.beginPath(); ctx.arc(x, y, 0.7, 0, Math.PI * 2); ctx.fill();
      }
    }
  } else if (pattern === 'cloud') {
    for (let i = 0; i < 7; i++) {
      ctx.globalAlpha = 0.1 + rng() * 0.16;
      ctx.beginPath();
      ctx.arc(rng() * s, rng() * s, s * (0.08 + rng() * 0.18), 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (pattern === 'flame') {
    ctx.globalAlpha = 0.26;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(s * (0.3 + i * 0.16), s * 0.92);
      ctx.quadraticCurveTo(s * (0.18 + i * 0.16), s * 0.5, s * (0.38 + i * 0.13), s * (0.12 + i * 0.06));
      ctx.quadraticCurveTo(s * (0.62 + i * 0.08), s * 0.5, s * (0.52 + i * 0.1), s * 0.92);
      ctx.fill();
    }
  } else if (pattern === 'bolt' || pattern === 'spark') {
    ctx.globalAlpha = 0.34;
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      let x = rng() * s, y = 0;
      ctx.moveTo(x, y);
      for (let k = 0; k < 4; k++) { x += (rng() - 0.5) * 10; y += s / 4; ctx.lineTo(x, y); }
      ctx.stroke();
    }
  } else if (pattern === 'scales') {
    ctx.globalAlpha = 0.22;
    ctx.lineWidth = 0.8;
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        ctx.beginPath();
        ctx.arc(col * 12 + (row % 2) * 6, row * 11, 5, Math.PI, 0);
        ctx.stroke();
      }
    }
  } else if (pattern === 'crumb') {
    for (let i = 0; i < 7; i++) {
      ctx.globalAlpha = 0.14 + rng() * 0.16;
      const x = rng() * s, y = rng() * s;
      ctx.beginPath();
      ctx.arc(x, y, 1.5 + rng() * 4, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (pattern === 'brick') {
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = 1;
    for (let y = 0; y < s; y += 12) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(s, y); ctx.stroke();
      const off = (Math.floor(y / 12) % 2) * 11;
      for (let x = off; x < s; x += 22) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 12); ctx.stroke(); }
    }
  } else if (pattern === 'rings') {
    ctx.globalAlpha = 0.22;
    ctx.lineWidth = 1;
    for (let r = 5; r < s; r += 8) { ctx.beginPath(); ctx.arc(s * 0.45, s * 0.5, r, 0, Math.PI * 2); ctx.stroke(); }
  } else if (pattern === 'hex') {
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = 0.9;
    for (let row = -1; row < 5; row++) {
      for (let col = -1; col < 5; col++) {
        const cx = col * 12 + (row % 2) * 6, cy = row * 10;
        ctx.beginPath();
        for (let k = 0; k < 6; k++) {
          const a = Math.PI / 3 * k;
          const x = cx + Math.cos(a) * 5, y = cy + Math.sin(a) * 5;
          if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath(); ctx.stroke();
      }
    }
  } else if (pattern === 'gloss') {
    ctx.globalAlpha = 0.28;
    ctx.beginPath();
    ctx.moveTo(-s, s * 0.25); ctx.lineTo(s * 0.4, -s); ctx.lineTo(s * 0.72, -s); ctx.lineTo(-s * 0.7, s); ctx.closePath();
    ctx.fill();
  } else if (pattern === 'frost') {
    ctx.globalAlpha = 0.32;
    ctx.lineWidth = 0.8;
    const cx = s / 2, cy = s / 2;
    for (let k = 0; k < 6; k++) {
      const a = Math.PI / 3 * k;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * s * 0.44, cy + Math.sin(a) * s * 0.44); ctx.stroke();
      const bx = cx + Math.cos(a) * s * 0.26, by = cy + Math.sin(a) * s * 0.26;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + Math.cos(a + 0.7) * s * 0.1, by + Math.sin(a + 0.7) * s * 0.1); ctx.stroke();
    }
  } else if (pattern === 'stars') {
    for (let i = 0; i < 15; i++) {
      ctx.globalAlpha = 0.25 + rng() * 0.5;
      const x = rng() * s, y = rng() * s;
      ctx.fillRect(x, y, 1, 1);
      if (rng() > 0.75) { ctx.fillRect(x - 1.5, y, 4, 1); ctx.fillRect(x, y - 1.5, 1, 4); }
    }
  } else if (pattern === 'hazard') {
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 3;
    for (let x = -s; x < s * 2; x += 11) {
      ctx.beginPath(); ctx.moveTo(x, s); ctx.lineTo(x + s, 0); ctx.stroke();
    }
  } else if (pattern === 'circuit') {
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 0.8;
    for (let i = 0; i < 5; i++) {
      const x = rng() * s, y = rng() * s;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 10, y); ctx.lineTo(x + 10, y + 9); ctx.stroke();
      ctx.beginPath(); ctx.arc(x + 10, y + 9, 1.2, 0, Math.PI * 2); ctx.fill();
    }
  } else if (pattern === 'weave') {
    ctx.globalAlpha = 0.18;
    ctx.lineWidth = 0.8;
    for (let x = 0; x < s; x += 6) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, s); ctx.stroke(); }
    for (let y = 0; y < s; y += 6) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(s, y); ctx.stroke(); }
  } else if (pattern === 'mosaic') {
    ctx.globalAlpha = 0.18;
    for (let i = 0; i < 7; i++) {
      ctx.beginPath();
      const x = rng() * s, y = rng() * s;
      ctx.moveTo(x, y); ctx.lineTo(x + 5 + rng() * 6, y + rng() * 5); ctx.lineTo(x + rng() * 6, y + 5 + rng() * 6);
      ctx.closePath(); ctx.fill();
    }
  } else if (pattern === 'molecule') {
    ctx.globalAlpha = 0.32;
    ctx.lineWidth = 0.9;
    const points = [[0.25, 0.3], [0.72, 0.22], [0.55, 0.72], [0.18, 0.78]];
    for (const [x, y] of points) { ctx.beginPath(); ctx.arc(x * s, y * s, 2, 0, Math.PI * 2); ctx.fill(); }
    ctx.beginPath(); ctx.moveTo(points[0][0] * s, points[0][1] * s); ctx.lineTo(points[1][0] * s, points[1][1] * s); ctx.lineTo(points[2][0] * s, points[2][1] * s); ctx.lineTo(points[3][0] * s, points[3][1] * s); ctx.stroke();
  } else if (pattern === 'diamond') {
    ctx.globalAlpha = 0.28;
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      const k = 5 + i * 8;
      ctx.beginPath(); ctx.moveTo(s / 2, k); ctx.lineTo(s - k, s / 2); ctx.lineTo(s / 2, s - k); ctx.lineTo(k, s / 2); ctx.closePath(); ctx.stroke();
    }
  } else {
    for (let i = 0; i < 18; i++) {
      ctx.globalAlpha = 0.16;
      ctx.fillRect(rng() * s, rng() * s, 1 + rng() * 2, 1 + rng() * 2);
    }
  }
  ctx.restore();

  // Soft top light and inner edge.
  const sheen = ctx.createLinearGradient(0, 0, 0, size);
  sheen.addColorStop(0, 'rgba(255,255,255,0.28)');
  sheen.addColorStop(0.32, 'rgba(255,255,255,0.04)');
  sheen.addColorStop(1, 'rgba(0,0,0,0.24)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = 'rgba(255,255,255,0.16)';
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, size - 1, size - 1);
  if (material.glow > 0.3) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = Math.min(0.6, material.glow);
    ctx.shadowBlur = 14;
    ctx.shadowColor = material.colorLight;
    ctx.strokeStyle = material.colorLight;
    ctx.strokeRect(1, 1, size - 2, size - 2);
    ctx.restore();
  }
}

function mulberry32(seed) {
  return function next() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function iconSvg(name, size = 13) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true">${CATEGORY_ICONS[name] || CATEGORY_ICONS.earth}</svg>`;
}

function renderCategoryChips() {
  const strip = $('#category-strip');
  const all = document.createElement('button');
  all.className = 'cat-chip active';
  all.dataset.category = 'all';
  all.innerHTML = `${iconSvg('earth', 12)}<span>Wszystkie</span><b>${formatNumber(MATERIALS.length)}</b>`;
  strip.appendChild(all);
  for (const category of CATEGORIES) {
    const button = document.createElement('button');
    button.className = 'cat-chip';
    button.dataset.category = category.id;
    button.innerHTML = `${iconSvg(category.icon, 12)}<span>${category.short}</span><b>${category.count}</b>`;
    button.title = category.name;
    strip.appendChild(button);
  }
  strip.addEventListener('click', event => {
    const button = event.target.closest('.cat-chip');
    if (!button) return;
    app.filterCategory = button.dataset.category;
    $$('.cat-chip', strip).forEach(chip => chip.classList.toggle('active', chip === button));
    applyFilter();
  });
}

function applyFilter(resetScroll = true) {
  const query = normalize(app.query.trim());
  app.filtered = MATERIALS.filter(m => {
    if (app.filterCategory !== 'all' && m.category !== app.filterCategory) return false;
    if (!query) return true;
    if (normalize(m.name).includes(query)) return true;
    if (normalize(m.categoryName).includes(query)) return true;
    if (normalize(m.state).includes(query)) return true;
    return m.tags.some(tag => normalize(tag).includes(query));
  });
  const category = CATEGORIES.find(c => c.id === app.filterCategory);
  $('#filter-label').textContent = category ? category.name : 'Wszystkie materiały';
  $('#visible-count').textContent = formatNumber(app.filtered.length);
  if (resetScroll) $('#material-list').scrollTop = 0;
  renderVirtualList();
}

function gridColumns() {
  if (window.innerWidth <= 860) return 2;
  const width = $('#material-list').clientWidth || 276;
  return width >= 340 ? 2 : 1;
}

function renderVirtualList() {
  const list = $('#material-list');
  const space = $('#virtual-space');
  const grid = $('#material-grid');
  const cols = gridColumns();
  app.gridCols = cols;
  app.rowHeight = window.innerWidth <= 860 ? 67 : 71;
  const rowHeight = app.rowHeight;
  const totalRows = Math.ceil(app.filtered.length / cols);
  space.style.height = `${app.filtered.length ? Math.max(1, totalRows) * rowHeight : 220}px`;
  grid.style.setProperty('--cols', cols);
  const scrollTop = list.scrollTop;
  const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - 2);
  const endRow = Math.min(totalRows, startRow + Math.ceil(list.clientHeight / rowHeight) + 4);
  const start = startRow * cols;
  const end = Math.min(app.filtered.length, endRow * cols);
  grid.style.transform = `translateY(${startRow * rowHeight}px)`;
  const fragment = document.createDocumentFragment();
  for (let i = start; i < end; i++) {
    const material = app.filtered[i];
    const card = document.createElement('button');
    card.className = `material-card${material.id === app.selectedId ? ' active' : ''}`;
    card.dataset.id = material.id;
    card.title = `${material.name} — ${material.categoryName}`;
    const canvas = document.createElement('canvas');
    drawMaterialIcon(canvas, material, 38);
    const copy = document.createElement('span');
    copy.className = 'm-copy';
    const stateClass = normalize(material.state).replace(/\s+/g, '');
    copy.innerHTML = `<span class="m-name">${escapeHtml(material.name)}</span><span class="m-sub"><i class="m-state ${stateClass}"></i>${escapeHtml(material.state)}</span>`;
    card.append(canvas, copy);
    fragment.appendChild(card);
  }
  grid.replaceChildren(fragment);
  if (!app.filtered.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = '<b>Brak wyników</b><span>Spróbuj innej nazwy lub kategorii.</span>';
    grid.appendChild(empty);
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function selectMaterial(id, options = {}) {
  const material = MATERIALS[id - 1];
  if (!material) return;
  app.selectedId = id;
  app.sim.selected = id;
  $$('.material-card').forEach(card => card.classList.toggle('active', Number(card.dataset.id) === id));
  renderInspector(material);
  $('#inspector-foot-text').textContent = `Wybrano: ${material.name}`;
  if (options.silent !== true) toast(`Wybrano ${material.name}`);
  if (window.innerWidth <= 860 && options.closeSheet !== false) closeSheets();
}

function renderInspector(material) {
  drawMaterialIcon($('#selected-swatch'), material, 58);
  $('#selected-category').textContent = material.categoryName;
  $('#selected-name').textContent = material.name;
  $('#selected-state').textContent = material.state;
  $('#selected-id').textContent = `#${String(material.id).padStart(3, '0')}`;
  const densityNorm = Math.min(100, Math.log10(material.density * 1000 + 1) * 24);
  const condNorm = Math.min(100, Math.log10(material.conductivity + 1) * 32);
  const props = [
    ['Gęstość', formatDensity(material.density), densityNorm, 'g/cm³'],
    ['Twardość', `${material.hardness.toFixed(1)} / 10 Mohs`, material.hardness * 10, 'Mohs'],
    ['Przewodność', formatConductivity(material.conductivity), condNorm, 'W/mK'],
    ['Palność', `${Math.round(material.flammability)} / 100`, material.flammability, ''],
    ['Reaktywność', `${Math.round(material.reactivity)} / 100`, material.reactivity, ''],
    ['Radioaktywność', `${Math.round(material.radioactivity)} / 100`, material.radioactivity, ''],
  ];
  $('#property-grid').innerHTML = props.map(([label, value, percent, unit]) => `
    <div class="prop" title="${escapeHtml(value)}${unit ? ' ' + unit : ''}">
      <div class="prop-label"><span>${label}</span></div>
      <div class="prop-value">${escapeHtml(value)}</div>
      <div class="prop-bar"><i style="width:${clamp(percent, 1, 100)}%"></i></div>
    </div>
  `).join('');
  $('#behavior-text').textContent = material.behavior;
  const thermal = [
    ['Temperatura', formatTemp(material.temperature)],
    ['Topnienie', material.melt == null ? '—' : formatTemp(material.melt)],
    ['Wrzenie', material.boil == null ? '—' : formatTemp(material.boil)],
    ['Ciepło właściwe', formatHeat(material.heatCapacity)],
  ];
  $('#thermal-grid').innerHTML = thermal.map(([label, value]) => `
    <div class="thermal"><span>${label}</span><strong>${escapeHtml(value)}</strong></div>
  `).join('');
  $('#reaction-list').innerHTML = material.reactions.map((reaction, index) => `
    <div class="reaction">
      <span class="reaction-dot">${String(index + 1).padStart(2, '0')}</span>
      <div class="reaction-copy">
        <div class="reaction-with">${escapeHtml(reaction.with)} <span style="color:#5c6872">→</span> ${escapeHtml(reaction.effect)}</div>
        <div class="reaction-effect">Produkt: <b>${escapeHtml(reaction.result)}</b></div>
      </div>
    </div>
  `).join('');
  $('#tag-list').innerHTML = material.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('');
}

function clamp(value, lo, hi) { return Math.min(hi, Math.max(lo, value)); }

function setScene(sceneId) {
  const scene = SCENES[sceneId];
  if (!scene) return;
  app.sim.sceneName = sceneId;
  app.sim.reset(sceneId);
  $('#stage').dataset.scene = sceneId;
  $('#scene-button-label').textContent = scene.name;
  $('#experiment-name').textContent = scene.title;
  $('#scene-badge strong').textContent = scene.title;
  $$('.scene-option').forEach(option => option.classList.toggle('active', option.dataset.scene === sceneId));
  toast(`Scena: ${scene.name}`);
}

function setTool(tool) {
  if (!TOOL_LABELS[tool]) return;
  app.sim.tool = tool;
  $$('.tool').forEach(button => button.classList.toggle('active', button.dataset.tool === tool));
  $('#inspector-foot-text').textContent = `Narzędzie: ${TOOL_LABELS[tool]}`;
}

function toast(message) {
  const element = $('#toast');
  element.textContent = message;
  element.classList.add('show');
  clearTimeout(app.toastTimer);
  app.toastTimer = setTimeout(() => element.classList.remove('show'), 1900);
}

function openLibrary() {
  closeSheets();
  $('#app').classList.add('library-open');
  $('#search').focus({ preventScroll: true });
}
function openInspector() {
  closeSheets();
  $('#app').classList.add('inspector-open');
}
function closeSheets() {
  $('#app').classList.remove('library-open', 'inspector-open');
}

function updateSceneLabels() {
  const scene = SCENES[app.sim.sceneName] || SCENES.volcano;
  $('#stage').dataset.scene = app.sim.sceneName;
  $('#scene-button-label').textContent = scene.name;
  $('#experiment-name').textContent = scene.title;
  $('#scene-badge strong').textContent = scene.title;
}

function togglePause() {
  app.paused = !app.paused;
  $('#pause-button').classList.toggle('paused', app.paused);
  toast(app.paused ? 'Symulacja wstrzymana' : 'Symulacja wznowiona');
}

function cycleSpeed() {
  app.speed = app.speed === 1 ? 2 : app.speed === 2 ? 3 : 1;
  $('#speed-button').textContent = `${app.speed}×`;
  toast(`Prędkość symulacji: ${app.speed}×`);
}

function savePng() {
  const source = app.sim.canvas;
  const out = document.createElement('canvas');
  out.width = Math.round(app.sim.cssWidth * 2);
  out.height = Math.round(app.sim.cssHeight * 2);
  const ctx = out.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, out.height);
  gradient.addColorStop(0, '#0e171e');
  gradient.addColorStop(1, '#080d11');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(source, 0, 0, out.width, out.height);
  out.toBlob(blob => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sandbox-${app.sim.sceneName}-${Date.now()}.png`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    toast('Zapisano obraz PNG');
  }, 'image/png');
}

function updateHud(now) {
  if (now - app.lastHud < 180) return;
  app.lastHud = now;
  const stats = app.sim.stats;
  $('#particle-count').textContent = formatNumber(stats.particles);
  $('#reaction-readout').textContent = formatNumber(app.sim.totalReactions);
  const hover = app.lastHover;
  const hovered = hover ? app.sim.getCell(hover.x, hover.y) : null;
  const temp = hovered && hovered.material ? hovered.temp : stats.avgTemp;
  $('#temp-readout').textContent = formatTemp(temp);
  if (hovered && hovered.material) {
    $('#inspector-foot-text').textContent = `${hovered.material.name} · ${formatTemp(hovered.temp)}`;
  }
}

function animate(now) {
  const dt = Math.min(0.08, (now - app.lastFrame) / 1000);
  app.lastFrame = now;
  app.fpsFrames++;
  app.fpsTime += dt;
  if (app.fpsTime >= 0.5) {
    app.fps = Math.round(app.fpsFrames / app.fpsTime);
    app.fpsFrames = 0;
    app.fpsTime = 0;
  }
  if (!app.paused) {
    app.acc += dt * app.speed;
    let steps = 0;
    while (app.acc >= 1 / 30 && steps < 4) {
      app.sim.step();
      app.acc -= 1 / 30;
      steps++;
    }
    if (steps === 4) app.acc = 0;
  }
  app.sim.render();
  updateHud(now);
  requestAnimationFrame(animate);
}

function bindPointer() {
  const stage = $('#stage');
  const canvas = app.sim.canvas;
  const toCell = event => app.sim.pointerToCell(event.clientX, event.clientY);

  stage.addEventListener('pointerdown', event => {
    if (event.target.closest('.sim-controls, .tool-dock, .brush-control, .scene-badge')) return;
    event.preventDefault();
    app.painting = true;
    app.pointerId = event.pointerId;
    stage.setPointerCapture?.(event.pointerId);
    const cell = toCell(event);
    if (!cell) return;
    app.sim.hover = cell;
    app.lastHover = cell;
    if (app.sim.tool === 'line') {
      app.lineStart = cell;
      app.sim.paintAt(cell.x, cell.y);
    } else {
      app.sim.paintAt(cell.x, cell.y);
    }
  });

  stage.addEventListener('pointermove', event => {
    const cell = toCell(event);
    const previous = app.lastHover;
    app.sim.hover = cell;
    app.lastHover = cell;
    if (!app.painting) return;
    if (event.pointerId !== app.pointerId) return;
    event.preventDefault();
    if (app.sim.tool === 'line') {
      // The final line is committed on pointerup; the cursor shows the endpoint.
      return;
    }
    if (cell) {
      if (previous && (previous.x !== cell.x || previous.y !== cell.y)) {
        app.sim.paintLine(previous.x, previous.y, cell.x, cell.y);
      } else {
        app.sim.paintAt(cell.x, cell.y);
      }
    }
  });

  const finish = event => {
    if (app.sim.tool === 'line' && app.lineStart) {
      const cell = toCell(event);
      if (cell) app.sim.paintLine(app.lineStart.x, app.lineStart.y, cell.x, cell.y);
      app.lineStart = null;
    }
    app.painting = false;
    app.pointerId = null;
    if (event.pointerId != null) stage.releasePointerCapture?.(event.pointerId);
  };
  stage.addEventListener('pointerup', finish);
  stage.addEventListener('pointercancel', finish);
  stage.addEventListener('pointerleave', () => {
    app.sim.hover = null;
    app.lastHover = null;
  });
  canvas.addEventListener('contextmenu', event => event.preventDefault());
}

function bindUi() {
  $('#top-material-count').textContent = formatNumber(MATERIALS.length);
  $('#top-category-count').textContent = formatNumber(CATEGORIES.length);
  $('#library-count').textContent = formatNumber(MATERIALS.length);
  $('#visible-count').textContent = formatNumber(MATERIALS.length);

  $('#search').addEventListener('input', event => {
    app.query = event.target.value;
    $('#clear-search').hidden = !app.query;
    applyFilter();
  });
  $('#clear-search').addEventListener('click', () => {
    app.query = '';
    $('#search').value = '';
    $('#clear-search').hidden = true;
    applyFilter();
    $('#search').focus();
  });
  $('#material-list').addEventListener('scroll', () => {
    if (app.scrollFrame) return;
    app.scrollFrame = requestAnimationFrame(() => {
      app.scrollFrame = 0;
      renderVirtualList();
    });
  });
  $('#material-grid').addEventListener('click', event => {
    const card = event.target.closest('.material-card');
    if (!card) return;
    selectMaterial(Number(card.dataset.id));
  });

  $$('.tool').forEach(button => button.addEventListener('click', () => setTool(button.dataset.tool)));
  $('#brush-size').addEventListener('input', event => {
    const value = Number(event.target.value);
    app.sim.brush = value;
    $('#brush-value').textContent = value;
  });

  $('#pause-button').addEventListener('click', togglePause);
  $('#speed-button').addEventListener('click', cycleSpeed);
  $('#reset-button').addEventListener('click', () => {
    app.sim.reset(app.sim.sceneName);
    toast('Scena odtworzona');
  });
  $('#clear-button').addEventListener('click', () => {
    app.sim.clear();
    toast('Plansza wyczyszczona');
  });
  $('#save-button').addEventListener('click', savePng);

  $('#scene-menu-button').addEventListener('click', event => {
    event.stopPropagation();
    const menu = $('#scene-menu');
    const open = !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    $('#scene-menu-button').setAttribute('aria-expanded', String(open));
  });
  $('#scene-menu').addEventListener('click', event => {
    const option = event.target.closest('.scene-option');
    if (!option) return;
    setScene(option.dataset.scene);
    $('#scene-menu').classList.remove('open');
    $('#scene-menu-button').setAttribute('aria-expanded', 'false');
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('#scene-menu, #scene-menu-button')) {
      $('#scene-menu').classList.remove('open');
      $('#scene-menu-button').setAttribute('aria-expanded', 'false');
    }
  });

  $('#help-button').addEventListener('click', () => { $('#help-modal').hidden = false; });
  $('#help-close').addEventListener('click', () => { $('#help-modal').hidden = true; });
  $('#help-modal').addEventListener('click', event => {
    if (event.target === $('#help-modal')) $('#help-modal').hidden = true;
  });

  $('#mobile-library-button').addEventListener('click', openLibrary);
  $('#mobile-inspector-button').addEventListener('click', openInspector);
  $('#library-close').addEventListener('click', closeSheets);
  $('#inspector-close').addEventListener('click', closeSheets);
  $('#sheet-backdrop').addEventListener('click', closeSheets);

  document.addEventListener('keydown', event => {
    if (event.target.matches('input, textarea, select')) return;
    const key = event.key.toLowerCase();
    const toolKeys = { b: 'brush', e: 'eraser', l: 'line', h: 'heat', c: 'cool', k: 'spark', v: 'vacuum' };
    if (toolKeys[key]) { setTool(toolKeys[key]); return; }
    if (event.code === 'Space') { event.preventDefault(); togglePause(); return; }
    if (key === 'r') { app.sim.reset(app.sim.sceneName); toast('Scena odtworzona'); return; }
    if (event.key === 'Escape') {
      $('#help-modal').hidden = true;
      $('#scene-menu').classList.remove('open');
      closeSheets();
    }
  });

  window.addEventListener('resize', () => {
    clearTimeout(app.resizeTimer);
    app.resizeTimer = setTimeout(() => {
      app.sim.resize();
      renderVirtualList();
    }, 120);
  });
}

function init() {
  app.sim = new SandSim($('#sim-canvas'));
  app.sim.selected = app.selectedId;
  app.sim.render();
  renderCategoryChips();
  applyFilter();
  selectMaterial(app.selectedId, { silent: true, closeSheet: false });
  updateSceneLabels();
  bindUi();
  bindPointer();
  requestAnimationFrame(animate);

  // Expose a small diagnostics API for automated checks and curious players.
  window.SandBox = {
    app,
    materials: MATERIALS,
    categories: CATEGORIES,
    selectMaterial,
    setScene,
    get count() { return MATERIALS.length; },
  };
}

init();

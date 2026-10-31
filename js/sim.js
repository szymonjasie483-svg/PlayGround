/* SANDLAB simulation core.
   Typed-array cellular automaton with heat diffusion, phase changes,
   fluid/powder movement and tag-driven chemistry. */

import { getDef, findByName, findFirst, onMaterialsChanged } from './data.js';

const EMPTY = 0;
const AMBIENT = 20;
const FLUID_STATES = new Set(['liquid', 'gas', 'plasma', 'fire', 'energy', 'foam', 'gel', 'paste']);
const RESISTANT_TAGS = new Set(['glass', 'ceramic', 'noble', 'gold', 'platinum', 'fluoropolymer', 'ptfe', 'acid_resistant']);

function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }
function lower(s) { return (s || '').toLowerCase(); }

function hexToRgb(hex) {
  const h = (hex || '#888888').replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export class SandEngine {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.onReaction = options.onReaction || (() => {});
    this.onState = options.onState || (() => {});
    this.cols = 0;
    this.rows = 0;
    this.cells = null;
    this.variant = null;
    this.temps = null;
    this.aux = null;
    this.dir = null;
    this.moved = null;
    this.frame = 0;
    this.running = true;
    this.overlay = false;
    this.selectedId = 0;
    this.tool = 'draw';
    this.brush = 8;
    this.pointer = { x: -1, y: -1, inside: false };
    this.reactions = [];
    this.reactionMap = new Map();
    this._specials = null;
    this._specialsDirty = true;
    this._explosions = 0;
    this._hotPoints = [];
    this._cellPx = 4;
    this._off = document.createElement('canvas');
    this._offCtx = this._off.getContext('2d');
    this._imageData = null;
    this._lastPaint = null;
    this._heatFrame = 0;
    this._fps = 60;
    this._fpsTime = performance.now();
    this._fpsFrames = 0;
    this._onDefsChanged = onMaterialsChanged(() => { this._specialsDirty = true; });
  }

  destroy() {
    if (this._onDefsChanged) this._onDefsChanged();
  }

  /* ---------------------------------------------------------- grid */

  resize(cols, rows) {
    cols = Math.max(24, cols | 0);
    rows = Math.max(24, rows | 0);
    if (cols === this.cols && rows === this.rows) return;
    const old = {
      cols: this.cols,
      rows: this.rows,
      cells: this.cells,
      variant: this.variant,
      temps: this.temps,
      aux: this.aux,
      dir: this.dir,
    };

    const n = cols * rows;
    this.cols = cols;
    this.rows = rows;
    this.cells = new Uint16Array(n);
    this.variant = new Uint8Array(n);
    this.temps = new Float32Array(n).fill(AMBIENT);
    this.aux = new Float32Array(n);
    this.dir = new Int8Array(n);
    this.moved = new Uint8Array(n);

    if (old.cells && old.cols > 0 && old.rows > 0) {
      const dx = Math.floor((cols - old.cols) / 2);
      const dy = rows - old.rows;
      for (let y = 0; y < old.rows; y++) {
        const ny = y + dy;
        if (ny < 0 || ny >= rows) continue;
        for (let x = 0; x < old.cols; x++) {
          const nx = x + dx;
          if (nx < 0 || nx >= cols) continue;
          const oi = y * old.cols + x;
          if (!old.cells[oi]) continue;
          const ni = ny * cols + nx;
          this.cells[ni] = old.cells[oi];
          this.variant[ni] = old.variant[oi];
          this.temps[ni] = old.temps[oi];
          this.aux[ni] = old.aux[oi];
          this.dir[ni] = old.dir[oi];
        }
      }
    }

    this._off.width = cols;
    this._off.height = rows;
    this._imageData = this._offCtx.createImageData(cols, rows);
    this.canvas.width = cols * this._cellPx;
    this.canvas.height = rows * this._cellPx;
    this.ctx.imageSmoothingEnabled = false;
  }

  idx(x, y) { return y * this.cols + x; }

  inBounds(x, y) { return x >= 0 && y >= 0 && x < this.cols && y < this.rows; }

  clear() {
    this.cells.fill(EMPTY);
    this.variant.fill(0);
    this.aux.fill(0);
    this.temps.fill(AMBIENT);
    this.dir.fill(0);
    this.reactions = [];
    this.reactionMap.clear();
    this._specialsDirty = true;
    this.onState('clear');
  }

  /* ---------------------------------------------------------- specials */

  refreshSpecials() {
    const byName = (names) => findByName(names);
    const byTag = (tag) => findFirst((d) => d.tags && d.tags.includes(tag));
    const s = {};

    s.fire = byName(['Płomień drewna', 'Płomień świecy', 'Płomień gazu']) || findFirst((d) => d.state === 'fire');
    s.water = byName(['Woda']) || findFirst((d) => d.tags && d.tags.includes('water') && d.state === 'liquid');
    s.ice = byName(['Lód']) || findFirst((d) => d.tags && d.tags.includes('ice') && d.state === 'solid');
    s.steam = byName(['Para wodna']) || findFirst((d) => d.tags && d.tags.includes('steam'));
    s.smoke = byName(['Dym']) || s.steam;
    s.ash = byName(['Popiół']) || byTag('ash');
    s.stone = byName(['Bazalt', 'Granit']) || byTag('stone');
    s.saltwater = byName(['Woda morska', 'Solanka']);
    s.salt = byName(['Sól kamienna', 'Sól drogowa']) || byTag('salt');
    s.concrete = byName(['Beton']) || byTag('concrete');
    s.hydrogen = byName(['Wodór']);
    s.oxygen = byName(['Tlen']);
    s.plasma = byName(['Plazma']) || findFirst((d) => d.state === 'plasma');
    s.energy = findFirst((d) => d.state === 'energy');
    s.acid = byName(['Kwas siarkowy', 'Kwas chlorowodorowy']) || byTag('acid');
    s.smokeGas = byName(['Dym', 'Dwutlenek węgla']) || s.steam;
    s.rust = byName(['Rdza', 'Tlenek żelaza']);

    this._specials = s;
    this._specialsDirty = false;
    return s;
  }

  specials() {
    if (this._specialsDirty || !this._specials) return this.refreshSpecials();
    return this._specials;
  }

  /* ---------------------------------------------------------- painting */

  setCell(x, y, id, opts = {}) {
    if (!this.inBounds(x, y)) return;
    const i = this.idx(x, y);
    const d = getDef(id);
    if (!d) return;
    this.cells[i] = id;
    this.variant[i] = (Math.random() * 4) | 0;
    this.temps[i] = opts.temp != null ? opts.temp : (d.temperature != null ? d.temperature : AMBIENT);
    this.dir[i] = Math.random() < 0.5 ? -1 : 1;
    if (d.state === 'fire') this.aux[i] = 70 + Math.random() * 90;
    else if (d.state === 'energy') this.aux[i] = 24 + Math.random() * 30;
    else if (d.state === 'plasma') this.aux[i] = 50 + Math.random() * 60;
    else if (d.state === 'plant' || d.movement === 'grow') this.aux[i] = 4 + Math.random() * 8;
    else this.aux[i] = 0;
    this.moved[i] = 1;
  }

  paint(x, y, radius, tool = this.tool, id = this.selectedId) {
    if (!this.inBounds(x, y)) return;
    const r = Math.max(0.5, radius);
    const r2 = r * r;
    const rr = Math.ceil(r);
    for (let dy = -rr; dy <= rr; dy++) {
      for (let dx = -rr; dx <= rr; dx++) {
        if (dx * dx + dy * dy > r2) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (!this.inBounds(nx, ny)) continue;
        const i = this.idx(nx, ny);
        if (tool === 'erase') {
          this.cells[i] = EMPTY;
          this.variant[i] = 0;
          this.aux[i] = 0;
          this.temps[i] = AMBIENT;
          continue;
        }
        if (tool === 'heat') {
          this.temps[i] = Math.min(6000, this.temps[i] + 55);
          continue;
        }
        if (tool === 'cool') {
          this.temps[i] = Math.max(-250, this.temps[i] - 55);
          continue;
        }
        if (id) this.setCell(nx, ny, id);
      }
    }
    this._lastPaint = { x, y, tool, id };
  }

  paintLine(x0, y0, x1, y1, radius, tool = this.tool, id = this.selectedId) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / Math.max(1, radius * 0.45)));
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      this.paint(Math.round(x0 + dx * t), Math.round(y0 + dy * t), radius, tool, id);
    }
  }

  /* ---------------------------------------------------------- update */

  step() {
    if (!this.cells) return;
    this.frame++;
    this.moved.fill(0);
    this._explosions = 0;

    if (this.frame % 2 === 0) this.conductHeat();

    const bottomUp = this.frame % 2 === 0;
    for (let yy = 0; yy < this.rows; yy++) {
      const y = bottomUp ? this.rows - 1 - yy : yy;
      const leftToRight = (this.frame + y) % 2 === 0;
      for (let xx = 0; xx < this.cols; xx++) {
        const x = leftToRight ? xx : this.cols - 1 - xx;
        const i = y * this.cols + x;
        if (!this.cells[i] || this.moved[i]) continue;
        this.updateCell(x, y, i);
      }
    }

    this._fpsFrames++;
    const now = performance.now();
    if (now - this._fpsTime > 600) {
      this._fps = Math.round((this._fpsFrames * 1000) / (now - this._fpsTime));
      this._fpsFrames = 0;
      this._fpsTime = now;
    }
  }

  updateCell(x, y, i) {
    const id = this.cells[i];
    const d = getDef(id);
    if (!d) return;
    let temp = this.temps[i];

    // fire / energy decay
    if (d.state === 'fire' || d.state === 'energy' || d.state === 'plasma') {
      this.aux[i] -= 1;
      if (d.state === 'fire') this.temps[i] = Math.max(temp, 520 + Math.min(400, this.aux[i]));
      if (this.aux[i] <= 0) {
        this.finishTransient(x, y, i, d);
        return;
      }
    }

    if ((this.frame + i) % 3 === 0) {
      this.chemistry(x, y, i, d);
      if (this.cells[i] !== id) return; // transformed
    }

    // ambient relaxation
    const relaxed = d.state === 'gas' ? 0.0012 : d.state === 'fire' || d.state === 'plasma' ? 0.0005 : 0.0004;
    this.temps[i] += (AMBIENT - this.temps[i]) * relaxed;

    this.move(x, y, i, d);
  }

  finishTransient(x, y, i, d) {
    const s = this.specials();
    if (d.state === 'fire') {
      if (Math.random() < 0.22 && s.ash) {
        this.setCell(x, y, s.ash.id, { temp: Math.max(80, this.temps[i] * 0.5) });
      } else {
        this.cells[i] = EMPTY;
        this.temps[i] = AMBIENT;
      }
    } else {
      this.cells[i] = EMPTY;
      this.temps[i] = AMBIENT;
    }
  }

  conductHeat() {
    const { cols, rows, cells, temps } = this;
    this._heatFrame++;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        const a = getDef(cells[i]);
        const ta = temps[i];
        // right
        if (x + 1 < cols) {
          const j = i + 1;
          const b = getDef(cells[j]);
          this.exchange(i, j, a, b, ta, temps[j]);
        }
        // down
        if (y + 1 < rows) {
          const j = i + cols;
          const b = getDef(cells[j]);
          this.exchange(i, j, a, b, ta, temps[j]);
        }
      }
    }
    // ambient drift for empty air
    for (let i = 0; i < cells.length; i++) {
      if (!cells[i]) temps[i] += (AMBIENT - temps[i]) * 0.02;
    }
  }

  exchange(i, j, a, b, ta, tb) {
    const ca = a ? clamp((a.thermalConductivity || 0.02) * 0.75, 0.008, 0.42) : 0.11;
    const cb = b ? clamp((b.thermalConductivity || 0.02) * 0.75, 0.008, 0.42) : 0.11;
    const ha = a ? clamp(a.specificHeat || 1, 0.2, 4) : 1.6;
    const hb = b ? clamp(b.specificHeat || 1, 0.2, 4) : 1.6;
    const k = Math.min(0.24, ((ca + cb) * 0.5) / ((ha + hb) * 0.5));
    const flow = (tb - ta) * k * 0.5;
    this.temps[i] = clamp(ta + flow / ha, -273, 120000);
    this.temps[j] = clamp(tb - flow / hb, -273, 120000);
  }

  /* ---------------------------------------------------------- movement */

  canDisplace(i, d, mode) {
    const tid = this.cells[i];
    if (!tid) return true;
    const t = getDef(tid);
    if (!t) return false;
    if (!FLUID_STATES.has(t.state)) return false;
    if (mode === 'fall') return (t.density || 0) < (d.density || 0) * 0.98;
    if (mode === 'rise') return (t.density || 0) > (d.density || 0) * 1.02;
    return (t.density || 0) < (d.density || 0) * 0.98;
  }

  swapCells(a, b) {
    const c = this.cells[a]; this.cells[a] = this.cells[b]; this.cells[b] = c;
    const v = this.variant[a]; this.variant[a] = this.variant[b]; this.variant[b] = v;
    const t = this.temps[a]; this.temps[a] = this.temps[b]; this.temps[b] = t;
    const u = this.aux[a]; this.aux[a] = this.aux[b]; this.aux[b] = u;
    const dr = this.dir[a]; this.dir[a] = this.dir[b]; this.dir[b] = dr;
    this.moved[a] = 1;
    this.moved[b] = 1;
  }

  moveTo(from, to) {
    if (this.cells[to]) this.swapCells(from, to);
    else {
      this.cells[to] = this.cells[from];
      this.variant[to] = this.variant[from];
      this.temps[to] = this.temps[from];
      this.aux[to] = this.aux[from];
      this.dir[to] = this.dir[from];
      this.cells[from] = EMPTY;
      this.variant[from] = 0;
      this.aux[from] = 0;
      this.temps[from] = AMBIENT;
      this.moved[to] = 1;
    }
  }

  move(x, y, i, d) {
    const { cols, rows } = this;
    const m = d.movement || 'static';

    if (m === 'fall') {
      const below = i + cols;
      if (y + 1 < rows && this.canDisplace(below, d, 'fall')) { this.moveTo(i, below); return; }
      const dirs = Math.random() < 0.5 ? [-1, 1] : [1, -1];
      for (const dx of dirs) {
        const nx = x + dx;
        if (nx < 0 || nx >= cols || y + 1 >= rows) continue;
        const j = (y + 1) * cols + nx;
        if (this.canDisplace(j, d, 'fall')) { this.moveTo(i, j); return; }
      }
      // powders form piles: occasional sideways slide
      if (Math.random() < 0.12) {
        const nx = x + (Math.random() < 0.5 ? -1 : 1);
        if (nx >= 0 && nx < cols) {
          const j = y * cols + nx;
          if (!this.cells[j]) { this.moveTo(i, j); return; }
        }
      }
      return;
    }

    if (m === 'flow') {
      const below = i + cols;
      if (y + 1 < rows && this.canDisplace(below, d, 'fall')) { this.moveTo(i, below); return; }
      const dirs = Math.random() < 0.5 ? [-1, 1] : [1, -1];
      for (const dx of dirs) {
        const nx = x + dx;
        if (nx < 0 || nx >= cols || y + 1 >= rows) continue;
        const j = (y + 1) * cols + nx;
        if (this.canDisplace(j, d, 'fall')) { this.moveTo(i, j); return; }
      }
      const viscous = d.tags && (d.tags.includes('viscous') || d.tags.includes('tar'));
      if (viscous && Math.random() < 0.55) return;
      const pref = this.dir[i] || 1;
      for (const dx of [pref, -pref]) {
        const nx = x + dx;
        if (nx < 0 || nx >= cols) continue;
        const j = y * cols + nx;
        if (this.canDisplace(j, d, 'flow')) {
          if (Math.random() < 0.82) { this.moveTo(i, j); return; }
        }
      }
      if (Math.random() < 0.2) this.dir[i] = -pref;
      return;
    }

    if (m === 'rise') {
      const above = i - cols;
      if (y > 0 && this.canDisplace(above, d, 'rise')) { this.moveTo(i, above); return; }
      const dirs = Math.random() < 0.5 ? [-1, 1] : [1, -1];
      for (const dx of dirs) {
        const nx = x + dx;
        if (nx < 0 || nx >= cols || y <= 0) continue;
        const j = (y - 1) * cols + nx;
        if (this.canDisplace(j, d, 'rise')) { this.moveTo(i, j); return; }
      }
      if (Math.random() < 0.35) {
        const nx = x + (Math.random() < 0.5 ? -1 : 1);
        if (nx >= 0 && nx < cols) {
          const j = y * cols + nx;
          if (!this.cells[j]) { this.moveTo(i, j); return; }
        }
      }
      return;
    }

    if (m === 'drift') {
      const dx = Math.random() < 0.5 ? -1 : 1;
      const nx = x + dx;
      if (nx >= 0 && nx < cols) {
        const j = y * cols + nx;
        if (!this.cells[j]) { this.moveTo(i, j); return; }
      }
      if (Math.random() < 0.3 && y > 0) {
        const j = i - cols;
        if (!this.cells[j]) this.moveTo(i, j);
      }
      return;
    }

    if (m === 'grow') {
      if (Math.random() > 0.004 || this.aux[i] <= 0) return;
      const dirs = [[0, -1], [-1, 0], [1, 0], [-1, -1], [1, -1], [0, 1]];
      const [dx, dy] = pick(dirs);
      const nx = x + dx;
      const ny = y + dy;
      if (!this.inBounds(nx, ny)) return;
      const j = ny * cols + nx;
      if (!this.cells[j] && Math.random() < 0.55) {
        this.cells[j] = this.cells[i];
        this.variant[j] = (Math.random() * 4) | 0;
        this.temps[j] = this.temps[i];
        this.aux[j] = Math.max(0, this.aux[i] - 1);
        this.aux[i] = Math.max(0, this.aux[i] - 1);
        this.moved[j] = 1;
      }
      return;
    }

    if (m === 'crawl') {
      if (Math.random() > 0.28) return;
      const dirs = [[-1, 0], [1, 0], [-1, -1], [1, -1], [0, -1]];
      const [dx, dy] = pick(dirs);
      const nx = x + dx;
      const ny = y + dy;
      if (!this.inBounds(nx, ny)) return;
      const j = ny * cols + nx;
      if (!this.cells[j]) { this.moveTo(i, j); return; }
      const t = getDef(this.cells[j]);
      if (t && (t.state === 'gas' || t.state === 'liquid')) { this.swapCells(i, j); }
      return;
    }

    // static / paste / gel / foam: gel and foam creep slowly
    if (d.state === 'gel' || d.state === 'foam' || d.state === 'paste') {
      if (Math.random() > 0.08) return;
      const below = i + cols;
      if (y + 1 < rows && !this.cells[below]) { this.moveTo(i, below); return; }
      const nx = x + (Math.random() < 0.5 ? -1 : 1);
      if (nx >= 0 && nx < cols) {
        const j = y * cols + nx;
        if (!this.cells[j]) this.moveTo(i, j);
      }
    }
  }

  /* ---------------------------------------------------------- chemistry */

  chemistry(x, y, i, d) {
    const s = this.specials();
    const tags = d.tags || [];
    const temp = this.temps[i];
    const has = (tag) => tags.includes(tag);

    // ---- phase changes -------------------------------------------------
    if (has('ice') || has('frost') || has('snow') || has('precipitation')) {
      if (temp > 0.5) {
        const target = s.water;
        if (target) {
          this.setCell(x, y, target.id, { temp: Math.max(1, temp) });
          this.record('topnienie', 'Topnienie lodu', `${d.name} zmienia się w wodę powyżej 0°C.`);
          return;
        }
      }
    }
    if (has('water') && d.state === 'liquid') {
      if (d.boiling != null && temp >= d.boiling && s.steam) {
        this.setCell(x, y, s.steam.id, { temp: temp });
        this.record('wrzenie', 'Wrzenie wody', `${d.name} odparowuje w ${Math.round(d.boiling)}°C.`);
        return;
      }
      if (d.melting != null && temp <= 0.5 && s.ice && d.name === 'Woda') {
        this.setCell(x, y, s.ice.id, { temp: temp });
        this.record('zamrazanie', 'Zamrażanie wody', 'Woda krzepnie poniżej 0°C.');
        return;
      }
    }
    if ((has('steam') || /^Para\b/i.test(d.name)) && temp < 100 && s.water) {
      if (Math.random() < 0.04) {
        this.setCell(x, y, s.water.id, { temp: temp });
        this.record('kondensacja', 'Kondensacja pary', 'Para wodna skrapla się poniżej 100°C.');
        return;
      }
    }
    if ((has('lava') || has('magma')) && d.state === 'liquid') {
      if (d.melting != null && temp < d.melting) {
        const target = s.stone;
        if (target) {
          this.setCell(x, y, target.id, { temp: temp });
          this.record('krzepniecie-lawy', 'Krzepnięcie lawy', `${d.name} zastyga w skałę.`);
          return;
        }
      }
    }
    if (has('molten') && d.state === 'liquid' && d.melting != null && temp < d.melting) {
      const baseName = d.name.replace(/^Stopion\w*\s+/i, '');
      const target = findByName([baseName, baseName.charAt(0).toUpperCase() + baseName.slice(1)]);
      if (target) {
        this.setCell(x, y, target.id, { temp: temp });
        this.record('krzepniecie-metalu', 'Krzepnięcie metalu', `${d.name} przechodzi w stan stały.`);
        return;
      }
    }

    // ---- combustion ----------------------------------------------------
    if (d.state === 'fire') {
      this.temps[i] = Math.max(this.temps[i], 600);
      for (const [nx, ny] of this.neighbors(x, y)) {
        const j = ny * this.cols + nx;
        const t = getDef(this.cells[j]);
        if (!t) continue;
        const tt = t.tags || [];
        if (tt.includes('water') || t.name === 'Woda') {
          this.cells[i] = EMPTY;
          this.temps[i] = AMBIENT;
          if (s.steam && Math.random() < 0.55) this.setCell(x, y, s.steam.id, { temp: 130 });
          this.temps[j] = Math.min(this.temps[j] + 35, 150);
          this.record('gaszenie', 'Woda gasi ogień', 'Woda odbiera ciepło i odcina tlen.');
          return;
        }
        if (tt.includes('ice') || tt.includes('snow') || tt.includes('frost')) {
          if (s.water) this.setCell(nx, ny, s.water.id, { temp: 2 });
          continue;
        }
        if ((t.flammable || 0) > 0.1) {
          const ignition = t.ignition != null ? t.ignition : 300;
          if (this.temps[j] >= ignition || Math.random() < 0.14) {
            this.ignite(nx, ny, j, t);
            continue;
          }
        }
        if (tt.includes('explosive') || tt.includes('incendiary')) {
          if (Math.random() < 0.08) this.explode(nx, ny, 3);
        }
        if (tt.includes('fuel') && Math.random() < 0.08) this.ignite(nx, ny, j, t);
        this.temps[j] = Math.min(12000, this.temps[j] + 9);
      }
      return;
    }

    if ((d.flammable || 0) > 0.1 && d.ignition != null && temp >= d.ignition) {
      if (has('explosive')) { this.explode(x, y, 4); return; }
      this.ignite(x, y, i, d);
      return;
    }
    if ((has('explosive') || has('incendiary')) && d.ignition != null && temp >= d.ignition) {
      this.explode(x, y, 4);
      return;
    }

    // ---- water / lava / salts -----------------------------------------
    if (has('water') || d.name === 'Woda') {
      for (const [nx, ny] of this.neighbors(x, y)) {
        const j = ny * this.cols + nx;
        const t = getDef(this.cells[j]);
        if (!t) continue;
        const tt = t.tags || [];
        if (tt.includes('lava') || tt.includes('magma')) {
          if (s.stone) this.setCell(nx, ny, s.stone.id, { temp: 300 });
          this.setCell(x, y, s.steam.id || this.cells[i], { temp: 220 });
          this.record('para-lawowa', 'Lawa + woda', 'Woda natychmiast paruje, a lawa zastyga w skałę.');
          return;
        }
        if (tt.includes('cement') || tt.includes('hydraulic') || tt.includes('binder')) {
          if (Math.random() < 0.03 && s.concrete) {
            this.setCell(nx, ny, s.concrete.id, { temp: this.temps[j] + 8 });
            this.record('betonowanie', 'Wiązanie cementu', 'Cement z wodą tworzy twardy beton.');
            continue;
          }
        }
        if (tt.includes('salt') && Math.random() < 0.02 && s.saltwater) {
          this.setCell(x, y, s.saltwater.id, { temp: temp });
          this.record('solanka', 'Powstanie solanki', 'Sól rozpuszcza się w wodzie.');
          return;
        }
        if (tt.includes('acid') && Math.random() < 0.02) {
          this.temps[i] += 18;
        }
      }
      return;
    }

    // ---- acid corrosion ------------------------------------------------
    if (has('acid') || has('corrosive')) {
      const [nx, ny] = pick(this.neighbors(x, y));
      const j = ny * this.cols + nx;
      const t = getDef(this.cells[j]);
      if (t) {
        const tt = t.tags || [];
        const resistant = tt.some((tag) => RESISTANT_TAGS.has(tag)) || t.state === 'gas' || t.state === 'plasma' || t.state === 'energy';
        if (!resistant && !tt.includes('acid') && Math.random() < 0.06) {
          if (Math.random() < 0.4 && s.smokeGas) {
            this.setCell(nx, ny, s.smokeGas.id, { temp: 90 });
          } else {
            this.cells[j] = EMPTY;
            this.temps[j] = AMBIENT;
          }
          this.temps[i] = Math.min(400, this.temps[i] + 12);
          this.record('korozja', 'Korozja kwasowa', `${d.name} rozpuszcza ${t.name}.`);
          return;
        }
      }
    }

    // ---- base + acid ---------------------------------------------------
    if (has('base') || has('alkaline')) {
      for (const [nx, ny] of this.neighbors(x, y)) {
        const j = ny * this.cols + nx;
        const t = getDef(this.cells[j]);
        if (t && (t.tags || []).includes('acid') && Math.random() < 0.08) {
          if (s.water) this.setCell(nx, ny, s.water.id, { temp: temp + 15 });
          this.temps[i] = Math.min(200, this.temps[i] + 30);
          this.record('neutralizacja', 'Neutralizacja kwasu', 'Zasada i kwas tworzą sól oraz wodę.');
          return;
        }
      }
    }

    // ---- ice + salt ----------------------------------------------------
    if (has('salt')) {
      for (const [nx, ny] of this.neighbors(x, y)) {
        const j = ny * this.cols + nx;
        const t = getDef(this.cells[j]);
        if (t && (t.tags || []).includes('ice') && s.water) {
          this.setCell(nx, ny, s.water.id, { temp: -2 });
          this.record('solenie', 'Sól obniża temperaturę topnienia', 'Lód topi się pod wpływem soli.');
          return;
        }
      }
    }

    // ---- plant growth --------------------------------------------------
    if (d.state === 'plant' || has('plant')) {
      if (temp > (d.ignition || 240)) { this.ignite(x, y, i, d); return; }
      if (this.aux[i] > 0 && Math.random() < 0.003) {
        const [nx, ny] = pick(this.neighbors(x, y));
        const j = ny * this.cols + nx;
        if (!this.cells[j]) {
          // grow only where there is support below or a dense plant edge
          const below = ny + 1 < this.rows ? this.cells[(ny + 1) * this.cols + nx] : 0;
          let same = 0;
          for (const [sx, sy] of this.neighbors(nx, ny)) {
            if (this.cells[sy * this.cols + sx] === this.cells[i]) same++;
          }
          if (!below && same < 2) return;
          this.cells[j] = this.cells[i];
          this.variant[j] = (Math.random() * 4) | 0;
          this.temps[j] = temp;
          this.aux[j] = Math.max(0, this.aux[i] - 1);
          this.aux[i] = Math.max(0, this.aux[i] - 1);
          this.moved[j] = 1;
          if (Math.random() < 0.06) this.record('wzrost', 'Wzrost roślin', `${d.name} rozrasta się w sprzyjających warunkach.`);
        } else {
          const t = getDef(this.cells[j]);
          if (t && (t.tags || []).includes('water') && Math.random() < 0.2) {
            this.cells[j] = this.cells[i];
            this.variant[j] = (Math.random() * 4) | 0;
            this.aux[j] = Math.max(0, this.aux[i] - 1);
            this.aux[i] = Math.max(0, this.aux[i] - 1);
            this.record('wzrost', 'Wzrost roślin', `${d.name} pobiera wodę i rośnie.`);
          }
        }
      }
      return;
    }

    // ---- organisms -----------------------------------------------------
    if (d.state === 'organism' || has('animal') || has('bacteria') || has('virus')) {
      if (temp > 90) {
        if (Math.random() < 0.2) {
          if (s.ash) this.setCell(x, y, s.ash.id, { temp: temp });
          this.record('spopielenie', 'Wysoka temperatura niszczy organizm', `${d.name} obumiera.`);
          return;
        }
      }
      if (has('pathogen') && Math.random() < 0.002 && s.smokeGas) {
        const [nx, ny] = pick(this.neighbors(x, y));
        this.record('patogen', 'Rozprzestrzenianie patogenu', `${d.name} zakaża sąsiedztwo.`);
        if (!this.cells[ny * this.cols + nx]) this.setCell(nx, ny, this.cells[i], { temp });
      }
    }

    // ---- radiation -----------------------------------------------------
    if ((d.radioactivity || 0) > 0.12) {
      let mutated = false;
      for (const [nx, ny] of this.neighbors(x, y)) {
        const j = ny * this.cols + nx;
        this.temps[j] = Math.min(2000, this.temps[j] + 1.6);
        const t = getDef(this.cells[j]);
        if (t && (t.state === 'organism' || (t.tags || []).includes('plant')) && Math.random() < 0.003) {
          if (s.ash) this.setCell(nx, ny, s.ash.id, { temp: this.temps[j] });
          mutated = true;
        }
      }
      if (mutated) this.record('promieniowanie', 'Promieniowanie jonizujące', `${d.name} uszkadza organizmy i podnosi temperaturę.`);
      if (Math.random() < 0.0008 && s.energy) {
        const [nx, ny] = pick(this.neighbors(x, y));
        if (!this.cells[ny * this.cols + nx]) this.setCell(nx, ny, s.energy.id, { temp });
      }
      return;
    }

    // ---- electricity / plasma -----------------------------------------
    if (d.state === 'energy' || d.state === 'plasma' || has('electric') || has('charged')) {
      for (const [nx, ny] of this.neighbors(x, y)) {
        const j = ny * this.cols + nx;
        const t = getDef(this.cells[j]);
        if (!t) continue;
        if ((t.conductivity || 0) > 0.3) {
          this.temps[j] = Math.min(12000, this.temps[j] + 18);
          if ((t.flammable || 0) > 0.2 && Math.random() < 0.02) this.ignite(nx, ny, j, t);
        }
      }
      this.record('prad', 'Przewodzenie prądu', 'Energia elektryczna podgrzewa przewodniki.');
      return;
    }

    // ---- antimatter ----------------------------------------------------
    if (has('antimatter')) {
      this.explode(x, y, 5);
      return;
    }

    // ---- oxidizers -----------------------------------------------------
    if (has('oxidizer') && Math.random() < 0.03) {
      for (const [nx, ny] of this.neighbors(x, y)) {
        const j = ny * this.cols + nx;
        const t = getDef(this.cells[j]);
        if (!t) continue;
        if (t.state === 'fire') {
          this.temps[j] = Math.min(16000, this.temps[j] + 25);
          this.record('utlenianie', 'Utlenianie', `${d.name} podtrzymuje spalanie.`);
          return;
        }
        if ((t.flammable || 0) > 0.25 && t.ignition != null && this.temps[j] >= t.ignition) {
          this.ignite(nx, ny, j, t);
          this.record('utlenianie', 'Utlenianie', `${d.name} przyspiesza spalanie ${t.name}.`);
          return;
        }
      }
    }
  }

  neighbors(x, y) {
    const out = [];
    if (x > 0) out.push([x - 1, y]);
    if (x + 1 < this.cols) out.push([x + 1, y]);
    if (y > 0) out.push([x, y - 1]);
    if (y + 1 < this.rows) out.push([x, y + 1]);
    return out;
  }

  ignite(x, y, i, d) {
    const s = this.specials();
    if (!s.fire) return;
    const tags = d.tags || [];
    if (tags.includes('explosive')) { this.explode(x, y, 4); return; }
    this.setCell(x, y, s.fire.id, { temp: Math.max(650, this.temps[i]) });
    this.record('spalanie', 'Spalanie', `${d.name} zapala się i uwalnia ciepło.`);
  }

  explode(x, y, radius) {
    if (this._explosions > 6) return;
    this._explosions++;
    const s = this.specials();
    const r2 = radius * radius;
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (dx * dx + dy * dy > r2) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (!this.inBounds(nx, ny)) continue;
        const i = ny * this.cols + nx;
        const dist = Math.hypot(dx, dy);
        if (dist < radius - 0.8) {
          this.cells[i] = EMPTY;
          this.temps[i] = 700;
        } else if (s.fire && Math.random() < 0.6) {
          this.setCell(nx, ny, s.fire.id, { temp: 900 });
        }
        this.temps[i] = Math.min(8000, this.temps[i] + 500 / (1 + dist));
      }
    }
    this.record('eksplozja', 'Eksplozja', 'Materiał wybuchowy uwalnia energię i rozrzuca ogień.');
  }

  record(key, title, detail) {
    if (this.reactionMap.has(key)) return false;
    const entry = { key, title, detail, time: Date.now() };
    this.reactionMap.set(key, entry);
    this.reactions.push(entry);
    if (this.reactions.length > 90) this.reactions.shift();
    this.onReaction(entry, true);
    return true;
  }

  /* ---------------------------------------------------------- rendering */

  render() {
    if (!this._imageData) return;
    const { cols, rows, cells, temps, variant } = this;
    const data = this._imageData.data;
    const overlay = this.overlay;
    const hot = this._hotPoints;
    hot.length = 0;

    for (let i = 0, p = 0; i < cells.length; i++, p += 4) {
      const id = cells[i];
      if (!id) {
        data[p + 3] = 0;
        continue;
      }
      const d = getDef(id);
      if (!d) { data[p + 3] = 0; continue; }
      if (!d._rgb) {
        d._rgb = (d.palette && d.palette.length === 4 ? d.palette : [d.color, d.color, d.color, d.color]).map(hexToRgb);
      }
      const rgb = d._rgb[variant[i] & 3] || d._rgb[0];
      let r = rgb[0];
      let g = rgb[1];
      let b = rgb[2];

      // subtle pixel texture
      const h = ((i * 13 + id * 7) & 7) - 3.5;
      r += h; g += h; b += h;

      if (overlay) {
        const t = temps[i];
        if (t > 28) {
          const k = clamp((t - 28) / 900, 0, 1);
          r = r * (1 - k) + 255 * k;
          g = g * (1 - k) + (70 + 120 * k) * k;
          b = b * (1 - k) + 20 * k;
        } else if (t < 12) {
          const k = clamp((12 - t) / 130, 0, 1);
          r = r * (1 - k) + 40 * k;
          g = g * (1 - k) + 150 * k;
          b = b * (1 - k) + 255 * k;
        }
      }

      data[p] = clamp(r, 0, 255);
      data[p + 1] = clamp(g, 0, 255);
      data[p + 2] = clamp(b, 0, 255);
      data[p + 3] = 255;

      if (d.state === 'fire' || d.state === 'plasma' || temps[i] > 550) {
        if (hot.length < 240 && (i & 3) === 0) hot.push(i);
      }
    }

    this._offCtx.putImageData(this._imageData, 0, 0);

    const ctx = this.ctx;
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    ctx.clearRect(0, 0, cw, ch);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this._off, 0, 0, cw, ch);

    // glow for hot cells
    if (hot.length) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const scale = this._cellPx;
      for (const i of hot) {
        const x = (i % cols) * scale + scale / 2;
        const y = ((i / cols) | 0) * scale + scale / 2;
        const d = getDef(cells[i]);
        const t = temps[i];
        const radius = scale * (d && d.state === 'fire' ? 3.2 : 2);
        const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
        const alpha = clamp((t - 400) / 2400, 0.05, 0.5);
        g.addColorStop(0, `rgba(255, 190, 80, ${alpha})`);
        g.addColorStop(0.5, `rgba(255, 100, 30, ${alpha * 0.45})`);
        g.addColorStop(1, 'rgba(255, 60, 0, 0)');
        ctx.fillStyle = g;
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      }
      ctx.restore();
    }

    // brush cursor
    if (this.pointer.inside) {
      const { x, y } = this.pointer;
      const scale = this._cellPx;
      const cx = x * scale + scale / 2;
      const cy = y * scale + scale / 2;
      const rad = Math.max(2, this.brush / 2) * scale;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(201,255,77,0.9)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(1, rad - 3), 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,0,0,0.45)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
  }

  cellInfo(x, y) {
    if (!this.inBounds(x, y)) return null;
    const i = this.idx(x, y);
    return { id: this.cells[i], def: getDef(this.cells[i]), temp: this.temps[i], x, y };
  }

  averageTemperature() {
    if (!this.cells) return AMBIENT;
    let sum = 0;
    let n = 0;
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i]) { sum += this.temps[i]; n++; }
    }
    return n ? sum / n : AMBIENT;
  }

  /* ---------------------------------------------------------- scene */

  seedScene() {
    const { cols, rows } = this;
    if (!cols || !rows) return;
    this.cells.fill(EMPTY);
    this.variant.fill(0);
    this.aux.fill(0);
    this.temps.fill(AMBIENT);
    this.dir.fill(0);

    const soil = findByName(['Gleba próchniczna', 'Gleba gliniasta']);
    const sand = findByName(['Piasek kwarcowy', 'Piasek rzeczny']);
    const stone = findByName(['Granit', 'Bazalt']);
    const water = findByName(['Woda']);
    const ice = findByName(['Lód']);
    const grass = findByName(['Trawa']);
    const leaf = findByName(['Liść dębu', 'Trawa']);
    const wood = findByName(['Dąb', 'Brzoza']);
    const copper = findByName(['Miedź']);
    const coal = findByName(['Węgiel drzewny']);
    const lava = findByName(['Lawa', 'Magma']);
    const oxygen = findByName(['Tlen']);

    const ground = Math.floor(rows * 0.78);
    const surface = new Array(cols).fill(ground);

    // gentle terrain profile
    for (let x = 0; x < cols; x++) {
      const n = Math.sin(x * 0.06) * 1.6 + Math.sin(x * 0.021 + 1.4) * 2.2;
      surface[x] = Math.round(ground + n);
    }

    // pond basin on the left
    const pondX0 = Math.floor(cols * 0.18);
    const pondX1 = Math.floor(cols * 0.47);
    const pondDepth = Math.max(6, Math.floor(rows * 0.09));
    for (let x = pondX0; x <= pondX1; x++) {
      const t = (x - pondX0) / Math.max(1, pondX1 - pondX0);
      const depth = Math.round(Math.sin(t * Math.PI) * pondDepth);
      surface[x] += depth;
    }

    // fill ground
    for (let x = 0; x < cols; x++) {
      const top = surface[x];
      for (let y = top; y < rows; y++) {
        const depth = y - top;
        let id = soil ? soil.id : (stone ? stone.id : 0);
        if (depth > rows * 0.08) id = stone ? stone.id : id;
        if (depth > 2 && depth < 5 && sand && Math.random() < 0.35) id = sand.id;
        if (stone && Math.random() < 0.025) id = stone.id;
        if (id) this.setCell(x, y, id);
      }
      // grass cap
      if (grass && surface[x] < rows - 2) {
        for (let k = 0; k < 2; k++) this.setCell(x, surface[x] + k, grass.id);
      }
    }

    // pond water and icy rim
    for (let x = pondX0 + 1; x < pondX1; x++) {
      const t = (x - pondX0) / Math.max(1, pondX1 - pondX0);
      const depth = Math.round(Math.sin(t * Math.PI) * pondDepth);
      if (depth < 2) continue;
      const top = surface[x] - depth + 1;
      for (let y = top; y < surface[x]; y++) {
        if (water) this.setCell(x, y, water.id);
      }
      if (ice && (x < pondX0 + 3 || x > pondX1 - 3) && Math.random() < 0.55) {
        this.setCell(x, top, ice.id);
      }
    }

    // tree on the right
    if (wood) {
      const tx = Math.floor(cols * 0.72);
      const base = surface[tx] || ground;
      const th = Math.max(10, Math.floor(rows * 0.24));
      for (let y = base - th; y < base; y++) {
        this.setCell(tx, y, wood.id);
        if (Math.random() < 0.4) this.setCell(tx + 1, y, wood.id);
      }
      const cx = tx;
      const cy = base - th;
      const rad = Math.max(6, Math.floor(rows * 0.11));
      for (let dy = -rad; dy <= rad; dy++) {
        for (let dx = -rad - 3; dx <= rad + 3; dx++) {
          const dist = Math.hypot(dx * 0.9, dy);
          if (dist < rad && Math.random() < 0.82) {
            const x = cx + dx;
            const y = cy + dy;
            if (this.inBounds(x, y) && (!leaf || Math.random() < 0.9)) {
              if (leaf) this.setCell(x, y, leaf.id);
            }
          }
        }
      }
    }

    // copper vein and coal pockets
    if (copper) {
      for (let k = 0; k < 3; k++) {
        let x = Math.floor(cols * (0.55 + Math.random() * 0.35));
        let y = ground + Math.floor(rows * (0.1 + Math.random() * 0.08));
        for (let s = 0; s < 18; s++) {
          if (this.inBounds(x, y)) this.setCell(x, y, copper.id);
          x += (Math.random() < 0.5 ? -1 : 1);
          y += Math.random() < 0.5 ? 1 : 0;
        }
      }
    }
    if (coal) {
      for (let k = 0; k < 2; k++) {
        const cx = Math.floor(cols * (0.1 + Math.random() * 0.3));
        const cy = ground + Math.floor(rows * 0.16);
        for (let dy = -2; dy <= 2; dy++) for (let dx = -3; dx <= 3; dx++) {
          if (Math.random() < 0.5 && this.inBounds(cx + dx, cy + dy)) this.setCell(cx + dx, cy + dy, coal.id);
        }
      }
    }

    // deep lava pocket, sealed under stone and kept away from the pond
    if (lava) {
      const cx = Math.floor(cols * 0.86);
      const cy = Math.min(rows - 4, ground + Math.floor(rows * 0.17));
      for (let dy = -2; dy <= 2; dy++) for (let dx = -4; dx <= 4; dx++) {
        if (Math.hypot(dx, dy) < 3.2 && this.inBounds(cx + dx, cy + dy)) this.setCell(cx + dx, cy + dy, lava.id);
      }
      if (stone) {
        for (let dy = -4; dy <= 4; dy++) for (let dx = -6; dx <= 6; dx++) {
          const d = Math.hypot(dx, dy);
          if (d > 3 && d < 4.5 && this.inBounds(cx + dx, cy + dy)) this.setCell(cx + dx, cy + dy, stone.id);
        }
      }
    }

    // faint oxygen layer above the terrain
    // (kept out of the starter scene: rising gas made the diorama noisy)

    this.record('start', 'Świat gotowy', 'Gleba, woda, las, miedź i gorące jądro czekają na eksperymenty.');
  }
}

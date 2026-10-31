import { MATERIALS, MATERIAL_BY_NAME } from './data.js';

export const SIM_STATE = Object.freeze({
  EMPTY: 0, POWDER: 1, LIQUID: 2, GAS: 3, SOLID: 4, FIRE: 5,
  ENERGY: 6, PLANT: 7, FUNGUS: 8, ANIMAL: 9, TECH: 10, RADIO: 11,
});

const STATE_BY_NAME = {
  powder: SIM_STATE.POWDER, liquid: SIM_STATE.LIQUID, gas: SIM_STATE.GAS,
  solid: SIM_STATE.SOLID, fire: SIM_STATE.FIRE, energy: SIM_STATE.ENERGY,
  plant: SIM_STATE.PLANT, fungus: SIM_STATE.FUNGUS, animal: SIM_STATE.ANIMAL,
  tech: SIM_STATE.TECH, radioactive: SIM_STATE.RADIO,
};

const T = Object.freeze({
  fuel: 1 << 0, explosive: 1 << 1, water: 1 << 2, acid: 1 << 3,
  base: 1 << 4, metal: 1 << 5, conductor: 1 << 6, electric: 1 << 7,
  hot: 1 << 8, cold: 1 << 9, fire: 1 << 10, gas: 1 << 11,
  toxic: 1 << 12, radioactive: 1 << 13, mineral: 1 << 14, inert: 1 << 15,
  organic: 1 << 16, plant: 1 << 17, fungus: 1 << 18, animal: 1 << 19,
  food: 1 << 20, plastic: 1 << 21, glass: 1 << 22, tech: 1 << 23,
  energy: 1 << 24, corrosive: 1 << 25, space: 1 << 26, salt: 1 << 27,
  ceramic: 1 << 28, crystal: 1 << 29,
});

const TAG_TO_BIT = T;
const N = MATERIALS.length + 1;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const rnd = () => Math.random();

function idOf(name) {
  return MATERIAL_BY_NAME.get(name)?.id || 0;
}

export class SandSim {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.cols = 0;
    this.rows = 0;
    this.frame = 0;
    this.sceneName = 'volcano';
    this.brush = 4;
    this.tool = 'brush';
    this.selected = idOf('Piasek kwadratowy') || idOf('Piasek kwarcowy');
    this.hover = null;
    this.stats = { particles: 0, avgTemp: 20, maxTemp: 20, reactions: 0, glowing: 0 };
    this._reactionCount = 0;
    this.totalReactions = 0;
    this._lastStats = 0;
    this._initLookup();
    this.resize(true);
    this.reset('volcano');
  }

  _initLookup() {
    this.ids = {
      fire: idOf('Ogień'),
      steam: idOf('Para wodna'),
      smoke: idOf('Smuga dymu'),
      ash: idOf('Popiół gorący'),
      ember: idOf('Węgiel żarzący'),
      water: idOf('Woda'),
      ice: idOf('Lód'),
      lava: idOf('Lawa'),
      magma: idOf('Magma'),
      basalt: idOf('Bazalt'),
      stone: idOf('Bazalt'),
      sand: idOf('Piasek kwarcowy'),
      soil: idOf('Ziemia ogrodowa'),
      hydrogen: idOf('Wodór'),
      acidMist: idOf('Mgła kwasowa'),
      radioWater: idOf('Woda radioaktywna'),
      radiation: idOf('Promieniowanie gamma'),
      spark: idOf('Iskra elektryczna'),
      salt: idOf('Chlorek sodu'),
      glass: idOf('Szkło hartowane'),
      metal: idOf('Żelazo'),
    };

    this.mState = new Uint8Array(N);
    this.mDensity = new Float32Array(N);
    this.mHardness = new Float32Array(N);
    this.mMelt = new Float32Array(N);
    this.mBoil = new Float32Array(N);
    this.mCond = new Float32Array(N);
    this.mHeat = new Float32Array(N);
    this.mFlamm = new Float32Array(N);
    this.mVisc = new Float32Array(N);
    this.mDisp = new Float32Array(N);
    this.mRadio = new Float32Array(N);
    this.mGlow = new Float32Array(N);
    this.mTags = new Uint32Array(N);
    this.mMeltId = new Uint16Array(N);
    this.mBoilId = new Uint16Array(N);
    this.mFreezeId = new Uint16Array(N);
    this.mBurnId = new Uint16Array(N);
    this.mR = new Uint8Array(N);
    this.mG = new Uint8Array(N);
    this.mB = new Uint8Array(N);
    this.mSeed = new Uint32Array(N);
    this.mBaseTemp = new Float32Array(N);

    for (const m of MATERIALS) {
      const i = m.id;
      this.mState[i] = STATE_BY_NAME[m.sim] || SIM_STATE.SOLID;
      this.mDensity[i] = m.density;
      this.mHardness[i] = m.hardness;
      this.mMelt[i] = m.melt == null ? 99999 : m.melt;
      this.mBoil[i] = m.boil == null ? 99999 : m.boil;
      this.mCond[i] = m.conductivity;
      this.mHeat[i] = m.heatCapacity;
      this.mFlamm[i] = m.flammability;
      this.mVisc[i] = m.viscosity;
      this.mDisp[i] = m.dispersion;
      this.mRadio[i] = m.radioactivity;
      this.mGlow[i] = m.glow;
      this.mMeltId[i] = m.meltId;
      this.mBoilId[i] = m.boilId;
      this.mFreezeId[i] = m.freezeId;
      this.mBurnId[i] = m.burnId;
      this.mBaseTemp[i] = m.temperature;
      this.mSeed[i] = m.textureSeed;
      const rgb = m.color.replace('#', '');
      this.mR[i] = parseInt(rgb.slice(0, 2), 16);
      this.mG[i] = parseInt(rgb.slice(2, 4), 16);
      this.mB[i] = parseInt(rgb.slice(4, 6), 16);
      let mask = 0;
      for (const tag of m.tags) mask |= TAG_TO_BIT[tag] || 0;
      this.mTags[i] = mask >>> 0;
    }
  }

  _allocate(cols, rows, preserve = false) {
    const old = preserve && this.mat ? {
      cols: this.cols, rows: this.rows, mat: this.mat, temp: this.temp,
      life: this.life, aux: this.aux, charge: this.charge,
    } : null;
    this.cols = cols;
    this.rows = rows;
    const size = cols * rows;
    this.mat = new Uint16Array(size);
    this.temp = new Float32Array(size);
    this.life = new Uint8Array(size);
    this.aux = new Uint16Array(size);
    this.charge = new Uint8Array(size);
    this.stamp = new Uint32Array(size);
    this.temp.fill(20);
    if (old) {
      const dx = Math.floor((cols - old.cols) / 2);
      const dy = Math.floor((rows - old.rows) / 2);
      for (let y = 0; y < old.rows; y++) {
        const ny = y + dy;
        if (ny < 0 || ny >= rows) continue;
        for (let x = 0; x < old.cols; x++) {
          const nx = x + dx;
          if (nx < 0 || nx >= cols) continue;
          const from = y * old.cols + x;
          const to = ny * cols + nx;
          this.mat[to] = old.mat[from];
          this.temp[to] = old.temp[from];
          this.life[to] = old.life[from];
          this.aux[to] = old.aux[from];
          this.charge[to] = old.charge[from];
        }
      }
    }
    this.imageData = this.ctx.createImageData(cols, rows);
    this.pixels = this.imageData.data;
    this.glowCanvas = document.createElement('canvas');
    this.glowCanvas.width = cols;
    this.glowCanvas.height = rows;
    this.glowCtx = this.glowCanvas.getContext('2d', { alpha: true });
    this.glowData = this.glowCtx.createImageData(cols, rows);
  }

  resize(initial = false) {
    const rect = this.canvas.getBoundingClientRect();
    const width = Math.max(280, Math.floor(rect.width));
    const height = Math.max(260, Math.floor(rect.height));
    const cell = width < 720 ? 4 : 5;
    const cols = clamp(Math.round(width / cell), 80, 250);
    const rows = clamp(Math.round(height / cell), 75, 210);
    this.cssWidth = width;
    this.cssHeight = height;
    // Render at simulation resolution and let CSS scale the canvas. This keeps
    // per-frame uploads tiny and gives the crisp pixel-art look for free.
    this.canvas.width = cols;
    this.canvas.height = rows;
    this.ctx.imageSmoothingEnabled = false;
    if (cols !== this.cols || rows !== this.rows) {
      const hadGrid = Boolean(this.mat);
      this._allocate(cols, rows, !initial && hadGrid);
      if (!hadGrid) this.reset(this.sceneName);
    }
  }

  _index(x, y) { return y * this.cols + x; }

  _inBounds(x, y) { return x >= 0 && y >= 0 && x < this.cols && y < this.rows; }

  _set(x, y, id, temp = null, life = 0, aux = 0) {
    if (!this._inBounds(x, y)) return;
    const i = this._index(x, y);
    this.mat[i] = id;
    this.temp[i] = temp == null ? (id ? this.mBaseTemp[id] : 20) : temp;
    this.life[i] = life;
    this.aux[i] = aux;
    this.charge[i] = 0;
    this.stamp[i] = this.frame;
  }

  _clear(x, y) {
    if (!this._inBounds(x, y)) return;
    const i = this._index(x, y);
    this.mat[i] = 0;
    this.temp[i] = 20;
    this.life[i] = 0;
    this.aux[i] = 0;
    this.charge[i] = 0;
    this.stamp[i] = this.frame;
  }

  _copyCell(from, to) {
    this.mat[to] = this.mat[from];
    this.temp[to] = this.temp[from];
    this.life[to] = this.life[from];
    this.aux[to] = this.aux[from];
    this.charge[to] = this.charge[from];
  }

  _move(from, to) {
    this._copyCell(from, to);
    this.mat[from] = 0;
    this.temp[from] = 20;
    this.life[from] = 0;
    this.aux[from] = 0;
    this.charge[from] = 0;
    this.stamp[to] = this.frame;
  }

  _swap(a, b) {
    const m = this.mat[a], t = this.temp[a], l = this.life[a], x = this.aux[a], c = this.charge[a];
    this.mat[a] = this.mat[b]; this.temp[a] = this.temp[b]; this.life[a] = this.life[b]; this.aux[a] = this.aux[b]; this.charge[a] = this.charge[b];
    this.mat[b] = m; this.temp[b] = t; this.life[b] = l; this.aux[b] = x; this.charge[b] = c;
    this.stamp[a] = this.frame;
    this.stamp[b] = this.frame;
  }

  _canDisplace(id, target) {
    if (!target) return true;
    const ts = this.mState[target];
    if (ts === SIM_STATE.GAS) return true;
    if (ts === SIM_STATE.LIQUID && this.mDensity[id] > this.mDensity[target] + 0.004) return true;
    return false;
  }

  _canGas(id, target) {
    if (!target) return true;
    const ts = this.mState[target];
    if (ts === SIM_STATE.GAS || ts === SIM_STATE.LIQUID) return true;
    return false;
  }

  _tryMove(x, y, nx, ny, mode = 'normal') {
    if (!this._inBounds(nx, ny)) return false;
    const from = this._index(x, y);
    const to = this._index(nx, ny);
    const id = this.mat[from];
    if (!id) return false;
    const target = this.mat[to];
    const ok = mode === 'gas' ? this._canGas(id, target) : this._canDisplace(id, target);
    if (!ok) return false;
    if (!target) this._move(from, to);
    else this._swap(from, to);
    return true;
  }

  _neighborId(x, y, dx, dy) {
    const nx = x + dx, ny = y + dy;
    if (!this._inBounds(nx, ny)) return 0;
    return this.mat[this._index(nx, ny)];
  }

  _neighbors(x, y) {
    return [
      [x, y - 1, this._neighborId(x, y, 0, -1)],
      [x, y + 1, this._neighborId(x, y, 0, 1)],
      [x - 1, y, this._neighborId(x, y, -1, 0)],
      [x + 1, y, this._neighborId(x, y, 1, 0)],
    ];
  }

  _hasNeighborTag(x, y, bit) {
    const n = this._neighbors(x, y);
    for (const [, , id] of n) if (id && (this.mTags[id] & bit)) return id;
    return 0;
  }

  _ignite(x, y, product = 0, power = 1) {
    if (!this._inBounds(x, y)) return;
    const i = this._index(x, y);
    if (!this.mat[i]) return;
    const p = product || this.mBurnId[this.mat[i]] || this.ids.ash;
    this.mat[i] = this.ids.fire || this.ids.ember;
    this.life[i] = clamp(Math.round(10 + rnd() * 20 * power), 4, 60);
    this.aux[i] = p;
    this.temp[i] = Math.max(this.temp[i], 500 + rnd() * 600);
    this.stamp[i] = this.frame;
    this._reactionCount++;
  }

  _extinguish(x, y) {
    const i = this._index(x, y);
    this.mat[i] = this.ids.smoke;
    this.life[i] = 5 + Math.floor(rnd() * 8);
    this.temp[i] = Math.max(70, Math.min(this.temp[i], 180));
    this.aux[i] = 0;
    this.stamp[i] = this.frame;
  }

  _explode(x, y, radius = 4) {
    const r2 = radius * radius;
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (dx * dx + dy * dy > r2) continue;
        const nx = x + dx, ny = y + dy;
        if (!this._inBounds(nx, ny)) continue;
        const i = this._index(nx, ny);
        if (!this.mat[i]) continue;
        if (rnd() < 0.55) {
          this.mat[i] = this.ids.fire || this.ids.ember;
          this.life[i] = 8 + Math.floor(rnd() * 20);
          this.aux[i] = this.mBurnId[i] || this.ids.ash;
        } else {
          this.mat[i] = 0;
        }
        this.temp[i] = 900 + rnd() * 1400;
        this.stamp[i] = this.frame;
      }
    }
    this._reactionCount += 4;
  }

  _sparkAt(x, y) {
    if (!this._inBounds(x, y)) return;
    const i = this._index(x, y);
    this.temp[i] += 180;
    if (this.mTags[this.mat[i]] & T.fuel) {
      if (rnd() < 0.22) this._ignite(x, y);
    }
    if (this.mTags[this.mat[i]] & T.explosive) {
      this._explode(x, y, 4);
    }
    this.charge[i] = 255;
  }

  _react(x, y, id) {
    if (!id) return;
    const tags = this.mTags[id];
    const i = this._index(x, y);
    const neighbors = this._neighbors(x, y);

    // Fire and water: rapid quenching.
    if ((tags & (T.fire | T.hot)) && this._hasNeighborTag(x, y, T.water)) {
      if (rnd() < 0.09) {
        const waterId = this._hasNeighborTag(x, y, T.water);
        if (waterId) {
          for (const [nx, ny, nid] of neighbors) {
            if (nid && (this.mTags[nid] & T.water) && rnd() < 0.35) {
              this.mat[this._index(nx, ny)] = this.ids.steam;
              this.temp[this._index(nx, ny)] = 130;
              this.life[this._index(nx, ny)] = 0;
              this.stamp[this._index(nx, ny)] = this.frame;
            }
          }
          if (this.mState[id] === SIM_STATE.FIRE) this._extinguish(x, y);
        }
      }
    }

    // Acid / base reactions.
    if (tags & T.acid) {
      for (const [nx, ny, nid] of neighbors) {
        if (!nid) continue;
        const nt = this.mTags[nid];
        if ((nt & (T.metal | T.mineral | T.salt | T.corrosive)) && rnd() < 0.018) {
          const ni = this._index(nx, ny);
          this.mat[ni] = 0;
          this.temp[ni] = Math.max(this.temp[ni], 60);
          this.temp[i] += 22;
          if (this.ids.hydrogen && rnd() < 0.45) {
            this.mat[i] = 0;
            this._set(nx, ny - 1, this.ids.hydrogen, 40);
          }
          this._reactionCount++;
        }
      }
    }
    if ((tags & T.base) && this._hasNeighborTag(x, y, T.acid)) {
      if (rnd() < 0.02) {
        this.mat[i] = this.ids.water;
        this.temp[i] = 60;
        this._reactionCount++;
      }
    }

    // Fuel ignition and explosions.
    if ((tags & T.fuel) && this._hasNeighborTag(x, y, T.fire | T.hot)) {
      if (rnd() < 0.012 + this.mFlamm[id] * 0.0006) this._ignite(x, y);
    }
    if (tags & T.explosive) {
      if (this.temp[i] > 220 || this._hasNeighborTag(x, y, T.fire)) {
        if (rnd() < 0.055) this._explode(x, y, 5);
      }
    }

    // Radioactivity contaminates water and living tissue.
    if (tags & T.radioactive) {
      if (rnd() < 0.0025) {
        for (const [nx, ny, nid] of neighbors) {
          if (!nid) continue;
          const nt = this.mTags[nid];
          if ((nt & T.water) && this.ids.radioWater && rnd() < 0.2) {
            this._set(nx, ny, this.ids.radioWater, 55);
            this._reactionCount++;
          } else if ((nt & (T.organic | T.animal | T.food)) && rnd() < 0.08) {
            this.temp[this._index(nx, ny)] += 45;
            if (rnd() < 0.1) this._set(nx, ny, this.ids.ember, 120);
            this._reactionCount++;
          }
        }
      }
    }

    // Electric conduction and electrolysis.
    if (tags & T.conductor) {
      if (this._hasNeighborTag(x, y, T.energy | T.electric)) {
        this.charge[i] = 255;
        this.temp[i] += 8;
      }
    }
    if (tags & T.water) {
      if (this._hasNeighborTag(x, y, T.energy | T.electric) && rnd() < 0.006) {
        this.mat[i] = this.ids.steam;
        this.temp[i] = 130;
        this._reactionCount++;
      }
    }

    // Salts dissolve and conduct.
    if ((tags & T.salt) && this._hasNeighborTag(x, y, T.water)) {
      if (rnd() < 0.0009) {
        this.mat[i] = 0;
        this._reactionCount++;
      }
    }

    // Cold materials chill their surroundings.
    if (tags & T.cold) {
      if (rnd() < 0.005) {
        for (const [nx, ny, nid] of neighbors) {
          if (!nid) continue;
          const ni = this._index(nx, ny);
          this.temp[ni] -= 3;
        }
      }
    }
  }

  _phaseChange(x, y, id) {
    const i = this._index(x, y);
    const state = this.mState[id];
    const temp = this.temp[i];
    if (state === SIM_STATE.FIRE || state === SIM_STATE.ENERGY) return false;
    const melt = this.mMelt[id];
    const boil = this.mBoil[id];
    if (state === SIM_STATE.LIQUID || state === SIM_STATE.GAS) {
      if (this.mFreezeId[id] && temp < melt - 3 && rnd() < 0.12) {
        const next = this.mFreezeId[id];
        this._set(x, y, next, Math.max(temp, this.mBaseTemp[next]));
        return true;
      }
    }
    if ((state === SIM_STATE.LIQUID || state === SIM_STATE.GAS) && this.mBoilId[id] && temp > boil + 4 && rnd() < 0.16) {
      this._set(x, y, this.mBoilId[id], Math.max(temp, this.mBaseTemp[this.mBoilId[id]]));
      return true;
    }
    if (state !== SIM_STATE.LIQUID && this.mMeltId[id] && temp > melt + 8 && rnd() < 0.055) {
      this._set(x, y, this.mMeltId[id], Math.max(temp, this.mBaseTemp[this.mMeltId[id]]));
      return true;
    }
    return false;
  }

  _updatePowder(x, y, id) {
    if (this._phaseChange(x, y, id)) return;
    if (this.mFlamm[id] > 40 && this._hasNeighborTag(x, y, T.fire | T.hot) && rnd() < 0.006) {
      this._ignite(x, y);
      return;
    }
    if (this._tryMove(x, y, x, y + 1)) return;
    const dir = rnd() < 0.5 ? -1 : 1;
    if (this._tryMove(x, y, x + dir, y + 1)) return;
    if (this._tryMove(x, y, x - dir, y + 1)) return;
    // Fine powders can creep sideways when piled up.
    if (this.mDisp[id] > 4 && rnd() < 0.03) this._tryMove(x, y, x + dir, y);
  }

  _updateLiquid(x, y, id) {
    if (this._phaseChange(x, y, id)) return;
    if (this.mFlamm[id] > 65 && this._hasNeighborTag(x, y, T.fire | T.hot) && rnd() < 0.004) {
      this._ignite(x, y);
      return;
    }
    if (this._tryMove(x, y, x, y + 1)) return;
    const dir = rnd() < 0.5 ? -1 : 1;
    if (this._tryMove(x, y, x + dir, y + 1)) return;
    if (rnd() * 100 < 100 - this.mVisc[id] * 0.8) {
      const tries = clamp(Math.round(this.mDisp[id]), 1, 8);
      for (let i = 0; i < tries; i++) {
        if (this._tryMove(x, y, x + dir, y)) return;
        if (this._tryMove(x, y, x - dir, y)) return;
      }
    }
  }

  _updateGas(x, y, id) {
    if (this._phaseChange(x, y, id)) return;
    if (this.mFlamm[id] > 60 && this._hasNeighborTag(x, y, T.fire | T.hot) && rnd() < 0.012) {
      this._ignite(x, y);
      return;
    }
    if (this._tryMove(x, y, x, y - 1, 'gas')) return;
    const dir = rnd() < 0.5 ? -1 : 1;
    if (this._tryMove(x, y, x + dir, y - 1, 'gas')) return;
    if (this._tryMove(x, y, x - dir, y - 1, 'gas')) return;
    const tries = clamp(Math.round(this.mDisp[id] / 2), 1, 5);
    for (let i = 0; i < tries; i++) if (this._tryMove(x, y, x + dir, y, 'gas')) return;
  }

  _updateFire(x, y, id) {
    const i = this._index(x, y);
    if (this.life[i] === 0) this.life[i] = 10 + Math.floor(rnd() * 18);
    this.life[i]--;
    // Fire heats and ignites its neighbourhood.
    for (const [nx, ny, nid] of this._neighbors(x, y)) {
      if (!nid) {
        const ni = this._index(nx, ny);
        this.temp[ni] += 3.5;
        continue;
      }
      const ni = this._index(nx, ny);
      this.temp[ni] += 12 + rnd() * 20;
      if (this.mTags[nid] & T.water) {
        if (rnd() < 0.08) {
          this._set(nx, ny, this.ids.steam, 120);
          this._extinguish(x, y);
          return;
        }
      }
      if ((this.mTags[nid] & T.fuel) && rnd() < 0.035) this._ignite(nx, ny);
      if (this.mTags[nid] & T.explosive && rnd() < 0.02) this._explode(nx, ny, 4);
    }
    this.temp[i] = Math.max(this.temp[i], 520);
    if (this.life[i] === 0) {
      const product = this.aux[i] || this.ids.smoke;
      this._set(x, y, product, Math.max(80, this.temp[i] * 0.35));
      return;
    }
    if (rnd() < 0.72) {
      if (this._tryMove(x, y, x, y - 1, 'normal')) return;
      const dir = rnd() < 0.5 ? -1 : 1;
      if (this._tryMove(x, y, x + dir, y - 1, 'normal')) return;
    }
  }

  _updateEnergy(x, y, id) {
    const i = this._index(x, y);
    if (this.life[i] === 0) this.life[i] = 8 + Math.floor(rnd() * 14);
    this.life[i]--;
    this.temp[i] = Math.max(this.temp[i], 300);
    if (this.life[i] === 0) {
      this._clear(x, y);
      return;
    }
    for (const [nx, ny, nid] of this._neighbors(x, y)) {
      if (!nid) continue;
      const ni = this._index(nx, ny);
      if (this.mTags[nid] & T.conductor) {
        this.temp[ni] += 35;
        this.charge[ni] = 255;
        if ((this.mTags[nid] & T.fuel) && rnd() < 0.01) this._ignite(nx, ny);
      }
      if (this.mTags[nid] & T.water && rnd() < 0.01) this._set(nx, ny, this.ids.steam, 130);
    }
    if (rnd() < 0.55) {
      if (this._tryMove(x, y, x, y - 1, 'normal')) return;
      const dir = rnd() < 0.5 ? -1 : 1;
      if (this._tryMove(x, y, x + dir, y - 1, 'normal')) return;
      if (this._tryMove(x, y, x + dir, y, 'normal')) return;
    }
  }

  _updatePlant(x, y, id) {
    if (this._hasNeighborTag(x, y, T.fire | T.hot) && rnd() < 0.01) {
      this._ignite(x, y);
      return;
    }
    const i = this._index(x, y);
    if (this.life[i] === 0) return;
    if (rnd() < 0.004) {
      this.life[i]--;
      const water = this._hasNeighborTag(x, y, T.water);
      if (water && rnd() < 0.55) {
        const dir = rnd() < 0.5 ? -1 : 1;
        const candidates = [[x, y - 1], [x + dir, y - 1], [x + dir, y], [x - dir, y]];
        for (const [nx, ny] of candidates) {
          if (!this._inBounds(nx, ny)) continue;
          const ni = this._index(nx, ny);
          if (this.mat[ni] === 0) {
            this._set(nx, ny, id, this.temp[i], 3 + Math.floor(rnd() * 5));
            this._reactionCount++;
            break;
          }
        }
      }
    }
  }

  _updateFungus(x, y, id) {
    if (this._hasNeighborTag(x, y, T.hot) && rnd() < 0.008) {
      this._set(x, y, this.ids.ash, 90);
      return;
    }
    const i = this._index(x, y);
    if (rnd() < 0.006) {
      const dir = rnd() < 0.5 ? -1 : 1;
      const candidates = [[x + dir, y], [x, y + 1], [x, y - 1], [x - dir, y]];
      for (const [nx, ny] of candidates) {
        if (!this._inBounds(nx, ny)) continue;
        const ni = this._index(nx, ny);
        const nid = this.mat[ni];
        if (!nid) continue;
        const nt = this.mTags[nid];
        if ((nt & (T.organic | T.food | T.plant | T.animal)) && rnd() < 0.12) {
          this.mat[ni] = id;
          this.life[ni] = 3 + Math.floor(rnd() * 5);
          this.stamp[ni] = this.frame;
          this._reactionCount++;
          break;
        }
      }
    }
  }

  _updateAnimal(x, y, id) {
    if (this._hasNeighborTag(x, y, T.fire | T.hot) && rnd() < 0.012) {
      this._ignite(x, y);
      return;
    }
    if (rnd() < 0.12) {
      if (this._tryMove(x, y, x, y + 1)) return;
      const dir = rnd() < 0.5 ? -1 : 1;
      if (this._tryMove(x, y, x + dir, y)) return;
      if (this._tryMove(x, y, x + dir, y + 1)) return;
    }
  }

  _updateTech(x, y, id) {
    if (this._hasNeighborTag(x, y, T.water) && rnd() < 0.004) {
      const i = this._index(x, y);
      this.temp[i] += 45;
      this.charge[i] = 255;
      if (rnd() < 0.16) {
        const water = this._hasNeighborTag(x, y, T.water);
        for (const [nx, ny, nid] of this._neighbors(x, y)) {
          if (nid === water && rnd() < 0.4) this._set(nx, ny, this.ids.steam, 120);
        }
      }
    }
    if (this._hasNeighborTag(x, y, T.energy | T.electric)) {
      this.charge[this._index(x, y)] = 255;
    }
  }

  _updateRadio(x, y, id) {
    const i = this._index(x, y);
    if (rnd() < 0.004) {
      this.temp[i] += 4;
      for (const [nx, ny, nid] of this._neighbors(x, y)) {
        if (!nid) continue;
        this.temp[this._index(nx, ny)] += 0.8;
      }
    }
  }

  step() {
    this.frame++;
    this._reactionCount = 0;
    const cols = this.cols;
    const rows = this.rows;
    const leftToRight = (this.frame & 1) === 0;
    for (let y = rows - 1; y >= 0; y--) {
      const row = y * cols;
      for (let k = 0; k < cols; k++) {
        const x = leftToRight ? k : cols - 1 - k;
        const i = row + x;
        const id = this.mat[i];
        if (!id) continue;
        if (this.stamp[i] === this.frame) continue;
        const state = this.mState[id];
        if (((x * 13 + y * 7 + this.frame) & 31) === 0) this._react(x, y, id);
        switch (state) {
          case SIM_STATE.POWDER: this._updatePowder(x, y, id); break;
          case SIM_STATE.LIQUID: this._updateLiquid(x, y, id); break;
          case SIM_STATE.GAS: this._updateGas(x, y, id); break;
          case SIM_STATE.FIRE: this._updateFire(x, y, id); break;
          case SIM_STATE.ENERGY: this._updateEnergy(x, y, id); break;
          case SIM_STATE.PLANT: this._updatePlant(x, y, id); break;
          case SIM_STATE.FUNGUS: this._updateFungus(x, y, id); break;
          case SIM_STATE.ANIMAL: this._updateAnimal(x, y, id); break;
          case SIM_STATE.TECH: this._updateTech(x, y, id); break;
          case SIM_STATE.RADIO: this._updateRadio(x, y, id); break;
          default: this._phaseChange(x, y, id); break;
        }
      }
    }
    this._updateTemperature();
    this.totalReactions += this._reactionCount;
    if (this.frame - this._lastStats >= 10) {
      this._computeStats();
      this._lastStats = this.frame;
    }
  }

  _updateTemperature() {
    const cols = this.cols, rows = this.rows;
    const sample = this.frame & 1;
    for (let y = 0; y < rows; y++) {
      const row = y * cols;
      for (let x = sample; x < cols; x += 2) {
        const i = row + x;
        const id = this.mat[i];
        if (!id) {
          this.temp[i] += (20 - this.temp[i]) * 0.006;
          continue;
        }
        const t = this.temp[i];
        const cap = this.mHeat[id] || 1000;
        const cond = this.mCond[id] || 0.1;
        // Ambient cooling / warming is deliberately slow.
        this.temp[i] += (20 - t) * 0.0007;
        for (let d = 0; d < 4; d++) {
          const nx = x + (d === 0 ? -1 : d === 1 ? 1 : 0);
          const ny = y + (d === 2 ? -1 : d === 3 ? 1 : 0);
          if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
          const ni = ny * cols + nx;
          const nid = this.mat[ni];
          if (!nid) {
            this.temp[i] += (20 - this.temp[i]) * 0.0009;
            continue;
          }
          const ncap = this.mHeat[nid] || 1000;
          const ncond = this.mCond[nid] || 0.1;
          const k = Math.min(0.14, 0.006 + (cond + ncond) / 1800);
          const diff = this.temp[ni] - this.temp[i];
          const transfer = diff * k * (ncap / (cap + ncap));
          this.temp[i] += transfer;
          this.temp[ni] -= transfer;
        }
        if (this.temp[i] > 12000) this.temp[i] = 12000;
        if (this.temp[i] < -273) this.temp[i] = -273;
      }
    }
  }

  _computeStats() {
    let count = 0, sum = 0, max = -1000, glow = 0;
    for (let i = 0; i < this.mat.length; i++) {
      const id = this.mat[i];
      if (!id) continue;
      count++;
      sum += this.temp[i];
      if (this.temp[i] > max) max = this.temp[i];
      if (this.mGlow[id] > 0.35) glow++;
    }
    this.stats = {
      particles: count,
      avgTemp: count ? sum / count : 20,
      maxTemp: count ? max : 20,
      reactions: this._reactionCount,
      glowing: glow,
    };
  }

  render() {
    const { cols, rows, pixels } = this;
    const glowPixels = this.glowData.data;
    glowPixels.fill(0);
    for (let y = 0; y < rows; y++) {
      const row = y * cols;
      for (let x = 0; x < cols; x++) {
        const i = row + x;
        const id = this.mat[i];
        const p = i * 4;
        if (!id) {
          pixels[p + 3] = 0;
          continue;
        }
        const seed = this.mSeed[id];
        const h = ((x * 73856093) ^ (y * 19349663) ^ seed) >>> 0;
        const noise = ((h & 255) / 255 - 0.5) * 0.2;
        let r = this.mR[id] * (1 + noise);
        let g = this.mG[id] * (1 + noise);
        let b = this.mB[id] * (1 + noise);
        const temp = this.temp[i];
        if (temp > 120) {
          const k = clamp((temp - 120) / 1100, 0, 0.55);
          r += (255 - r) * k;
          g += (150 - g) * k * 0.7;
          b += (35 - b) * k * 0.5;
        } else if (temp < -8) {
          const k = clamp((-temp - 8) / 180, 0, 0.35);
          r += (90 - r) * k;
          g += (190 - g) * k;
          b += (255 - b) * k;
        }
        if (this.charge[i] > 0) {
          const k = this.charge[i] / 255 * 0.32;
          r += (120 - r) * k;
          g += (235 - g) * k;
          b += (255 - b) * k;
        }
        pixels[p] = clamp(r, 0, 255);
        pixels[p + 1] = clamp(g, 0, 255);
        pixels[p + 2] = clamp(b, 0, 255);
        pixels[p + 3] = 255;
        const glow = this.mGlow[id];
        if (glow > 0.12) {
          const ga = clamp(glow * 0.9 + (temp > 300 ? 0.1 : 0), 0, 1);
          glowPixels[p] = clamp(r * 1.15, 0, 255);
          glowPixels[p + 1] = clamp(g * 1.1, 0, 255);
          glowPixels[p + 2] = clamp(b * 1.05, 0, 255);
          glowPixels[p + 3] = ga * 210;
        }
      }
    }
    this.ctx.putImageData(this.imageData, 0, 0);
    this.glowCtx.putImageData(this.glowData, 0, 0);

    const ctx = this.ctx;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.66;
    ctx.drawImage(this.glowCanvas, 0, 0);
    ctx.restore();

    if (this.hover) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 180, 72, 0.95)';
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.arc(this.hover.x + 0.5, this.hover.y + 0.5, Math.max(2, this.brush), 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(this.hover.x + 0.5, this.hover.y + 0.5, Math.max(2, this.brush) + 0.6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  pointerToCell(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const x = Math.floor((clientX - rect.left) / rect.width * this.cols);
    const y = Math.floor((clientY - rect.top) / rect.height * this.rows);
    if (!this._inBounds(x, y)) return null;
    return { x, y };
  }

  paintAt(x, y, id = this.selected, radius = this.brush, tool = this.tool) {
    if (!this._inBounds(x, y)) return;
    const r2 = radius * radius;
    const mode = tool;
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (dx * dx + dy * dy > r2) continue;
        const nx = x + dx, ny = y + dy;
        if (!this._inBounds(nx, ny)) continue;
        const i = this._index(nx, ny);
        if (mode === 'eraser' || mode === 'vacuum') {
          this.mat[i] = 0;
          this.temp[i] = 20;
          this.life[i] = 0;
          this.aux[i] = 0;
          this.charge[i] = 0;
        } else if (mode === 'heat') {
          this.temp[i] += 140;
          this.charge[i] = 0;
          if (this.mat[i] && this.mTags[this.mat[i]] & T.fuel && rnd() < 0.18) this._ignite(nx, ny);
        } else if (mode === 'cool') {
          this.temp[i] -= 120;
        } else if (mode === 'spark') {
          this._sparkAt(nx, ny);
          if (rnd() < 0.14) {
            this.mat[i] = this.ids.spark;
            this.life[i] = 8 + Math.floor(rnd() * 10);
            this.temp[i] = 700;
            this.charge[i] = 255;
          }
        } else {
          this.mat[i] = id;
          this.temp[i] = this.mBaseTemp[id] || 20;
          this.life[i] = this._initialLife(id);
          this.aux[i] = 0;
          this.charge[i] = 0;
        }
        this.stamp[i] = this.frame;
      }
    }
  }

  _initialLife(id) {
    const state = this.mState[id];
    if (state === SIM_STATE.FIRE) return 18 + Math.floor(rnd() * 18);
    if (state === SIM_STATE.ENERGY) return 12 + Math.floor(rnd() * 10);
    if (state === SIM_STATE.PLANT) return 5 + Math.floor(rnd() * 7);
    if (state === SIM_STATE.FUNGUS) return 4 + Math.floor(rnd() * 5);
    return 0;
  }

  paintLine(x0, y0, x1, y1, id = this.selected, radius = this.brush, tool = this.tool) {
    const dx = x1 - x0, dy = y1 - y0;
    const steps = Math.max(Math.abs(dx), Math.abs(dy), 1);
    for (let i = 0; i <= steps; i++) {
      this.paintAt(Math.round(x0 + dx * i / steps), Math.round(y0 + dy * i / steps), id, radius, tool);
    }
  }

  getCell(x, y) {
    if (!this._inBounds(x, y)) return null;
    const i = this._index(x, y);
    const id = this.mat[i];
    return {
      id, temp: this.temp[i], life: this.life[i], charge: this.charge[i],
      material: id ? MATERIALS[id - 1] : null,
    };
  }

  clear() {
    this.mat.fill(0);
    this.temp.fill(20);
    this.life.fill(0);
    this.aux.fill(0);
    this.charge.fill(0);
    this.stamp.fill(0);
    this.totalReactions = 0;
    this.stats = { particles: 0, avgTemp: 20, maxTemp: 20, reactions: 0, glowing: 0 };
  }

  reset(sceneName = this.sceneName) {
    this.sceneName = sceneName;
    this.clear();
    this.frame = 0;
    const scene = this['_scene_' + sceneName] || this._scene_volcano;
    scene.call(this);
    this._computeStats();
  }

  _id(name) { return idOf(name) || this.ids.sand; }

  _rect(x0, y0, x1, y1, id, temp = null, life = 0) {
    for (let y = Math.max(0, y0); y <= Math.min(this.rows - 1, y1); y++) {
      for (let x = Math.max(0, x0); x <= Math.min(this.cols - 1, x1); x++) {
        this._set(x, y, id, temp, life);
      }
    }
  }

  _scatter(x0, y0, x1, y1, id, density = 0.25, temp = null) {
    for (let y = Math.max(0, y0); y <= Math.min(this.rows - 1, y1); y++) {
      for (let x = Math.max(0, x0); x <= Math.min(this.cols - 1, x1); x++) {
        if (rnd() < density) this._set(x, y, id, temp);
      }
    }
  }

  _tree(cx, ground, height, trunkId, leafId) {
    const trunkTop = ground - height;
    for (let y = trunkTop; y <= ground; y++) this._set(cx, y, trunkId);
    const radius = Math.max(2, Math.round(height * 0.32));
    for (let y = trunkTop - radius; y <= trunkTop + 2; y++) {
      for (let x = cx - radius; x <= cx + radius; x++) {
        const d = ((x - cx) ** 2) / (radius * radius) + ((y - trunkTop) ** 2) / (radius * radius * 0.8);
        if (d < 1 && rnd() < 0.82) this._set(x, y, leafId, null, 6 + Math.floor(rnd() * 5));
      }
    }
  }

  _scene_volcano() {
    const w = this.cols, h = this.rows;
    const ground = Math.floor(h * 0.78);
    const soil = this._id('Ziemia wulkaniczna');
    const basalt = this._id('Bazalt');
    const rock = this._id('Skała wulkaniczna');
    const tuf = this._id('Tuf wulkaniczny');
    const sand = this._id('Piasek bazaltowy');
    const water = this._id('Woda');
    const lava = this._id('Lawa');
    const ice = this._id('Lód');
    const snow = this._id('Śnieg świeży');
    const wood = this._id('Drewno dębowe');
    const leaves = this._id('Liść dębu');
    const crystal = this._id('Kryształ górski') || this._id('Kwarc');
    const metal = this._id('Blacha stalowa');
    const fire = this._id('Ogień');
    const smoke = this._id('Smuga dymu');

    // Layered volcanic crust.
    for (let y = ground; y < h; y++) {
      const depth = y - ground;
      const id = depth < 4 ? soil : depth < 10 ? basalt : depth < 16 ? rock : basalt;
      for (let x = 0; x < w; x++) {
        const edge = Math.sin(x * 0.07) * 1.6 + Math.sin(x * 0.017) * 2.2;
        if (y > ground + edge) this._set(x, y, id);
      }
    }
    // Sandy rim and dark beach.
    for (let x = 0; x < w; x++) {
      const rim = ground + Math.round(Math.sin(x * 0.07) * 1.6 + Math.sin(x * 0.017) * 2.2);
      if (rnd() < 0.6) this._set(x, rim, sand);
    }

    // Tall, jagged ice cliff on the left — it gives the scene a strong vertical anchor.
    const cliffTop = Math.floor(h * 0.30);
    for (let y = cliffTop; y < ground + 2; y++) {
      const t = (y - cliffTop) / Math.max(1, ground - cliffTop);
      const span = Math.round(2 + t * w * 0.085 + Math.sin(y * 0.55) * 1.3);
      for (let x = 2; x < 2 + span; x++) {
        if (rnd() < 0.94) this._set(x, y, ice, -14);
      }
    }
    this._scatter(2, cliffTop, Math.floor(w * 0.105), cliffTop + 9, snow, 0.72, -18);
    for (let i = 0; i < 12; i++) {
      const x = 4 + Math.floor(rnd() * Math.max(2, w * 0.055));
      const y = cliffTop + 4 + Math.floor(rnd() * Math.max(2, ground - cliffTop - 4));
      this._set(x, y, this._id('Lód lodowcowy') || ice, -18);
    }

    // The volcano itself: a broad cone rising from the crust into the sky.
    const peakY = Math.floor(h * 0.34);
    const cx = Math.floor(w * 0.50);
    const baseHalf = Math.floor(w * 0.185);
    const craterHalf = Math.max(3, Math.floor(w * 0.03));
    for (let y = peakY; y <= ground + 2; y++) {
      const t = (y - peakY) / Math.max(1, ground + 2 - peakY);
      const jag = Math.round(Math.sin(y * 0.37) * 1.3 + Math.sin(y * 0.11) * 0.9);
      const half = Math.max(craterHalf + 1, Math.round(craterHalf + (baseHalf - craterHalf) * Math.pow(t, 0.82)) + jag);
      const band = (y - peakY) % 26;
      for (let x = cx - half; x <= cx + half; x++) {
        let id = basalt;
        if (y < peakY + 11) id = rock;
        else if (band === 0) id = tuf;
        else if (band === 13) id = rock;
        if (rnd() < 0.012) id = this._id('Obsydian') || id;
        this._set(x, y, id, 34);
      }
    }
    // Crater bowl with a molten core and a lava overflow on the right flank.
    for (let y = peakY; y < peakY + 10; y++) {
      const t = (y - peakY) / 10;
      const half = Math.max(1, Math.round(craterHalf * (1 - t * 0.3)));
      for (let x = cx - half; x <= cx + half; x++) {
        if (y < peakY + 5) this._set(x, y, 0, 380);
        else this._set(x, y, lava, 1120);
      }
    }
    for (let y = peakY + 8; y < ground + 1; y++) {
      const t = (y - peakY) / Math.max(1, ground - peakY);
      const half = Math.round(craterHalf + (baseHalf - craterHalf) * Math.pow(t, 0.82));
      const x = cx + half - 1 + Math.round(Math.sin(y * 0.8) * 1.2);
      if (rnd() < 0.62) this._set(x, y, lava, 1050);
      if (rnd() < 0.28) this._set(x - 1, y, lava, 1000);
    }
    // A living plume: embers and ash above the crater.
    for (let i = 0; i < 14; i++) {
      const x = cx - 4 + Math.floor(rnd() * 9);
      const y = peakY - 1 - Math.floor(rnd() * 7);
      if (rnd() < 0.55) this._set(x, y, fire, 900 + rnd() * 300, 12 + Math.floor(rnd() * 16));
      else this._set(x, y, smoke, 190 + rnd() * 90);
    }

    // Water basin at the foot of the cone, with a dark sand rim.
    const poolL = Math.floor(w * 0.34), poolR = Math.floor(w * 0.62);
    const poolTop = ground - 6;
    for (let y = poolTop; y < ground + 4; y++) {
      for (let x = poolL; x <= poolR; x++) {
        const d = Math.abs(x - (poolL + poolR) / 2) / ((poolR - poolL) / 2);
        if (d < 0.94 && y >= ground - 3) this._set(x, y, water, 18);
      }
    }
    for (let x = poolL - 3; x <= poolR + 3; x++) {
      for (let y = ground - 3; y < ground + 2; y++) {
        if (rnd() < 0.35) this._set(x, y, sand);
      }
    }
    for (let x = poolL + 2; x <= poolR - 2; x++) {
      if (rnd() < 0.7) this._set(x, ground - 3, water, 18);
    }

    // Lava lake on the right, with a basalt rim and a channel from the cone.
    const lavaL = Math.floor(w * 0.74), lavaR = Math.floor(w * 0.92);
    for (let y = ground - 6; y < ground + 4; y++) {
      for (let x = lavaL; x <= lavaR; x++) {
        const d = Math.abs(x - (lavaL + lavaR) / 2) / ((lavaR - lavaL) / 2);
        if (d < 0.9) this._set(x, y, y > ground - 4 ? lava : 0, 1100);
      }
    }
    for (let x = lavaL - 2; x <= lavaR + 2; x++) {
      if (rnd() < 0.55) this._set(x, ground - 7, basalt, 80);
    }
    for (let x = Math.floor(w * 0.68); x < lavaL; x++) {
      for (let y = ground - 5; y < ground - 1; y++) {
        if (rnd() < 0.35) this._set(x, y, lava, 1040);
      }
    }
    for (let y = ground - 7; y < ground + 2; y++) {
      if (rnd() < 0.55) this._set(lavaL - 3 + Math.round(Math.sin(y) * 1), y, lava, 1050);
    }

    // Trees, crystals and moss on the sheltered left shelf.
    this._tree(Math.floor(w * 0.18), ground - 1, 13, wood, leaves);
    this._tree(Math.floor(w * 0.27), ground - 1, 9, this._id('Drewno sosnowe'), this._id('Liść sosny'));
    for (let i = 0; i < 9; i++) {
      const x = 8 + Math.floor(rnd() * 18);
      const y = ground - 2 - Math.floor(rnd() * 6);
      this._set(x, y, crystal, -5);
      if (rnd() < 0.5) this._set(x + 1, y + 1, crystal, -5);
    }
    this._scatter(5, ground - 2, Math.floor(w * 0.3), ground, this._id('Trawa'), 0.18);
    this._scatter(Math.floor(w * 0.12), ground - 3, Math.floor(w * 0.3), ground, this._id('Borowik'), 0.012);

    // A higher metal observation bridge over the pond, with lamps and supports.
    const bridgeY = ground - 24;
    this._rect(poolL - 5, bridgeY, poolR + 5, bridgeY + 1, metal, 20);
    this._rect(poolL - 5, bridgeY + 2, poolL - 4, ground - 4, this._id('Belka stalowa'), 20);
    this._rect(poolR + 4, bridgeY + 2, poolR + 5, ground - 4, this._id('Belka stalowa'), 20);
    for (let x = poolL - 2; x < poolR + 2; x += 7) this._set(x, bridgeY - 1, this._id('Lampa'), 20);

    // Floating reactive dust and distant embers for depth.
    this._scatter(Math.floor(w * 0.64), ground - 26, Math.floor(w * 0.72), ground - 10, this._id('Pył wulkaniczny') || sand, 0.035, 90);
    for (let i = 0; i < 6; i++) {
      this._set(Math.floor(w * 0.4 + rnd() * w * 0.2), peakY - 8 - Math.floor(rnd() * 12), this._id('Iskra'), 900, 18);
    }
  }

  _scene_garden() {
    const w = this.cols, h = this.rows;
    const ground = Math.floor(h * 0.77);
    const soil = this._id('Ziemia ogrodowa');
    const grass = this._id('Trawa');
    const water = this._id('Woda');
    const stone = this._id('Otoczaki');
    for (let y = ground; y < h; y++) for (let x = 0; x < w; x++) this._set(x, y, y < ground + 4 ? soil : this._id('Glina ceramiczna'));
    for (let x = 0; x < w; x++) if (rnd() < 0.7) this._set(x, ground - 1, grass);
    const poolL = Math.floor(w * 0.58), poolR = Math.floor(w * 0.82);
    for (let y = ground - 5; y < ground + 2; y++) for (let x = poolL; x <= poolR; x++) {
      if (y >= ground - 1) this._set(x, y, water, 19);
      else if (rnd() < 0.4) this._set(x, y, 0);
    }
    for (let x = poolL - 2; x <= poolR + 2; x++) if (rnd() < 0.4) this._set(x, ground - 2, stone);
    this._tree(Math.floor(w * 0.18), ground - 1, 15, this._id('Drewno bukowe'), this._id('Liść klonu'));
    this._tree(Math.floor(w * 0.35), ground - 1, 11, this._id('Drewno brzozowe'), this._id('Liść brzozy'));
    for (let i = 0; i < 18; i++) {
      const x = 4 + Math.floor(rnd() * (w * 0.5));
      const y = ground - 1 - Math.floor(rnd() * 4);
      this._set(x, y, this._id(['Róża', 'Tulipan', 'Lawenda', 'Mak', 'Chaber'][i % 5]), null, 4);
    }
    this._scatter(4, ground - 2, Math.floor(w * 0.5), ground - 1, this._id('Mech'), 0.12);
    for (let i = 0; i < 14; i++) this._set(6 + Math.floor(rnd() * 30), ground - 1, this._id('Pieczarka'), null, 5);
    // A little wildlife.
    for (let i = 0; i < 5; i++) this._set(8 + Math.floor(rnd() * 20), ground - 3, this._id('Pszczoła'), 24);
    this._set(Math.floor(w * 0.46), ground - 2, this._id('Królik'), 37);
    this._set(Math.floor(w * 0.5), ground - 2, this._id('Jeż'), 36);
    // Garden lights.
    for (let x = 10; x < w * 0.55; x += 12) this._set(x, ground - 8, this._id('Lampion'), 20);
  }

  _scene_lab() {
    const w = this.cols, h = this.rows;
    const floor = Math.floor(h * 0.8);
    const steel = this._id('Blacha stalowa');
    const concrete = this._id('Beton');
    for (let y = floor; y < h; y++) for (let x = 0; x < w; x++) this._set(x, y, y < floor + 3 ? steel : concrete);
    for (let x = 0; x < w; x += 8) this._set(x, floor - 1, this._id('Lampa UV'), 20);
    // Glass tanks.
    const tank = (x, y, tw, th, liquid) => {
      this._rect(x, y, x + tw, y + 1, this._id('Szkło hartowane'));
      this._rect(x, y + th - 1, x + tw, y + th, this._id('Szkło hartowane'));
      this._rect(x, y, x, y + th, this._id('Szkło hartowane'));
      this._rect(x + tw, y, x + tw, y + th, this._id('Szkło hartowane'));
      for (let yy = y + 2; yy < y + th - 1; yy++) for (let xx = x + 1; xx < x + tw; xx++) this._set(xx, yy, liquid, liquid === this._id('Lawa') ? 1000 : 20);
    };
    tank(Math.floor(w * 0.08), floor - 22, 18, 20, this._id('Woda'));
    tank(Math.floor(w * 0.32), floor - 22, 18, 20, this._id('Kwas siarkowy'));
    tank(Math.floor(w * 0.56), floor - 22, 18, 20, this._id('Lawa'));
    tank(Math.floor(w * 0.8), floor - 22, 18, 20, this._id('Woda radioaktywna'));
    // Metal pipe network and batteries.
    this._rect(Math.floor(w * 0.1), floor - 26, Math.floor(w * 0.9), floor - 25, this._id('Rura'), 20);
    for (let x = Math.floor(w * 0.1); x < w * 0.9; x += 9) this._set(x, floor - 24, this._id('Bateria'), 20);
    for (let i = 0; i < 12; i++) this._set(Math.floor(w * 0.05) + i * 6, floor - 2, this._id('Przewód miedziany'), 20);
    // A crystal and a small radioactive core behind lead.
    this._set(Math.floor(w * 0.52), floor - 4, this._id('Kryształ mocy'), 20);
    this._rect(Math.floor(w * 0.48), floor - 6, Math.floor(w * 0.5), floor - 2, this._id('Ołów'), 20);
    this._set(Math.floor(w * 0.47), floor - 5, this._id('Uran'), 70);
  }

  _scene_desert() {
    const w = this.cols, h = this.rows;
    const ground = Math.floor(h * 0.75);
    const sand = this._id('Piasek pustynny');
    const stone = this._id('Piaskowiec');
    for (let x = 0; x < w; x++) {
      const dune = Math.round(Math.sin(x * 0.045) * 4 + Math.sin(x * 0.11) * 1.5);
      for (let y = ground + dune; y < h; y++) this._set(x, y, y < ground + dune + 6 ? sand : stone);
    }
    for (let i = 0; i < 16; i++) {
      const x = Math.floor(rnd() * w);
      const y = ground + Math.round(Math.sin(x * 0.045) * 4) - 1;
      this._set(x, y, this._id(['Kaktus', 'Trawa', 'Sosna'][i % 3]) || this._id('Trawa'), null, 4);
    }
    // Oasis.
    const ox = Math.floor(w * 0.7), oy = ground + 2;
    for (let y = oy - 4; y < oy + 2; y++) for (let x = ox - 12; x < ox + 12; x++) if (rnd() < 0.75) this._set(x, y, this._id('Woda'), 18);
    for (let i = 0; i < 8; i++) this._set(ox - 14 + Math.floor(rnd() * 28), oy - 5, this._id('Palma') || this._id('Trawa'), null, 5);
    // Rocks and bones.
    this._scatter(0, ground - 4, w, ground, this._id('Otoczaki'), 0.02);
    this._set(Math.floor(w * 0.25), ground - 2, this._id('Żółw'), 25);
    this._set(Math.floor(w * 0.32), ground - 2, this._id('Jaszczurka'), 28);
  }

  _scene_space() {
    const w = this.cols, h = this.rows;
    const ground = Math.floor(h * 0.82);
    const regolith = this._id('Regolit księżycowy');
    const ice = this._id('Lód kometowy');
    for (let y = ground; y < h; y++) for (let x = 0; x < w; x++) this._set(x, y, regolith);
    for (let x = 0; x < w; x++) if (rnd() < 0.2) this._set(x, ground - 1, regolith);
    for (let i = 0; i < 10; i++) {
      const x = Math.floor(rnd() * w);
      const y = ground - 2 - Math.floor(rnd() * 6);
      this._set(x, y, ice, -80);
    }
    // Floating stars and a satellite.
    for (let i = 0; i < 28; i++) {
      const x = Math.floor(rnd() * w);
      const y = Math.floor(rnd() * ground * 0.6);
      this._set(x, y, this._id(['Materiał gwiazdowy', 'Pył gwiezdny', 'Plazma słoneczna'][i % 3]), 500);
    }
    const sx = Math.floor(w * 0.62), sy = Math.floor(h * 0.3);
    this._rect(sx, sy, sx + 12, sy + 2, this._id('Stop kosmiczny'));
    this._rect(sx + 5, sy + 3, sx + 7, sy + 6, this._id('Antena'));
    this._rect(sx - 4, sy + 1, sx - 1, sy + 3, this._id('Ogniwo słoneczne'));
    this._rect(sx + 13, sy + 1, sx + 16, sy + 3, this._id('Ogniwo słoneczne'));
    this._set(Math.floor(w * 0.25), ground - 4, this._id('Materiał meteorytu'), -50);
    this._set(Math.floor(w * 0.32), ground - 2, this._id('Sonda kosmiczna'), -40);
  }
}

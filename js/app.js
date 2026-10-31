/* SANDLAB application shell: library, filters, tools, modals and scene. */

import {
  loadIndex,
  loadStarter,
  loadCategory,
  getDef,
  findByName,
  allIndexMaterials,
  categories,
  isCategoryLoaded,
  getStarter,
} from './data.js';
import { SandEngine } from './sim.js';
import { drawMaterialIcon } from './textures.js';

const $ = (id) => document.getElementById(id);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const PAGE_SIZE = 48;
const FAV_KEY = 'sandlab:favorites:v1';
const HELP_KEY = 'sandlab:help:v1';

const STATE_COLORS = {
  solid: '#9fb3c8',
  powder: '#d8a96a',
  liquid: '#5db6ff',
  gas: '#7fd6c4',
  plasma: '#ff8aff',
  energy: '#ffe066',
  fire: '#ff7a45',
  plant: '#7ed957',
  organism: '#f2a65a',
  gel: '#8ad8e8',
  foam: '#bfeaff',
  paste: '#d8c8a8',
};

const app = {
  index: null,
  starter: null,
  engine: null,
  selected: null,
  filtered: [],
  shown: 0,
  filter: { q: '', cat: 'all', state: 'all', fav: false },
  favorites: new Set(),
  painting: false,
  lastPaint: null,
  hover: null,
  seeded: false,
  userInteracted: false,
  toastTimer: 0,
  hintTimer: 0,
  tempTimer: 0,
  lastFps: 60,
  reactionCount: 0,
};

/* ------------------------------------------------------------ helpers */

function normalize(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/\s+/g, ' ')
    .trim();
}

function stateColor(state) {
  return STATE_COLORS[state] || '#7d8f89';
}

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    if (raw) app.favorites = new Set(JSON.parse(raw));
  } catch { /* ignore */ }
  $('favCount').textContent = String(app.favorites.size);
}

function saveFavorites() {
  try { localStorage.setItem(FAV_KEY, JSON.stringify([...app.favorites])); } catch { /* ignore */ }
  $('favCount').textContent = String(app.favorites.size);
}

function setHint(text) {
  const el = $('stageHint');
  el.textContent = text;
  el.classList.remove('hidden');
  clearTimeout(app.hintTimer);
  app.hintTimer = setTimeout(() => el.classList.add('hidden'), 6500);
}

function hideHint() {
  clearTimeout(app.hintTimer);
  $('stageHint').classList.add('hidden');
}

function toast(title, detail, ms = 2800) {
  const el = $('reactionToast');
  el.replaceChildren();
  const b = document.createElement('b');
  b.textContent = title;
  const span = document.createElement('span');
  span.textContent = detail;
  el.append(b, span);
  el.hidden = false;
  requestAnimationFrame(() => el.classList.add('show'));
  clearTimeout(app.toastTimer);
  app.toastTimer = setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => { el.hidden = true; }, 280);
  }, ms);
}

function openModal(id) {
  const el = $(id);
  if (!el) return;
  el.hidden = false;
  const focusable = el.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusable) setTimeout(() => focusable.focus({ preventScroll: true }), 30);
}

function closeModal(id) {
  const el = $(id);
  if (el) el.hidden = true;
}

function closeAllModals() {
  $$('.modal-backdrop').forEach((el) => { el.hidden = true; });
}

function isMobile() {
  return window.matchMedia('(max-width: 900px)').matches;
}

function setSheetCollapsed(collapsed) {
  $('app').classList.toggle('sheet-collapsed', collapsed);
  $('sheetToggle').setAttribute('aria-label', collapsed ? 'Rozwiń bibliotekę' : 'Zwiń bibliotekę');
}

function ensureCategory(slug) {
  if (!slug || isCategoryLoaded(slug)) return Promise.resolve();
  return loadCategory(slug).catch((err) => {
    console.error(err);
    toast('Błąd wczytywania', 'Nie udało się pobrać kategorii materiałów.');
  });
}

async function ensureMaterial(entry) {
  if (!entry) return null;
  const existing = getDef(entry.id);
  if (existing) return existing;
  await ensureCategory(entry.category);
  return getDef(entry.id) || entry;
}

/* ------------------------------------------------------------ library */

function buildCategoryStrip() {
  const strip = $('categoryStrip');
  strip.replaceChildren();

  const all = document.createElement('button');
  all.className = 'cat-chip' + (app.filter.cat === 'all' ? ' active' : '');
  all.style.setProperty('--cat-color', '#c9ff4d');
  all.dataset.cat = 'all';
  all.innerHTML = '<span class="cat-ico"><svg><use href="#i-grid"/></svg></span><span>Wszystkie</span><span class="cat-count">1050</span>';
  all.addEventListener('click', () => setCategory('all'));
  strip.appendChild(all);

  for (const cat of categories()) {
    const btn = document.createElement('button');
    btn.className = 'cat-chip' + (app.filter.cat === cat.slug ? ' active' : '');
    btn.dataset.cat = cat.slug;
    btn.style.setProperty('--cat-color', cat.color);
    btn.title = `${cat.name} — ${cat.count} materiałów`;
    btn.innerHTML = `<span class="cat-ico"><svg><use href="#i-${cat.icon}"/></svg></span><span>${cat.short}</span><span class="cat-count">${cat.count}</span>`;
    btn.addEventListener('click', () => setCategory(cat.slug));
    strip.appendChild(btn);
  }
}

function setCategory(slug) {
  app.filter.cat = slug;
  $$('.cat-chip').forEach((el) => el.classList.toggle('active', el.dataset.cat === slug));
  if (slug !== 'all') {
    // lazy: warm the chunk for this category only
    ensureCategory(slug);
    const cat = categories().find((c) => c.slug === slug);
    if (cat) $('activeFilter').textContent = cat.name;
  } else {
    $('activeFilter').textContent = 'Wszystkie kategorie';
  }
  applyFilters(true);
}

function updateResults() {
  const total = app.filtered.length;
  $('resultsCount').innerHTML = `Pokazano <b>${app.shown}</b> z ${total} materiałów`;
  $('loadMore').hidden = app.shown >= total;
  $('emptyState').hidden = total !== 0;
  if (!app.filter.q && app.filter.cat === 'all') {
    $('activeFilter').textContent = 'Wszystkie kategorie';
  } else if (app.filter.q) {
    $('activeFilter').textContent = `Szukaj: ${app.filter.q}`;
  }
}

function applyFilters(reset = true) {
  const q = normalize(app.filter.q);
  const { cat, state, fav } = app.filter;
  app.filtered = allIndexMaterials().filter((m) => {
    if (cat !== 'all' && m.category !== cat) return false;
    if (state !== 'all' && m.state !== state) return false;
    if (fav && !app.favorites.has(m.id)) return false;
    if (q) {
      const hay = normalize(`${m.name} ${m.categoryName} ${m.stateLabel} ${m.movement}`);
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  app.shown = Math.min(app.filtered.length, PAGE_SIZE);
  if (reset) {
    $('materialGrid').replaceChildren();
    $('materialScroll').scrollTop = 0;
  }
  renderCards();
  updateResults();
}

function renderCards() {
  const grid = $('materialGrid');
  const start = grid.childElementCount;
  if (start >= app.shown) return;
  const frag = document.createDocumentFragment();
  for (let i = start; i < app.shown; i++) {
    const m = app.filtered[i];
    if (m) frag.appendChild(createCard(m));
  }
  grid.appendChild(frag);
}

function createCard(m) {
  const card = document.createElement('div');
  card.className = 'mat-card' + (app.selected && app.selected.id === m.id ? ' selected' : '');
  card.dataset.id = String(m.id);
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `${m.name}, ${m.categoryName}, ${m.stateLabel}`);

  const iconWrap = document.createElement('div');
  iconWrap.className = 'mat-icon-wrap';
  const icon = document.createElement('canvas');
  icon.className = 'mat-icon';
  icon.width = 40;
  icon.height = 40;
  drawMaterialIcon(icon, m, 40);
  iconWrap.appendChild(icon);

  const copy = document.createElement('div');
  copy.className = 'mat-copy';
  const name = document.createElement('span');
  name.className = 'mat-name';
  name.textContent = m.name;
  const sub = document.createElement('span');
  sub.className = 'mat-sub';
  const dot = document.createElement('span');
  dot.className = 'mat-state-dot';
  dot.style.setProperty('--dot', stateColor(m.state));
  const catName = document.createElement('span');
  catName.className = 'mat-cat-name';
  catName.textContent = m.categoryName;
  sub.append(dot, catName);
  copy.append(name, sub);

  const fav = document.createElement('button');
  fav.className = 'mat-fav' + (app.favorites.has(m.id) ? ' active' : '');
  fav.type = 'button';
  fav.textContent = app.favorites.has(m.id) ? '★' : '☆';
  fav.title = app.favorites.has(m.id) ? 'Usuń z ulubionych' : 'Dodaj do ulubionych';
  fav.setAttribute('aria-label', fav.title);
  fav.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFavorite(m, fav);
  });

  const info = document.createElement('button');
  info.className = 'mat-info';
  info.type = 'button';
  info.title = 'Szczegóły materiału';
  info.setAttribute('aria-label', `Szczegóły: ${m.name}`);
  info.innerHTML = '<svg><use href="#i-info"/></svg>';
  info.addEventListener('click', (e) => {
    e.stopPropagation();
    openDetail(m);
  });

  card.append(iconWrap, copy, fav, info);
  card.addEventListener('click', () => selectMaterial(m));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectMaterial(m);
    }
  });
  return card;
}

function toggleFavorite(m, btn) {
  if (app.favorites.has(m.id)) {
    app.favorites.delete(m.id);
    if (btn) { btn.classList.remove('active'); btn.textContent = '☆'; btn.title = 'Dodaj do ulubionych'; }
  } else {
    app.favorites.add(m.id);
    if (btn) { btn.classList.add('active'); btn.textContent = '★'; btn.title = 'Usuń z ulubionych'; }
  }
  saveFavorites();
  if (app.filter.fav) applyFilters(true);
}

function markSelectedCard() {
  $$('.mat-card').forEach((el) => {
    el.classList.toggle('selected', !!app.selected && Number(el.dataset.id) === app.selected.id);
  });
}

/* ------------------------------------------------------------ selection */

async function selectMaterial(entry, opts = {}) {
  const def = await ensureMaterial(entry);
  if (!def) return;
  app.selected = def;
  if (app.engine) app.engine.selectedId = def.id;

  $('stageMatName').textContent = def.name;
  $('footEmpty').hidden = true;
  $('footSelected').hidden = false;
  $('footCategory').textContent = def.categoryName || '—';
  $('footName').textContent = def.name;
  $('footState').textContent = `${def.stateLabel || def.state} · ${def.movementLabel || def.movement}`;
  drawMaterialIcon($('stageIcon'), def, 38);
  drawMaterialIcon($('footIcon'), def, 40);
  markSelectedCard();

  if (opts.collapse !== false && isMobile()) setSheetCollapsed(true);
  if (opts.hint !== false) {
    setHint(`Malujesz: ${def.name}. Przeciągnij palcem po planszy.`);
  }
}

/* ------------------------------------------------------------ detail */

async function openDetail(entry) {
  const modal = $('detailModal');
  openModal('detailModal');
  $('detailName').textContent = 'Wczytywanie…';
  $('detailCategory').textContent = '—';
  $('detailBehavior').textContent = 'Pobieram właściwości fizyczne i reakcje…';
  $('detailBadges').replaceChildren();
  $('detailStats').replaceChildren();
  $('detailReactions').replaceChildren();
  $('detailSelect').disabled = true;

  const def = await ensureMaterial(entry);
  if (!def || modal.hidden) return;

  $('detailCategory').textContent = def.categoryName || def.category;
  $('detailName').textContent = def.name;
  $('detailBehavior').textContent = def.behavior || 'Materiał bez opisu.';
  drawMaterialIcon($('detailIcon'), def, 96);

  const badges = $('detailBadges');
  const badge = (text, cls = '') => {
    const span = document.createElement('span');
    span.className = 'badge' + (cls ? ` ${cls}` : '');
    span.textContent = text;
    return span;
  };
  const stateBadge = badge(def.stateLabel || def.state, 'primary');
  badges.appendChild(stateBadge);
  const moveBadge = badge(def.movementLabel || def.movement, 'dot');
  moveBadge.style.setProperty('--badge-dot', stateColor(def.state));
  badges.appendChild(moveBadge);
  badges.appendChild(badge(def.categoryName || def.category));
  (def.tags || []).slice(0, 5).forEach((t) => badges.appendChild(badge(`#${t}`)));

  const stats = [
    ['Gęstość', def.density != null ? `${Math.round(def.density).toLocaleString('pl-PL')} kg/m³` : '—'],
    ['Twardość', def.hardness != null ? `${def.hardness} Mohs` : '—'],
    ['Topienie', def.melting != null ? `${Math.round(def.melting)}°C` : '—'],
    ['Wrzenie', def.boiling != null ? `${Math.round(def.boiling)}°C` : '—'],
    ['Zapłon', def.ignition != null ? `${Math.round(def.ignition)}°C` : '—'],
    ['Przewodność', def.conductivity != null ? `${def.conductivity.toFixed(2)} W/mK` : '—'],
    ['pH', def.ph != null ? def.ph.toFixed(1) : '—'],
    ['Promieniotwórczość', def.radioactivity != null ? `${Math.round(def.radioactivity * 100)}%` : '—'],
    ['Ciepło właściwe', def.specificHeat != null ? `${def.specificHeat.toFixed(2)} kJ/kgK` : '—'],
  ];
  const statGrid = $('detailStats');
  for (const [label, value] of stats) {
    const tile = document.createElement('div');
    tile.className = 'stat-tile';
    const l = document.createElement('span');
    l.textContent = label;
    const b = document.createElement('b');
    b.textContent = value;
    tile.append(l, b);
    statGrid.appendChild(tile);
  }

  const list = $('detailReactions');
  const reactions = (def.reactions && def.reactions.length)
    ? def.reactions
    : [`Stan: ${def.stateLabel || def.state}. Ruch: ${def.movementLabel || def.movement}.`];
  for (const r of reactions) {
    const li = document.createElement('li');
    li.textContent = r;
    list.appendChild(li);
  }

  $('detailSelect').disabled = false;
  $('detailSelect').onclick = () => {
    selectMaterial(def, { collapse: true });
    closeModal('detailModal');
  };
}

/* ------------------------------------------------------------ log */

function renderLog() {
  const list = $('logList');
  list.replaceChildren();
  const entries = [...(app.engine ? app.engine.reactions : [])].reverse();
  if (!entries.length) {
    const empty = document.createElement('div');
    empty.className = 'log-empty';
    empty.textContent = 'Dziennik jest pusty. Zacznij mieszać materiały, aby odkrywać reakcje.';
    list.appendChild(empty);
    return;
  }
  for (const entry of entries) {
    const row = document.createElement('div');
    row.className = 'log-entry';
    const dot = document.createElement('span');
    dot.className = 'log-dot';
    const copy = document.createElement('div');
    const b = document.createElement('b');
    b.textContent = entry.title;
    const span = document.createElement('span');
    span.textContent = entry.detail;
    copy.append(b, span);
    const time = document.createElement('time');
    time.textContent = new Date(entry.time).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    row.append(dot, copy, time);
    list.appendChild(row);
  }
}

function onReaction(entry) {
  app.reactionCount = app.engine
    ? app.engine.reactions.filter((r) => r.key !== 'start').length
    : app.reactionCount + (entry.key === 'start' ? 0 : 1);
  $('reactionCount').textContent = String(app.reactionCount);
  if (entry.key !== 'start' && app.userInteracted) {
    toast(entry.title, entry.detail);
  }
  if (!$('logModal').hidden) renderLog();
}

/* ------------------------------------------------------------ engine */

function setupEngine() {
  const canvas = $('world');
  const stage = $('stageCard');
  const engine = new SandEngine(canvas, {
    onReaction: (entry) => onReaction(entry),
  });
  app.engine = engine;
  window.__sandlab = app;

  const rect = stage.getBoundingClientRect();
  const cell = rect.width < 700 ? 4 : 5;
  engine._cellPx = cell;
  engine.resize(Math.floor(rect.width / cell), Math.floor(rect.height / cell));
  engine.seedScene();
  app.seeded = true;
  app.reactionCount = engine.reactions.filter((r) => r.key !== 'start').length;
  $('reactionCount').textContent = String(app.reactionCount);

  const ro = new ResizeObserver(() => {
    const r = stage.getBoundingClientRect();
    if (r.width < 40 || r.height < 40) return;
    const c = r.width < 700 ? 4 : 5;
    engine._cellPx = c;
    engine.resize(Math.floor(r.width / c), Math.floor(r.height / c));
    if (!app.seeded) { engine.seedScene(); app.seeded = true; }
  });
  ro.observe(stage);

  bindPointer(canvas, engine);
  requestAnimationFrame(loop);
}

function eventToCell(e, engine) {
  const rect = engine.canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  const x = Math.floor(((e.clientX - rect.left) / rect.width) * engine.cols);
  const y = Math.floor(((e.clientY - rect.top) / rect.height) * engine.rows);
  if (x < 0 || y < 0 || x >= engine.cols || y >= engine.rows) return null;
  return { x, y };
}

function bindPointer(canvas, engine) {
  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    app.userInteracted = true;
    canvas.setPointerCapture(e.pointerId);
    const cell = eventToCell(e, engine);
    if (!cell) return;
    app.painting = true;
    app.lastPaint = cell;
    engine.pointer = { x: cell.x, y: cell.y, inside: true };
    engine.paint(cell.x, cell.y, Math.max(1, engine.brush / 2), engine.tool, engine.selectedId);
    hideHint();
  });

  canvas.addEventListener('pointermove', (e) => {
    const cell = eventToCell(e, engine);
    if (!cell) {
      engine.pointer.inside = false;
      app.hover = null;
      return;
    }
    engine.pointer = { x: cell.x, y: cell.y, inside: true };
    app.hover = engine.cellInfo(cell.x, cell.y);
    if (app.painting && app.lastPaint) {
      engine.paintLine(app.lastPaint.x, app.lastPaint.y, cell.x, cell.y, Math.max(1, engine.brush / 2), engine.tool, engine.selectedId);
      app.lastPaint = cell;
    }
  });

  const end = (e) => {
    app.painting = false;
    app.lastPaint = null;
    if (e && e.pointerId != null && canvas.hasPointerCapture(e.pointerId)) {
      try { canvas.releasePointerCapture(e.pointerId); } catch { /* ignore */ }
    }
  };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);
  canvas.addEventListener('pointerleave', () => {
    engine.pointer.inside = false;
    app.hover = null;
    app.painting = false;
    app.lastPaint = null;
  });
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
}

function loop(now) {
  requestAnimationFrame(loop);
  const engine = app.engine;
  if (!engine) return;
  const t0 = performance.now();
  if (engine.running) engine.step();
  engine.render();
  const cost = performance.now() - t0;
  app.frameCost = app.frameCost ? app.frameCost * 0.9 + cost * 0.1 : cost;

  $('fps').textContent = `${app.frameCost.toFixed(0)} ms`;

  if (now - app.tempTimer > 420) {
    app.tempTimer = now;
    const info = app.hover;
    const t = info && info.def ? info.temp : engine.averageTemperature();
    $('tempStat').textContent = `${Math.round(t)}°C`;
  }
}

/* ------------------------------------------------------------ controls */

function bindControls() {
  // pause / step / clear
  $('playBtn').addEventListener('click', () => {
    const engine = app.engine;
    if (!engine) return;
    engine.running = !engine.running;
    updateRunState();
  });

  $('stepBtn').addEventListener('click', () => {
    const engine = app.engine;
    if (!engine) return;
    engine.step();
    engine.render();
    if (engine.running) {
      engine.running = false;
      updateRunState();
    }
  });

  $('clearBtn').addEventListener('click', () => {
    if (!app.engine) return;
    app.engine.clear();
    toast('Świat wyczyszczony', 'Pusta plansza czeka na nowy eksperyment.', 1900);
    setHint('Wybierz materiał i zacznij od nowa.');
  });

  // tools
  $$('.dock-btn.tool').forEach((btn) => {
    btn.addEventListener('click', () => {
      app.userInteracted = true;
      $$('.dock-btn.tool').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      app.engine.tool = btn.dataset.tool;
      const hints = {
        draw: 'Tryb rysowania: maluj wybranym materiałem.',
        erase: 'Gumka: usuwa materię z planszy.',
        heat: 'Podgrzewanie: dodaje ciepło i wywołuje przemiany.',
        cool: 'Ochładzanie: obniża temperaturę i zamraża.',
      };
      setHint(hints[btn.dataset.tool] || '');
    });
  });

  // brush
  const brush = $('brushRange');
  const applyBrush = () => {
    const v = Number(brush.value);
    if (app.engine) app.engine.brush = v;
    $('brushValue').textContent = String(v);
    brush.style.setProperty('--brush-pct', `${((v - 2) / 24) * 100}%`);
  };
  brush.addEventListener('input', applyBrush);
  applyBrush();

  // thermo
  $('thermoBtn').addEventListener('click', () => {
    if (!app.engine) return;
    app.engine.overlay = !app.engine.overlay;
    $('thermoBtn').classList.toggle('active', app.engine.overlay);
    setHint(app.engine.overlay ? 'Termowizja: niebieski = zimno, pomarańczowy = gorąco.' : 'Termowizja wyłączona.');
  });

  // search
  const search = $('searchInput');
  let searchTimer = 0;
  search.addEventListener('input', () => {
    app.filter.q = search.value.trim();
    $('clearSearch').hidden = !search.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => applyFilters(true), 110);
  });
  search.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      search.value = '';
      app.filter.q = '';
      $('clearSearch').hidden = true;
      applyFilters(true);
    }
  });
  $('clearSearch').addEventListener('click', () => {
    search.value = '';
    app.filter.q = '';
    $('clearSearch').hidden = true;
    applyFilters(true);
    search.focus();
  });
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      search.focus();
      search.select();
    }
    if (e.key === 'Escape') {
      const open = $$('.modal-backdrop').find((el) => !el.hidden);
      if (open) closeModal(open.id);
    }
  });

  // filters
  $('stateFilter').addEventListener('change', (e) => {
    app.filter.state = e.target.value;
    applyFilters(true);
  });
  $('favFilter').addEventListener('click', () => {
    app.filter.fav = !app.filter.fav;
    $('favFilter').classList.toggle('active', app.filter.fav);
    $('favFilter').setAttribute('aria-pressed', String(app.filter.fav));
    applyFilters(true);
  });
  const resetFilters = () => {
    app.filter = { q: '', cat: 'all', state: 'all', fav: false };
    search.value = '';
    $('clearSearch').hidden = true;
    $('stateFilter').value = 'all';
    $('favFilter').classList.remove('active');
    $$('.cat-chip').forEach((el) => el.classList.toggle('active', el.dataset.cat === 'all'));
    applyFilters(true);
  };
  $('resetFilter').addEventListener('click', resetFilters);
  $('emptyReset').addEventListener('click', resetFilters);

  // load more
  $('loadMore').addEventListener('click', () => {
    app.shown = Math.min(app.filtered.length, app.shown + PAGE_SIZE);
    renderCards();
    updateResults();
  });
  $('materialScroll').addEventListener('scroll', () => {
    const el = $('materialScroll');
    if (el.scrollTop + el.clientHeight > el.scrollHeight - 180) {
      if (app.shown < app.filtered.length) {
        app.shown = Math.min(app.filtered.length, app.shown + PAGE_SIZE);
        renderCards();
        updateResults();
      }
    }
  });

  // random
  $('randomBtn').addEventListener('click', async () => {
    app.userInteracted = true;
    const mats = allIndexMaterials();
    if (!mats.length) return;
    const m = mats[(Math.random() * mats.length) | 0];
    await selectMaterial(m, { hint: false });
    toast('Losowy materiał', `${m.name} — ${m.categoryName}`, 1900);
  });

  // sheet
  $('sheetGrab').addEventListener('click', () => setSheetCollapsed(!$('app').classList.contains('sheet-collapsed')));
  $('sheetToggle').addEventListener('click', () => setSheetCollapsed(!$('app').classList.contains('sheet-collapsed')));

  // selected chip / foot
  $('stageSelected').addEventListener('click', () => { if (app.selected) openDetail(app.selected); });
  $('footDetail').addEventListener('click', () => { if (app.selected) openDetail(app.selected); });

  // modals
  $('detailClose').addEventListener('click', () => closeModal('detailModal'));
  $('detailClose2').addEventListener('click', () => closeModal('detailModal'));
  $('helpBtn').addEventListener('click', () => openModal('helpModal'));
  $('helpClose').addEventListener('click', () => closeModal('helpModal'));
  $('helpStart').addEventListener('click', () => {
    try { localStorage.setItem(HELP_KEY, '1'); } catch { /* ignore */ }
    closeModal('helpModal');
  });
  $('logBtn').addEventListener('click', () => { renderLog(); openModal('logModal'); });
  $('reactionStat').addEventListener('click', () => { renderLog(); openModal('logModal'); });
  $('logClose').addEventListener('click', () => closeModal('logModal'));

  $$('.modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.hidden = true;
    });
  });
}

function updateRunState() {
  const engine = app.engine;
  if (!engine) return;
  const paused = !engine.running;
  $('statusPill').classList.toggle('paused', paused);
  $('simStatus').textContent = paused ? 'Symulacja wstrzymana' : 'Symulacja aktywna';
  $('playBtn').innerHTML = `<svg><use href="#i-${paused ? 'play' : 'pause'}"/></svg>`;
  $('playBtn').setAttribute('aria-label', paused ? 'Wznów symulację' : 'Wstrzymaj symulację');
}

/* ------------------------------------------------------------ boot */

async function boot() {
  loadFavorites();
  bindControls();

  try {
    app.index = await loadIndex();
    app.starter = await loadStarter();
    $('topCount').textContent = app.index.total.toLocaleString('pl-PL');
    buildCategoryStrip();

    const starterCats = (app.starter && app.starter.categories) || ['ciecze', 'piasek', 'ziemia'];
    await Promise.all(starterCats.map((slug) => ensureCategory(slug)));

    setupEngine();

    // choose water by default
    const water = findByName(['Woda']) || getDef(app.starter.materials[0]?.id) || null;
    if (water) {
      await selectMaterial(water, { collapse: false, hint: false });
    } else {
      const first = allIndexMaterials()[0];
      if (first) await selectMaterial(first, { collapse: false, hint: false });
    }

    applyFilters(true);
    updateRunState();

    setTimeout(() => {
      $('loadingScreen').classList.add('done');
      setTimeout(() => { $('loadingScreen').style.display = 'none'; }, 600);
    }, 180);

    if (!localStorage.getItem(HELP_KEY)) {
      setTimeout(() => openModal('helpModal'), 700);
    } else {
      setHint('Wybierz materiał z biblioteki i rysuj palcem po planszy.');
    }
  } catch (err) {
    console.error(err);
    $('loadingScreen').innerHTML = `<div class="loader-copy"><b>SANDLAB</b><span>Błąd wczytywania: ${err.message}</span></div>`;
  }
}

boot();

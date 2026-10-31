/* Data access: lightweight index, lazy category chunks, starter set. */

const state = {
  index: null,
  categories: new Map(),
  defs: new Array(1051).fill(null),
  byName: new Map(),
  bySlug: new Map(),
  loaded: new Set(),
  loading: new Map(),
  starter: null,
};

const listeners = new Set();

function notify() {
  for (const fn of listeners) {
    try { fn(); } catch (err) { console.error(err); }
  }
}

export function onMaterialsChanged(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function registerMaterials(materials, category) {
  for (const mat of materials) {
    const enriched = category ? {
      ...mat,
      categoryName: mat.categoryName || category.name,
    } : mat;
    state.defs[mat.id] = enriched;
    state.byName.set(mat.name, enriched);
    state.bySlug.set(mat.slug, enriched);
  }
}

export async function loadIndex() {
  if (state.index) return state.index;
  const res = await fetch('data/index.json', { cache: 'force-cache' });
  if (!res.ok) throw new Error(`Nie udało się wczytać indeksu (${res.status})`);
  state.index = await res.json();
  return state.index;
}

export async function loadStarter() {
  if (state.starter) return state.starter;
  const res = await fetch('data/starter.json', { cache: 'force-cache' });
  if (!res.ok) throw new Error(`Nie udało się wczytać scenariusza (${res.status})`);
  state.starter = await res.json();
  return state.starter;
}

export async function loadCategory(slug) {
  if (state.loaded.has(slug)) return state.categories.get(slug);
  if (state.loading.has(slug)) return state.loading.get(slug);

  const promise = (async () => {
    const res = await fetch(`data/materials/${slug}.json`, { cache: 'force-cache' });
    if (!res.ok) throw new Error(`Nie udało się wczytać kategorii ${slug} (${res.status})`);
    const data = await res.json();
    state.categories.set(slug, data);
    state.loaded.add(slug);
    registerMaterials(data.materials, data.category);
    notify();
    return data;
  })();

  state.loading.set(slug, promise);
  try {
    return await promise;
  } finally {
    state.loading.delete(slug);
  }
}

export function isCategoryLoaded(slug) {
  return state.loaded.has(slug);
}

export function getDef(id) {
  return state.defs[id] || null;
}

export function getIndexEntry(id) {
  return state.index ? state.index.materials.find((m) => m.id === id) : null;
}

export function findByName(names) {
  for (const name of names) {
    const found = state.byName.get(name);
    if (found) return found;
  }
  return null;
}

export function findFirst(predicate) {
  for (const def of state.defs) {
    if (def && predicate(def)) return def;
  }
  return null;
}

export function loadedDefs() {
  return state.defs.filter(Boolean);
}

export function allIndexMaterials() {
  return state.index ? state.index.materials : [];
}

export function categories() {
  return state.index ? state.index.categories : [];
}

export function getStarter() {
  return state.starter;
}

export function loadedCategories() {
  return [...state.loaded];
}

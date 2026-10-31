import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import categories1 from './categories-1.mjs'
import categories2 from './categories-2.mjs'
import categories3 from './categories-3.mjs'
import categories4 from './categories-4.mjs'
import categories5 from './categories-5.mjs'
import { resolveArchetype } from './archetypes/index.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'data')
const materialDir = join(outDir, 'materials')
const categories = [...categories1, ...categories2, ...categories3, ...categories4, ...categories5]

const STATE_LABELS = {
  solid: 'Ciało stałe',
  powder: 'Proszek',
  liquid: 'Ciecz',
  gas: 'Gaz',
  plasma: 'Plazma',
  energy: 'Energia',
  fire: 'Ogień',
  plant: 'Roślina',
  organism: 'Organizm',
  gel: 'Żel',
  foam: 'Piana',
  paste: 'Pasta'
}

const MOVEMENT_LABELS = {
  static: 'Pozostaje w miejscu',
  fall: 'Opada i tworzy kopce',
  flow: 'Rozlewa się',
  rise: 'Unosi się',
  grow: 'Rozrasta się',
  crawl: 'Pełznie po powierzchni',
  drift: 'Dryfuje',
  spark: 'Iskrzy i przeskakuje',
  pulse: 'Pulsuje'
}

const PATTERNS = ['grain', 'speckle', 'strata', 'crystal', 'fiber', 'bubble', 'scale', 'vein', 'spark', 'ring', 'wave', 'flame']
const STARTER_NAMES = [
  'Gleba próchniczna', 'Piasek kwarcowy', 'Granit', 'Woda', 'Lawa',
  'Trawa', 'Lód', 'Dąb', 'Węgiel drzewny', 'Tlen', 'Miedź'
]

function hashString(value) {
  let h = 2166136261
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function slugify(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/ł/g, 'l').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'material'
}

function clamp(n, min, max) { return Math.min(max, Math.max(min, n)) }

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}
function rgbToHex([r, g, b]) {
  return '#' + [r, g, b].map(v => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('')
}
function rgbToHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      default: h = (r - g) / d + 4
    }
    h /= 6
  }
  return [h, s, l]
}
function hslToRgb([h, s, l]) {
  h = ((h % 1) + 1) % 1
  if (s === 0) return [l * 255, l * 255, l * 255]
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const hue = (t) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  return [hue(h + 1 / 3) * 255, hue(h) * 255, hue(h - 1 / 3) * 255]
}

function makePalette(base, hash) {
  const hsl = rgbToHsl(hexToRgb(base))
  const hueShift = ((hash % 41) - 20) / 360
  const sat = clamp(hsl[1] * (0.85 + ((hash >>> 3) % 31) / 100), 0.18, 0.9)
  const light = clamp(hsl[2] * (0.88 + ((hash >>> 7) % 29) / 100), 0.18, 0.82)
  const h = hsl[0] + hueShift
  const baseHex = rgbToHex(hslToRgb([h, sat, light]))
  const lightHex = rgbToHex(hslToRgb([h, clamp(sat * 0.9, 0.12, 1), clamp(light + 0.16, 0.2, 0.94)]))
  const darkHex = rgbToHex(hslToRgb([h, clamp(sat * 1.05, 0.1, 1), clamp(light - 0.14, 0.06, 0.7)]))
  const accentHex = rgbToHex(hslToRgb([h + 0.11, clamp(sat * 1.15, 0.2, 1), clamp(light + 0.04, 0.2, 0.9)]))
  return { color: baseHex, palette: [lightHex, baseHex, darkHex, accentHex] }
}

function vary(value, hash, bits, pct, decimals = 1) {
  if (value === null || value === undefined) return null
  const factor = 1 + (((hash >>> bits) % 201) - 100) / 100 * pct
  return Number((value * factor).toFixed(decimals))
}

function makeReactions(tags, arch, stateLabel, categoryName) {
  const set = new Set()
  const add = (text) => { if (text) set.add(text) }
  const has = (tag) => tags.includes(tag)

  if (has('water')) {
    add('Z solami i cukrami: rozpuszcza je; z kwasami reaguje egzotermicznie.')
    add('Powyżej 100°C paruje; poniżej 0°C zamarza.')
  }
  if (has('acid')) add('Z metalami: wydziela wodór; z węglanami: burzy się i uwalnia CO₂.')
  if (has('base')) add('Z kwasami: neutralizacja i ciepło; z tłuszczami: zmydlanie.')
  if (has('carbonate')) add('Z kwasem: wydziela CO₂; podgrzany rozkłada się do tlenku.')
  if (has('metal')) add('Z tlenem: utlenia się; z kwasami: wydziela wodór.')
  if (has('noble')) add('Bardzo odporny: reaguje tylko z wodą królewską lub silnymi utleniaczami.')
  if (has('alkali') || has('water_reactive')) add('Z wodą: gwałtownie wydziela wodór i ciepło.')
  if (has('oxidizer')) add('Z paliwami: gwałtowne utlenianie, może wybuchnąć.')
  if (has('flammable') || has('fuel')) add('Z ogniem lub iskrą: zapala się i podtrzymuje spalanie.')
  if (has('explosive')) add('Pod wpływem ognia, iskry lub uderzenia: detonacja.')
  if (has('radioactive')) add('Emituje promieniowanie; osłabiane przez ołów, beton i wodę.')
  if (has('plant')) add('Z wodą i światłem: wzrost; z ogniem: spala się.')
  if (has('fungus') || has('bacteria') || has('virus') || has('microbe')) add('W wilgoci i cieple: namnaża się; środki dezynfekujące je niszczą.')
  if (has('food')) add('W cieple: psuje się; z ogniem: przypala się.')
  if (has('ice') || has('cold') || has('cryo')) add('Z ciepłem: topi się; z wodą: chłodzi ją i może zamrozić.')
  if (has('lava') || has('hot')) add('Z wodą: gwałtownie paruje; z palnymi: zapala je.')
  if (has('glass')) add('Z kwasem fluorowodorowym: trawi się; na ogół chemicznie obojętne.')
  if (has('ceramic')) add('Odporna na ciepło; pęka przy nagłym chłodzeniu.')
  if (has('polymer') || has('plastic') || has('rubber')) add('Topi się i pali; rozpuszcza się w niektórych rozpuszczalnikach.')
  if (has('paper') || has('wood') || has('cellulose')) add('Palne; chłonie wodę i gnije.')
  if (has('electronic') || has('conductive') || has('battery')) add('Przewodzi prąd; przegrzany może się spalić.')
  if (has('magnetic')) add('Przyciąga ferromagnetyki; traci magnetyzm powyżej temperatury Curie.')
  if (has('piezo')) add('Pod naciskiem wytwarza napięcie elektryczne.')
  if (has('space') || has('exotic')) add('Reaguje zgodnie z fizyką ekstremalną; może promieniować lub anihilować.')
  if (has('sulfur')) add('Palny; z tlenem tworzy SO₂, a z wodą — kwas siarkowy.')
  if (has('phosphorus') || has('pyrophoric')) add('Zapala się sam w powietrzu; reaguje z tlenem i wodą.')
  if (has('tar') || has('asphalt')) add('Lepki; po ochłodzeniu twardnieje, a po podgrzaniu dymi.')
  if (has('foam') || has('extinguisher')) add('Odcina tlen i chłodzi; gasi palne ciecze i ciała stałe.')
  if (has('seed') || has('spores')) add('Kiełkuje w wilgoci; wysokie ciepło je zabija.')

  if (set.size < 3) add('Reaguje z silnymi kwasami, utleniaczami i wysoką temperaturą.')
  if (set.size < 3) add(`W kontakcie z ogniem: ${arch.flammable > 0.45 ? 'zapala się' : 'nagrzewa się i może pęknąć'}.`)
  if (set.size < 3) add(`W wodzie: ${arch.solubility > 0.2 ? 'rozpuszcza się' : 'pozostaje nierozpuszczalny'}.`)
  if (set.size < 3) add(`W temperaturze ${arch.melting ?? 'brak danych'}°C: ${arch.melting ? 'topi się' : 'nie topi się w normalnych warunkach'}.`)
  add(`Kategoria: ${categoryName}; stan: ${stateLabel.toLowerCase()}.`)
  return [...set].slice(0, 6)
}

function validateCategory(cat, index) {
  if (!cat.slug || !cat.name || !cat.groups) throw new Error(`Błędna kategoria #${index + 1}`)
  const names = Object.values(cat.groups).flat()
  if (names.length !== 42) throw new Error(`${cat.slug}: ${names.length} materiałów, oczekiwano 42`)
}

const seenNames = new Set()
const seenSlugs = new Set()
const seenColors = new Set()
const seenSignatures = new Set()
let nextId = 1
const indexMaterials = []
const categoryMeta = []
const fullByCategory = {}

for (const [catIndex, cat] of categories.entries()) {
  validateCategory(cat, catIndex)
  const full = []
  for (const [group, names] of Object.entries(cat.groups)) {
    for (const name of names) {
      if (seenNames.has(name)) throw new Error(`Duplikat nazwy: ${name}`)
      seenNames.add(name)

      const resolved = resolveArchetype(cat.slug, group, name)
      if (!resolved.archetype) throw new Error(`Brak archetypu "${resolved.key}" dla ${cat.slug}/${group}/${name}`)
      const arch = resolved.archetype
      const hash = hashString(`${cat.slug}/${group}/${name}`)
      let slug = slugify(name)
      while (seenSlugs.has(slug)) slug += '-2'
      seenSlugs.add(slug)

      let palette = makePalette(arch.color, hash)
      let colorGuard = 0
      while (seenColors.has(palette.color) && colorGuard++ < 80) {
        const hsl = rgbToHsl(hexToRgb(palette.color))
        palette = makePalette(rgbToHex(hslToRgb([hsl[0] + 0.003, hsl[1], clamp(hsl[2] + 0.008, 0.1, 0.9)])), hash + colorGuard * 17)
      }
      seenColors.add(palette.color)

      const density = Number((vary(arch.density, hash, 2, 0.03, arch.density < 10 ? 3 : 1) ?? 1).toFixed(arch.density < 10 ? 3 : 1))
      const hardness = Number(clamp((arch.hardness ?? 0) + (((hash >>> 5) % 11) - 5) / 20, 0, 10).toFixed(1))
      const meltSpread = arch.melting === null || arch.melting === undefined ? 0 : Math.min(15, Math.max(2, Math.abs(arch.melting) * 0.02))
      const melting = arch.melting === null || arch.melting === undefined ? null : Math.round(arch.melting + (((hash >>> 7) % 2001) / 1000 - 1) * meltSpread)
      const boilSpread = arch.boiling === null || arch.boiling === undefined ? 0 : Math.min(20, Math.max(2, Math.abs(arch.boiling) * 0.02))
      const boiling = arch.boiling === null || arch.boiling === undefined ? null : Math.round(arch.boiling + (((hash >>> 9) % 2001) / 1000 - 1) * boilSpread)
      const igniteSpread = arch.ignition === null || arch.ignition === undefined ? 0 : Math.min(15, Math.max(2, Math.abs(arch.ignition) * 0.03))
      const ignition = arch.ignition === null || arch.ignition === undefined ? null : Math.round(arch.ignition + (((hash >>> 11) % 2001) / 1000 - 1) * igniteSpread)
      const conductivity = Number(clamp((arch.conductivity ?? 0) * (0.8 + ((hash >>> 13) % 41) / 100), 0, 80).toFixed(3))
      const ph = Number(clamp((arch.ph ?? 7) + (((hash >>> 15) % 9) - 4) / 10, 0, 14).toFixed(1))
      const radioactivity = Number(clamp((arch.radioactivity ?? 0) * (0.85 + ((hash >>> 17) % 31) / 100), 0, 1).toFixed(2))
      const solubility = Number(clamp((arch.solubility ?? 0) + (((hash >>> 19) % 11) - 5) / 100, 0, 1).toFixed(2))
      const flammable = Number(clamp((arch.flammable ?? 0) + (((hash >>> 21) % 11) - 5) / 100, 0, 1).toFixed(2))
      const specificHeat = Number((0.45 + ((hash >>> 23) % 150) / 100 + (arch.state === 'liquid' ? 0.4 : 0) + (arch.state === 'gas' ? 0.6 : 0)).toFixed(2))
      const thermalConductivity = Number(clamp(conductivity * 0.35 + (arch.state === 'solid' ? 0.12 : 0.03), 0.01, 30).toFixed(2))
      let signature = [density, hardness, melting, boiling, ignition, conductivity, ph, radioactivity, solubility, flammable, specificHeat].join('|')
      let guard = 0
      let uniqueSpecificHeat = specificHeat
      while (seenSignatures.has(signature) && guard++ < 200) {
        uniqueSpecificHeat = Number((uniqueSpecificHeat + 0.001).toFixed(3))
        signature = [density, hardness, melting, boiling, ignition, conductivity, ph, radioactivity, solubility, flammable, uniqueSpecificHeat].join('|')
      }
      seenSignatures.add(signature)

      const stateLabel = STATE_LABELS[arch.state] || 'Materiał'
      const movementLabel = MOVEMENT_LABELS[arch.movement] || 'Zachowuje się zgodnie z fizyką'
      const pattern = PATTERNS[(hash + PATTERNS.indexOf(arch.pattern || 'grain') * 5) % PATTERNS.length]
      const tags = [...new Set(arch.tags || [])]
      const material = {
        id: nextId++,
        slug,
        name,
        category: cat.slug,
        categoryName: cat.name,
        group,
        archetype: resolved.key,
        state: arch.state,
        stateLabel,
        movement: arch.movement,
        movementLabel,
        density,
        hardness,
        melting,
        boiling,
        ignition,
        conductivity,
        thermalConductivity,
        specificHeat: uniqueSpecificHeat,
        ph,
        radioactivity,
        solubility,
        flammable,
        temperature: arch.temperature ?? 20,
        tags,
        behavior: arch.behavior,
        reactions: makeReactions(tags, arch, stateLabel, cat.name),
        color: palette.color,
        palette: palette.palette,
        pattern,
        seed: hash % 251
      }
      full.push(material)
      indexMaterials.push({
        id: material.id,
        name: material.name,
        slug: material.slug,
        category: material.category,
        categoryName: material.categoryName,
        state: material.state,
        stateLabel: material.stateLabel,
        movement: material.movement,
        color: material.color,
        palette: material.palette,
        pattern: material.pattern,
        seed: material.seed
      })
    }
  }
  fullByCategory[cat.slug] = full
  categoryMeta.push({ slug: cat.slug, name: cat.name, short: cat.short, color: cat.color, icon: cat.icon, count: full.length })
}

if (indexMaterials.length < 1000) throw new Error(`Za mało materiałów: ${indexMaterials.length}`)
if (seenNames.size !== indexMaterials.length) throw new Error('Niespójna liczba nazw')

rmSync(materialDir, { recursive: true, force: true })
mkdirSync(materialDir, { recursive: true })
for (const cat of categoryMeta) {
  writeFileSync(join(materialDir, `${cat.slug}.json`), JSON.stringify({ category: cat, materials: fullByCategory[cat.slug] }))
}
writeFileSync(join(outDir, 'index.json'), JSON.stringify({
  version: 1,
  total: indexMaterials.length,
  categoryCount: categoryMeta.length,
  categories: categoryMeta,
  materials: indexMaterials
}))
const starter = indexMaterials.filter(m => STARTER_NAMES.includes(m.name)).map(m => ({ id: m.id, name: m.name, category: m.category }))
writeFileSync(join(outDir, 'starter.json'), JSON.stringify({ materials: starter, categories: [...new Set(starter.map(m => m.category))] }))
console.log(`OK: ${indexMaterials.length} materiałów, ${categoryMeta.length} kategorii, ${seenColors.size} unikalnych kolorów.`)
console.log(categoryMeta.map(c => `${c.slug}:${c.count}`).join(' '))

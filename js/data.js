import { CATALOG_A } from './catalog-a.js';
import { CATALOG_B } from './catalog-b.js';
import { CATALOG_C } from './catalog-c.js';
import { PROFILES, TAG_LABELS } from './profiles.js';

// Four phase-change products are also real, selectable materials. They live in
// the temperature/ice categories and push the library above the 1000 mark.
const EXTRA = [
  { cat: 'fire', kind: 'molten', name: 'Szkło stopione' },
  { cat: 'ice', kind: 'cold_solid', name: 'Lód organiczny' },
  { cat: 'ice', kind: 'cold_solid', name: 'Lód kwasowy' },
  { cat: 'ice', kind: 'cold_solid', name: 'Lód zasadowy' },
];

const KIND_OVERRIDES = {
  'Rtęć': 'mercury',
  'Lawa bazaltowa': 'molten',
  'Mroźny pył': 'cold_powder',
  'Zamieć': 'cold_gas',
  'Kondensat': 'cold_liquid',
  'Szron': 'cold_powder',
  'Grad': 'cold_powder',
  'Suchy lód': 'cold_solid',
  'Kriogeniczny żel': 'cold_liquid',
  'Sól rozmrażająca': 'cold_solid',
  'Mieszanka chłodząca': 'cold_powder',
  'Szron krystaliczny': 'cold_powder',
  'Mgła lodowa': 'cold_gas',
  'Grad lodowy': 'cold_powder',
  'Zamarznięta mgła': 'cold_gas',
  'Śryż': 'cold_powder',
  'Śnieg z deszczem': 'cold_liquid',
  'Zamieć śnieżna': 'cold_gas',
};

const COLOR_OVERRIDES = {
  'Woda': '#3a9ee8', 'Woda słona': '#2f86c7', 'Woda destylowana': '#65c9f2',
  'Woda mineralna': '#4eb6de', 'Woda morska': '#1f6f9e', 'Woda ciężka': '#4f9ab5',
  'Woda utleniona': '#9fe4ee', 'Woda królewska': '#d7a52a',
  'Lawa': '#ff5a18', 'Magma': '#ff3b0f', 'Metal stopiony': '#ffb33b',
  'Lawa bazaltowa': '#e94516', 'Ogień': '#ff7a00', 'Płomień świecy': '#ffb52e',
  'Płomień alkoholowy': '#4d8dff', 'Płomień gazowy': '#4ba7ff', 'Płomień magnezowy': '#fff6d6',
  'Płomień sodu': '#ffd12e', 'Płomień miedzi': '#4de1a4', 'Płomień zimny': '#7a7dff',
  'Złoto': '#f4c542', 'Srebro': '#d9e1e8', 'Miedź': '#c76b3a', 'Żelazo': '#7e8993',
  'Aluminium': '#b8c1c8', 'Ołów': '#6b717b', 'Cyna': '#b8b3a2', 'Tytan': '#9fa9b4',
  'Rtęć': '#c9d2d8', 'Uran': '#7cae43', 'Pluton': '#8b9a4c', 'Rad': '#c8f06a',
  'Diament': '#c8f4ff', 'Rubin': '#cf2b4f', 'Szafir': '#275cd6', 'Szmaragd': '#1f9f64',
  'Ametyst': '#8b55c7', 'Topaz': '#e7b63c', 'Opal': '#d7b8dd', 'Turmalin': '#d05a9f',
  'Granit': '#8f8580', 'Bazalt': '#454b50', 'Wapień': '#c5b99d', 'Marmur': '#e3dfd3',
  'Obsydian': '#1f222b', 'Pumeks': '#9b958c', 'Piasek kwarcowy': '#e4c987',
  'Piasek pustynny': '#dcae66', 'Piasek plażowy': '#f0d9a2', 'Piasek bazaltowy': '#4d4a43',
  'Piasek zielony': '#7f9c66', 'Piasek magnetyczny': '#3d3b39',
  'Krew': '#a51f28', 'Trawa': '#3f9d43', 'Mech': '#4f7d3d', 'Róża': '#d73557',
  'Tulipan': '#e8424a', 'Słonecznik': '#f2c22b', 'Lawenda': '#8b72d8',
  'Jabłko': '#c92f38', 'Banan': '#f0d04a', 'Pomarańcza': '#ee8b20', 'Cytryna': '#e7dc3f',
  'Winogrono': '#6a3d8f', 'Truskawka': '#d92836', 'Arbuz': '#4c9c4f', 'Mango': '#efad2d',
  'Chleb': '#b98045', 'Ser': '#e3c05b', 'Mleko': '#f1efe2', 'Mięso mielone': '#a24e4c',
  'Cegła czerwona': '#a74d3a', 'Cement': '#a5a19a', 'Beton': '#8f918e', 'Asfalt': '#3a3c40',
  'Drewno dębowe': '#8a5a34', 'Drewno sosnowe': '#c28d51', 'Drewno hebanowe': '#2e2523',
  'Papier': '#e5ddc8', 'Karton': '#b78e58', 'Szkło sodowe': '#9bd4df',
  'Szkło ołowiowe': '#c5e7f1', 'Szkło borokrzemowe': '#a9d9d0', 'Porcelana': '#f0eee6',
  'Terakota': '#b65f3f', 'Lód': '#a9e4f4', 'Śnieg świeży': '#eef8ff', 'Suchy lód': '#d7f4f4',
  'Regolit księżycowy': '#8f8e8a', 'Pył marsjański': '#b8613e', 'Plazma słoneczna': '#ffd44a',
  'Antymateria': '#c15bff', 'Ciemna materia': '#2b1a44', 'Neon dekoracyjny': '#ff3d9a',
  'Mikroprocesor': '#3d5b49', 'Złom': '#7c6655', 'Ropa naftowa': '#1f2020',
  'Węgiel kamienny': '#242628', 'Węgiel brunatny': '#4d3928', 'Torf': '#493b28',
};

const FREEZE_BY_KIND = {
  water: 'Lód', organic_liquid: 'Lód organiczny', acid: 'Lód kwasowy', base: 'Lód zasadowy',
  cryo_liquid: 'Lód kriogeniczny', fuel_liquid: 'Lód organiczny', molten: 'Bazalt',
  metal: 'Żelazo', rare_metal: 'Żelazo', alloy: 'Żelazo', alkali: 'Sód',
  special_metal: 'Żelazo', mercury: null, vapor: 'Woda', hot_vapor: 'Woda',
  adhesive: 'Lód organiczny', dairy: 'Lód', cryo: 'Lód kriogeniczny',
  industrial_chem: 'Lód organiczny', industrial_waste: 'Lód organiczny',
};

const VALUE_OVERRIDES = {
  'Woda': { d: 1.0, melt: 0, boil: 100, cond: 0.6, heat: 4182, flam: 0, visc: 1, disp: 7, temp: 20, tags: ['water', 'solvent'] },
  'Woda morska': { d: 1.025, melt: -1.8, boil: 102, cond: 0.58, heat: 3990, temp: 18 },
  'Woda słona': { d: 1.12, melt: -6, boil: 104, cond: 0.55, heat: 3850, temp: 18 },
  'Woda ciężka': { d: 1.11, melt: 3.8, boil: 101.4, cond: 0.61, heat: 4220, temp: 20 },
  'Woda utleniona': { d: 1.45, melt: -0.4, boil: 150.2, cond: 0.58, heat: 2600, temp: 18 },
  'Woda królewska': { d: 1.2, melt: -20, boil: 108, cond: 0.7, heat: 3000, temp: 18, tags: ['acid', 'corrosive', 'water'] },
  'Rtęć': { d: 13.534, melt: -38.8, boil: 356.7, cond: 8.3, heat: 140, visc: 1, disp: 6, temp: 20 },
  'Złoto': { d: 19.3, melt: 1064, boil: 2856, cond: 318, heat: 129, hard: 2.5 },
  'Srebro': { d: 10.49, melt: 961.8, boil: 2162, cond: 429, heat: 235, hard: 2.5 },
  'Miedź': { d: 8.96, melt: 1084.6, boil: 2562, cond: 401, heat: 385, hard: 3 },
  'Żelazo': { d: 7.87, melt: 1538, boil: 2861, cond: 80, heat: 449, hard: 4 },
  'Aluminium': { d: 2.7, melt: 660.3, boil: 2470, cond: 237, heat: 897, hard: 2.75 },
  'Ołów': { d: 11.34, melt: 327.5, boil: 1749, cond: 35.3, heat: 129, hard: 1.5 },
  'Tytan': { d: 4.51, melt: 1668, boil: 3287, cond: 21.9, heat: 523, hard: 6 },
  'Wolfram': { d: 19.25, melt: 3422, boil: 5555, cond: 173, heat: 134, hard: 7.5 },
  'Platyna': { d: 21.45, melt: 1768, boil: 3825, cond: 71.6, heat: 133, hard: 4 },
  'Diament': { d: 3.51, melt: 3550, boil: 4027, cond: 2000, heat: 509, hard: 10, tags: ['mineral', 'inert'] },
  'Lód': { d: 0.917, melt: 0, boil: 100, cond: 2.22, heat: 2050, temp: -8 },
  'Śnieg świeży': { d: 0.12, melt: 0, boil: 100, temp: -12 },
  'Lawa': { d: 2.8, melt: 900, boil: 2400, temp: 1150, cond: 2.5, visc: 72, disp: 2 },
  'Magma': { d: 2.6, melt: 850, boil: 2300, temp: 1320, cond: 2.2, visc: 84, disp: 1.5 },
  'Metal stopiony': { d: 7.2, melt: 1200, boil: 2900, temp: 1500, cond: 30, visc: 45, disp: 2 },
  'Szkło stopione': { d: 2.5, melt: 700, boil: 2300, temp: 1250, cond: 2, visc: 92, disp: 1 },
  'Ciekły azot': { d: 0.808, melt: -210, boil: -196, temp: -196, cond: 0.14, heat: 1040 },
  'Ciekły tlen': { d: 1.141, melt: -218.8, boil: -183, temp: -183, cond: 0.15, heat: 1700 },
  'Ciekły hel': { d: 0.145, melt: -272, boil: -269, temp: -269, cond: 0.02, heat: 5200 },
  'Ciekły wodór': { d: 0.07, melt: -259, boil: -253, temp: -253, cond: 0.1, heat: 9700 },
  'Suchy lód': { d: 1.56, melt: -78, boil: -78, temp: -78, cond: 0.15, heat: 850 },
  'Piorun': { temp: 30000, glow: 1 },
  'Łuk elektryczny': { temp: 6000, glow: 1 },
  'Plazma słoneczna': { temp: 5500, glow: 1 },
  'Korona słoneczna': { temp: 8000, glow: 1 },
  'Antymateria': { temp: 20, glow: 0.9, radio: 100 },
};

const REACTION_TEMPLATES = {
  fuel: [['Ogień', 'zapłon', 'popiół + dym'], ['Tlen', 'spalanie', 'CO₂ + ciepło'], ['Woda', 'chłodzenie', 'para wodna']],
  explosive: [['Ogień', 'detonacja', 'fala ciśnienia + ogień'], ['Iskra', 'zapłon', 'wybuch'], ['Woda', 'zwilżenie', 'utrata właściwości']],
  water: [['Lawa', 'odparowanie', 'para + kamień'], ['Kwas', 'rozcieńczenie', 'ciepło'], ['Sól', 'rozpuszczenie', 'solanka']],
  acid: [['Metal', 'roztwarzanie', 'sól + wodór'], ['Zasada', 'neutralizacja', 'sól + woda'], ['Węglan', 'reakcja', 'CO₂ + ciepło']],
  base: [['Kwas', 'neutralizacja', 'sól + woda'], ['Tłuszcz', 'zmydlanie', 'mydło'], ['Metal', 'korozja', 'wodór']],
  metal: [['Kwas', 'roztwarzanie', 'sól + wodór'], ['Tlen', 'utlenianie', 'tlenek metalu'], ['Woda', 'korozja', 'rdza']],
  conductor: [['Prąd', 'przewodzenie', 'ciepło'], ['Woda', 'zwarcie', 'iskra'], ['Magnes', 'indukcja', 'pole elektryczne']],
  electric: [['Metal', 'przewodzenie', 'impuls'], ['Woda', 'elektroliza', 'wodór + tlen'], ['Izolator', 'przebicie', 'iskra']],
  hot: [['Woda', 'odparowanie', 'para'], ['Lód', 'topnienie', 'woda'], ['Paliwo', 'zapłon', 'ogień']],
  cold: [['Ciepło', 'topnienie', 'woda'], ['Woda', 'zamrożenie', 'lód'], ['Metal', 'skurcz', 'pęknięcie']],
  fire: [['Paliwo', 'zapłon', 'ogień'], ['Woda', 'gwałtowne chłodzenie', 'para'], ['Tlen', 'intensyfikacja', 'większy płomień']],
  gas: [['Iskra', 'zapłon', 'płomień'], ['Woda', 'rozpuszczanie', 'roztwór'], ['Ciepło', 'rozszerzanie', 'spadek gęstości']],
  toxic: [['Organizm', 'zatrucie', 'uszkodzenie'], ['Woda', 'skażenie', 'trucizna'], ['Węgiel', 'adsorpcja', 'oczyszczenie']],
  radioactive: [['Woda', 'skażenie', 'woda radioaktywna'], ['Organizm', 'mutacja', 'uszkodzenie DNA'], ['Ołów', 'osłona', 'pochłanianie']],
  mineral: [['Kwas', 'trawienie', 'sól + gaz'], ['Ciepło', 'topnienie', 'lawa'], ['Woda', 'erozja', 'osad']],
  inert: [['Kwas', 'odporność', 'brak zmian'], ['Ciepło', 'rozszerzanie', 'naprężenie'], ['Tarcie', 'iskra', 'ładunek']],
  oxide: [['Węgiel', 'redukcja', 'metal + CO₂'], ['Kwas', 'roztwarzanie', 'sól + woda'], ['Wodór', 'redukcja', 'metal + para']],
  salt: [['Woda', 'rozpuszczenie', 'solanka'], ['Kwas', 'wymiana', 'nowa sól'], ['Ciepło', 'topnienie', 'stop']],
  organic: [['Ogień', 'spalanie', 'popiół + dym'], ['Pleśń', 'gnicie', 'rozkład'], ['Woda', 'hydroliza', 'zmiana struktury']],
  plant: [['Woda', 'wzrost', 'nowe pędy'], ['Ogień', 'spalanie', 'popiół'], ['Grzyb', 'infekcja', 'rozkład']],
  fungus: [['Materia organiczna', 'rozkład', 'humus'], ['Woda', 'wzrost', 'kolonia'], ['Ciepło', 'sterylizacja', 'obumarcie']],
  animal: [['Ogień', 'zwęglenie', 'popiół'], ['Woda', 'utopienie', 'bezruch'], ['Grzyb', 'infekcja', 'rozkład']],
  food: [['Pleśń', 'psucie', 'rozkład'], ['Ogień', 'zwęglenie', 'węgiel'], ['Woda', 'namaczanie', 'mięknięcie']],
  plastic: [['Ogień', 'spalanie', 'sadza + dym'], ['Ciepło', 'mięknienie', 'odkształcenie'], ['Rozpuszczalnik', 'rozpuszczenie', 'żel']],
  glass: [['Ciepło', 'mięknienie', 'odkształcenie'], ['Kwas fluorowodorowy', 'trawienie', 'matowienie'], ['Tarcie', 'iskra', 'rysy']],
  ceramic: [['Ciepło', 'naprężenie', 'pęknięcie'], ['Kwas', 'odporność', 'brak zmian'], ['Uderzenie', 'kruche pęknięcie', 'odłamki']],
  crystal: [['Ciepło', 'topnienie', 'stop'], ['Woda', 'rozpuszczenie', 'roztwór'], ['Uderzenie', 'pęknięcie', 'odłamki']],
  space: [['Atmosfera', 'ablacja', 'plazma'], ['Grawitacja', 'spadek', 'zderzenie'], ['Ciepło', 'sublimacja', 'gaz']],
  special: [['Prąd', 'aktywacja', 'impuls'], ['Ciepło', 'zmiana fazy', 'nowa struktura'], ['Pole', 'rezonans', 'emisja']],
  tech: [['Prąd', 'aktywacja', 'sygnał'], ['Woda', 'zwarcie', 'iskra'], ['Ciepło', 'przegrzanie', 'awaria']],
  building: [['Woda', 'nasiąkanie', 'osłabienie'], ['Ciepło', 'naprężenie', 'pęknięcie'], ['Kwas', 'korozja', 'uszkodzenie']],
  industrial: [['Woda', 'reakcja', 'osad'], ['Ciepło', 'rozkład', 'gaz'], ['Kwas', 'korozja', 'sól']],
  decor: [['Ciepło', 'odkształcenie', 'uszkodzenie'], ['Woda', 'nasiąkanie', 'plama'], ['Uderzenie', 'tłuczenie', 'odłamki']],
  tool: [['Ciepło', 'odkształcenie', 'utrata ostrości'], ['Woda', 'korozja', 'rdza'], ['Uderzenie', 'zużycie', 'wyszczerbienie']],
  energy: [['Metal', 'przewodzenie', 'impuls'], ['Woda', 'rozproszenie', 'ciepło'], ['Izolator', 'pochłanianie', 'osłabienie']],
  exotic: [['Materia zwykła', 'anihilacja', 'energia'], ['Pole', 'fluktuacja', 'niestabilność'], ['Grawitacja', 'zakrzywienie', 'zapadnięcie']],
};

const PHASE_TEXT = {
  'Lawa': 'lawa', 'Magma': 'magma', 'Metal stopiony': 'stop', 'Szkło stopione': 'stop szkła',
  'Woda': 'woda', 'Lód': 'lód', 'Para wodna': 'para', 'Smuga dymu': 'dym',
  'Popiół gorący': 'popiół', 'Węgiel żarzący': 'węgiel', 'Sadza': 'sadza',
  'Pył radioaktywny': 'pył', 'Żużel uranowy': 'żużel', 'Kula ognia': 'kula ognia',
};

function hashString(value) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
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

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const rangeValue = (rng, range, digits = 2) => {
  if (!range) return null;
  const value = range[0] + rng() * (range[1] - range[0]);
  return Number(value.toFixed(digits));
};

function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = clamp(s, 0, 100) / 100;
  l = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return '#' + [r, g, b].map(v => Math.round((v + m) * 255).toString(16).padStart(2, '0')).join('');
}

function hexToRgb(hex) {
  const value = hex.replace('#', '');
  return [parseInt(value.slice(0, 2), 16), parseInt(value.slice(2, 4), 16), parseInt(value.slice(4, 6), 16)];
}

function shade(hex, amount) {
  const [r, g, b] = hexToRgb(hex);
  const mix = amount >= 0 ? 255 : 0;
  const k = Math.abs(amount);
  return '#' + [r, g, b].map(v => Math.round(v + (mix - v) * k).toString(16).padStart(2, '0')).join('');
}

function behaviorFor(m) {
  const density = m.density;
  const visc = m.viscosity;
  const state = m.sim;
  if (state === 'powder') {
    const buoy = density < 1 ? 'unosi się na wodzie' : 'tonie w wodzie';
    return `Sypki: osypuje się po zboczu, ${buoy}. Kąt usypu ~${Math.round(24 + (m.dispersion ?? 2) * 5)}°, wilgotność zmienia spójność.`;
  }
  if (state === 'liquid') {
    const layer = density < 1 ? 'tworzy warstwę na wodzie' : 'opada pod wodę';
    return `Płynie i wyrównuje poziom; ${layer}. Lepkość ${visc}/100, rozlewanie ${m.dispersion}/10${m.flammability > 60 ? ', łatwopalna' : ''}.`;
  }
  if (state === 'gas') {
    return `Unosi się i dyfunduje; gęstość ${density.toFixed(4)} g/cm³. Miesza się z powietrzem, wypiera cięższe gazy.`;
  }
  if (state === 'fire') {
    return `Płomień unosi się, emituje ciepło ${Math.round(m.temperature)}°C i gaśnie po wyczerpaniu paliwa. Reaguje z wodą i paliwami.`;
  }
  if (state === 'energy') {
    return `Impuls energii przemieszcza się i słabnie. Przewodzi się przez metale, jonizuje gazy, podnosi temperaturę otoczenia.`;
  }
  if (state === 'plant') {
    return `Rośnie w kontakcie z wodą i światłem; rozrasta się na wolne komórki. Wysoka temperatura i ogień zamieniają ją w popiół.`;
  }
  if (state === 'fungus') {
    return `Kolonia rozprzestrzenia się na materii organicznej. Wilgoć przyspiesza wzrost, ciepło i chemia mogą ją sterylizować.`;
  }
  if (state === 'animal') {
    return `Organizm porusza się po podłożu, spada i unika przeszkód. W wodzie traci mobilność, ogień zwęgla tkanki.`;
  }
  if (state === 'tech') {
    return `Moduł statyczny; przewodzi impulsy, grzeje się pod obciążeniem. Woda powoduje zwarcie, ciepło może uszkodzić strukturę.`;
  }
  if (state === 'radioactive') {
    return `Emituje promieniowanie i ciepło. Skaża sąsiednie materiały, zwłaszcza wodę i organizmy; ołów osłabia emisję.`;
  }
  if (state === 'solid') {
    const phase = m.melt == null ? 'nie topi się w normalnym zakresie' : `topi się w ${Math.round(m.melt)}°C`;
    return `Statyczny; ${phase}. ${m.hardness >= 6 ? 'Twardy i kruchy' : 'Odporny na odkształcenia'} — pęka przy nagłym chłodzeniu.`;
  }
  return `Materiał specjalny; zachowuje się niestandardowo i reaguje na pole, ciepło oraz sąsiedztwo innych materiałów.`;
}

function buildReactionNotes(material, index) {
  const candidates = [];
  const seen = new Set();
  for (const tag of material.tags) {
    const list = REACTION_TEMPLATES[tag];
    if (!list) continue;
    for (const item of list) {
      const key = item.join('|');
      if (seen.has(key)) continue;
      seen.add(key);
      candidates.push(item);
    }
  }
  if (candidates.length < 3) {
    candidates.push(['Ciepło', 'przemiana fazowa', material.meltName ? PHASE_TEXT[material.meltName] || 'nowa faza' : 'stabilizacja']);
    candidates.push(['Woda', 'zwilżenie', 'zmiana powierzchni']);
    candidates.push(['Tlen', 'utlenianie', 'nalot']);
  }
  const offset = index % candidates.length;
  const picked = [];
  const used = new Set();
  for (let i = 0; i < candidates.length && picked.length < 3; i++) {
    const item = candidates[(offset + i) % candidates.length];
    if (used.has(item[0] + item[1])) continue;
    used.add(item[0] + item[1]);
    picked.push({ with: item[0], effect: item[1], result: item[2] });
  }
  return picked;
}

function buildMaterials() {
  const categories = [...CATALOG_A, ...CATALOG_B, ...CATALOG_C];
  const materials = [];
  const usedColors = new Set();
  let globalIndex = 0;

  const add = (cat, kind, name, groupIndex, itemIndex) => {
    const profile = PROFILES[kind] || PROFILES.mineral;
    const seed = hashString(name + '|' + cat.id + '|' + kind);
    const rng = mulberry32(seed);
    const category = categories.find(c => c.id === cat.id) || cat;
    const valueOverride = VALUE_OVERRIDES[name] || {};
    const pickRange = (key, digits = 2) => {
      if (valueOverride[key] != null) return valueOverride[key];
      return rangeValue(rng, profile[key], digits);
    };

    const density = pickRange('d', 4);
    const hardness = pickRange('h', 2);
    const melt = pickRange('melt', 1);
    const boil = pickRange('boil', 1);
    const conductivity = pickRange('cond', 3);
    const heatCapacity = pickRange('heat', 0);
    const flammability = pickRange('flam', 1);
    const viscosity = pickRange('visc', 1);
    const dispersion = pickRange('disp', 1);
    const reactivity = pickRange('react', 1);
    const radioactivity = pickRange('radio', 1);
    const magnetism = pickRange('mag', 1);
    const temperature = pickRange('temp', 1);
    const glow = pickRange('glow', 3);

    let color = COLOR_OVERRIDES[name];
    if (!color) {
      const h = category.hue[0] + rng() * (category.hue[1] - category.hue[0]);
      const s = category.sat[0] + rng() * (category.sat[1] - category.sat[0]);
      const l = category.light[0] + rng() * (category.light[1] - category.light[0]);
      color = hslToHex(h, s, l);
    }
    if (usedColors.has(color)) {
      const [r, g, b] = hexToRgb(color);
      color = '#' + [r, g, b].map(v => clamp(v + ((globalIndex % 7) - 3), 0, 255).toString(16).padStart(2, '0')).join('');
    }
    usedColors.add(color);

    const tags = [...new Set([...(profile.tags || []), ...(valueOverride.tags || [])])];
    const m = {
      id: materials.length + 1,
      name,
      category: cat.id,
      categoryName: category.name,
      categoryShort: category.short,
      kind,
      groupIndex,
      itemIndex,
      state: profile.state,
      sim: profile.sim,
      density,
      hardness: hardness ?? 0,
      melt,
      boil,
      conductivity,
      heatCapacity,
      flammability,
      viscosity: viscosity ?? 0,
      dispersion: dispersion ?? 0,
      reactivity,
      radioactivity,
      magnetism,
      temperature,
      glow,
      tags,
      tagLabels: tags.map(t => TAG_LABELS[t] || t),
      color,
      colorDark: shade(color, -0.32),
      colorLight: shade(color, 0.28),
      pattern: category.patterns[Math.floor(rng() * category.patterns.length)],
      textureSeed: seed,
      meltName: profile.meltName || null,
      boilName: profile.boilName || null,
      freezeName: FREEZE_BY_KIND[kind] || null,
      burnName: profile.burnName || null,
      behavior: '',
      reactions: [],
      meltId: 0,
      boilId: 0,
      freezeId: 0,
      burnId: 0,
    };
    m.behavior = behaviorFor(m);
    materials.push(m);
    globalIndex++;
  };

  for (const category of categories) {
    category.groups.forEach(([kind, names], groupIndex) => {
      names.forEach((name, itemIndex) => {
        const actualKind = KIND_OVERRIDES[name] || kind;
        add(category, actualKind, name, groupIndex, itemIndex);
      });
    });
  }

  for (const item of EXTRA) {
    const category = categories.find(c => c.id === item.cat);
    add(category, item.kind, item.name, 0, 0);
  }

  const byName = new Map(materials.map(m => [m.name, m]));
  for (const m of materials) {
    m.meltId = m.meltName ? (byName.get(m.meltName)?.id || 0) : 0;
    m.boilId = m.boilName ? (byName.get(m.boilName)?.id || 0) : 0;
    m.freezeId = m.freezeName ? (byName.get(m.freezeName)?.id || 0) : 0;
    m.burnId = m.burnName ? (byName.get(m.burnName)?.id || 0) : 0;
    m.reactions = buildReactionNotes(m, m.id);
  }

  const categoryCounts = categories.map(c => ({
    id: c.id, name: c.name, short: c.short, icon: c.icon,
    count: materials.filter(m => m.category === c.id).length,
    hue: c.hue, sat: c.sat, light: c.light, patterns: c.patterns,
  }));

  return { materials, categories: categoryCounts, byName };
}

export const { materials: MATERIALS, categories: CATEGORIES, byName: MATERIAL_BY_NAME } = buildMaterials();
export const MATERIAL_COUNT = MATERIALS.length;
export const TAG_BITS = Object.fromEntries(Object.keys(TAG_LABELS).map((tag, i) => [tag, 1 << i]));

export function validateLibrary() {
  const errors = [];
  if (MATERIALS.length < 1000) errors.push(`Only ${MATERIALS.length} materials`);
  const names = new Set();
  const colors = new Set();
  for (const m of MATERIALS) {
    if (names.has(m.name)) errors.push(`Duplicate name: ${m.name}`);
    names.add(m.name);
    if (colors.has(m.color)) errors.push(`Duplicate color: ${m.color} (${m.name})`);
    colors.add(m.color);
    if (!m.state || !m.sim) errors.push(`Missing state: ${m.name}`);
    if (!Number.isFinite(m.density)) errors.push(`Bad density: ${m.name}`);
    if (!m.behavior) errors.push(`Missing behavior: ${m.name}`);
    if (!m.reactions || m.reactions.length < 3) errors.push(`Missing reactions: ${m.name}`);
    if (m.meltName && !MATERIAL_BY_NAME.has(m.meltName)) errors.push(`Missing melt product ${m.meltName} for ${m.name}`);
    if (m.boilName && !MATERIAL_BY_NAME.has(m.boilName)) errors.push(`Missing boil product ${m.boilName} for ${m.name}`);
    if (m.freezeName && !MATERIAL_BY_NAME.has(m.freezeName)) errors.push(`Missing freeze product ${m.freezeName} for ${m.name}`);
    if (m.burnName && !MATERIAL_BY_NAME.has(m.burnName)) errors.push(`Missing burn product ${m.burnName} for ${m.name}`);
  }
  for (const c of CATEGORIES) if (!c.count) errors.push(`Empty category ${c.id}`);
  return { ok: errors.length === 0, errors, count: MATERIALS.length, categories: CATEGORIES.length, names: names.size, colors: colors.size };
}

if (typeof window !== 'undefined') {
  window.SandLibrary = { MATERIALS, CATEGORIES, MATERIAL_COUNT, validateLibrary };
}
